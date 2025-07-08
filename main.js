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
        // About page: only load avatar from storage, no interactions
        const aboutAvatarImg = document.getElementById('avatar-img-about');
        const aboutAvatarPlaceholder = document.querySelector('.about-avatar .avatar-placeholder');
        
        if (aboutAvatarImg && aboutAvatarPlaceholder) {
            const savedAvatar = localStorage.getItem('userAvatar');
            if (savedAvatar) {
                aboutAvatarImg.src = savedAvatar;
                aboutAvatarImg.style.display = 'block';
                aboutAvatarPlaceholder.style.display = 'none';
            }
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