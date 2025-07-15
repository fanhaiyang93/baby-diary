/**
 * 宝贝成长记录网站 - 主JavaScript文件
 * 处理网站的交互功能和动态效果
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initializeNavigation();
    initializeScrollEffects();
    initializeAnimations();
    initializePregnancyProgress();
    initializeLazyLoading();
    initializeFormValidation();
    
    console.log('宝贝成长记录网站已加载完成 🎉');
});

/**
 * 初始化导航功能
 */
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');
    const navLinks = document.querySelectorAll('.nav-link');
    const body = document.body;
    
    // 移动端导航切换
    function toggleNav() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navOverlay.classList.toggle('active');
        body.classList.toggle('nav-open');
        
        // 更新汉堡菜单动画
        const hamburgers = navToggle.querySelectorAll('.hamburger');
        hamburgers.forEach((hamburger, index) => {
            if (navToggle.classList.contains('active')) {
                if (index === 0) hamburger.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) hamburger.style.opacity = '0';
                if (index === 2) hamburger.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                hamburger.style.transform = '';
                hamburger.style.opacity = '';
            }
        });
    }
    
    function closeNav() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navOverlay.classList.remove('active');
        body.classList.remove('nav-open');
        
        // 重置汉堡菜单
        const hamburgers = navToggle.querySelectorAll('.hamburger');
        hamburgers.forEach(hamburger => {
            hamburger.style.transform = '';
            hamburger.style.opacity = '';
        });
    }
    
    // 事件监听器
    if (navToggle) {
        navToggle.addEventListener('click', toggleNav);
    }
    
    if (navOverlay) {
        navOverlay.addEventListener('click', closeNav);
    }
    
    // 导航链接点击
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeNav();
            
            // 平滑滚动到锚点
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ESC键关闭菜单
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeNav();
        }
    });
    
    // 窗口大小改变时关闭移动端菜单
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeNav();
        }
    });
}

/**
 * 初始化滚动效果
 */
function initializeScrollEffects() {
    // 回到顶部按钮
    const backToTopButton = document.getElementById('back-to-top');
    
    function toggleBackToTop() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // 监听滚动事件
    window.addEventListener('scroll', throttle(toggleBackToTop, 100));
    
    // 点击回到顶部
    if (backToTopButton) {
        backToTopButton.addEventListener('click', scrollToTop);
    }
    
    // 导航栏滚动效果
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', throttle(function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 检查是否在timeline页面，如果是则不隐藏导航栏
        const isTimelinePage = window.location.pathname.includes('/timeline') || 
                              document.body.classList.contains('timeline-page') ||
                              document.querySelector('.main-timeline');
        
        if (!isTimelinePage && scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动，隐藏导航栏（timeline页面除外）
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动或在timeline页面，显示导航栏
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    }, 100));
    
    // 初始检查
    toggleBackToTop();
}

/**
 * 初始化动画效果
 */
