// ===================================
// FAST-LOADING SAMPLE DESIGN MARKETPLACE
// ThemeWagon - Optimized JavaScript
// ===================================

'use strict';

// ===================================
// PERFORMANCE & UTILITY FUNCTIONS
// ===================================
const Utils = {
    // Debounce function for performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
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
    },

    // Format time for video player
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: var(--background-card);
            color: var(--text-primary); padding: 12px 20px; border-radius: 8px;
            border: 1px solid var(--border-color); box-shadow: var(--shadow-lg);
            z-index: 10000; opacity: 0; transform: translateY(-20px);
            transition: all 0.3s ease; font-size: 0.875rem; font-weight: 500; max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
};

// ===================================
// MOBILE MENU CONTROLLER
// ===================================
class MobileMenu {
    constructor() {
        this.toggle = document.querySelector('.mobile-menu-toggle');
        this.overlay = document.querySelector('.mobile-nav-overlay');
        this.hamburgerLines = document.querySelectorAll('.hamburger-line');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.toggle || !this.overlay) return;

        this.toggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });

        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) this.close();
        });

        // Close menu when clicking nav links
        document.querySelectorAll('.mobile-nav-link, .mobile-secondary-link').forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }

    toggleMenu() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.overlay.classList.add('active');
        this.toggle.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animate hamburger to X
        this.hamburgerLines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        this.hamburgerLines[1].style.opacity = '0';
        this.hamburgerLines[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    }

    close() {
        this.isOpen = false;
        this.overlay.classList.remove('active');
        this.toggle.classList.remove('active');
        document.body.style.overflow = '';

        // Reset hamburger
        this.hamburgerLines.forEach(line => {
            line.style.transform = '';
            line.style.opacity = '';
        });
    }
}

// ===================================
// SEARCH CONTROLLER
// ===================================
class SearchController {
    constructor() {
        this.searchInput = document.querySelector('#searchInput');
        this.clearBtn = document.querySelector('#clearSearchBtn');
        this.templateCards = document.querySelectorAll('.template-card-link');
        this.templateGrid = document.querySelector('.template-grid');
        this.pageTitle = document.querySelector('#pageTitle');
        this.breadcrumb = document.querySelector('#breadcrumbCurrent');
        this.init();
    }

    init() {
        if (!this.searchInput) return;

        this.searchInput.addEventListener('input', Utils.debounce((e) => {
            const query = e.target.value.trim();
            this.toggleClearButton(query);
            this.performSearch(query);
        }, 300));

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(e.target.value.trim());
            }
        });

        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearSearch());
        }
    }

    toggleClearButton(query) {
        if (this.clearBtn) {
            this.clearBtn.style.display = query ? 'flex' : 'none';
        }
    }

    performSearch(query) {
        const lowerQuery = query.toLowerCase();
        let visibleCount = 0;

        this.templateCards.forEach((cardLink, index) => {
            const card = cardLink.querySelector('.template-card');
            const title = card.querySelector('.template-title').textContent.toLowerCase();
            const type = card.querySelector('.template-type').textContent.toLowerCase();

            const isMatch = !query || title.includes(lowerQuery) || type.includes(lowerQuery);

            if (isMatch) {
                cardLink.style.display = 'block';
                this.animateCardIn(card, index * 50);
                visibleCount++;
            } else {
                this.animateCardOut(card, cardLink);
            }
        });

        this.handleNoResults(visibleCount, query);
        this.updateSearchResults(query, visibleCount);
    }

    animateCardIn(card, delay) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, delay);
    }

    animateCardOut(card, cardLink) {
        card.style.opacity = '0';
        card.style.transform = 'translateY(-20px)';
        setTimeout(() => cardLink.style.display = 'none', 300);
    }

    handleNoResults(count, query) {
        const existing = document.querySelector('.no-results-message');
        if (existing) existing.remove();

        if (count === 0 && query) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results-message';
            noResults.style.cssText = `
                text-align: center; padding: 3rem 1rem; opacity: 0; transform: translateY(20px);
                transition: all 0.3s ease; background: var(--background-card); border-radius: var(--radius-xl);
                border: 1px solid var(--border-color); margin: 2rem 0;
            `;
            noResults.innerHTML = `
                <div class="no-results-content">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
                    <h3 style="color: var(--text-primary); margin-bottom: 0.5rem; font-size: 1.5rem;">Unavailable</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">No sample designs found matching "${query}"</p>
                    <button onclick="window.app.components.searchController.clearSearch()" style="
                        background: var(--background-tertiary); color: var(--text-primary); border: 1px solid var(--border-color);
                        padding: 0.75rem 1.5rem; border-radius: var(--radius-lg); cursor: pointer; font-size: 0.875rem;
                        transition: all 0.3s ease; display: inline-flex; align-items: center; gap: 0.5rem;
                    ">
                        <i class="fas fa-times"></i> Clear Search
                    </button>
                </div>
            `;
            this.templateGrid.parentNode.insertBefore(noResults, this.templateGrid.nextSibling);
            
            // Animate in
            setTimeout(() => {
                noResults.style.opacity = '1';
                noResults.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    updateSearchResults(query, count) {
        if (query) {
            this.pageTitle.textContent = `Results for: "${query}" (${count})`;
            this.breadcrumb.textContent = `Search: ${query}`;
        } else {
            this.pageTitle.textContent = 'All Sample Designs';
            this.breadcrumb.textContent = 'All Sample Designs';
        }
        
        // Reset mobile load more state when searching
        this.resetMobileLoadMore();
    }

    resetMobileLoadMore() {
        const templateGrid = document.querySelector('.template-grid');
        const loadMoreBtn = document.querySelector('.load-more-btn');
        
        if (templateGrid && loadMoreBtn) {
            templateGrid.classList.remove('show-all');
            loadMoreBtn.classList.remove('show-less');
            loadMoreBtn.innerHTML = '<span>Load More Sample Designs</span><i class="fas fa-arrow-down"></i>';
        }
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchInput.focus();
        this.toggleClearButton('');
        this.performSearch('');
        Utils.showNotification('Search cleared');
    }
}

// ===================================
// FILTER CONTROLLER
// ===================================
class FilterController {
    constructor() {
        this.init();
    }

    init() {
        this.setupFilterDropdown();
    }

    setupFilterDropdown() {
        const filterBtn = document.querySelector('.filter-btn');
        const filterDropdown = document.querySelector('.filter-dropdown');
        const filterOptions = document.querySelectorAll('.filter-option');

        console.log('Setting up filter dropdown:', {
            btn: !!filterBtn,
            dropdown: !!filterDropdown,
            options: filterOptions.length
        });

        if (!filterBtn || !filterDropdown) {
            console.error('Filter elements not found');
            return;
        }

        // Toggle dropdown
        filterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Filter button clicked');
            filterDropdown.classList.toggle('active');
        });

        // Handle filter options
        filterOptions.forEach((option, index) => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const filterType = option.textContent.trim();
                console.log('Filter option clicked:', filterType);
                
                // Update button text
                const btnSpan = filterBtn.querySelector('span');
                if (btnSpan) btnSpan.textContent = filterType;
                
                // Close dropdown
                filterDropdown.classList.remove('active');
                
                // Apply filter
                this.applyFilter(filterType);
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-dropdown')) {
                filterDropdown.classList.remove('active');
            }
        });
    }

    applyFilter(filterType) {
        console.log('Applying filter:', filterType);
        const templateCards = document.querySelectorAll('.template-card-link');
        let visibleCount = 0;

        templateCards.forEach((cardLink) => {
            const typeElement = cardLink.querySelector('.template-type');
            const cardType = typeElement ? typeElement.textContent.trim() : '';
            
            let shouldShow = filterType === 'All Types' || 
                           (filterType === 'Sample Designs' && cardType === 'Sample Design') ||
                           (filterType === 'Components' && cardType === 'Component') ||
                           (filterType === 'Plugins' && cardType === 'Plugin');

            if (shouldShow) {
                cardLink.style.display = 'block';
                visibleCount++;
            } else {
                cardLink.style.display = 'none';
            }
        });

        console.log('Filter applied, visible cards:', visibleCount);
        
        // Update page title
        const pageTitle = document.querySelector('#pageTitle');
        if (pageTitle) {
            pageTitle.textContent = filterType === 'All Types' ? 'All Sample Designs' : `${filterType} (${visibleCount})`;
        }
    }
}

