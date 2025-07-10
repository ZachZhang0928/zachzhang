// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing components...');
    
    // 确保只初始化一次
    if (!window.themeInitialized) {
        initializeTheme();
        window.themeInitialized = true;
    }
    
    initializeAvatar();
    initializeNavigation();
    initializeNameClick();
    initializeShareButton();

    // 为项目卡片添加点击功能（仅projects页面，避免about页面影响头像）
    if (window.location.pathname.includes('projects')) {
        const projectCards = document.querySelectorAll('.project-card, .project-item');
        projectCards.forEach(card => {
            // 若HTML已有onclick则不重复添加
            if (!card.hasAttribute('onclick')) {
                card.addEventListener('click', function() {
                    // 可自定义跳转逻辑
                    console.log('项目卡片被点击');
                });
            }
        });
    }

    // 只在桌面端执行强制删除绿色状态标签
    if (window.innerWidth > 768 && window.location.pathname.includes('projects')) {
        const badgeSelectors = [
            '.status-badge',
            '.project-status',
            '.badge',
            '.tag',
            '.label',
            '[class*="status"]',
            '[class*="badge"]',
            '[class*="Research"]',
            '[class*="Production"]',
            '[class*="Real-time"]',
            '[class*="AI/ML"]'
        ];
        badgeSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                if (
                    computedStyle.backgroundColor.includes('green') ||
                    computedStyle.backgroundColor.includes('rgba(76, 175, 80') ||
                    el.textContent.includes('Research') ||
                    el.textContent.includes('Production') ||
                    el.textContent.includes('Real-time') ||
                    el.textContent.includes('AI/ML')
                ) {
                    el.remove();
                }
            });
        });
        // 额外检查所有span和div元素
        const allSpans = document.querySelectorAll('span, div');
        allSpans.forEach(span => {
            const style = window.getComputedStyle(span);
            const text = span.textContent.trim();
            if ((style.backgroundColor.includes('green') || 
                 style.backgroundColor.includes('#4CAF50') ||
                 style.backgroundColor.includes('rgb(76, 175, 80)')) &&
                (text === 'Research' || text === 'Production' || 
                 text === 'Real-time' || text === 'AI/ML')) {
                span.remove();
            }
        });
    }

    // 强制添加间距
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        // 找到指标数据区域
        const metricsArea = card.querySelector('.project-metrics, .metrics-grid, .metrics-container, .project-stats, div:has(.metric-value)');
        if (metricsArea) {
            metricsArea.style.marginBottom = '40px';
            metricsArea.style.paddingBottom = '24px';
        }
        // 移除所有小圆圈
        const smallElements = card.querySelectorAll('*');
        smallElements.forEach(el => {
            const style = window.getComputedStyle(el);
            const width = parseInt(style.width);
            const height = parseInt(style.height);
            const borderRadius = style.borderRadius;
            if ((width <= 12 && height <= 12) && 
                (borderRadius.includes('50%') || borderRadius.includes('px'))) {
                el.style.display = 'none';
            }
            if (el.tagName === 'SPAN' || el.tagName === 'DIV') {
                el.style.setProperty('--before-display', 'none', 'important');
                el.style.setProperty('--after-display', 'none', 'important');
            }
        });
    });
    setTimeout(() => {
        projectCards.forEach(card => {
            const allElements = card.querySelectorAll('*');
            allElements.forEach(el => {
                if (el.offsetWidth <= 12 && el.offsetHeight <= 12) {
                    const style = window.getComputedStyle(el);
                    if (style.borderRadius.includes('50%') || 
                        style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                        el.remove();
                    }
                }
            });
        });
    }, 500);

    // === 轮播初始化 ===
    (function() {
        const track = document.querySelector('.material-carousel-track');
        if (!track) return;
        const MAX_IMAGES = 20; // 最大支持20张照片
        while (track.children.length > MAX_IMAGES) track.removeChild(track.lastChild);
        const imgs = Array.from(track.children);
        function getGroupWidth() {
            let w = 0;
            for (let i = 0; i < imgs.length; i++) {
                w += track.children[i].offsetWidth;
                if (i < imgs.length - 1) w += parseInt(getComputedStyle(track.children[i]).marginRight);
            }
            return w;
        }
        function fillTrackAndGetWidth() {
            while (track.children.length > MAX_IMAGES) track.removeChild(track.lastChild);
            const groupWidth = getGroupWidth();
            const container = track.parentElement;
            const containerWidth = container.offsetWidth;
            let n = Math.ceil((containerWidth + groupWidth * 2) / groupWidth);
            for (let i = 1; i < n; i++) {
                imgs.forEach(img => {
                    const clone = img.cloneNode(true);
                    track.appendChild(clone);
                });
            }
            return groupWidth;
        }
        let started = false;
        function startCarouselOnce() {
            if (!started) {
                started = true;
                startCarousel();
            }
        }
        const allImgs = track.querySelectorAll('img');
        let loadedCount = 0;
        allImgs.forEach(img => {
            if (img.complete) loadedCount++;
            else {
                img.addEventListener('load', () => {
                    loadedCount++;
                    if (loadedCount === allImgs.length) startCarouselOnce();
                });
                img.addEventListener('error', () => {
                    loadedCount++;
                    if (loadedCount === allImgs.length) startCarouselOnce();
                });
            }
        });
        // 兜底：无论图片加载状态如何，500ms后强制启动轮播
        setTimeout(startCarouselOnce, 500);
        let rafId = null;
        let pos = 0;
        let groupWidth = 0;
        function startCarousel() {
            groupWidth = fillTrackAndGetWidth();
            let pxPerSecond = 70;
            pos = 0;
            function updateWidth() {
                groupWidth = fillTrackAndGetWidth();
            }
            window.addEventListener('resize', updateWidth);
            let lastTime = performance.now();
            function animate(now) {
                const delta = (now - lastTime) / 1000;
                lastTime = now;
                pos += pxPerSecond * delta;
                if (pos >= groupWidth) {
                    pos -= groupWidth;
                    track.style.transition = 'none';
                    track.style.transform = `translateX(${-pos}px)`;
                    void track.offsetWidth;
                    track.style.transition = '';
                } else {
                    track.style.transform = `translateX(${-pos}px)`;
                }
                rafId = requestAnimationFrame(animate);
            }
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(animate);
        }
        // 禁止拖动/滑动/鼠标/触摸交互
        track.onmousedown = track.ontouchstart = track.ontouchmove = track.ontouchend = null;
        window.onmousemove = window.ontouchmove = window.onmouseup = window.ontouchend = null;
        // 禁止画廊区域的滚动和交互
        track.addEventListener('wheel', e => e.preventDefault(), {passive: false});
        track.addEventListener('touchmove', e => e.preventDefault(), {passive: false});
        track.addEventListener('pointerdown', e => e.preventDefault());
        track.addEventListener('mousedown', e => e.preventDefault());
        track.addEventListener('selectstart', e => e.preventDefault());
    })();
});