function initializeAnimations() {
    // 创建Intersection Observer用于滚动动画
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
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll(
        '.feature-card, .update-card, .pregnancy-card, .tips-card'
    );
    
    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });
    
    // 添加CSS动画类
    const style = document.createElement('style');
    style.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-card.animate-element {
            transition-delay: 0.1s;
        }
        
        .feature-card:nth-child(2).animate-element {
            transition-delay: 0.2s;
        }
        
        .feature-card:nth-child(3).animate-element {
            transition-delay: 0.3s;
        }
        
        .feature-card:nth-child(4).animate-element {
            transition-delay: 0.4s;
        }
    `;
    document.head.appendChild(style);
}

/**
 * 初始化孕期进度计算
 */
function initializePregnancyProgress() {
    // 从Jekyll配置中获取日期（这些值会在页面加载时通过模板注入）
    const startDateElement = document.querySelector('[data-start-date]');
    const dueDateElement = document.querySelector('[data-due-date]');
    
    // 如果没有找到数据元素，使用默认值或从其他地方获取
    let startDate = '2024-01-01'; // 默认值，实际应该从配置获取
    let dueDate = '2024-10-01';   // 默认值，实际应该从配置获取
    
    if (startDateElement) startDate = startDateElement.dataset.startDate;
    if (dueDateElement) dueDate = dueDateElement.dataset.dueDate;
    
    updatePregnancyProgress(startDate, dueDate);
    
    // 每小时更新一次进度
    setInterval(() => {
        updatePregnancyProgress(startDate, dueDate);
    }, 3600000); // 1小时 = 3600000毫秒
}

/**
 * 更新孕期进度显示
 * @param {string} startDate - 怀孕开始日期
 * @param {string} dueDate - 预产期
 */
function updatePregnancyProgress(startDate, dueDate) {
    const progress = calculatePregnancyProgress(startDate, dueDate);
    
    // 更新进度条
    const progressBars = document.querySelectorAll('.pregnancy-progress-bar');
    progressBars.forEach(bar => {
        bar.style.width = progress.progressPercentage + '%';
    });
    
    // 更新进度文本
    const progressTexts = document.querySelectorAll('.pregnancy-progress-text');
    progressTexts.forEach(text => {
        text.textContent = `已怀孕 ${progress.passedDays} 天 / ${progress.totalDays} 天`;
    });
    
    // 更新倒计时
    const countdowns = document.querySelectorAll('.pregnancy-countdown');
    countdowns.forEach(countdown => {
        if (progress.remainingDays > 0) {
            countdown.textContent = `距预产期还有 ${progress.remainingDays} 天`;
        } else if (progress.remainingDays === 0) {
            countdown.textContent = '今天是预产期！🎉';
        } else {
            countdown.textContent = `宝宝已经出生 ${Math.abs(progress.remainingDays)} 天啦！🎉`;
        }
    });
    
    // 更新孕周
    const weekTexts = document.querySelectorAll('.pregnancy-week');
    weekTexts.forEach(weekText => {
        if (progress.remainingDays >= 0) {
            weekText.textContent = `孕 ${progress.currentWeek} 周`;
        } else {
            weekText.textContent = '宝宝已出生';
        }
    });
    
    // 更新孕期阶段
    updatePregnancyStage(progress.currentWeek);
}

/**
 * 计算孕期进度
 * @param {string} startDate - 怀孕开始日期
 * @param {string} dueDate - 预产期
 * @returns {object} 包含进度信息的对象
 */
function calculatePregnancyProgress(startDate, dueDate) {
    const start = new Date(startDate);
    const due = new Date(dueDate);
    const today = new Date();
    
    const totalDays = Math.ceil((due - start) / (1000 * 60 * 60 * 24));
    const passedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    const progressPercentage = Math.min(100, Math.max(0, (passedDays / totalDays) * 100));
    const currentWeek = Math.floor(passedDays / 7);
    
    return {
        totalDays,
        passedDays,
        remainingDays,
        progressPercentage,
        currentWeek,
        startDate: start,
        dueDate: due,
        currentDate: today
    };
}

/**
 * 更新孕期阶段信息
 * @param {number} week - 当前孕周
 */
function updatePregnancyStage(week) {
    let stage = '';
    let stageDescription = '';
    
    if (week <= 12) {
        stage = '孕早期';
        stageDescription = '胚胎发育的关键时期，注意营养和休息';
    } else if (week <= 28) {
        stage = '孕中期';
        stageDescription = '相对稳定的时期，可以进行适量运动';
    } else if (week <= 40) {
        stage = '孕晚期';
        stageDescription = '准备迎接宝宝的到来，注意产检';
    } else {
        stage = '已出生';
        stageDescription = '宝宝已经来到这个世界！';
    }
    
    // 更新阶段显示
    const stageElements = document.querySelectorAll('.pregnancy-stage');
    stageElements.forEach(element => {
        element.textContent = stage;
    });
    
    const stageDescElements = document.querySelectorAll('.pregnancy-stage-description');
    stageDescElements.forEach(element => {
        element.textContent = stageDescription;
    });
}

/**
 * 初始化懒加载
 */
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * 初始化表单验证
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
            }
        });
        
        // 实时验证
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(input);
            });
        });
    });
}

/**
 * 验证表单
 * @param {HTMLFormElement} form - 要验证的表单
 * @returns {boolean} 验证是否通过
 */
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

/**
 * 验证单个字段
 * @param {HTMLInputElement} field - 要验证的字段
 * @returns {boolean} 验证是否通过
 */
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // 清除之前的错误
    clearFieldError(field);
    
    // 必填验证
    if (required && !value) {
        showFieldError(field, '此字段为必填项');
        return false;
    }
    
    // 邮箱验证
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, '请输入有效的邮箱地址');
            return false;
        }
    }
    
    // 日期验证
    if (type === 'date' && value) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
            showFieldError(field, '请输入有效的日期');
            return false;
        }
    }
    
    return true;
}

/**
 * 显示字段错误
 * @param {HTMLInputElement} field - 字段元素
 * @param {string} message - 错误消息
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

/**
 * 清除字段错误
 * @param {HTMLInputElement} field - 字段元素
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 节流时间间隔
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 防抖延迟时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const args = arguments;
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
}

/**
 * 格式化日期
 * @param {Date} date - 要格式化的日期
 * @param {string} format - 格式字符串
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day);
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, warning, info)
 * @param {number} duration - 显示时长（毫秒）
 */
function showNotification(message, type = 'info', duration = 3000) {
    // 创建通知容器（如果不存在）
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(container);
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        background: white;
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 10px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        border-left: 4px solid ${getNotificationColor(type)};
        transform: translateX(100%);
        transition: transform 0.3s ease;
        pointer-events: auto;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    notification.textContent = message;
    container.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
    
    // 点击关闭
    notification.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
}

/**
 * 获取通知颜色
 * @param {string} type - 通知类型
 * @returns {string} 颜色值
 */
function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// 导出函数供其他脚本使用
window.BabyGrowthJournal = {
    calculatePregnancyProgress,
    updatePregnancyProgress,
    formatDate,
    showNotification,
    throttle,
    debounce
};