// ===================================
// VIDEO PLAYER CONTROLLER
// ===================================
class VideoPlayer {
    constructor() {
        this.video = document.getElementById('aboutVideo');
        this.overlay = document.getElementById('videoOverlay');
        this.playButton = document.getElementById('playButton');
        this.controls = document.getElementById('videoControls');
        this.progressBar = document.getElementById('progressBar');
        this.progressFill = document.getElementById('progressFill');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.isPlaying = false;
        this.controlsTimeout = null;
        this.init();
    }

    init() {
        if (!this.video || !this.overlay || !this.playButton) return;

        this.playButton.addEventListener('click', () => this.play());
        this.video.addEventListener('click', () => this.toggle());
        
        if (this.progressBar) {
            this.progressBar.addEventListener('click', (e) => this.seek(e));
        }

        this.video.addEventListener('loadedmetadata', () => this.updateTimeDisplay());
        this.video.addEventListener('timeupdate', () => {
            this.updateProgress();
            this.updateTimeDisplay();
        });
        this.video.addEventListener('ended', () => this.reset());
        this.video.addEventListener('play', () => this.onPlay());
        this.video.addEventListener('pause', () => this.onPause());

        this.setupKeyboardControls();
        this.setupMouseControls();
    }

    play() {
        this.video.play().then(() => {
            this.isPlaying = true;
            this.overlay.classList.add('hidden');
            Utils.showNotification('Video playing');
        }).catch(error => {
            console.error('Error playing video:', error);
            Utils.showNotification('Error playing video');
        });
    }

    pause() {
        this.video.pause();
        this.isPlaying = false;
        Utils.showNotification('Video paused');
    }

    toggle() {
        this.isPlaying ? this.pause() : this.play();
    }

    seek(e) {
        const rect = this.progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        this.video.currentTime = percentage * this.video.duration;
    }

    onPlay() {
        this.isPlaying = true;
        this.overlay.classList.add('hidden');
        if (this.controls) {
            this.controls.classList.add('visible');
            this.showControlsTemporarily();
        }
    }

    onPause() {
        this.isPlaying = false;
        if (this.controls) this.controls.classList.remove('visible');
    }

    reset() {
        this.isPlaying = false;
        this.video.currentTime = 0;
        this.overlay.classList.remove('hidden');
        if (this.controls) this.controls.classList.remove('visible');
        this.updateProgress();
        this.updateTimeDisplay();
    }

    updateProgress() {
        if (this.video.duration && this.progressFill) {
            const percentage = (this.video.currentTime / this.video.duration) * 100;
            this.progressFill.style.width = percentage + '%';
        }
    }

    updateTimeDisplay() {
        if (this.timeDisplay && this.video.duration) {
            const current = Utils.formatTime(this.video.currentTime);
            const total = Utils.formatTime(this.video.duration);
            this.timeDisplay.textContent = `${current} / ${total}`;
        }
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName.toLowerCase() === 'input') return;
            
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    this.toggle();
                    break;
                case 'ArrowLeft':
                    if (this.isPlaying) {
                        e.preventDefault();
                        this.video.currentTime = Math.max(0, this.video.currentTime - 10);
                    }
                    break;
                case 'ArrowRight':
                    if (this.isPlaying) {
                        e.preventDefault();
                        this.video.currentTime = Math.min(this.video.duration, this.video.currentTime + 10);
                    }
                    break;
            }
        });
    }

    setupMouseControls() {
        const videoContainer = document.querySelector('.about-video');
        if (!videoContainer) return;

        videoContainer.addEventListener('mousemove', () => {
            if (this.isPlaying && this.controls) {
                this.controls.classList.add('visible');
                this.showControlsTemporarily();
            }
        });

        videoContainer.addEventListener('mouseleave', () => {
            if (this.isPlaying && this.controls) {
                clearTimeout(this.controlsTimeout);
                this.controlsTimeout = setTimeout(() => {
                    this.controls.classList.remove('visible');
                }, 1000);
            }
        });
    }

    showControlsTemporarily() {
        clearTimeout(this.controlsTimeout);
        this.controlsTimeout = setTimeout(() => {
            if (this.isPlaying && this.controls) {
                this.controls.classList.remove('visible');
            }
        }, 3000);
    }
}

// ===================================
// NAVIGATION CONTROLLER
// ===================================
class NavigationController {
    constructor() {
        this.secondaryNavLinks = document.querySelectorAll('.secondary-nav-link, .mobile-secondary-link');
        this.sections = document.querySelectorAll('#templates, #about, #contact');
        this.init();
    }