// Theme Toggle Functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // 验证localStorage可用性
    const isLocalStorageAvailable = (() => {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage not available:', e);
            return false;
        }
    })();

    // 检测系统主题偏好
    function getSystemTheme() {
        if (window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    }

    // 获取初始主题（优先级：localStorage > 系统设置 > 默认light）
    function getInitialTheme() {
        if (isLocalStorageAvailable) {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
        }
        return getSystemTheme();
    }

    // 更新主题按钮状态
    function updateThemeButton(theme) {
        if (themeToggle) {
            const icon = themeToggle.querySelector('.material-icons');
            if (icon) {
                icon.textContent = theme === 'dark' ? 'dark_mode' : 'light_mode';
            }
            themeToggle.setAttribute('data-theme-mode', theme);
        }
    }

    // 应用主题
    function applyTheme(theme, withAnimation = false) {
        html.setAttribute('data-theme', theme);
        updateThemeButton(theme);
        
        if (isLocalStorageAvailable) {
            localStorage.setItem('theme', theme);
        }
        
        // 添加平滑过渡
        if (withAnimation) {
            html.style.transition = 'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                html.style.transition = '';
            }, 400);
        }
    }

    if (themeToggle) {
        // 移除可能存在的旧事件监听器
        themeToggle.removeEventListener('click', toggleThemeHandler);
        
        // 添加新的事件监听器
        themeToggle.addEventListener('click', toggleThemeHandler);
        
        console.log('Theme toggle button initialized successfully');
    } else {
        console.error('Theme toggle button not found!');
    }

    // 主题切换处理函数（带动效）
    function toggleThemeHandler(e) {
        try {
            e.preventDefault();
            console.log('Theme toggle clicked');
            
            const currentTheme = html.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // 添加动效类
            themeToggle.classList.add('switching');
            
            // 延迟应用主题切换，让动效播放
            setTimeout(() => {
                applyTheme(newTheme, true);
                
                // 添加成功反馈动效
                themeToggle.classList.remove('switching');
                themeToggle.classList.add('switched');
                
                // 清除成功动效类
                setTimeout(() => {
                    themeToggle.classList.remove('switched');
                }, 400);
                
            }, 150);
            
            console.log('Theme changed to:', newTheme);
        } catch (error) {
            console.error('Error toggling theme:', error);
            // 清除动效类以防出错
            themeToggle.classList.remove('switching', 'switched');
        }
    }

    // 监听系统主题变化
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        function handleSystemThemeChange(e) {
            // 只有在没有保存用户偏好时才跟随系统
            if (!isLocalStorageAvailable || !localStorage.getItem('theme')) {
                const systemTheme = e.matches ? 'dark' : 'light';
                console.log('System theme changed to:', systemTheme);
                applyTheme(systemTheme, true);
            }
        }
        
        // 监听系统主题变化
        mediaQuery.addListener(handleSystemThemeChange);
        
        // 现代浏览器的API
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleSystemThemeChange);
        }
    }

    // 初始化主题
    try {
        const initialTheme = getInitialTheme();
        applyTheme(initialTheme);
        console.log('Theme initialized:', initialTheme);
        
        // 如果是首次访问且跟随系统主题，给用户提示
        if (!isLocalStorageAvailable || !localStorage.getItem('theme')) {
            console.log('Following system theme preference');
        }
    } catch (error) {
        console.error('Error initializing theme:', error);
        // 设置默认主题
        applyTheme('light');
    }
}

