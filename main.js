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

    if (themeToggle) {
        // 移除可能存在的旧事件监听器
        themeToggle.removeEventListener('click', toggleThemeHandler);
        
        // 添加新的事件监听器
        themeToggle.addEventListener('click', toggleThemeHandler);
        
        console.log('Theme toggle button initialized successfully');
    } else {
        console.error('Theme toggle button not found!');
    }

    // 主题切换处理函数
    function toggleThemeHandler() {
        try {
            console.log('Theme toggle clicked'); // 调试日志
            
            const currentTheme = html.getAttribute('data-theme') || 'light';
            console.log('Current theme:', currentTheme); // 调试日志
            
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // 同时更新DOM和localStorage
            html.setAttribute('data-theme', newTheme);
            
            if (isLocalStorageAvailable) {
                localStorage.setItem('theme', newTheme);
            }
            
            // Update button icon
            const icon = themeToggle.querySelector('.material-icons');
            if (icon) {
                icon.textContent = newTheme === 'dark' ? 'dark_mode' : 'light_mode';
            }
            
            console.log('Theme changed to:', newTheme); // 调试日志
        } catch (error) {
            console.error('Error toggling theme:', error);
        }
    }

    // Load saved theme and update button icon
    try {
        const savedTheme = isLocalStorageAvailable ? (localStorage.getItem('theme') || 'light') : 'light';
        html.setAttribute('data-theme', savedTheme);
        
        if (themeToggle) {
            const icon = themeToggle.querySelector('.material-icons');
            if (icon) {
                icon.textContent = savedTheme === 'dark' ? 'dark_mode' : 'light_mode';
            }
        }
        
        console.log('Theme loaded:', savedTheme);
    } catch (error) {
        console.error('Error loading theme:', error);
        // 设置默认主题
        html.setAttribute('data-theme', 'light');
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

// Mobile Navigation Toggle
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Update menu icon
            const icon = navToggle.querySelector('.material-icons');
            if (icon) {
                icon.textContent = navLinks.classList.contains('active') ? 'close' : 'menu';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                navLinks.classList.remove('active');
                const icon = navToggle.querySelector('.material-icons');
                if (icon) {
                    icon.textContent = 'menu';
                }
            }
        });

        // Close mobile menu when clicking on a link
        const navLinkElements = navLinks.querySelectorAll('.nav-link');
        navLinkElements.forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('active');
                const icon = navToggle.querySelector('.material-icons');
                if (icon) {
                    icon.textContent = 'menu';
                }
            });
        });
    }
}

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

// 首页Google风格照片轮播 - 终极无缝平滑循环（轨道宽度覆盖可视区+一组，绝无断层）
(function() {
    const track = document.querySelector('.material-carousel-track');
    if (!track) return;
    // 只保留原始6张图片
    while (track.children.length > 6) track.removeChild(track.lastChild);
    const imgs = Array.from(track.children);
    // 计算单组总宽度
    function getGroupWidth() {
        let w = 0;
        for (let i = 0; i < 6; i++) {
            w += track.children[i].offsetWidth;
            if (i < 5) w += parseInt(getComputedStyle(track.children[i]).marginRight);
        }
        return w;
    }
    // 填充足够多的图片组，保证track宽度大于等于容器宽度+一组，实现彻底无缝
    function fillTrackAndGetWidth() {
        while (track.children.length > 6) track.removeChild(track.lastChild);
        const groupWidth = getGroupWidth();
        const container = track.parentElement;
        const containerWidth = container.offsetWidth;
        let n = Math.ceil((containerWidth + groupWidth) / groupWidth);
        for (let i = 1; i < n; i++) {
            imgs.forEach(img => {
                const clone = img.cloneNode(true);
                track.appendChild(clone);
            });
        }
        return groupWidth;
    }
    // 等待图片全部加载后再开始动画
    let imagesLoaded = 0;
    const allImgs = track.querySelectorAll('img');
    allImgs.forEach(img => {
        if (img.complete) imagesLoaded++;
        else img.addEventListener('load', () => {
            imagesLoaded++;
            if (imagesLoaded === allImgs.length) startCarousel();
        });
    });
    if (imagesLoaded === allImgs.length) startCarousel();
    function startCarousel() {
        let groupWidth = fillTrackAndGetWidth();
        let pxPerSecond = 70; // 慢速
        let pos = 0;
        function updateWidth() {
            groupWidth = fillTrackAndGetWidth();
        }
        window.addEventListener('resize', updateWidth);
        let lastTime = performance.now();
        let container = track.parentElement;
        function animate(now) {
            const delta = (now - lastTime) / 1000;
            lastTime = now;
            pos += pxPerSecond * delta;
            const maxScroll = track.scrollWidth - container.offsetWidth;
            if (pos >= maxScroll) {
                pos = 0;
                track.style.transition = 'none';
                track.style.transform = `translateX(${-pos}px)`;
                void track.offsetWidth;
                track.style.transition = '';
            } else {
                track.style.transform = `translateX(${-pos}px)`;
            }
            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }
})(); 

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

function shareWebsite() {
  if (navigator.share) {
    navigator.share({
      title: "Zach Zhang's Portfolio",
      text: "Check out Zach Zhang's portfolio - CS Student at Northeastern University",
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Link copied to clipboard!");
    });
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