    init() {
        this.secondaryNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection(link);
            });
        });

        window.addEventListener('scroll', Utils.throttle(() => this.updateActiveNavigation(), 100));
    }

    navigateToSection(clickedLink) {
        const targetId = clickedLink.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (!targetSection) return;

        // Update active states
        this.secondaryNavLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
        
        const correspondingLink = document.querySelector(
            clickedLink.classList.contains('secondary-nav-link') 
                ? `.mobile-secondary-link[href="${targetId}"]`
                : `.secondary-nav-link[href="${targetId}"]`
        );
        if (correspondingLink) correspondingLink.classList.add('active');

        // Smooth scroll
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (app && app.components.mobileMenu) {
            app.components.mobileMenu.close();
        }
    }

    updateActiveNavigation() {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const scrollPosition = window.scrollY + headerHeight + 100;
        let activeSection = 'templates';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section.id;
            }
        });

        this.secondaryNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${activeSection}`);
        });
    }
}

// ===================================
// CONTACT ANIMATION CONTROLLER
// ===================================
class ContactAnimation {
    constructor() {
        this.contactBtn = document.querySelector('.contact-btn');
        this.init();
    }

    init() {
        if (!this.contactBtn) return;

        // Shake animation every 3 seconds
        setInterval(() => {
            this.contactBtn.classList.add('shake');
            setTimeout(() => this.contactBtn.classList.remove('shake'), 600);
        }, 3000);

        // Stop shaking on interaction
        this.contactBtn.addEventListener('mouseenter', () => {
            this.contactBtn.classList.remove('shake');
        });

        this.contactBtn.addEventListener('click', () => {
            this.contactBtn.classList.remove('shake');
        });
    }
}

// ===================================
// LAZY LOADING CONTROLLER
// ===================================
class LazyLoader {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) return;

        this.setupImageLazyLoading();
        this.setupVideoLazyLoading();
    }

    setupImageLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.addEventListener('load', () => img.style.opacity = '1');
                    observer.unobserve(img);
                }
            });
        }, this.observerOptions);

        images.forEach(img => imageObserver.observe(img));
    }

    setupVideoLazyLoading() {
        const video = document.getElementById('aboutVideo');
        if (!video) return;

        const videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.preload = 'metadata';
                    videoObserver.unobserve(video);
                }
            });
        }, this.observerOptions);

        videoObserver.observe(video);
    }
}

// ===================================
// LOAD MORE CONTROLLER
// ===================================
class LoadMoreController {
    constructor() {
        this.isShowingAll = false;
        this.init();
    }

    init() {
        this.setupLoadMore();
    }

    setupLoadMore() {
        const loadMoreBtn = document.querySelector('.load-more-btn');
        const templateGrid = document.querySelector('.template-grid');

        console.log('Setting up load more:', {
            btn: !!loadMoreBtn,
            grid: !!templateGrid
        });

        if (!loadMoreBtn || !templateGrid) {
            console.error('Load more elements not found');
            return;
        }

        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Load more button clicked, current state:', this.isShowingAll);
            
            if (this.isShowingAll) {
                this.showLess(templateGrid, loadMoreBtn);
            } else {
                this.showMore(templateGrid, loadMoreBtn);
            }
        });
    }

    showMore(templateGrid, loadMoreBtn) {
        console.log('Showing more templates');
        this.isShowingAll = true;
        
        // Add class to show all templates
        templateGrid.classList.add('show-all');
        
        // Update button
        loadMoreBtn.innerHTML = '<span>Show Less</span><i class="fas fa-arrow-up"></i>';
        
        console.log('Templates should now be visible');
    }

    showLess(templateGrid, loadMoreBtn) {
        console.log('Showing less templates');
        this.isShowingAll = false;
        
        // Remove class to hide templates 7-12
        templateGrid.classList.remove('show-all');
        
        // Update button
        loadMoreBtn.innerHTML = '<span>Load More Sample Designs</span><i class="fas fa-arrow-down"></i>';
        
        // Scroll to top of template grid
        templateGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        console.log('Templates 7-12 should now be hidden');
    }
}

// ===================================
// SCROLL ANIMATION CONTROLLER
// ===================================
class ScrollAnimationController {
    constructor() {
        this.animatedElements = new Set();
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        this.init();
    }

    init() {
        if (!('IntersectionObserver' in window)) {
            this.fallbackAnimation();
            return;
        }

        this.setupObserver();
        this.observeElements();
    }

    setupObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, this.observerOptions);
    }

    observeElements() {
        // Observe template cards with staggered animation
        const templateCards = document.querySelectorAll('.template-card');
        templateCards.forEach((card, index) => {
            card.dataset.animationDelay = index * 50; // 50ms stagger
            this.observer.observe(card);
        });

        // Observe about section elements
        const aboutTitle = document.querySelector('.about-title');
        const aboutDescription = document.querySelector('.about-description');
        const aboutFeatures = document.querySelector('.about-features');

        if (aboutTitle) {
            aboutTitle.dataset.animationDelay = 0;
            this.observer.observe(aboutTitle);
        }

        if (aboutDescription) {
            aboutDescription.dataset.animationDelay = 200;
            this.observer.observe(aboutDescription);
        }

        if (aboutFeatures) {
            aboutFeatures.dataset.animationDelay = 400;
            this.observer.observe(aboutFeatures);
        }
    }

    animateElement(element) {
        const delay = parseInt(element.dataset.animationDelay) || 0;
        
        setTimeout(() => {
            element.classList.add('animate-in');
        }, delay);
    }

    fallbackAnimation() {
        // Fallback for browsers without IntersectionObserver
        const templateCards = document.querySelectorAll('.template-card');
        const aboutTitle = document.querySelector('.about-title');
        const aboutDescription = document.querySelector('.about-description');
        const aboutFeatures = document.querySelector('.about-features');

        templateCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animate-in');
            }, index * 50);
        });

        if (aboutTitle) {
            setTimeout(() => aboutTitle.classList.add('animate-in'), 0);
        }

        if (aboutDescription) {
            setTimeout(() => aboutDescription.classList.add('animate-in'), 200);
        }

        if (aboutFeatures) {
            setTimeout(() => aboutFeatures.classList.add('animate-in'), 400);
        }
    }

    // Method to reset animations (useful for testing or retriggering)
    reset() {
        this.animatedElements.clear();
        
        const allAnimatedElements = document.querySelectorAll('.animate-in');
        allAnimatedElements.forEach(element => {
            element.classList.remove('animate-in');
        });

        // Re-observe elements
        this.observeElements();
    }
}


// ===================================
// SCROLL EFFECTS CONTROLLER
// ===================================
class ScrollEffects {
    constructor() {
        this.header = document.querySelector('.header');
        this.init();
    }

    init() {
        if (!this.header) return;

        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                this.header.style.background = 'rgba(0, 0, 0, 0.95)';
                this.header.style.backdropFilter = 'blur(20px)';
            } else {
                this.header.style.background = 'var(--background-primary)';
                this.header.style.backdropFilter = 'blur(10px)';
            }
        }, 16));

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// ===================================
// MAIN APPLICATION CONTROLLER
// ===================================
class App {
    constructor() {
        this.components = {};
        this.init();
    }

    init() {
        // Fallback for browsers without requestIdleCallback
        if (!window.requestIdleCallback) {
            window.requestIdleCallback = function(cb) {
                return setTimeout(cb, 1);
            };
        }

        document.addEventListener('DOMContentLoaded', () => {
            // Initialize critical components first for fast loading
            this.initializeCriticalComponents();
            
            // Initialize non-critical components with delay for better performance
            requestIdleCallback(() => {
                this.initializeNonCriticalComponents();
            });
        });
    }

    initializeCriticalComponents() {
        // Initialize preloader first
        this.components.preloaderController = new PreloaderController();
        
        // Critical for immediate user interaction
        this.components.mobileMenu = new MobileMenu();
        this.components.searchController = new SearchController();
        this.components.filterController = new FilterController();
        this.components.loadMoreController = new LoadMoreController();
        
        // Make search controller globally accessible
        window.searchController = this.components.searchController;
        
        console.log('Critical components initialized');
    }

    initializeNonCriticalComponents() {
        // Non-critical components loaded after page interaction
        this.components.videoPlayer = new VideoPlayer();
        this.components.navigationController = new NavigationController();
        this.components.contactAnimation = new ContactAnimation();
        this.components.lazyLoader = new LazyLoader();
        this.components.scrollAnimationController = new ScrollAnimationController();
        this.components.scrollEffects = new ScrollEffects();
        
        this.setupTemplateCards();
        this.setupErrorHandling();
        
        console.log('Non-critical components initialized');
    }

    setupTemplateCards() {
        const templateCards = document.querySelectorAll('.template-card');
        
        templateCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.preview-btn')) {
                    this.handleTemplateClick(card);
                }
            });

            const previewBtn = card.querySelector('.preview-btn');
            if (previewBtn) {
                previewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.handlePreviewClick(card);
                });
            }

            // Keyboard support
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleTemplateClick(card);
                }
            });

            // Image error handling
            const img = card.querySelector('.template-image img');
            if (img) {
                img.addEventListener('error', () => {
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjMTExMTExIi8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3NSAxMjVIMjI1TDIwMCAxNTBaIiBmaWxsPSIjNzE3MTdhIi8+PC9zdmc+';
                });
            }
        });
    }

    handleTemplateClick(card) {
        const title = card.querySelector('.template-title').textContent;
        
        card.style.transform = 'scale(0.98)';
        setTimeout(() => card.style.transform = '', 150);
        
        Utils.showNotification(`Opening ${title} sample design...`);
    }

    handlePreviewClick(card) {
        const title = card.querySelector('.template-title').textContent;
        
        const previewBtn = card.querySelector('.preview-btn');
        previewBtn.style.transform = 'scale(0.95)';
        setTimeout(() => previewBtn.style.transform = '', 150);
        
        Utils.showNotification(`Loading preview for ${title}...`);
    }

    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('JavaScript error:', e.error);
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
        });
    }
}

// ===================================
// NEWSLETTER FUNCTIONALITY
// ===================================
class NewsletterController {
    constructor() {
        this.form = document.querySelector('.newsletter-form');
        this.input = document.querySelector('.newsletter-input');
        this.button = document.querySelector('.newsletter-btn');
        this.buttonText = this.button?.querySelector('span');
        this.buttonIcon = this.button?.querySelector('i');
        this.init();
    }

    init() {
        if (!this.form || !this.input || !this.button) return;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        this.input.addEventListener('input', () => this.validateInput());
        
        // Focus effects
        this.input.addEventListener('focus', () => this.input.parentElement.classList.add('focused'));
        this.input.addEventListener('blur', () => this.input.parentElement.classList.remove('focused'));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const email = this.input.value.trim();
        
        if (!this.isValidEmail(email)) {
            this.showNotification('Please enter a valid email address', 'error');
            this.input.focus();
            return;
        }
        
        this.setButtonLoading(true);
        
        try {
            const formData = new FormData(this.form);
            
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.showNotification('Thank you for subscribing! Check your email for confirmation.', 'success');
                this.form.reset();
                if (typeof Utils !== 'undefined' && Utils.showNotification) {
                    Utils.showNotification('Newsletter subscription successful!');
                }
            } else {
                if (data.errors) {
                    const errorMessages = Object.values(data.errors).flat();
                    throw new Error(errorMessages.join(', '));
                } else {
                    throw new Error(data.error || 'Subscription failed');
                }
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            
            let errorMessage = 'Something went wrong. Please try again later.';
            if (error.message.includes('email')) {
                errorMessage = 'Please check your email address and try again.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'Network error. Please check your connection and try again.';
            }
            
            this.showNotification(errorMessage, 'error');
        } finally {
            this.setButtonLoading(false);
        }
    }

    validateInput() {
        const email = this.input.value.trim();
        if (email && !this.isValidEmail(email)) {
            this.input.style.borderColor = '#ef4444';
            this.input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.2)';
        } else {
            this.input.style.borderColor = '';
            this.input.style.boxShadow = '';
        }
    }

    setButtonLoading(loading) {
        if (loading) {
            this.button.disabled = true;
            if (this.buttonText) this.buttonText.textContent = 'Subscribing...';
            if (this.buttonIcon) this.buttonIcon.className = 'fas fa-spinner fa-spin';
            this.button.style.opacity = '0.7';
        } else {
            this.button.disabled = false;
            if (this.buttonText) this.buttonText.textContent = 'Subscribe';
            if (this.buttonIcon) this.buttonIcon.className = 'fas fa-paper-plane';
            this.button.style.opacity = '1';
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showNotification(message, type = 'info') {
        const existingNotifications = document.querySelectorAll('.newsletter-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `newsletter-notification ${type}`;
        notification.textContent = message;
        
        const colors = {
            success: 'background: linear-gradient(135deg, #10b981, #059669);',
            error: 'background: linear-gradient(135deg, #ef4444, #dc2626);',
            info: 'background: linear-gradient(135deg, #3b82f6, #2563eb);'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            font-size: 14px;
            z-index: 10000;
            max-width: 350px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            transform: translateX(400px);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            cursor: pointer;
            ${colors[type] || colors.info}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
    }
}

// ===================================
// PRELOADER CONTROLLER
// ===================================
class PreloaderController {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.minDisplayTime = 1000;
        this.startTime = Date.now();
        this.init();
    }

    init() {
        if (!this.preloader) return;

        this.show();

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.handlePageLoad();
            });
        } else {
            this.handlePageLoad();
        }

        window.addEventListener('load', () => {
            this.handlePageLoad();
        });
    }

    show() {
        if (this.preloader) {
            this.preloader.classList.remove('fade-out');
            document.body.style.overflow = 'hidden';
        }
    }

    hide() {
        if (!this.preloader) return;

        const elapsedTime = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);

        setTimeout(() => {
            this.preloader.classList.add('fade-out');
            document.body.style.overflow = '';
            
            setTimeout(() => {
                if (this.preloader && this.preloader.parentNode) {
                    this.preloader.parentNode.removeChild(this.preloader);
                }
            }, 500);
        }, remainingTime);
    }

    handlePageLoad() {
        const images = document.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            return new Promise((resolve) => {
                if (img.complete) {
                    resolve();
                } else {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                }
            });
        });

        Promise.all(imagePromises).then(() => {
            this.hide();
        });

        setTimeout(() => {
            this.hide();
        }, 5000);
    }
}

// ===================================
// GLOBAL INSTANCES & INITIALIZATION
// ===================================
let app;
let newsletter;

// Initialize the application
app = new App();
newsletter = new NewsletterController();

// ===================================
// THEME DETECTION
// ===================================
function detectColorScheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
}

if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectColorScheme);
}

detectColorScheme();

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===================================
// PERFORMANCE MONITORING
// ===================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        }, 0);
    });
}

// ===================================
// EXPORT FOR GLOBAL ACCESS
// ===================================
window.app = app;
window.Utils = Utils;


//smooth SCROLL//
(function () {
  
// Scroll Variables (tweakable)
var defaultOptions = {

    // Scrolling Core
    frameRate        : 150, // [Hz]
    animationTime    : 600, // [ms]
    stepSize         : 100, // [px]

    // Pulse (less tweakable)
    // ratio of "tail" to "acceleration"
    pulseAlgorithm   : true,
    pulseScale       : 4,
    pulseNormalize   : 1,

    // Acceleration
    accelerationDelta : 50,  // 50
    accelerationMax   : 3,   // 3

    // Keyboard Settings
    keyboardSupport   : true,  // option
    arrowScroll       : 50,    // [px]

    // Other
    fixedBackground   : true, 
    excluded          : ''    
};

var options = defaultOptions;


// Other Variables
var isExcluded = false;
var isFrame = false;
var direction = { x: 0, y: 0 };
var initDone  = false;
var root = document.documentElement;
var activeElement;
var observer;
var refreshSize;
var deltaBuffer = [];
var deltaBufferTimer;
var isMac = /^Mac/.test(navigator.platform);

var key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32, 
            pageup: 33, pagedown: 34, end: 35, home: 36 };
var arrowKeys = { 37: 1, 38: 1, 39: 1, 40: 1 };

/***********************************************
 * INITIALIZE
 ***********************************************/

/**
 * Tests if smooth scrolling is allowed. Shuts down everything if not.
 */
function initTest() {
    if (options.keyboardSupport) {
        addEvent('keydown', keydown);
    }
}

/**
 * Sets up scrolls array, determines if frames are involved.
 */
function init() {
  
    if (initDone || !document.body) return;

    initDone = true;

    var body = document.body;
    var html = document.documentElement;
    var windowHeight = window.innerHeight; 
    var scrollHeight = body.scrollHeight;
    
    // check compat mode for root element
    root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
    activeElement = body;
    
    initTest();

    // Checks if this script is running in a frame
    if (top != self) {
        isFrame = true;
    }

    /**
     * Safari 10 fixed it, Chrome fixed it in v45:
     * This fixes a bug where the areas left and right to 
     * the content does not trigger the onmousewheel event
     * on some pages. e.g.: html, body { height: 100% }
     */
    else if (isOldSafari &&
             scrollHeight > windowHeight &&
            (body.offsetHeight <= windowHeight || 
             html.offsetHeight <= windowHeight)) {

        var fullPageElem = document.createElement('div');
        fullPageElem.style.cssText = 'position:absolute; z-index:-10000; ' +
                                     'top:0; left:0; right:0; height:' + 
                                      root.scrollHeight + 'px';
        document.body.appendChild(fullPageElem);
        
        // DOM changed (throttled) to fix height
        var pendingRefresh;
        refreshSize = function () {
            if (pendingRefresh) return; // could also be: clearTimeout(pendingRefresh);
            pendingRefresh = setTimeout(function () {
                if (isExcluded) return; // could be running after cleanup
                fullPageElem.style.height = '0';
                fullPageElem.style.height = root.scrollHeight + 'px';
                pendingRefresh = null;
            }, 500); // act rarely to stay fast
        };
  
        setTimeout(refreshSize, 10);

        addEvent('resize', refreshSize);

        // TODO: attributeFilter?
        var config = {
            attributes: true, 
            childList: true, 
            characterData: false 
            // subtree: true
        };

        observer = new MutationObserver(refreshSize);
        observer.observe(body, config);

        if (root.offsetHeight <= windowHeight) {
            var clearfix = document.createElement('div');   
            clearfix.style.clear = 'both';
            body.appendChild(clearfix);
        }
    }

    // disable fixed background
    if (!options.fixedBackground && !isExcluded) {
        body.style.backgroundAttachment = 'scroll';
        html.style.backgroundAttachment = 'scroll';
    }
}

/**
 * Removes event listeners and other traces left on the page.
 */
function cleanup() {
    observer && observer.disconnect();
    removeEvent(wheelEvent, wheel);
    removeEvent('mousedown', mousedown);
    removeEvent('keydown', keydown);
    removeEvent('resize', refreshSize);
    removeEvent('load', init);
}


/************************************************
 * SCROLLING 
 ************************************************/
 
var que = [];
var pending = false;
var lastScroll = Date.now();

/**
 * Pushes scroll actions to the scrolling queue.
 */
function scrollArray(elem, left, top) {
    
    directionCheck(left, top);

    if (options.accelerationMax != 1) {
        var now = Date.now();
        var elapsed = now - lastScroll;
        if (elapsed < options.accelerationDelta) {
            var factor = (1 + (50 / elapsed)) / 2;
            if (factor > 1) {
                factor = Math.min(factor, options.accelerationMax);
                left *= factor;
                top  *= factor;
            }
        }
        lastScroll = Date.now();
    }          
    
    // push a scroll command
    que.push({
        x: left, 
        y: top, 
        lastX: (left < 0) ? 0.99 : -0.99,
        lastY: (top  < 0) ? 0.99 : -0.99, 
        start: Date.now()
    });
        
    // don't act if there's a pending queue
    if (pending) {
        return;
    }  

    var scrollRoot = getScrollRoot();
    var isWindowScroll = (elem === scrollRoot || elem === document.body);
    
    // if we haven't already fixed the behavior, 
    // and it needs fixing for this sesh
    if (elem.$scrollBehavior == null && isScrollBehaviorSmooth(elem)) {
        elem.$scrollBehavior = elem.style.scrollBehavior;
        elem.style.scrollBehavior = 'auto';
    }

    var step = function (time) {
        
        var now = Date.now();
        var scrollX = 0;
        var scrollY = 0; 
    
        for (var i = 0; i < que.length; i++) {
            
            var item = que[i];
            var elapsed  = now - item.start;
            var finished = (elapsed >= options.animationTime);
            
            // scroll position: [0, 1]
            var position = (finished) ? 1 : elapsed / options.animationTime;
            
            // easing [optional]
            if (options.pulseAlgorithm) {
                position = pulse(position);
            }
            
            // only need the difference
            var x = (item.x * position - item.lastX) >> 0;
            var y = (item.y * position - item.lastY) >> 0;
            
            // add this to the total scrolling
            scrollX += x;
            scrollY += y;            
            
            // update last values
            item.lastX += x;
            item.lastY += y;
        
            // delete and step back if it's over
            if (finished) {
                que.splice(i, 1); i--;
            }           
        }

        // scroll left and top
        if (isWindowScroll) {
            window.scrollBy(scrollX, scrollY);
        } 
        else {
            if (scrollX) elem.scrollLeft += scrollX;
            if (scrollY) elem.scrollTop  += scrollY;                    
        }
        
        // clean up if there's nothing left to do
        if (!left && !top) {
            que = [];
        }
        
        if (que.length) { 
            requestFrame(step, elem, (1000 / options.frameRate + 1)); 
        } else { 
            pending = false;
            // restore default behavior at the end of scrolling sesh
            if (elem.$scrollBehavior != null) {
                elem.style.scrollBehavior = elem.$scrollBehavior;
                elem.$scrollBehavior = null;
            }
        }
    };
    
    // start a new queue of actions
    requestFrame(step, elem, 0);
    pending = true;
}


/***********************************************
 * EVENTS
 ***********************************************/

/**
 * Mouse wheel handler.
 * @param {Object} event
 */
function wheel(event) {

    if (!initDone) {
        init();
    }
    
    var target = event.target;

    // leave early if default action is prevented   
    // or it's a zooming event with CTRL 
    if (event.defaultPrevented || event.ctrlKey) {
        return true;
    }
    
    // leave embedded content alone (flash & pdf)
    if (isNodeName(activeElement, 'embed') || 
       (isNodeName(target, 'embed') && /\.pdf/i.test(target.src)) ||
        isNodeName(activeElement, 'object') ||
        target.shadowRoot) {
        return true;
    }

    var deltaX = -event.wheelDeltaX || event.deltaX || 0;
    var deltaY = -event.wheelDeltaY || event.deltaY || 0;
    
    if (isMac) {
        if (event.wheelDeltaX && isDivisible(event.wheelDeltaX, 120)) {
            deltaX = -120 * (event.wheelDeltaX / Math.abs(event.wheelDeltaX));
        }
        if (event.wheelDeltaY && isDivisible(event.wheelDeltaY, 120)) {
            deltaY = -120 * (event.wheelDeltaY / Math.abs(event.wheelDeltaY));
        }
    }
    
    // use wheelDelta if deltaX/Y is not available
    if (!deltaX && !deltaY) {
        deltaY = -event.wheelDelta || 0;
    }

    // line based scrolling (Firefox mostly)
    if (event.deltaMode === 1) {
        deltaX *= 40;
        deltaY *= 40;
    }

    var overflowing = overflowingAncestor(target);

    // nothing to do if there's no element that's scrollable
    if (!overflowing) {
        // except Chrome iframes seem to eat wheel events, which we need to 
        // propagate up, if the iframe has nothing overflowing to scroll
        if (isFrame && isChrome)  {
            // change target to iframe element itself for the parent frame
            Object.defineProperty(event, "target", {value: window.frameElement});
            return parent.wheel(event);
        }
        return true;
    }
    
    // check if it's a touchpad scroll that should be ignored
    if (isTouchpad(deltaY)) {
        return true;
    }

    // scale by step size
    // delta is 120 most of the time
    // synaptics seems to send 1 sometimes
    if (Math.abs(deltaX) > 1.2) {
        deltaX *= options.stepSize / 120;
    }
    if (Math.abs(deltaY) > 1.2) {
        deltaY *= options.stepSize / 120;
    }
    
    scrollArray(overflowing, deltaX, deltaY);
    event.preventDefault();
    scheduleClearCache();
}

/**
 * Keydown event handler.
 * @param {Object} event
 */
function keydown(event) {

    var target   = event.target;
    var modifier = event.ctrlKey || event.altKey || event.metaKey || 
                  (event.shiftKey && event.keyCode !== key.spacebar);
    
    // our own tracked active element could've been removed from the DOM
    if (!document.body.contains(activeElement)) {
        activeElement = document.activeElement;
    }

    // do nothing if user is editing text
    // or using a modifier key (except shift)
    // or in a dropdown
    // or inside interactive elements
    var inputNodeNames = /^(textarea|select|embed|object)$/i;
    var buttonTypes = /^(button|submit|radio|checkbox|file|color|image)$/i;
    if ( event.defaultPrevented ||
         inputNodeNames.test(target.nodeName) ||
         isNodeName(target, 'input') && !buttonTypes.test(target.type) ||
         isNodeName(activeElement, 'video') ||
         isInsideYoutubeVideo(event) ||
         target.isContentEditable || 
         modifier ) {
      return true;
    }

    // [spacebar] should trigger button press, leave it alone
    if ((isNodeName(target, 'button') ||
         isNodeName(target, 'input') && buttonTypes.test(target.type)) &&
        event.keyCode === key.spacebar) {
      return true;
    }

    // [arrwow keys] on radio buttons should be left alone
    if (isNodeName(target, 'input') && target.type == 'radio' &&
        arrowKeys[event.keyCode])  {
      return true;
    }
    
    var shift, x = 0, y = 0;
    var overflowing = overflowingAncestor(activeElement);

    if (!overflowing) {
        // Chrome iframes seem to eat key events, which we need to 
        // propagate up, if the iframe has nothing overflowing to scroll
        return (isFrame && isChrome) ? parent.keydown(event) : true;
    }

    var clientHeight = overflowing.clientHeight; 

    if (overflowing == document.body) {
        clientHeight = window.innerHeight;
    }

    switch (event.keyCode) {
        case key.up:
            y = -options.arrowScroll;
            break;
        case key.down:
            y = options.arrowScroll;
            break;         
        case key.spacebar: // (+ shift)
            shift = event.shiftKey ? 1 : -1;
            y = -shift * clientHeight * 0.9;
            break;
        case key.pageup:
            y = -clientHeight * 0.9;
            break;
        case key.pagedown:
            y = clientHeight * 0.9;
            break;
        case key.home:
            if (overflowing == document.body && document.scrollingElement)
                overflowing = document.scrollingElement;
            y = -overflowing.scrollTop;
            break;
        case key.end:
            var scroll = overflowing.scrollHeight - overflowing.scrollTop;
            var scrollRemaining = scroll - clientHeight;
            y = (scrollRemaining > 0) ? scrollRemaining + 10 : 0;
            break;
        case key.left:
            x = -options.arrowScroll;
            break;
        case key.right:
            x = options.arrowScroll;
            break;            
        default:
            return true; // a key we don't care about
    }

    scrollArray(overflowing, x, y);
    event.preventDefault();
    scheduleClearCache();
}

/**
 * Mousedown event only for updating activeElement
 */
function mousedown(event) {
    activeElement = event.target;
}


/***********************************************
 * OVERFLOW
 ***********************************************/

var uniqueID = (function () {
    var i = 0;
    return function (el) {
        return el.uniqueID || (el.uniqueID = i++);
    };
})();

var cacheX = {}; // cleared out after a scrolling session
var cacheY = {}; // cleared out after a scrolling session
var clearCacheTimer;
var smoothBehaviorForElement = {};

//setInterval(function () { cache = {}; }, 10 * 1000);

function scheduleClearCache() {
    clearTimeout(clearCacheTimer);
    clearCacheTimer = setInterval(function () { 
        cacheX = cacheY = smoothBehaviorForElement = {}; 
    }, 1*1000);
}

function setCache(elems, overflowing, x) {
    var cache = x ? cacheX : cacheY;
    for (var i = elems.length; i--;)
        cache[uniqueID(elems[i])] = overflowing;
    return overflowing;
}

function getCache(el, x) {
    return (x ? cacheX : cacheY)[uniqueID(el)];
}

//  (body)                (root)
//         | hidden | visible | scroll |  auto  |
// hidden  |   no   |    no   |   YES  |   YES  |
// visible |   no   |   YES   |   YES  |   YES  |
// scroll  |   no   |   YES   |   YES  |   YES  |
// auto    |   no   |   YES   |   YES  |   YES  |

function overflowingAncestor(el) {
    var elems = [];
    var body = document.body;
    var rootScrollHeight = root.scrollHeight;
    do {
        var cached = getCache(el, false);
        if (cached) {
            return setCache(elems, cached);
        }
        elems.push(el);
        if (rootScrollHeight === el.scrollHeight) {
            var topOverflowsNotHidden = overflowNotHidden(root) && overflowNotHidden(body);
            var isOverflowCSS = topOverflowsNotHidden || overflowAutoOrScroll(root);
            if (isFrame && isContentOverflowing(root) || 
               !isFrame && isOverflowCSS) {
                return setCache(elems, getScrollRoot()); 
            }
        } else if (isContentOverflowing(el) && overflowAutoOrScroll(el)) {
            return setCache(elems, el);
        }
    } while ((el = el.parentElement));
}

function isContentOverflowing(el) {
    return (el.clientHeight + 10 < el.scrollHeight);
}

// typically for <body> and <html>
function overflowNotHidden(el) {
    var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
    return (overflow !== 'hidden');
}

// for all other elements
function overflowAutoOrScroll(el) {
    var overflow = getComputedStyle(el, '').getPropertyValue('overflow-y');
    return (overflow === 'scroll' || overflow === 'auto');
}

// for all other elements
function isScrollBehaviorSmooth(el) {
    var id = uniqueID(el);
    if (smoothBehaviorForElement[id] == null) {
        var scrollBehavior = getComputedStyle(el, '')['scroll-behavior'];
        smoothBehaviorForElement[id] = ('smooth' == scrollBehavior);
    }
    return smoothBehaviorForElement[id];
}


/***********************************************
 * HELPERS
 ***********************************************/

function addEvent(type, fn, arg) {
    window.addEventListener(type, fn, arg || false);
}

function removeEvent(type, fn, arg) {
    window.removeEventListener(type, fn, arg || false);  
}

function isNodeName(el, tag) {
    return el && (el.nodeName||'').toLowerCase() === tag.toLowerCase();
}

function directionCheck(x, y) {
    x = (x > 0) ? 1 : -1;
    y = (y > 0) ? 1 : -1;
    if (direction.x !== x || direction.y !== y) {
        direction.x = x;
        direction.y = y;
        que = [];
        lastScroll = 0;
    }
}

if (window.localStorage && localStorage.SS_deltaBuffer) {
    try { // #46 Safari throws in private browsing for localStorage 
        deltaBuffer = localStorage.SS_deltaBuffer.split(',');
    } catch (e) { } 
}

function isTouchpad(deltaY) {
    if (!deltaY) return;
    if (!deltaBuffer.length) {
        deltaBuffer = [deltaY, deltaY, deltaY];
    }
    deltaY = Math.abs(deltaY);
    deltaBuffer.push(deltaY);
    deltaBuffer.shift();
    clearTimeout(deltaBufferTimer);
    deltaBufferTimer = setTimeout(function () {
        try { // #46 Safari throws in private browsing for localStorage
            localStorage.SS_deltaBuffer = deltaBuffer.join(',');
        } catch (e) { }  
    }, 1000);
    var dpiScaledWheelDelta = deltaY > 120 && allDeltasDivisableBy(deltaY); // win64 
    var tp = !allDeltasDivisableBy(120) && !allDeltasDivisableBy(100) && !dpiScaledWheelDelta;
    if (deltaY < 50) return true;
    return tp;
} 

function isDivisible(n, divisor) {
    return (Math.floor(n / divisor) == n / divisor);
}

function allDeltasDivisableBy(divisor) {
    return (isDivisible(deltaBuffer[0], divisor) &&
            isDivisible(deltaBuffer[1], divisor) &&
            isDivisible(deltaBuffer[2], divisor));
}

function isInsideYoutubeVideo(event) {
    var elem = event.target;
    var isControl = false;
    if (document.URL.indexOf ('www.youtube.com/watch') != -1) {
        do {
            isControl = (elem.classList && 
                         elem.classList.contains('html5-video-controls'));
            if (isControl) break;
        } while ((elem = elem.parentNode));
    }
    return isControl;
}

var requestFrame = (function () {
      return (window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    ||
              function (callback, element, delay) {
                 window.setTimeout(callback, delay || (1000/60));
             });
})();

var MutationObserver = (window.MutationObserver || 
                        window.WebKitMutationObserver ||
                        window.MozMutationObserver);  

var getScrollRoot = (function() {
  var SCROLL_ROOT = document.scrollingElement;
  return function() {
    if (!SCROLL_ROOT) {
      var dummy = document.createElement('div');
      dummy.style.cssText = 'height:10000px;width:1px;';
      document.body.appendChild(dummy);
      var bodyScrollTop  = document.body.scrollTop;
      var docElScrollTop = document.documentElement.scrollTop;
      window.scrollBy(0, 3);
      if (document.body.scrollTop != bodyScrollTop)
        (SCROLL_ROOT = document.body);
      else 
        (SCROLL_ROOT = document.documentElement);
      window.scrollBy(0, -3);
      document.body.removeChild(dummy);
    }
    return SCROLL_ROOT;
  };
})();


/***********************************************
 * PULSE (by Michael Herf)
 ***********************************************/
 
/**
 * Viscous fluid with a pulse for part and decay for the rest.
 * - Applies a fixed force over an interval (a damped acceleration), and
 * - Lets the exponential bleed away the velocity over a longer interval
 * - Michael Herf, http://stereopsis.com/stopping/
 */
function pulse_(x) {
    var val, start, expx;
    // test
    x = x * options.pulseScale;
    if (x < 1) { // acceleartion
        val = x - (1 - Math.exp(-x));
    } else {     // tail
        // the previous animation ended here:
        start = Math.exp(-1);
        // simple viscous drag
        x -= 1;
        expx = 1 - Math.exp(-x);
        val = start + (expx * (1 - start));
    }
    return val * options.pulseNormalize;
}

function pulse(x) {
    if (x >= 1) return 1;
    if (x <= 0) return 0;

    if (options.pulseNormalize == 1) {
        options.pulseNormalize /= pulse_(1);
    }
    return pulse_(x);
}


/***********************************************
 * FIRST RUN
 ***********************************************/

var userAgent = window.navigator.userAgent;
var isEdge    = /Edge/.test(userAgent); // thank you MS
var isChrome  = /chrome/i.test(userAgent) && !isEdge; 
var isSafari  = /safari/i.test(userAgent) && !isEdge; 
var isMobile  = /mobile/i.test(userAgent);
var isIEWin7  = /Windows NT 6.1/i.test(userAgent) && /rv:11/i.test(userAgent);
var isOldSafari = isSafari && (/Version\/8/i.test(userAgent) || /Version\/9/i.test(userAgent));
var isEnabledForBrowser = (isChrome || isSafari || isIEWin7) && !isMobile;

var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () {
            supportsPassive = true;
        } 
    }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'; 

if (wheelEvent && isEnabledForBrowser) {
    addEvent(wheelEvent, wheel, wheelOpt);
    addEvent('mousedown', mousedown);
    addEvent('load', init);
}


/***********************************************
 * PUBLIC INTERFACE
 ***********************************************/

function SmoothScroll(optionsToSet) {
    for (var key in optionsToSet)
        if (defaultOptions.hasOwnProperty(key)) 
            options[key] = optionsToSet[key];
}
SmoothScroll.destroy = cleanup;

if (window.SmoothScrollOptions) // async API
    SmoothScroll(window.SmoothScrollOptions);

if (typeof define === 'function' && define.amd)
    define(function() {
        return SmoothScroll;
    });
else if ('object' == typeof exports)
    module.exports = SmoothScroll;
else
    window.SmoothScroll = SmoothScroll;

})();




// ===== CSS Animation On-Scroll Gate (works with existing CSS keyframes) =====
class CSSAnimationOnScroll {
  constructor() {
    this.targets = [];
    this.observer = null;
    this.prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.init();
  }

  init() {
    // Collect every element that already has a CSS animation from stylesheets
    // We’ll detect via computed style so you don't need to add any classes.
    const all = document.querySelectorAll('body *');

    all.forEach(el => {
      const cs = getComputedStyle(el);

      // If there’s no animation, skip
      // Handles multi-animations: animationName can be "fade, slide" etc.
      const names = (cs.animationName || '').split(',').map(s => s.trim()).filter(Boolean);
      if (!names.length || names.every(n => n === 'none')) return;

      // If animation is explicitly infinite (spinners/loaders), let it run immediately
      const counts = (cs.animationIterationCount || '').split(',').map(s => s.trim());
      const isInfinite = counts.some(c => c === 'infinite');

      // Store original shorthand to replay later
      const originalAnim = cs.animation; // shorthand includes name, duration, timing, delay, count, direction, fill, play-state

      // Mark + pause initial animation (unless infinite)
      if (!isInfinite) {
        el.dataset.animOriginal = originalAnim;
        el.style.animation = 'none';
        el.classList.add('css-anim-hidden');
        this.targets.push(el);
      }
    });

    if (this.prefersReduced || !this.targets.length) {
      // Just reveal everything without motion
      this.targets.forEach(el => {
        el.classList.remove('css-anim-hidden');
        el.classList.add('css-anim-play');
        el.style.animation = 'none';
      });
      return;
    }

    this.setupObserver();
    this.observe();
    this.setupRefreshReplay();
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          this.play(el);
          // Run once by default; if you want repeat behavior per element, set data-repeat="true"
          if (el.dataset.repeat !== 'true') this.observer.unobserve(el);
        } else if (el.dataset.repeat === 'true') {
          this.resetElement(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0' });
  }

  observe() {
    this.targets.forEach(el => this.observer.observe(el));
  }

  play(el) {
    // Restore original animation shorthand and reveal
    if (el.dataset.animOriginal) {
      // Force restart in case browser cached style
      el.style.animation = 'none';
      // reflow
      void el.offsetHeight;
      el.style.animation = el.dataset.animOriginal;
    }
    el.classList.remove('css-anim-hidden');
    el.classList.add('css-anim-play');
  }

  resetElement(el) {
    // Allow re-animate when it re-enters viewport
    el.classList.remove('css-anim-play');
    el.classList.add('css-anim-hidden');
    el.style.animation = 'none';
    // reflow
    void el.offsetHeight;
  }

  // Replay everything on hard refresh and BFCache restore
  setupRefreshReplay() {
    // On normal load, everything is already reset in init()
    // Handle bfcache (back/forward cache): pageshow with persisted = true
    window.addEventListener('pageshow', (e) => {
      if (e.persisted) this.resetAndReobserve();
    });
  }

  resetAndReobserve() {
    this.targets.forEach(el => this.resetElement(el));
    // Re-observe to ensure they play again as you scroll
    this.observe();
  }
}

this.components.scrollAnimationController = new ScrollAnimationController()
this.components.cssAnimationOnScroll = new CSSAnimationOnScroll();