// Avatar Upload and Display Functionality
function initializeAvatar() {
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarContainer = document.querySelector('.avatar-container');
    const avatarImg = document.getElementById('avatar-img');
    const avatarPlaceholder = document.querySelector('.avatar-placeholder');

    // Check if we're on the about page
    const isAboutPage = window.location.pathname.includes('about.html');
    
    if (isAboutPage) {
        // About page: 优先显示本地profile_pic/profile.JPG
        const aboutAvatarImg = document.getElementById('avatar-img-about');
        const aboutAvatarPlaceholder = document.querySelector('.about-avatar .avatar-placeholder');
        if (aboutAvatarImg) {
            const aboutAvatarPlaceholderIcon = document.getElementById('avatar-placeholder-icon');
            const avatarRing = aboutAvatarImg.parentElement; // .avatar-rainbow-border
            const avatarContainer = document.getElementById('about-avatar-upload-area');
            // 页面加载时整体隐藏头像区域
            avatarContainer.style.visibility = 'hidden';
            function showAvatarWithRing(imgUrl) {
                // 预加载
                const preload = new window.Image();
                preload.onload = function() {
                    aboutAvatarImg.src = imgUrl;
                    aboutAvatarImg.style.display = 'block';
                    if (aboutAvatarPlaceholderIcon) aboutAvatarPlaceholderIcon.style.display = 'none';
                    avatarContainer.style.visibility = 'visible';
                };
                preload.onerror = function() {
                    aboutAvatarImg.style.display = 'none';
                    if (aboutAvatarPlaceholderIcon) aboutAvatarPlaceholderIcon.style.display = '';
                    avatarContainer.style.visibility = 'visible';
                };
                preload.src = imgUrl;
            }
            // 优先本地图片
            fetch('profile_pic/profile.JPG')
                .then(res => {
                    if (res.ok) {
                        showAvatarWithRing('profile_pic/profile.JPG');
                    } else {
                        aboutAvatarImg.style.display = 'none';
                        if (aboutAvatarPlaceholderIcon) aboutAvatarPlaceholderIcon.style.display = '';
                        avatarContainer.style.visibility = 'visible';
                    }
                })
                .catch(() => {
                    aboutAvatarImg.style.display = 'none';
                    if (aboutAvatarPlaceholderIcon) aboutAvatarPlaceholderIcon.style.display = '';
                    avatarContainer.style.visibility = 'visible';
                });
        }
        return;
    }

    // Home page: full avatar functionality
    if (!avatarUpload || !avatarContainer || !avatarImg || !avatarPlaceholder) {
        return;
    }

    // File upload handler
    avatarUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPEG, PNG, or WebP)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Please select an image smaller than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                avatarImg.src = e.target.result;
                avatarImg.style.display = 'block';
                avatarPlaceholder.style.display = 'none';
                localStorage.setItem('userAvatar', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    // Left click to upload
    avatarContainer.addEventListener('click', function(e) {
        e.preventDefault();
        avatarUpload.click();
    });

    // Right click to navigate to about page
    avatarContainer.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        window.location.href = 'about.html';
    });

    // Long press for mobile devices
    let pressTimer;
    avatarContainer.addEventListener('touchstart', function(e) {
        pressTimer = setTimeout(function() {
            window.location.href = 'about.html';
        }, 800);
    });

    avatarContainer.addEventListener('touchend', function(e) {
        clearTimeout(pressTimer);
    });

    avatarContainer.addEventListener('touchmove', function(e) {
        clearTimeout(pressTimer);
    });

    // Load saved avatar on page load
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
        avatarImg.src = savedAvatar;
        avatarImg.style.display = 'block';
        avatarPlaceholder.style.display = 'none';
    }
}

// About页面头像上传功能（无按钮，仅区域点击）
(function() {
    const uploadArea = document.getElementById('about-avatar-upload-area');
    const fileInput = document.getElementById('about-avatar-upload');
    const avatarImg = document.getElementById('avatar-img-about');
    const placeholder = uploadArea ? uploadArea.querySelector('.avatar-placeholder') : null;
    if (!uploadArea || !fileInput || !avatarImg) return;
    // 仅点击区域触发上传
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    fileInput.addEventListener('change', function() {
        const file = this.files[0];
        if (!file) return;
        if (!/^image\/(jpeg|png|gif|webp)$/.test(file.type)) {
            alert('仅支持jpg、png、gif、webp格式图片');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            avatarImg.src = e.target.result;
            avatarImg.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    });
})();

// Name Click Navigation
function initializeNameClick() {
    const googleDoodleName = document.querySelector('.google-doodle-name');
    
    if (googleDoodleName) {
        googleDoodleName.addEventListener('click', function() {
            window.location.href = 'about.html';
        });
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.classList.add('loaded');
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Add loading animation for page transitions
window.addEventListener('load', function() {
    document.documentElement.classList.add('loaded');
});

// Add intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.project-card, .hero-section > *');
    animateElements.forEach(el => {
        observer.observe(el);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .hero-section > * {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .hero-section > *.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .project-card {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .project-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    body.loaded .hero-section > *:nth-child(1) { transition-delay: 0.1s; }
    body.loaded .hero-section > *:nth-child(2) { transition-delay: 0.2s; }
    body.loaded .hero-section > *:nth-child(3) { transition-delay: 0.3s; }
    body.loaded .hero-section > *:nth-child(4) { transition-delay: 0.4s; }
    body.loaded .hero-section > *:nth-child(5) { transition-delay: 0.5s; }
`;
document.head.appendChild(style); 

// 禁用所有照片的拖拽和右键功能
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const photos = document.querySelectorAll('.photo-item img');
    photos.forEach(photo => {
      // 禁用拖拽
      photo.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
      });
      // 禁用右键菜单
      photo.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
      });
      // 禁用选择
      photo.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
      });
    });
  });
})(); 

function initializeShareButton() {
    // 查找所有分享按钮
    const shareButtons = document.querySelectorAll('a[title="Share"]');
    
    shareButtons.forEach(button => {
        // 阻止默认的链接行为
        button.addEventListener('click', function(e) {
            e.preventDefault();
            shareProfile();
        });
    });
}

function shareProfile() {
  const url = "https://zachzhang0928.github.io/zachzhang/";
  if (navigator.share) {
    navigator.share({
      title: "Zach Zhang's Portfolio",
      text: "Check out Zach Zhang's portfolio - CS Student at Northeastern University",
      url: url
    }).catch(err => {
      console.log('分享失败:', err);
      // 如果原生分享失败，降级到复制链接
      fallbackCopyToClipboard(url);
    });
  } else {
    fallbackCopyToClipboard(url);
  }
}

function fallbackCopyToClipboard(url) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast("链接已复制到剪贴板！");
    }).catch(err => {
      console.log('复制失败:', err);
      // 最后的降级方案
      legacyCopyToClipboard(url);
    });
  } else {
    legacyCopyToClipboard(url);
  }
}

function legacyCopyToClipboard(url) {
  // 创建临时input元素
  const tempInput = document.createElement('input');
  tempInput.value = url;
  document.body.appendChild(tempInput);
  tempInput.select();
  tempInput.setSelectionRange(0, 99999); // 移动端兼容
  
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast("链接已复制到剪贴板！");
    } else {
      showToast("复制失败，请手动复制：" + url);
    }
  } catch (err) {
    console.log('复制失败:', err);
    showToast("复制失败，请手动复制：" + url);
  } finally {
    document.body.removeChild(tempInput);
  }
}
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 12px 24px;
    border-radius: 24px;
    z-index: 1000;
    font-size: 14px;
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
} 

// 页面加载动画和骨架屏
window.addEventListener('DOMContentLoaded', function() {
  // 创建loading遮罩
  const loading = document.createElement('div');
  loading.id = 'page-loading';
  loading.style.position = 'fixed';
  loading.style.left = 0;
  loading.style.top = 0;
  loading.style.width = '100vw';
  loading.style.height = '100vh';
  loading.style.background = 'rgba(245,247,250,0.96)';
  loading.style.zIndex = 9999;
  loading.style.display = 'flex';
  loading.style.alignItems = 'center';
  loading.style.justifyContent = 'center';
  loading.innerHTML = '<div class="loader"></div>';
  document.body.appendChild(loading);

  // 骨架屏（可根据实际页面结构自定义）
  // ...可扩展...

  // loading动画样式
  const style = document.createElement('style');
  style.textContent = `
    .loader {
      border: 6px solid #e3e6ea;
      border-top: 6px solid #4285f4;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    body.fade-in { animation: fadeIn 0.7s; }
    body.fade-out { animation: fadeOut 0.5s; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    #back-to-top {
      position: fixed; right: 24px; bottom: 32px; z-index: 9999;
      width: 48px; height: 48px; border-radius: 50%;
      background: #4285f4; color: #fff; border: none;
      box-shadow: 0 2px 8px rgba(66,133,244,0.18);
      display: flex; align-items: center; justify-content: center;
      font-size: 2rem; cursor: pointer; opacity: 0.7; transition: opacity 0.2s;
      outline: none;
    }
    #back-to-top:hover { opacity: 1; background: #3367d6; }
  `;
  document.head.appendChild(style);
  // 追加夜间模式loading样式
  const darkStyle = document.createElement('style');
  darkStyle.textContent = `
    [data-theme="dark"] #loading {
      background: #181c23 !important;
    }
    [data-theme="dark"] .loader {
      border: 6px solid #333a44 !important;
      border-top: 6px solid #5b9df9 !important;
    }
  `;
  document.head.appendChild(darkStyle);

  // 页面淡入
  document.body.classList.add('fade-in');

  // 页面加载完毕后移除loading
  window.addEventListener('load', function() {
    setTimeout(() => {
      loading.style.opacity = 0;
      setTimeout(() => loading.remove(), 400);
    }, 300);
  });

  // 返回顶部按钮
  const backToTop = document.createElement('button');
  backToTop.id = 'back-to-top';
  backToTop.title = '返回顶部';
  backToTop.innerHTML = '<span class="material-icons">arrow_upward</span>';
  document.body.appendChild(backToTop);
  backToTop.style.display = 'none';
  window.addEventListener('scroll', function() {
    if (window.scrollY > 200) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });
  backToTop.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ===== Loading 动画复用封装 =====
// showLoading内部也加防抖，避免重复插入
function showLoading() {
  // 确保data-theme已同步设置，防止loading插入时闪白
  if (!document.documentElement.getAttribute('data-theme')) {
    try {
      var theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
  if (window.__loadingShown) return;
  window.__loadingShown = true;
  document.body.classList.add('body--loading');
  let loading = document.getElementById('loading');
  if (!loading) {
    loading = document.createElement('div');
    loading.id = 'loading';
    loading.style.position = 'fixed';
    loading.style.top = 0;
    loading.style.left = 0;
    loading.style.width = '100vw';
    loading.style.height = '100vh';
    loading.style.display = 'flex';
    loading.style.alignItems = 'center';
    loading.style.justifyContent = 'center';
    loading.style.zIndex = 99999;
    // 骨架屏结构
    loading.innerHTML = `
      <div class="skeleton-wrapper">
        <div class="skeleton skeleton-navbar"></div>
        <div class="skeleton skeleton-breadcrumb"></div>
        <div class="skeleton skeleton-header"></div>
        <div class="skeleton skeleton-main"></div>
        <div class="skeleton skeleton-sidebar"></div>
        <div class="skeleton skeleton-footer"></div>
        <div class="loader"></div>
      </div>
    `;
    document.body.appendChild(loading);
  } else {
    loading.style.display = 'flex';
    loading.style.opacity = 1;
  }
  // 骨架屏样式
  if (!document.getElementById('skeleton-style')) {
    const skeletonStyle = document.createElement('style');
    skeletonStyle.id = 'skeleton-style';
    skeletonStyle.textContent = `
      .skeleton-wrapper { 
        position: absolute; width: 100vw; height: 100vh; top: 0; left: 0; 
        display: flex; align-items: center; justify-content: center; 
        pointer-events: none; 
      }
      .skeleton {
        background: #ececec; border-radius: 6px; opacity: 0.7; animation: skeleton-shine 1.2s infinite linear alternate;
        position: absolute;
      }
      .skeleton-navbar { left: 5vw; top: 32px; width: 90vw; height: 48px; }
      .skeleton-breadcrumb { left: 10vw; top: 88px; width: 80vw; height: 28px; border-radius: 8px; }
      .skeleton-header { left: 20vw; top: 130px; width: 60vw; height: 32px; }
      .skeleton-main { left: 10vw; top: 180px; width: 80vw; height: 180px; }
      .skeleton-sidebar { left: 20vw; top: 380px; width: 60vw; height: 80px; }
      .skeleton-footer { left: 5vw; bottom: 32px; width: 90vw; height: 32px; }
      .loader { position: relative; z-index: 2; }
      @keyframes skeleton-shine {
        0% { filter: brightness(1); }
        100% { filter: brightness(1.15); }
      }
      [data-theme="dark"] .skeleton { background: #23272f; }
      .body--loading > *:not(#loading) { opacity: 0 !important; pointer-events: none !important; transition: opacity 0.4s; }
      body:not(.body--loading) > *:not(#loading) { opacity: 1 !important; pointer-events: auto !important; transition: opacity 0.4s; }
    `;
    document.head.appendChild(skeletonStyle);
  }
}
function hideLoading() {
  window.__loadingShown = false;
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.opacity = 0;
    setTimeout(() => {
      loading.style.display = 'none';
      document.body.classList.remove('body--loading');
      // 移除骨架屏样式
      const skeletonStyle = document.getElementById('skeleton-style');
      if (skeletonStyle) skeletonStyle.remove();
    }, 400);
  }
}

// ===== 页面切换淡入淡出动画 + loading（仅跳转时显示） =====
const links = document.querySelectorAll('a[href]');
links.forEach(link => {
  if (link.target === '_blank' || link.href.startsWith('mailto:')) return;
  link.addEventListener('click', function(e) {
    // 只处理站内链接
    if (link.hostname === window.location.hostname) {
      e.preventDefault();
      // 防抖：只在未显示loading时插入
      if (!window.__loadingShown) {
        window.__loadingShown = true;
        showLoading();
      }
      document.body.classList.remove('fade-in');
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location.href = link.href;
      }, 350);
    }
  });
});

// ===== 首次加载时不自动显示/隐藏 loading =====
// 移除window.onload和DOMContentLoaded相关的loading逻辑
// 保证新页面加载后直接显示内容

// showLoading内部也加防抖，避免重复插入
function showLoading() {
  // 确保data-theme已同步设置，防止loading插入时闪白
  if (!document.documentElement.getAttribute('data-theme')) {
    try {
      var theme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', theme);
    } catch(e) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }
  if (window.__loadingShown) return;
  window.__loadingShown = true;
  document.body.classList.add('body--loading');
  let loading = document.getElementById('loading');
  if (!loading) {
    loading = document.createElement('div');
    loading.id = 'loading';
    loading.style.position = 'fixed';
    loading.style.top = 0;
    loading.style.left = 0;
    loading.style.width = '100vw';
    loading.style.height = '100vh';
    loading.style.display = 'flex';
    loading.style.alignItems = 'center';
    loading.style.justifyContent = 'center';
    loading.style.zIndex = 99999;
    // 骨架屏结构
    loading.innerHTML = `
      <div class="skeleton-wrapper">
        <div class="skeleton skeleton-navbar"></div>
        <div class="skeleton skeleton-breadcrumb"></div>
        <div class="skeleton skeleton-header"></div>
        <div class="skeleton skeleton-main"></div>
        <div class="skeleton skeleton-sidebar"></div>
        <div class="skeleton skeleton-footer"></div>
        <div class="loader"></div>
      </div>
    `;
    document.body.appendChild(loading);
  } else {
    loading.style.display = 'flex';
    loading.style.opacity = 1;
  }
  // 骨架屏样式
  if (!document.getElementById('skeleton-style')) {
    const skeletonStyle = document.createElement('style');
    skeletonStyle.id = 'skeleton-style';
    skeletonStyle.textContent = `
      .skeleton-wrapper { 
        position: absolute; width: 100vw; height: 100vh; top: 0; left: 0; 
        display: flex; align-items: center; justify-content: center; 
        pointer-events: none; 
      }
      .skeleton {
        background: #ececec; border-radius: 6px; opacity: 0.7; animation: skeleton-shine 1.2s infinite linear alternate;
        position: absolute;
      }
      .skeleton-navbar { left: 5vw; top: 32px; width: 90vw; height: 48px; }
      .skeleton-breadcrumb { left: 10vw; top: 88px; width: 80vw; height: 28px; border-radius: 8px; }
      .skeleton-header { left: 20vw; top: 130px; width: 60vw; height: 32px; }
      .skeleton-main { left: 10vw; top: 180px; width: 80vw; height: 180px; }
      .skeleton-sidebar { left: 20vw; top: 380px; width: 60vw; height: 80px; }
      .skeleton-footer { left: 5vw; bottom: 32px; width: 90vw; height: 32px; }
      .loader { position: relative; z-index: 2; }
      @keyframes skeleton-shine {
        0% { filter: brightness(1); }
        100% { filter: brightness(1.15); }
      }
      [data-theme="dark"] .skeleton { background: #23272f; }
      .body--loading > *:not(#loading) { opacity: 0 !important; pointer-events: none !important; transition: opacity 0.4s; }
      body:not(.body--loading) > *:not(#loading) { opacity: 1 !important; pointer-events: auto !important; transition: opacity 0.4s; }
    `;
    document.head.appendChild(skeletonStyle);
  }
}
function hideLoading() {
  window.__loadingShown = false;
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.opacity = 0;
    setTimeout(() => {
      loading.style.display = 'none';
      document.body.classList.remove('body--loading');
      // 移除骨架屏样式
      const skeletonStyle = document.getElementById('skeleton-style');
      if (skeletonStyle) skeletonStyle.remove();
    }, 400);
  }
}

// ===== 预取下一个页面（导航悬停） =====
const prefetchCache = {};
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('mouseenter', function() {
    const url = link.getAttribute('href');
    if (!url || prefetchCache[url]) return;
    // 只预取本地/本站页面
    if (url.startsWith('http') && !url.includes(window.location.hostname)) return;
    fetch(url, { method: 'GET' })
      .then(res => res.text())
      .then(html => { prefetchCache[url] = html; })
      .catch(() => {});
  });
});

// ===== 首次加载时自动隐藏 loading =====
// window.addEventListener('load', function() {
//   setTimeout(() => {
//     hideLoading();
//   }, 300);
// });

// 移动端导航汉堡动画与自动关闭
function initializeNavigation() {
  console.log('initializeNavigation called');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  console.log('navToggle:', navToggle);
  console.log('navLinks:', navLinks);
  
  if (navToggle && navLinks) {
    console.log('Both elements found, setting up event listeners');
    let outsideClickHandler = null;
    
    navToggle.addEventListener('click', function(e) {
      console.log('nav-toggle clicked');
      e.stopPropagation();
      navLinks.classList.toggle('active');
      navToggle.classList.toggle('open');
      const icon = navToggle.querySelector('.material-icons');
      if (icon) {
        icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
      }
      console.log('navLinks.classList.contains("active"):', navLinks.classList.contains('active'));
      
      if (navLinks.classList.contains('active')) {
        outsideClickHandler = function(event) {
          if (!navToggle.contains(event.target) && !navLinks.contains(event.target)) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('open');
            const icon = navToggle.querySelector('.material-icons');
            if (icon) {
              icon.textContent = 'menu';
            }
            document.removeEventListener('click', outsideClickHandler, true);
          }
        };
        setTimeout(() => document.addEventListener('click', outsideClickHandler, true), 0);
      } else {
        if (outsideClickHandler) document.removeEventListener('click', outsideClickHandler, true);
      }
    });
    
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(e) {
        console.log('nav-link clicked');
        e.stopPropagation();
        navLinks.classList.remove('active');
        navToggle.classList.remove('open');
        const icon = navToggle.querySelector('.material-icons');
        if (icon) {
          icon.textContent = 'menu';
        }
        if (outsideClickHandler) document.removeEventListener('click', outsideClickHandler, true);
      });
    });
  } else {
    console.error('navToggle or navLinks not found!');
    console.error('navToggle:', navToggle);
    console.error('navLinks:', navLinks);
  }
} 

// Google Analytics 4 事件追踪
function trackEvent(eventName, params) {
  if (typeof gtag === 'function') {
    gtag('event', eventName, params);
  }
}

// 项目链接点击追踪
function setupProjectLinkTracking() {
  document.querySelectorAll('a.nav-link, .cta-button, .project-link, .project-card a').forEach(link => {
    link.addEventListener('click', function(e) {
      trackEvent('project_link_click', {
        link_text: link.textContent.trim(),
        link_url: link.href || '',
        page_location: window.location.pathname
      });
    });
  });
}

// 联系表单提交追踪（如有form）
function setupContactFormTracking() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      trackEvent('contact_form_submit', {
        form_id: form.id || '',
        page_location: window.location.pathname
      });
    });
  });
}

// 用户交互事件追踪（如按钮点击）
function setupInteractionTracking() {
  document.querySelectorAll('button, .contact-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      trackEvent('user_interaction', {
        button_text: btn.textContent.trim(),
        button_class: btn.className,
        page_location: window.location.pathname
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  setupProjectLinkTracking();
  setupContactFormTracking();
  setupInteractionTracking();
  initializeNavigation();
}); 

// 兜底：如果DOMContentLoaded后导航事件没绑定，强制绑定一次
setTimeout(() => {
  if (typeof initializeNavigation === 'function') {
    initializeNavigation();
  }
}, 1000); 