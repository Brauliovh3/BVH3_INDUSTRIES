class CyberpunkPortfolio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.startParticles();
        this.startTerminal();
        this.loadContent();
        this.navigateFromHash();
        this.musicPlayer = null;
        this.isPlaying = false;
        this.currentTrack = 0;
        this.tracks = [
            {
                file: 'cyberpunk.mp3',
                title: 'Cyberpunk: Edgerunners',
                artist: 'This Fire by Franz Ferdinand',
                duration: '3:45'
            }
        ];
        
        // Performance optimizations
        this.isLowEndDevice = this.detectLowEndDevice();
        this.performanceMode = this.getPerformanceMode();
        this.setupPerformanceOptimizations();
    }

    init() {
        this.activeSection = 'home';
        this.prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
        this.particles = [];
        this.terminalLines = [
            'BVH3 INDUSTRIES SYSTEM INITIALIZED...',
            'LOADING CYBERPUNK PROTOCOLS...',
            'SECURITY SCAN: [OK]',
            'NEURAL NETWORK: [ACTIVE]',
            'QUANTUM ENCRYPTION: [ENABLED]',
            'WELCOME TO THE FUTURE...'
        ];
        this.currentTerminalLine = 0;

        // Modal NSFW
        this.nsfwModal = document.getElementById('nsfw-modal');
        this.nsfwCloseBtn = document.querySelector('.nsfw-close-btn');
        this.nsfwSubmitBtn = document.getElementById('nsfw-submit-btn');
        this.nsfwPasswordInput = document.getElementById('nsfw-password');
        this.nsfwErrorMessage = document.getElementById('nsfw-error-message');
        this.nsfwTogglePasswordBtn = document.getElementById('nsfw-toggle-password');

        // Forbidden Content Modal
        this.forbiddenContentModal = document.getElementById('forbidden-content-modal');
        this.forbiddenContentBody = document.getElementById('forbidden-content-body');
        this.forbiddenContentCloseBtn = document.querySelector('.forbidden-content-close-btn');

        // Media Viewer
        this.mediaViewer = document.getElementById('media-viewer');
        this.mediaViewerContent = document.getElementById('media-viewer-content');
        this.mediaViewerCloseBtn = document.getElementById('media-viewer-close-btn');

       
        const titleMain = document.querySelector('.title-main');
        if (titleMain) {
            titleMain.setAttribute('data-text', titleMain.textContent);
            titleMain.classList.add('glitch');
        }
    }

    setupEventListeners() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.getElementById('navToggle');

       
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.getAttribute('data-section');
                this.handleNavigation(section);

                
                navMenu?.classList.remove('active');
                navToggle?.classList.remove('active');
                document.body.style.overflow = '';
            });

            // Add touch feedback for mobile
            btn.addEventListener('touchstart', (e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
            });
            
            btn.addEventListener('touchend', (e) => {
                e.currentTarget.style.transform = '';
            });
        });

        
        const terminalToggle = document.getElementById('terminalToggle');
        terminalToggle.addEventListener('click', () => {
            this.toggleTerminal();
        });

        
        navToggle.addEventListener('click', () => {
            this.toggleMobileMenu(navMenu, navToggle);
        });

        // Add touch support for hamburger menu
        navToggle.addEventListener('touchstart', (e) => {
            e.currentTarget.style.transform = 'scale(0.9)';
        });
        
        navToggle.addEventListener('touchend', (e) => {
            e.currentTarget.style.transform = '';
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !navToggle.contains(e.target)) {
                this.closeMobileMenu(navMenu, navToggle);
            }
        });

        // Handle escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                this.closeMobileMenu(navMenu, navToggle);
            }
            if (e.key === 'Escape' && this.nsfwModal?.style.display === 'flex') {
                this.hideNsfwModal();
            }
            if (e.key === 'Escape' && this.forbiddenContentModal?.style.display === 'flex') {
                this.hideForbiddenContentModal();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

       
        this.nsfwCloseBtn?.addEventListener('click', () => this.hideNsfwModal());
        this.nsfwSubmitBtn?.addEventListener('click', () => this.checkNsfwPassword());
        this.nsfwTogglePasswordBtn?.addEventListener('click', () => this.toggleNsfwPassword());
        this.nsfwPasswordInput?.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                this.checkNsfwPassword();
            }
        });
        
        window.addEventListener('click', (e) => {
            if (e.target == this.nsfwModal) {
                this.hideNsfwModal();
            }
            if (e.target == this.forbiddenContentModal) {
                this.hideForbiddenContentModal();
            }
        });

        // Forbidden Content
        this.forbiddenContentCloseBtn?.addEventListener('click', () => this.hideForbiddenContentModal());

        // Media Viewer
        this.mediaViewerCloseBtn?.addEventListener('click', () => this.hideMediaViewer());
        window.addEventListener('click', (e) => {
            if (e.target == this.mediaViewer) {
                this.hideMediaViewer();
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        window.addEventListener('hashchange', () => {
            this.navigateFromHash();
        });
    }

    handleNavigation(section) {
        if (!section) return;

        if (section === 'forbidden-zone') {
            this.showNsfwModal();
            // Do not proceed to showSection, as content is now handled in a modal
            return;
        }

        const activeSection = this.showSection(section);
        this.loadSectionContent(activeSection);
    }

    showNsfwModal() {
        if (!this.nsfwModal) return;
        this.nsfwModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        this.nsfwPasswordInput?.focus();
    }

    hideNsfwModal() {
        if (!this.nsfwModal) return;
        this.nsfwModal.style.display = 'none';
        document.body.style.overflow = '';
        if (this.nsfwPasswordInput) {
            this.nsfwPasswordInput.value = '';
        }
        if (this.nsfwErrorMessage) {
            this.nsfwErrorMessage.textContent = '';
        }
    }

    checkNsfwPassword() {
        const enteredPassword = this.nsfwPasswordInput.value.trim().toLowerCase().replace('-', '');
        const expectedPassword = 'bvh32006';

        if (enteredPassword === expectedPassword) {
            this.hideNsfwModal();
            this.loadAndShowForbiddenContent();
        } else {
            this.nsfwErrorMessage.textContent = 'CÓDIGO INCORRECTO. ACCESO DENEGADO.';
            this.nsfwPasswordInput.value = '';
            // Añadir un efecto de "sacudida" para feedback visual
            this.nsfwModal.querySelector('.nsfw-modal-content').animate([
                { transform: 'translateX(0)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(0)' }
            ], {
                duration: 300,
                easing: 'ease-in-out'
            });
        }
    }

    loadAndShowForbiddenContent() {
        if (!this.forbiddenContentBody) return;
        
        // Show loading state
        this.forbiddenContentBody.innerHTML = `
            <div class="forbidden-loading">
                <div class="loading-spinner"></div>
                <p>CARGANDO COLECCIÓN EXCLUSIVA...</p>
            </div>
        `;
        
        this.showForbiddenContentModal();
        
        // Load content with performance optimization
        setTimeout(() => {
            const content = this.getContentForSection('forbidden-zone');
            this.forbiddenContentBody.innerHTML = content;
            this.setupForbiddenZoneInteractions();
            this.setupLazyLoadingForGames();
        }, this.isLowEndDevice ? 300 : 100);
    }

    showForbiddenContentModal() {
        if (!this.forbiddenContentModal) return;
        this.forbiddenContentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    hideForbiddenContentModal() {
        if (!this.forbiddenContentModal) return;
        this.forbiddenContentModal.style.display = 'none';
        document.body.style.overflow = '';
        this.forbiddenContentBody.innerHTML = ''; // Clear content on close
    }


    toggleNsfwPassword() {
        if (!this.nsfwPasswordInput || !this.nsfwTogglePasswordBtn) return;
        const isPassword = this.nsfwPasswordInput.type === 'password';
        this.nsfwPasswordInput.type = isPassword ? 'text' : 'password';
        this.nsfwTogglePasswordBtn.textContent = isPassword ? '🙈' : '👁';
    }

    navigateFromHash() {
        const section = (window.location.hash || '').replace('#', '');
        if (!section) return;
        this.handleNavigation(section);
    }

    showSection(section) {
        if (!document.getElementById(section)) {
            section = 'home';
        }
        const allSections = document.querySelectorAll('.section');
        allSections.forEach(s => s.classList.toggle('active', s.id === section));

        const navBtns = document.querySelectorAll('.nav-btn');
        const activeNavSection = section === 'project-view' ? 'projects' : section;
        navBtns.forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-section') === activeNavSection));

        this.activeSection = section;
        if (section === 'home') {
            history.replaceState(null, '', window.location.pathname);
        } else {
            history.replaceState(null, '', `#${section}`);
        }

        return section;
    }

    async loadSectionContent(section) {
        if (section === 'home') return;
        const contentId = `${section}Content`;
        const contentElement = document.getElementById(contentId);

        if (!contentElement) return;

        const content = this.getContentForSection(section);
        this.animateContentLoad(contentElement, content, () => {
            this.onSectionRendered(section, contentElement);
        });
    }

    animateContentLoad(element, content, afterRender) {
        element.innerHTML = content;
        afterRender?.();
    }

    onSectionRendered(section, contentElement) {
        if (section === 'contact') {
            const contactForm = contentElement.querySelector('#contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmission(e);
                });
            }
        }

        if (section === 'projects') {
            const buttons = contentElement.querySelectorAll('.project-view-btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const title = btn.getAttribute('data-title') || 'PROYECTO';
                    const description = btn.getAttribute('data-description') || '';
                    const links = [
                        { label: 'Grupo', url: btn.getAttribute('data-group-url') || '' },
                        { label: 'Canal', url: btn.getAttribute('data-channel-url') || '' },
                        { label: 'Creador', url: btn.getAttribute('data-creator-url') || '' },
                        { label: 'Bot', url: btn.getAttribute('data-bot-url') || '' }
                    ].filter(l => l.url);

                    this.openProjectView({ title, description, links });
                });
            });
        }

        if (section === 'memories') {
            const memoryCards = contentElement.querySelectorAll('.memory-card');
            memoryCards.forEach(card => {
                card.addEventListener('click', () => {
                    const type = card.getAttribute('data-type');
                    const src = card.getAttribute('data-src');
                    this.showMediaViewer(type, src);
                });
                
                // Implement lazy loading for video thumbnails
                this.setupLazyVideoThumbnail(card);
            });
        }

        if (section === 'depool') {
            this.initDepoolAndroid(contentElement);
            this.initDiscordMusicPlayer();
        }

        const anchors = contentElement.querySelectorAll('a[href^="#"]');
        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = e.currentTarget.getAttribute('href') || '';
                const target = href.replace('#', '');
                if (!target) return;
                e.preventDefault();
                this.handleNavigation(target);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        });
    }

    initDepoolAndroid(contentElement) {
        const stage = contentElement.querySelector('#androidStage');
        const shell = contentElement.querySelector('#androidShell');
        const title = contentElement.querySelector('#androidReadoutTitle');
        const copy = contentElement.querySelector('#androidReadoutCopy');
        const status = contentElement.querySelector('#androidReadoutStatus');
        const hotspots = contentElement.querySelectorAll('.android-hotspot');

        if (!stage || !shell || !title || !copy || !status || !hotspots.length) return;

        const activateHotspot = (hotspot) => {
            hotspots.forEach((item) => item.classList.toggle('is-active', item === hotspot));
            title.textContent = hotspot.dataset.title || 'DEPOOL';
            copy.textContent = hotspot.dataset.detail || '';
            status.textContent = hotspot.dataset.status || 'SYNC ONLINE';
        };

        hotspots.forEach((hotspot) => {
            hotspot.addEventListener('mouseenter', () => activateHotspot(hotspot));
            hotspot.addEventListener('focus', () => activateHotspot(hotspot));
            hotspot.addEventListener('click', () => activateHotspot(hotspot));
        });

        const updateTilt = (clientX, clientY) => {
            const rect = stage.getBoundingClientRect();
            const offsetX = ((clientX - rect.left) / rect.width - 0.5) * 2;
            const offsetY = ((clientY - rect.top) / rect.height - 0.5) * 2;
            shell.style.setProperty('--android-rotate-x', `${(-offsetY * 7).toFixed(2)}deg`);
            shell.style.setProperty('--android-rotate-y', `${(offsetX * 9).toFixed(2)}deg`);
            shell.style.setProperty('--android-shift-x', `${(offsetX * 10).toFixed(1)}px`);
            shell.style.setProperty('--android-shift-y', `${(offsetY * 8).toFixed(1)}px`);
        };

        const resetTilt = () => {
            shell.style.setProperty('--android-rotate-x', '0deg');
            shell.style.setProperty('--android-rotate-y', '0deg');
            shell.style.setProperty('--android-shift-x', '0px');
            shell.style.setProperty('--android-shift-y', '0px');
        };

        if (window.matchMedia?.('(hover: hover)')?.matches) {
            stage.addEventListener('mousemove', (event) => updateTilt(event.clientX, event.clientY));
            stage.addEventListener('mouseleave', resetTilt);
        }

        stage.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            if (!touch) return;
            updateTilt(touch.clientX, touch.clientY);
        }, { passive: true });

        stage.addEventListener('touchend', resetTilt, { passive: true });
    }

    openProjectView(project) {
        const titleEl = document.getElementById('projectViewTitle');
        const subtitleEl = document.getElementById('projectViewSubtitle');
        const bodyEl = document.getElementById('projectViewBody');

        if (!titleEl || !subtitleEl || !bodyEl) return;

        titleEl.textContent = project.title;
        subtitleEl.textContent = project.description || 'Detalles y enlaces oficiales.';

        const linksBlock = project.links?.length
            ? `
                <div class="project-links-grid" aria-label="Enlaces">
                    ${project.links
                        .map(
                            l => `
                                <a class="project-link-card" href="${l.url}" target="_blank" rel="noopener">
                                    <span class="project-link-label">${l.label}</span>
                                    <span class="project-link-url">${l.url}</span>
                                </a>
                            `
                        )
                        .join('')}
                </div>
            `
            : '<p class="muted">No hay enlaces disponibles.</p>';

        bodyEl.innerHTML = `
            <div class="project-view-actions">
                <button type="button" class="cta-btn cta-btn--ghost project-back-btn">VOLVER A PROYECTOS</button>
            </div>
            <div class="panel panel--glass project-view-panel">
                ${linksBlock}
            </div>
        `;

        const backBtn = bodyEl.querySelector('.project-back-btn');
        backBtn?.addEventListener('click', () => {
            this.handleNavigation('projects');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    showMediaViewer(type, src) {
        if (!this.mediaViewer || !this.mediaViewerContent) return;

        // Check device performance and adjust quality
        const isLowEndDevice = this.detectLowEndDevice();
        
        if (type === 'image') {
            this.mediaViewerContent.innerHTML = `<img src="${src}" alt="Memory Image" loading="lazy">`;
        } else if (type === 'video') {
            // Show loading indicator
            this.mediaViewerContent.innerHTML = `
                <div class="video-loading">
                    <div class="loading-spinner"></div>
                    <p>CARGANDO VIDEO...</p>
                </div>
            `;
            
            // Create video element with optimized attributes for low-end devices
            const videoElement = document.createElement('video');
            
            // Adjust video source based on device capabilities
            const optimizedSrc = isLowEndDevice ? this.getOptimizedVideoSrc(src) : src;
            videoElement.src = optimizedSrc;
            
            // Performance optimizations
            videoElement.controls = true;
            videoElement.autoplay = !isLowEndDevice; // Disable autoplay on low-end devices
            videoElement.loop = true;
            videoElement.playsInline = true; // Important for iOS/Android
            videoElement.muted = true; // Allow autoplay on most platforms
            videoElement.preload = 'none'; // Don't preload until user interaction
            videoElement.setAttribute('data-optimized', isLowEndDevice ? 'true' : 'false');
            
            // Set video dimensions for better performance
            videoElement.style.maxWidth = '100%';
            videoElement.style.maxHeight = '100%';
            videoElement.style.objectFit = 'contain';
            
            // Add performance monitoring
            this.addVideoPerformanceMonitoring(videoElement);
            
            // Handle video load events with performance optimizations
            videoElement.addEventListener('loadeddata', () => {
                // Remove loading indicator
                const loadingIndicator = this.mediaViewerContent.querySelector('.video-loading');
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }
                
                // Try to play the video with fallback for low-end devices
                if (!isLowEndDevice) {
                    videoElement.play().catch(error => {
                        console.log('Autoplay prevented:', error);
                        videoElement.controls = true;
                    });
                } else {
                    // For low-end devices, show a play button overlay
                    this.addPlayButtonOverlay(videoElement);
                }
            });
            
            videoElement.addEventListener('error', (e) => {
                console.error('Video error:', e);
                this.mediaViewerContent.innerHTML = `<div style="color: #ff2bd6; text-align: center; padding: 2rem;">
                    <p>Error loading video</p>
                    <p style="font-size: 0.9rem; opacity: 0.7;">The video file may be corrupted or not supported</p>
                    <button class="cta-btn cta-btn--ghost" onclick="this.parentElement.parentElement.parentElement.showMediaViewer('video', '${src}')">REINTENTAR</button>
                </div>`;
            });
            
            // Clear loading indicator and add video
            setTimeout(() => {
                this.mediaViewerContent.innerHTML = '';
                this.mediaViewerContent.appendChild(videoElement);
                
                // Start loading the video after a small delay to improve perceived performance
                if (videoElement.preload === 'none') {
                    videoElement.load();
                }
            }, isLowEndDevice ? 100 : 50);
        }

        this.mediaViewer.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    hideMediaViewer() {
        if (!this.mediaViewer || !this.mediaViewerContent) return;
        this.mediaViewer.style.display = 'none';
        this.mediaViewerContent.innerHTML = '';
        document.body.style.overflow = ''; // Restore body scrolling
        
        // Stop any playing videos
        const videos = this.mediaViewerContent.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }

    detectLowEndDevice() {
        // Check for low-end device indicators
        const checks = {
            // Memory check (approximate)
            lowMemory: navigator.deviceMemory && navigator.deviceMemory <= 2,
            // CPU cores check
            lowCores: navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2,
            // Connection speed check
            slowConnection: navigator.connection && (
                navigator.connection.effectiveType === 'slow-2g' ||
                navigator.connection.effectiveType === '2g' ||
                navigator.connection.downlink < 1
            ),
            // Mobile device check
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            // Screen resolution check
            lowResolution: window.screen.width * window.screen.height <= 800 * 600
        };

        // Count how many low-end indicators are true
        const lowEndCount = Object.values(checks).filter(Boolean).length;
        
        // Consider device low-end if 3 or more indicators are true
        return lowEndCount >= 3 || checks.slowConnection || (checks.isMobile && checks.lowMemory);
    }

    getOptimizedVideoSrc(originalSrc) {
        // For demo purposes, we'll add a quality parameter
        // In a real implementation, you would have different video files
        const separator = originalSrc.includes('?') ? '&' : '?';
        return `${originalSrc}${separator}quality=low&optimize=true`;
    }

    addVideoPerformanceMonitoring(videoElement) {
        let startTime = performance.now();
        let frameCount = 0;
        let lastFrameTime = startTime;
        
        // Monitor video performance
        const monitorFrame = () => {
            frameCount++;
            const currentTime = performance.now();
            const deltaTime = currentTime - lastFrameTime;
            
            // Check if video is struggling (low FPS)
            if (deltaTime > 100) { // More than 100ms per frame = less than 10 FPS
                console.warn('Video performance issue detected, reducing quality');
                this.reduceVideoQuality(videoElement);
            }
            
            lastFrameTime = currentTime;
            
            if (videoElement.readyState >= 2 && !videoElement.paused) {
                requestAnimationFrame(monitorFrame);
            }
        };
        
        videoElement.addEventListener('play', () => {
            startTime = performance.now();
            frameCount = 0;
            requestAnimationFrame(monitorFrame);
        });
        
        // Log loading performance
        videoElement.addEventListener('loadeddata', () => {
            const loadTime = performance.now() - startTime;
            console.log(`Video loaded in ${loadTime.toFixed(2)}ms`);
        });
    }

    addPlayButtonOverlay(videoElement) {
        const playButton = document.createElement('div');
        playButton.className = 'video-play-overlay';
        playButton.innerHTML = `
            <div class="play-button-large">
                <span>PLAY</span>
            </div>
            <p class="play-hint">Click to play (optimized for your device)</p>
        `;
        
        playButton.addEventListener('click', () => {
            videoElement.play().then(() => {
                playButton.style.display = 'none';
            }).catch(error => {
                console.error('Play failed:', error);
            });
        });
        
        videoElement.parentElement.appendChild(playButton);
    }

    reduceVideoQuality(videoElement) {
        // Reduce video quality dynamically
        if (videoElement.dataset.optimized === 'false') {
            console.log('Reducing video quality for better performance');
            const currentSrc = videoElement.src;
            const optimizedSrc = this.getOptimizedVideoSrc(currentSrc);
            const currentTime = videoElement.currentTime;
            const wasPlaying = !videoElement.paused;
            
            videoElement.src = optimizedSrc;
            videoElement.dataset.optimized = 'true';
            
            videoElement.addEventListener('loadeddata', () => {
                videoElement.currentTime = currentTime;
                if (wasPlaying) {
                    videoElement.play();
                }
            }, { once: true });
        }
    }

    setupLazyVideoThumbnail(card) {
        const type = card.getAttribute('data-type');
        if (type !== 'video') return;

        const thumbnail = card.querySelector('.memory-thumbnail video');
        if (!thumbnail) return;

        // Add loading state
        card.classList.add('loading');

        // Create intersection observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadVideoThumbnail(thumbnail, card);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px', // Start loading 50px before visible
            threshold: 0.1
        });

        observer.observe(card);
    }

    loadVideoThumbnail(thumbnail, card) {
        const isLowEndDevice = this.detectLowEndDevice();
        const src = thumbnail.src || thumbnail.getAttribute('src');
        
        if (!src) return;

        // For low-end devices, use poster image instead of video thumbnail
        if (isLowEndDevice) {
            this.createVideoPoster(thumbnail, card);
            return;
        }

        // Load video thumbnail with performance optimization
        thumbnail.preload = 'metadata';
        thumbnail.muted = true;
        thumbnail.playsInline = true;

        thumbnail.addEventListener('loadeddata', () => {
            // Seek to a frame that shows good preview
            thumbnail.currentTime = 0.5;
            
            thumbnail.addEventListener('seeked', () => {
                card.classList.remove('loading');
                card.classList.add('loaded');
                
                // Pause after loading the preview frame
                thumbnail.pause();
            }, { once: true });
        });

        thumbnail.addEventListener('error', () => {
            console.warn('Video thumbnail failed to load, using fallback');
            this.createVideoPoster(thumbnail, card);
        });

        // Start loading
        thumbnail.load();
    }

    createVideoPoster(thumbnail, card) {
        // Create a poster image for low-end devices or fallback
        const poster = document.createElement('img');
        poster.src = 'https://via.placeholder.com/400x225.png/ff2bd6/000000?text=VIDEO';
        poster.alt = 'Video thumbnail';
        poster.className = 'video-poster-fallback';
        poster.style.cssText = `
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: absolute;
            top: 0;
            left: 0;
        `;

        thumbnail.style.display = 'none';
        thumbnail.parentElement.appendChild(poster);
        
        card.classList.remove('loading');
        card.classList.add('loaded');
    }

    optimizeMemoryUsage() {
        // Clean up unused video elements to free memory
        const videos = document.querySelectorAll('.memory-thumbnail video');
        videos.forEach(video => {
            const card = video.closest('.memory-card');
            if (!card || !card.classList.contains('loaded')) {
                video.src = '';
                video.load();
            }
        });
    }

    getPerformanceMode() {
        if (this.isLowEndDevice) {
            return 'low';
        }
        
        // Check connection speed
        if (navigator.connection) {
            const connection = navigator.connection;
            if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                return 'low';
            } else if (connection.effectiveType === '3g') {
                return 'medium';
            }
        }
        
        // Check battery level if available
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                if (battery.level < 0.2) {
                    this.performanceMode = 'low';
                    this.setupLowPowerMode();
                }
            });
        }
        
        return 'high';
    }

    setupPerformanceOptimizations() {
        // Add performance class to body
        document.body.classList.add(`performance-${this.performanceMode}`);
        
        if (this.isLowEndDevice) {
            document.body.classList.add('low-end-device');
            this.setupLowEndOptimizations();
        }
        
        // Setup network-aware loading
        if (navigator.connection) {
            this.setupNetworkAwareLoading();
        }
        
        // Setup memory optimization interval
        setInterval(() => {
            this.optimizeMemoryUsage();
        }, 30000); // Every 30 seconds
    }

    setupLowEndOptimizations() {
        // Reduce particle count for low-end devices
        if (this.particles && this.particles.length > 50) {
            this.particles = this.particles.slice(0, 50);
        }
        
        // Disable heavy animations
        document.body.style.setProperty('--animation-duration', '0.3s');
        
        // Reduce quality of background effects
        const matrixBg = document.getElementById('matrix-bg');
        if (matrixBg) {
            matrixBg.style.opacity = '0.5';
        }
    }

    setupLowPowerMode() {
        // Further reduce performance when battery is low
        document.body.classList.add('low-power-mode');
        
        // Disable animations completely
        document.body.style.setProperty('--animation-duration', '0s');
        
        // Reduce background effects
        const matrixBg = document.getElementById('matrix-bg');
        const particlesCanvas = document.getElementById('particles-canvas');
        if (matrixBg) matrixBg.style.opacity = '0.3';
        if (particlesCanvas) particlesCanvas.style.display = 'none';
    }

    setupNetworkAwareLoading() {
        const connection = navigator.connection;
        if (!connection) return;
        
        // Add slow connection class
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
            document.body.classList.add('slow-connection');
        }
        
        // Listen for network changes
        connection.addEventListener('change', () => {
            const newMode = this.getPerformanceMode();
            if (newMode !== this.performanceMode) {
                this.performanceMode = newMode;
                this.setupPerformanceOptimizations();
            }
        });
    }

    setupForbiddenZoneInteractions() {
        const gameCards = document.querySelectorAll('.h-game-card');
        const downloadButtons = document.querySelectorAll('.game-btn--primary');
        
        // Setup card hover effects with performance optimization
        gameCards.forEach(card => {
            if (!this.isLowEndDevice) {
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-8px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0) scale(1)';
                });
            }
            
            // Add touch feedback for mobile
            card.addEventListener('touchstart', () => {
                card.style.transform = 'scale(0.98)';
            });
            
            card.addEventListener('touchend', () => {
                card.style.transform = '';
            });
        });
        
        // Setup download buttons with tracking
        downloadButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleGameDownload(btn);
            });
        });
    }

    setupLazyLoadingForGames() {
        const gameImages = document.querySelectorAll('.game-image');
        
        // Create intersection observer for lazy loading
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const card = img.closest('.h-game-card');
                    
                    // Add loading state
                    card.classList.add('loading');
                    
                    img.addEventListener('load', () => {
                        card.classList.remove('loading');
                        card.classList.add('loaded');
                    });
                    
                    img.addEventListener('error', () => {
                        this.handleImageError(img);
                    });
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        gameImages.forEach(img => observer.observe(img));
    }

    handleGameDownload(button) {
        const downloadUrl = button.getAttribute('data-download');
        const gameTitle = button.closest('.h-game-card').querySelector('.game-title').textContent;
        
        // Show loading state
        button.innerHTML = `
            <span class="btn-icon">LOADING</span>
            <span class="btn-text">PREPARANDO...</span>
        `;
        button.disabled = true;
        
        // Track download
        this.trackGameDownload(gameTitle);
        
        // Create download link
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = '';
        link.style.display = 'none';
        document.body.appendChild(link);
        
        // Simulate preparation time
        setTimeout(() => {
            link.click();
            document.body.removeChild(link);
            
            // Show success state
            button.innerHTML = `
                <span class="btn-icon">CHECK</span>
                <span class="btn-text">DESCARGADO</span>
            `;
            button.classList.add('success');
            
            // Reset button after delay
            setTimeout(() => {
                button.innerHTML = `
                    <span class="btn-icon">DOWNLOAD</span>
                    <span class="btn-text">DESCARGAR</span>
                `;
                button.disabled = false;
                button.classList.remove('success');
            }, 3000);
        }, this.isLowEndDevice ? 1500 : 800);
    }

    handleImageError(img) {
        const card = img.closest('.h-game-card');
        const fallbackSrc = 'https://via.placeholder.com/400x225.png/ff2bd6/000000?text=GAME';
        
        img.src = fallbackSrc;
        img.classList.add('fallback-image');
        
        img.addEventListener('load', () => {
            card.classList.remove('loading');
            card.classList.add('loaded');
        }, { once: true });
    }

    trackGameDownload(gameTitle) {
        // Simple tracking for analytics
        console.log(`Game download initiated: ${gameTitle}`);
        
        // Store in localStorage for download history
        const downloadHistory = JSON.parse(localStorage.getItem('gameDownloads') || '[]');
        downloadHistory.push({
            game: gameTitle,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        });
        
        // Keep only last 50 downloads
        if (downloadHistory.length > 50) {
            downloadHistory.shift();
        }
        
        localStorage.setItem('gameDownloads', JSON.stringify(downloadHistory));
    }

    // Discord-style music player functions
    initDiscordMusicPlayer() {
        const audioPlayer = document.getElementById('musicPlayer');
        const globalPlayBtn = document.getElementById('globalPlayBtn');
        const globalPauseBtn = document.getElementById('globalPauseBtn');
        const globalNextBtn = document.getElementById('globalNextBtn');
        const visualizer = document.querySelector('.audio-visualizer');
        
        if (!audioPlayer) return;
        
        // Track list for Discord-style player
        this.discordTracks = [
            { file: 'cyberpunk.mp3', title: 'Cyberpunk: Edgerunners', artist: 'This Fire by Franz Ferdinand', duration: '3:45' },
            { file: 'Let it happen.mp3', title: 'Let It Happen', artist: 'Tame Impala', duration: '7:47' },
            { file: 'DARE.mp3', title: 'Dare', artist: 'Sayfalse, TRXVELER & DJ ALIM', duration: '4:23' }
        ];
        
        this.currentDiscordTrack = 0;
        this.isPlaying = false;
        
        // Setup global controls
        if (globalPlayBtn) {
            globalPlayBtn.addEventListener('click', () => this.playCurrentDiscordTrack());
        }
        
        if (globalPauseBtn) {
            globalPauseBtn.addEventListener('click', () => this.pauseDiscordTrack());
        }
        
        if (globalNextBtn) {
            globalNextBtn.addEventListener('click', () => this.playNextDiscordTrack());
        }
        
        // Setup audio events
        audioPlayer.addEventListener('timeupdate', () => this.updateDiscordProgress());
        audioPlayer.addEventListener('ended', () => this.playNextDiscordTrack());
        audioPlayer.addEventListener('play', () => {
            this.isPlaying = true;
            if (visualizer) visualizer.classList.add('playing');
        });
        audioPlayer.addEventListener('pause', () => {
            this.isPlaying = false;
            if (visualizer) visualizer.classList.remove('playing');
        });
    }

    playDiscordTrack(trackFile, buttonElement) {
        const audioPlayer = document.getElementById('musicPlayer');
        const trackIndex = this.discordTracks.findIndex(track => track.file === trackFile);
        
        if (trackIndex === -1) return;
        
        this.currentDiscordTrack = trackIndex;
        const track = this.discordTracks[trackIndex];
        
        // Update UI
        this.updateDiscordUI(track);
        
        // Update button states
        this.updateDiscordButtons(buttonElement);
        
        // Load and play
        audioPlayer.src = `src/music/${trackFile}`;
        audioPlayer.play().catch(error => {
            console.error('Error playing track:', error);
            this.showDiscordError('No se pudo reproducir la canción');
        });
    }

    playCurrentDiscordTrack() {
        const audioPlayer = document.getElementById('musicPlayer');
        if (audioPlayer.src) {
            audioPlayer.play().catch(error => {
                console.error('Error resuming track:', error);
            });
        } else {
            // Play first track if none is loaded
            const firstTrack = this.discordTracks[0];
            this.playDiscordTrack(firstTrack.file);
        }
    }

    pauseDiscordTrack() {
        const audioPlayer = document.getElementById('musicPlayer');
        audioPlayer.pause();
    }

    playNextDiscordTrack() {
        this.currentDiscordTrack = (this.currentDiscordTrack + 1) % this.discordTracks.length;
        const nextTrack = this.discordTracks[this.currentDiscordTrack];
        this.playDiscordTrack(nextTrack.file);
    }

    updateDiscordUI(track) {
        // Update current track info
        const currentTrackName = document.getElementById('currentTrackName');
        const currentArtistName = document.getElementById('currentArtistName');
        
        if (currentTrackName) currentTrackName.textContent = track.title;
        if (currentArtistName) currentArtistName.textContent = track.artist;
        
        // Update playlist active state
        const discordTracks = document.querySelectorAll('.discord-track');
        discordTracks.forEach((trackElement, index) => {
            const isActive = index === this.currentDiscordTrack;
            trackElement.classList.toggle('active', isActive);
            
            // Update status
            const statusElement = trackElement.querySelector('.discord-status');
            if (statusElement) {
                statusElement.textContent = isActive ? 'PLAYING' : 'READY';
            }
            
            // Update avatar status
            const avatarStatus = trackElement.querySelector('.avatar-status');
            if (avatarStatus) {
                avatarStatus.classList.toggle('playing', isActive);
            }
            
            // Update play button
            const playBtn = trackElement.querySelector('.discord-play-btn');
            if (playBtn) {
                playBtn.classList.toggle('active', isActive);
            }
        });
    }

    updateDiscordButtons(activeButton) {
        // Reset all buttons
        const allButtons = document.querySelectorAll('.discord-play-btn');
        allButtons.forEach(btn => btn.classList.remove('active'));
        
        // Activate current button
        if (activeButton) {
            activeButton.classList.add('active');
        }
    }

    updateDiscordProgress() {
        const audioPlayer = document.getElementById('musicPlayer');
        const progressFill = document.getElementById('progressFill');
        const timeDisplay = document.getElementById('timeDisplay');
        
        if (!audioPlayer.duration) return;
        
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        if (progressFill) progressFill.style.width = `${progress}%`;
        
        if (timeDisplay) {
            const current = this.formatTime(audioPlayer.currentTime);
            const total = this.formatTime(audioPlayer.duration);
            timeDisplay.textContent = `${current} / ${total}`;
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    showDiscordError(message) {
        // Simple error display - could be enhanced with a toast notification
        console.error('Discord Music Player Error:', message);
    }

    // Mini-Game functionality
    initMiniGame() {
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            score: 0,
            lives: 3,
            playerY: 50,
            obstacles: [],
            gameSpeed: 2,
            gameLoop: null,
            autoPlay: true
        };

        // Setup game controls
        this.setupGameControls();
        
        // Setup keyboard controls
        this.setupKeyboardControls();
        
        // Start auto-play demo
        setTimeout(() => this.startAutoPlay(), 1000);
    }

    setupGameControls() {
        const playBtn = document.getElementById('gamePlayBtn');
        const pauseBtn = document.getElementById('gamePauseBtn');
        const resetBtn = document.getElementById('gameResetBtn');
        const closeBtn = document.getElementById('gameCloseBtn');

        if (playBtn) {
            playBtn.addEventListener('click', () => this.startGame());
        }
        
        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => this.pauseGame());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetGame());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeGame());
        }
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.gameState.isPlaying || this.gameState.isPaused) return;
            
            const player = document.getElementById('gamePlayer');
            if (!player) return;

            switch(e.key.toLowerCase()) {
                case 'arrowup':
                case 'w':
                    e.preventDefault();
                    this.jumpPlayer();
                    break;
                case 'arrowdown':
                case 's':
                    e.preventDefault();
                    this.movePlayer('down');
                    break;
                case 'arrowleft':
                case 'a':
                    e.preventDefault();
                    this.movePlayer('left');
                    break;
                case 'arrowright':
                case 'd':
                    e.preventDefault();
                    this.movePlayer('right');
                    break;
                case ' ':
                    e.preventDefault();
                    this.jumpPlayer();
                    break;
            }
        });
    }

    openMiniGame() {
        const panel = document.getElementById('miniGamePanel');
        if (panel) {
            panel.classList.add('active');
            this.initMiniGame();
        }
    }

    startAutoPlay() {
        if (!this.gameState.autoPlay) return;
        
        // Auto-play demo - show game running automatically
        this.startGame();
        
        // Simulate player movements
        this.autoPlayInterval = setInterval(() => {
            if (!this.gameState.isPlaying || this.gameState.isPaused) return;
            
            // Random movements
            const moves = ['jump', 'left', 'right'];
            const randomMove = moves[Math.floor(Math.random() * moves.length)];
            
            switch(randomMove) {
                case 'jump':
                    this.jumpPlayer();
                    break;
                case 'left':
                    this.movePlayer('left');
                    break;
                case 'right':
                    this.movePlayer('right');
                    break;
            }
        }, 2000);
    }

    startGame() {
        if (this.gameState.isPlaying) return;
        
        this.gameState.isPlaying = true;
        this.gameState.isPaused = false;
        this.gameState.autoPlay = false;
        
        // Clear auto-play if running
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.classList.add('playing');
            canvas.classList.remove('paused', 'game-over');
        }
        
        this.gameLoop = setInterval(() => this.updateGame(), 1000 / 60);
    }

    pauseGame() {
        this.gameState.isPaused = !this.gameState.isPaused;
        
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.classList.toggle('paused', this.gameState.isPaused);
        }
    }

    resetGame() {
        // Clear game loop
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        // Clear auto-play
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
        
        // Reset state
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            score: 0,
            lives: 3,
            playerY: 50,
            obstacles: [],
            gameSpeed: 2,
            gameLoop: null,
            autoPlay: true
        };
        
        // Reset UI
        this.updateGameUI();
        
        // Reset player position
        const player = document.getElementById('gamePlayer');
        if (player) {
            player.style.left = '50px';
            player.style.bottom = '50px';
        }
        
        // Reset obstacles
        const obstacles = document.querySelectorAll('.game-obstacle');
        obstacles.forEach((obstacle, index) => {
            obstacle.style.left = `${300 + (index * 200)}px`;
            obstacle.classList.remove('hit');
        });
        
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.classList.remove('playing', 'paused', 'game-over');
        }
        
        // Restart auto-play
        setTimeout(() => this.startAutoPlay(), 1000);
    }

    closeGame() {
        this.resetGame();
        
        const panel = document.getElementById('miniGamePanel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    jumpPlayer() {
        const player = document.getElementById('gamePlayer');
        if (!player || player.classList.contains('jumping')) return;
        
        player.classList.add('jumping');
        setTimeout(() => {
            player.classList.remove('jumping');
        }, 500);
    }

    movePlayer(direction) {
        const player = document.getElementById('gamePlayer');
        if (!player) return;
        
        const currentLeft = parseInt(player.style.left) || 50;
        const canvas = document.getElementById('gameCanvas');
        const canvasWidth = canvas ? canvas.offsetWidth : 800;
        
        let newLeft = currentLeft;
        
        switch(direction) {
            case 'left':
                newLeft = Math.max(20, currentLeft - 30);
                break;
            case 'right':
                newLeft = Math.min(canvasWidth - 80, currentLeft + 30);
                break;
        }
        
        player.style.left = `${newLeft}px`;
    }

    updateGame() {
        if (!this.gameState.isPlaying || this.gameState.isPaused) return;
        
        // Update obstacles
        const obstacles = document.querySelectorAll('.game-obstacle');
        obstacles.forEach(obstacle => {
            if (obstacle.classList.contains('hit')) return;
            
            let currentLeft = parseInt(obstacle.style.left) || 800;
            currentLeft -= this.gameState.gameSpeed;
            
            // Reset obstacle when it goes off screen
            if (currentLeft < -50) {
                currentLeft = 800 + Math.random() * 200;
                this.gameState.score += 10;
            }
            
            obstacle.style.left = `${currentLeft}px`;
            
            // Check collision
            this.checkCollision(obstacle);
        });
        
        // Increase difficulty
        if (this.gameState.score > 0 && this.gameState.score % 50 === 0) {
            this.gameState.gameSpeed = Math.min(8, this.gameState.speed * 1.001);
        }
        
        this.updateGameUI();
    }

    checkCollision(obstacle) {
        const player = document.getElementById('gamePlayer');
        if (!player || player.classList.contains('jumping')) return;
        
        const playerRect = player.getBoundingClientRect();
        const obstacleRect = obstacle.getBoundingClientRect();
        
        if (playerRect.left < obstacleRect.right &&
            playerRect.right > obstacleRect.left &&
            playerRect.top < obstacleRect.bottom &&
            playerRect.bottom > obstacleRect.top) {
            
            // Collision detected
            obstacle.classList.add('hit');
            this.gameState.lives--;
            
            setTimeout(() => {
                obstacle.classList.remove('hit');
                const newLeft = 800 + Math.random() * 200;
                obstacle.style.left = `${newLeft}px`;
            }, 300);
            
            if (this.gameState.lives <= 0) {
                this.gameOver();
            }
        }
    }

    gameOver() {
        this.gameState.isPlaying = false;
        
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
        
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.classList.add('game-over');
            canvas.classList.remove('playing');
        }
        
        // Show game over message
        setTimeout(() => {
            alert(`Game Over! Score: ${this.gameState.score}`);
            this.resetGame();
        }, 500);
    }

    updateGameUI() {
        const scoreElement = document.getElementById('gameScore');
        const livesElement = document.getElementById('gameLives');
        
        if (scoreElement) {
            scoreElement.textContent = this.gameState.score;
        }
        
        if (livesElement) {
            const hearts = 'â¤ï¸'.repeat(Math.max(0, this.gameState.lives));
            livesElement.textContent = hearts;
        }
    }

    // Global function for music selection (needed for onclick handlers)
    playDiscordTrack(trackFile, buttonElement) {
        if (window.cyberpunkPortfolio) {
            window.cyberpunkPortfolio.playDiscordTrack(trackFile, buttonElement);
        }
    }

    // Global function for mini-game (needed for onclick handlers)
    openMiniGame() {
        if (window.cyberpunkPortfolio) {
            window.cyberpunkPortfolio.openMiniGame();
        }
    }

    getContentForSection(section) {
        const content = {
            about: `
                <div class="layout-grid layout-grid--2">
                    <div class="panel panel--glass">
                        <div class="about-head">
                            <div class="avatar-ring" aria-hidden="true">
                                <img src="src/images/logo.png" alt="" class="avatar-img" decoding="async">
                            </div>
                            <div class="about-meta">
                                <h3 class="neo-title">BVH3 INDUSTRIES</h3>
                                <p class="neo-subtitle">Full-Stack • Automatización • UI/UX Futurista</p>
                                <div class="pill-row" aria-label="Especialidades">
                                    <span class="pill pill--cyan">JAVASCRIPT</span>
                                    <span class="pill pill--pink">FRONTEND</span>
                                    <span class="pill pill--green">BACKEND</span>
                                    <span class="pill pill--purple">CLOUD</span>
                                </div>
                            </div>
                        </div>

                        <p class="lead">
                            Construyo interfaces rápidas, visualmente potentes y sistemas listos para producción. Enfoque: performance,
                            seguridad, automatización y una estética cyberpunk limpia.
                        </p>

                        <div class="kpi-grid" aria-label="Indicadores">
                            <div class="kpi">
                                <span class="kpi-number">5+</span>
                                <span class="kpi-label">AÑOS</span>
                            </div>
                            <div class="kpi">
                                <span class="kpi-number">150+</span>
                                <span class="kpi-label">PROYECTOS</span>
                            </div>
                            <div class="kpi">
                                <span class="kpi-number">24/7</span>
                                <span class="kpi-label">SOPORTE</span>
                            </div>
                        </div>

                        <div class="cta-row">
                            <a class="cta-btn cta-btn--primary" href="#projects">VER PROYECTOS</a>
                            <a class="cta-btn cta-btn--ghost" href="#contact">CONTACTAR</a>
                        </div>
                    </div>

                    <div class="panel panel--scan">
                        <h4 class="panel-title">Líneas de trabajo</h4>
                        <ul class="scan-list">
                            <li><span class="scan-dot" aria-hidden="true"></span>Web Apps: SPA / dashboards / landing premium</li>
                            <li><span class="scan-dot" aria-hidden="true"></span>APIs: integración, auth, pagos, automatización</li>
                            <li><span class="scan-dot" aria-hidden="true"></span>Optimización: Core Web Vitals y UX</li>
                            <li><span class="scan-dot" aria-hidden="true"></span>Deploy: dominios, SSL, CI/CD</li>
                        </ul>

                        <div class="divider"></div>

                        <h4 class="panel-title">Objetivo</h4>
                        <p class="muted">Entregar productos con estética futurista, consistencia visual y código mantenible.</p>
                    </div>
                </div>
            `,

            projects: `
                <div class="card-grid">
                    <article class="card card--hover">
                        <div class="card-top">
                            <h3 class="card-title">HATSUNE MIKU BOT</h3>
                            <span class="badge badge--green">ACTIVO</span>
                        </div>
                        <p class="card-text">Bot con comandos, descargas y juegos para WhatsApp. Automatización y respuestas rápidas.</p>
                        <div class="tag-row" aria-label="Stack">
                            <span class="tag">Node.js</span>
                            <span class="tag">JavaScript</span>
                            <span class="tag">JSON</span>
                        </div>
                        <button
                            type="button"
                            class="card-action project-view-btn"
                            data-title="HATSUNE MIKU BOT"
                            data-description="Accesos rápidos al grupo, canal, creador y número del bot."
                            data-group-url="https://chat.whatsapp.com/FQ78boTUpJ7Ge3oEtn8pRE?mode=gi_t"
                            data-channel-url="https://www.whatsapp.com/channel/0029VajYamSIHphMAl3ABi1o"
                            data-creator-url="https://wa.me/51988514570"
                            data-bot-url="https://wa.me/51926017929"
                        >
                            VER
                        </button>
                        <div class="meter" aria-label="Progreso 95%"><span class="meter-fill" style="width:95%"></span></div>
                    </article>

                    <article class="card card--hover">
                        <div class="card-top">
                            <h3 class="card-title">SISTEMA DE ACTAS (GORE)</h3>
                            <span class="badge badge--cyan">COMPLETADO</span>
                        </div>
                        <p class="card-text">Gestión de actas con registros, importación y módulos administrativos.</p>
                        <div class="tag-row" aria-label="Stack">
                            <span class="tag">PHP</span>
                            <span class="tag">MySQL</span>
                            <span class="tag">JS</span>
                        </div>
                        <div class="meter" aria-label="Progreso 100%"><span class="meter-fill" style="width:100%"></span></div>
                    </article>

                    <article class="card card--hover">
                        <div class="card-top">
                            <h3 class="card-title">CYBERSECURITY DASHBOARD</h3>
                            <span class="badge badge--pink">EN DESARROLLO</span>
                        </div>
                        <p class="card-text">Panel de monitoreo en tiempo real para análisis de eventos y amenazas.</p>
                        <div class="tag-row" aria-label="Stack">
                            <span class="tag">Angular</span>
                            <span class="tag">D3</span>
                            <span class="tag">Elastic</span>
                        </div>
                        <div class="meter" aria-label="Progreso 67%"><span class="meter-fill" style="width:67%"></span></div>
                    </article>

                    <article class="card card--hover">
                        <div class="card-top">
                            <h3 class="card-title">QUANTUM SIMULATOR</h3>
                            <span class="badge badge--purple">PLANEANDO</span>
                        </div>
                        <p class="card-text">Exploración de algoritmos y simulación de escenarios para pruebas experimentales.</p>
                        <div class="tag-row" aria-label="Stack">
                            <span class="tag">Qiskit</span>
                            <span class="tag">C++</span>
                            <span class="tag">CUDA</span>
                        </div>
                        <div class="meter" aria-label="Progreso 15%"><span class="meter-fill" style="width:15%"></span></div>
                    </article>
                </div>
            `,

            'forbidden-zone': `
                <div class="forbidden-zone-grid">
                    <div class="zone-header">
                        <h2 class="zone-title">COLECCIÓN EXCLUSIVA</h2>
                        <p class="zone-subtitle">Juegos premium para usuarios verificados</p>
                    </div>
                    
                    <div class="h-games-container">
                        <article class="h-game-card" data-game-id="lonely-girl">
                            <div class="game-thumbnail">
                                <div class="game-image-wrapper">
                                    <img src="https://techylist.com/wp-content/uploads/2023/11/Lonely-Girl.jpeg" 
                                         alt="Lonely Girl" 
                                         class="game-image" 
                                         loading="lazy">
                                    <div class="game-overlay">
                                        <div class="game-info">
                                            <span class="game-rating">18+</span>
                                            <span class="game-type">SIMULACIÓN</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="game-badge">NEW</div>
                            </div>
                            <div class="game-content">
                                <h3 class="game-title">Lonely Girl</h3>
                                <p class="game-description">Experiencia inmersiva de simulación con múltiples finales y decisiones impactantes.</p>
                                <div class="game-meta">
                                    <span class="game-version">v1.0</span>
                                    <span class="game-size">125 MB</span>
                                    <span class="game-rating-stars">4.8</span>
                                </div>
                                <div class="game-actions">
                                    <button class="game-btn game-btn--primary" data-download="src/apps/nsfw/Lonely Girl.apk">
                                        <span class="btn-icon">DOWNLOAD</span>
                                        <span class="btn-text">DESCARGAR</span>
                                    </button>
                                </div>
                            </div>
                        </article>

                        <article class="h-game-card" data-game-id="fhb">
                            <div class="game-thumbnail">
                                <div class="game-image-wrapper">
                                    <img src="https://files.catbox.moe/h3j5j2.png" 
                                         alt="FHB" 
                                         class="game-image" 
                                         loading="lazy">
                                    <div class="game-overlay">
                                        <div class="game-info">
                                            <span class="game-rating">18+</span>
                                            <span class="game-type">AVENTURA</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="game-badge">HOT</div>
                            </div>
                            <div class="game-content">
                                <h3 class="game-title">FHB</h3>
                                <p class="game-description">Aventura emocionante con gráficos impresionantes y gameplay innovador.</p>
                                <div class="game-meta">
                                    <span class="game-version">v1.0</span>
                                    <span class="game-size">98 MB</span>
                                    <span class="game-rating-stars">4.6</span>
                                </div>
                                <div class="game-actions">
                                    <button class="game-btn game-btn--primary" data-download="src/apps/nsfw/FHBQuickieHalloween Mavis.apk">
                                        <span class="btn-icon">DOWNLOAD</span>
                                        <span class="btn-text">DESCARGAR</span>
                                    </button>
                                </div>
                            </div>
                        </article>

                        <article class="h-game-card" data-game-id="kaguya">
                            <div class="game-thumbnail">
                                <div class="game-image-wrapper">
                                    <img src="https://img.40407.com/upload/202411/18/18104137af89dQEw7eL6SgUwjvc.jpg" 
                                         alt="Kaguya Player" 
                                         class="game-image" 
                                         loading="lazy">
                                    <div class="game-overlay">
                                        <div class="game-info">
                                            <span class="game-rating">18+</span>
                                            <span class="game-type">ESTRATEGIA</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="game-badge">UPDATE</div>
                            </div>
                            <div class="game-content">
                                <h3 class="game-title">Kaguya Player</h3>
                                <p class="game-description">Juego de estrategia profundo con personajes memorables y decisiones cruciales.</p>
                                <div class="game-meta">
                                    <span class="game-version">v2.0</span>
                                    <span class="game-size">156 MB</span>
                                    <span class="game-rating-stars">4.9</span>
                                </div>
                                <div class="game-actions">
                                    <button class="game-btn game-btn--primary" data-download="src/apps/nsfw/KAGUYA_PLAYER.apk">
                                        <span class="btn-icon">DOWNLOAD</span>
                                        <span class="btn-text">DESCARGAR</span>
                                    </button>
                                </div>
                            </div>
                        </article>

                        <article class="h-game-card" data-game-id="coconut">
                            <div class="game-thumbnail">
                                <div class="game-image-wrapper">
                                    <img src="https://img.itch.zone/aW1nLzM3MjgzMzkucG5n/315x250%23c/NjGtao.png" 
                                         alt="Coco-nut Shake" 
                                         class="game-image" 
                                         loading="lazy">
                                    <div class="game-overlay">
                                        <div class="game-info">
                                            <span class="game-rating">18+</span>
                                            <span class="game-type">RITMO</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="game-content">
                                <h3 class="game-title">Coco-nut Shake</h3>
                                <p class="game-description">Juego de ritmo adictivo con banda sonora increíble y visuales vibrantes.</p>
                                <div class="game-meta">
                                    <span class="game-version">v1.5</span>
                                    <span class="game-size">87 MB</span>
                                    <span class="game-rating-stars">4.7</span>
                                </div>
                                <div class="game-actions">
                                    <button class="game-btn game-btn--primary" data-download="src/apps/nsfw/Coco-nut_shake.apk">
                                        <span class="btn-icon">DOWNLOAD</span>
                                        <span class="btn-text">DESCARGAR</span>
                                    </button>
                                </div>
                            </div>
                        </article>

                        <article class="h-game-card" data-game-id="tatsumaki">
                            <div class="game-thumbnail">
                                <div class="game-image-wrapper">
                                    <img src="https://i.ytimg.com/vi/iyyotHXIkBs/maxresdefault.jpg" 
                                         alt="Tatsumaki-TH" 
                                         class="game-image" 
                                         loading="lazy">
                                    <div class="game-overlay">
                                        <div class="game-info">
                                            <span class="game-rating">18+</span>
                                            <span class="game-type">AVENTURA</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="game-content">
                                <h3 class="game-title">Tatsumaki-TH</h3>
                                <p class="game-description">Aventura épica con combate fluido y historia envolvente.</p>
                                <div class="game-meta">
                                    <span class="game-version">v1.0</span>
                                    <span class="game-size">134 MB</span>
                                    <span class="game-rating-stars">4.5</span>
                                </div>
                                <div class="game-actions">
                                    <button class="game-btn game-btn--primary" data-download="src/apps/nsfw/Tatsumaki-TH.apk">
                                        <span class="btn-icon">DOWNLOAD</span>
                                        <span class="btn-text">DESCARGAR</span>
                                    </button>
                                </div>
                            </div>
                        </article>

                        <article class="h-game-card" data-game-id="nicole">
                            <div class="game-thumbnail">
                                <div class="game-image-wrapper">
                                    <img src="https://files.catbox.moe/nxcu8y.jfif" 
                                         alt="Nicole v1" 
                                         class="game-image" 
                                         loading="lazy">
                                    <div class="game-overlay">
                                        <div class="game-info">
                                            <span class="game-rating">18+</span>
                                            <span class="game-type">SIMULACIÓN</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="game-badge">POPULAR</div>
                            </div>
                            <div class="game-content">
                                <h3 class="game-title">Nicole v1</h3>
                                <p class="game-description">Simulación realista con personajes complejos y decisiones morales.</p>
                                <div class="game-meta">
                                    <span class="game-version">v1.17</span>
                                    <span class="game-size">112 MB</span>
                                    <span class="game-rating-stars">4.8</span>
                                </div>
                                <div class="game-actions">
                                    <button class="game-btn game-btn--primary" data-download="src/apps/nsfw/Nicole v1.17.apk">
                                        <span class="btn-icon">DOWNLOAD</span>
                                        <span class="btn-text">DESCARGAR</span>
                                    </button>
                                </div>
                            </div>
                        </article>

                        <article class="h-game-card" data-game-id="fapwall">
                            <div class="game-thumbnail">
                                <div class="game-image-wrapper">
                                    <img src="https://uploads.ungrounded.net/tmp/img/736000/iu_736248_3166037.webp" 
                                         alt="Fapwall" 
                                         class="game-image" 
                                         loading="lazy">
                                    <div class="game-overlay">
                                        <div class="game-info">
                                            <span class="game-rating">18+</span>
                                            <span class="game-type">PUZZLE</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="game-content">
                                <h3 class="game-title">Fapwall</h3>
                                <p class="game-description">Puzzle único con mecánicas innovadoras y arte excepcional.</p>
                                <div class="game-meta">
                                    <span class="game-version">v1.0</span>
                                    <span class="game-size">76 MB</span>
                                    <span class="game-rating-stars">4.4</span>
                                </div>
                                <div class="game-actions">
                                    <button class="game-btn game-btn--primary" data-download="src/apps/nsfw/Fapwall.apk">
                                        <span class="btn-icon">DOWNLOAD</span>
                                        <span class="btn-text">DESCARGAR</span>
                                    </button>
                                </div>
                            </div>
                        </article>

                        <article class="h-game-card" data-game-id="fuckerwatch">
                            <div class="game-thumbnail">
                                <div class="game-image-wrapper">
                                    <img src="https://www.yunnx.com/upload/20250417/9c4fc637906a66.png" 
                                         alt="Fuckerwatch" 
                                         class="game-image" 
                                         loading="lazy">
                                    <div class="game-overlay">
                                        <div class="game-info">
                                            <span class="game-rating">18+</span>
                                            <span class="game-type">ACCIÓN</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="game-badge">EXCLUSIVE</div>
                            </div>
                            <div class="game-content">
                                <h3 class="game-title">Fuckerwatch</h3>
                                <p class="game-description">Acción intensa con gráficos next-gen y gameplay revolucionario.</p>
                                <div class="game-meta">
                                    <span class="game-version">v1.0</span>
                                    <span class="game-size">189 MB</span>
                                    <span class="game-rating-stars">4.9</span>
                                </div>
                                <div class="game-actions">
                                    <button class="game-btn game-btn--primary" data-download="src/apps/nsfw/FUCKERWATCH.apk">
                                        <span class="btn-icon">DOWNLOAD</span>
                                        <span class="btn-text">DESCARGAR</span>
                                    </button>
                                </div>
                            </div>
                        </article>
                    </div>
                </div>
            `,

            'memories': `
                <div class="card-grid">
                    <article class="card card--hover memory-card" data-type="image" data-src="https://via.placeholder.com/1280x720.png/00e5ff/000000?text=Cyberpunk+City">
                        <div class="card-top">
                            <h3 class="card-title">CIUDAD NEON</h3>
                            <span class="badge badge--cyan">IMAGEN</span>
                        </div>
                        <img src="https://via.placeholder.com/400x225.png/00e5ff/000000?text=Cyberpunk+City" alt="Ciudad Cyberpunk" class="memory-thumbnail">
                        <p class="card-text">Vistas nocturnas de una metrópolis futurista.</p>
                    </article>

                    <article class="card card--hover memory-card" data-type="image" data-src="https://via.placeholder.com/1280x720.png/ff2bd6/000000?text=Hacker+Lair">
                        <div class="card-top">
                            <h3 class="card-title">GUARIDA DEL HACKER</h3>
                            <span class="badge badge--cyan">IMAGEN</span>
                        </div>
                        <img src="https://via.placeholder.com/400x225.png/ff2bd6/000000?text=Hacker+Lair" alt="Guarida del Hacker" class="memory-thumbnail">
                        <p class="card-text">El lugar de nacimiento de la rebelión digital.</p>
                    </article>

                    <article class="card card--hover memory-card" data-type="video" data-src="https://www.w3schools.com/html/mov_bbb.mp4">
                        <div class="card-top">
                            <h3 class="card-title">TRANSMISIÓN PIRATA</h3>
                            <span class="badge badge--pink">VIDEO</span>
                        </div>
                        <div class="memory-thumbnail">
                            <video src="https://www.w3schools.com/html/mov_bbb.mp4#t=0.5" preload="metadata"></video>
                            <div class="play-icon">▶</div>
                        </div>
                        <p class="card-text">Un mensaje codificado para los despiertos.</p>
                    </article>

                    <article class="card card--hover memory-card" data-type="video" data-src="https://files.catbox.moe/utqyjf.mp4">
                        <div class="card-top">
                            <h3 class="card-title">ARTE NO COMPRENDIDO</h3>
                            <span class="badge badge--pink">VIDEO</span>
                        </div>
                        <div class="memory-thumbnail">
                            <video src="https://files.catbox.moe/utqyjf.mp4#t=0.5" preload="metadata"></video>
                            <div class="play-icon">▶</div>
                        </div>
                        <p class="card-text">Una pieza de arte digital.</p>
                    </article>
                    
                    <article class="card card--hover memory-card" data-type="image" data-src="https://via.placeholder.com/1280x720.png/8b5cf6/000000?text=Android+Dream">
                        <div class="card-top">
                            <h3 class="card-title">SUEÑO DE ANDROIDE</h3>
                            <span class="badge badge--cyan">IMAGEN</span>
                        </div>
                        <img src="https://via.placeholder.com/400x225.png/8b5cf6/000000?text=Android+Dream" alt="Sueño de Androide" class="memory-thumbnail">
                        <p class="card-text">Reflexiones sobre la conciencia artificial.</p>
                    </article>
                </div>
            `,

            apps: `
                <div class="card-grid card-grid--apps">
                    <article class="card card--hover card--rgb app-tile">
                        <div class="card-top">
                            <div class="app-tile-head">
                                <span class="app-tile-icon" aria-hidden="true">
                                    <img src="src/images/logo.png" alt="" decoding="async">
                                </span>
                                <div>
                                    <h3 class="card-title">BVH3 WALLPAPER</h3>
                                    <p class="app-tile-sub">Android • APK</p>
                                </div>
                            </div>
                            <span class="badge badge--pink">APK</span>
                        </div>

                        <p class="card-text">Wallpapers cyberpunk para Android.</p>

                        <div class="tag-row" aria-label="Etiquetas">
                            <span class="tag">ANDROID</span>
                            <span class="tag">CYBERPUNK</span>
                        </div>

                        <div class="app-tile-footer">
                            <a class="app-download-btn app-download-btn--sm" href="src/apps/BVH3_WALLPAPER.apk" download>DESCARGAR</a>
                            <span class="app-note-inline">Si Android bloquea: Seguridad → Apps desconocidas</span>
                        </div>
                    </article>
                </div>
            `,

            skills: `
                <div class="layout-grid layout-grid--3">
                    <div class="panel panel--glass">
                        <h3 class="panel-title">Frontend</h3>
                        <div class="skill">
                            <div class="skill-top"><span>HTML/CSS</span><span class="skill-pct">98%</span></div>
                            <div class="meter"><span class="meter-fill" style="width:98%"></span></div>
                        </div>
                        <div class="skill">
                            <div class="skill-top"><span>JavaScript</span><span class="skill-pct">95%</span></div>
                            <div class="meter"><span class="meter-fill" style="width:95%"></span></div>
                        </div>
                        <div class="skill">
                            <div class="skill-top"><span>React</span><span class="skill-pct">92%</span></div>
                            <div class="meter"><span class="meter-fill" style="width:92%"></span></div>
                        </div>
                    </div>

                    <div class="panel panel--glass">
                        <h3 class="panel-title">Backend</h3>
                        <div class="skill">
                            <div class="skill-top"><span>Node/Express</span><span class="skill-pct">94%</span></div>
                            <div class="meter"><span class="meter-fill" style="width:94%"></span></div>
                        </div>
                        <div class="skill">
                            <div class="skill-top"><span>PHP/Laravel</span><span class="skill-pct">90%</span></div>
                            <div class="meter"><span class="meter-fill" style="width:90%"></span></div>
                        </div>
                        <div class="skill">
                            <div class="skill-top"><span>Python</span><span class="skill-pct">88%</span></div>
                            <div class="meter"><span class="meter-fill" style="width:88%"></span></div>
                        </div>
                    </div>

                    <div class="panel panel--glass">
                        <h3 class="panel-title">Cloud / DevOps</h3>
                        <div class="skill">
                            <div class="skill-top"><span>Linux</span><span class="skill-pct">90%</span></div>
                            <div class="meter"><span class="meter-fill" style="width:90%"></span></div>
                        </div>
                        <div class="skill">
                            <div class="skill-top"><span>Docker</span><span class="skill-pct">85%</span></div>
                            <div class="meter"><span class="meter-fill" style="width:85%"></span></div>
                        </div>
                        <div class="skill">
                            <div class="skill-top"><span>CI/CD</span><span class="skill-pct">78%</span></div>
                            <div class="meter"><span class="meter-fill" style="width:78%"></span></div>
                        </div>
                    </div>
                </div>
            `,

            depool: `
                <div class="depool-interface">
                    <div class="android-bay">
                        <div class="android-stage" id="androidStage">
                            <div class="android-status-strip" aria-label="Estado del androide">
                                <span class="android-state-chip android-state-chip--live">SYNC ONLINE</span>
                                <span class="android-state-chip">FRAME v3.7</span>
                                <span class="android-state-chip">TACTICAL BODY</span>
                            </div>

                            <div class="android-shell" id="androidShell">
                                <div class="android-glow android-glow--cyan"></div>
                                <div class="android-glow android-glow--pink"></div>
                                <div class="android-shadow"></div>
                                <div class="android-backpack"></div>
                                <div class="android-antenna android-antenna--left"></div>
                                <div class="android-antenna android-antenna--right"></div>

                                <div class="android-head">
                                    <div class="android-face-plate"></div>
                                    <div class="android-brow android-brow--left"></div>
                                    <div class="android-brow android-brow--right"></div>
                                    <div class="android-visor"></div>
                                    <div class="android-ear android-ear--left"></div>
                                    <div class="android-ear android-ear--right"></div>
                                    <div class="android-mouth"></div>
                                </div>

                                <div class="android-neck"></div>

                                <div class="android-shoulder android-shoulder--left"></div>
                                <div class="android-shoulder android-shoulder--right"></div>
                                <div class="android-arm android-arm--left"></div>
                                <div class="android-arm android-arm--right"></div>

                                <div class="android-torso">
                                    <div class="android-collar"></div>
                                    <div class="android-chest-plate">
                                        <div class="android-chest-line"></div>
                                        <div class="android-chest-line"></div>
                                        <div class="android-chest-line"></div>
                                    </div>
                                    <div class="android-reactor">
                                        <div class="android-reactor-ring"></div>
                                        <div class="android-reactor-core"></div>
                                    </div>
                                    <div class="android-ab-panel">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>

                                <div class="android-cable android-cable--left"></div>
                                <div class="android-cable android-cable--right"></div>
                                <div class="android-hip"></div>
                                <div class="android-leg android-leg--left"></div>
                                <div class="android-leg android-leg--right"></div>
                                <div class="android-shin android-shin--left"></div>
                                <div class="android-shin android-shin--right"></div>
                                <div class="android-foot android-foot--left"></div>
                                <div class="android-foot android-foot--right"></div>

                                <button type="button" class="android-hotspot is-active" data-title="REACTOR CENTRAL" data-detail="Núcleo energético estabilizado. Regula potencia, movilidad y pulsos visuales del chasis DEPOOL." data-status="ENERGIA 98%" style="--x: 50%; --y: 58%;">
                                    <span></span>
                                </button>
                                <button type="button" class="android-hotspot" data-title="VISOR TÁCTICO" data-detail="Óptica frontal con barrido de amenazas y lectura del entorno. Sigue movimiento y refuerza la presencia del avatar." data-status="TRACKING ON" style="--x: 50%; --y: 17%;">
                                    <span></span>
                                </button>
                                <button type="button" class="android-hotspot" data-title="SERVOS DE HOMBRO" data-detail="Módulos laterales para estabilidad de brazos y microajustes. Añaden volumen mecánico y sensación de potencia." data-status="SERVO READY" style="--x: 21%; --y: 42%;">
                                    <span></span>
                                </button>
                                <button type="button" class="android-hotspot" data-title="BLINDAJE TORÁCICO" data-detail="Placas frontales con capas compuestas y líneas lumínicas activas para un look más premium y agresivo." data-status="ARMOR LOCK" style="--x: 79%; --y: 42%;">
                                    <span></span>
                                </button>
                            </div>

                            <div class="android-readout panel panel--glass">
                                <div class="android-readout-top">
                                    <span class="android-readout-kicker">CHASSIS ANALYSIS</span>
                                    <span class="android-readout-status" id="androidReadoutStatus">ENERGIA 98%</span>
                                </div>
                                <h3 class="android-readout-title" id="androidReadoutTitle">REACTOR CENTRAL</h3>
                                <p class="android-readout-copy" id="androidReadoutCopy">Núcleo energético estabilizado. Regula potencia, movilidad y pulsos visuales del chasis DEPOOL.</p>
                                <div class="android-readout-metrics">
                                    <div class="android-metric">
                                        <span class="android-metric-label">ESTADO</span>
                                        <strong>OPERATIVO</strong>
                                    </div>
                                    <div class="android-metric">
                                        <span class="android-metric-label">RESPUESTA</span>
                                        <strong>6 MS</strong>
                                    </div>
                                    <div class="android-metric">
                                        <span class="android-metric-label">MODO</span>
                                        <strong>INTERACTIVO</strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Content Display -->
                    <div class="content-display">
                        <!-- Music Section -->
                        <div class="section-display music-display">
                            <div class="section-header">
                                <h3 class="section-title">MUSICA</h3>
                                <div class="section-status">ACTIVE</div>
                                <div class="section-controls">
                                    <button class="control-btn play-btn" id="globalPlayBtn">▶</button>
                                    <button class="control-btn pause-btn" id="globalPauseBtn">⏸</button>
                                    <button class="control-btn next-btn" id="globalNextBtn">⏭</button>
                                </div>
                            </div>
                            <div class="section-content">
                                <audio id="musicPlayer" preload="auto"></audio>
                                <div class="audio-visualizer">
                                    <div class="wave-bar"></div>
                                    <div class="wave-bar"></div>
                                    <div class="wave-bar"></div>
                                </div>
                                <div class="track-info">
                                    <p class="track-name" id="currentTrackName">Cyberpunk: Edgerunners</p>
                                    <p class="artist-name" id="currentArtistName">This Fire by Franz Ferdinand</p>
                                    <div class="track-progress">
                                        <div class="progress-bar">
                                            <div class="progress-fill" id="progressFill"></div>
                                        </div>
                                        <span class="time-display" id="timeDisplay">0:00 / 0:00</span>
                                    </div>
                                </div>
                                <div class="discord-playlist" id="musicPlaylist">
                                    <div class="discord-track active" data-track="cyberpunk.mp3">
                                        <div class="discord-avatar">
                                            <div class="avatar-circle">
                                                <div class="avatar-image" style="background: linear-gradient(135deg, #ff2bd6, #8b5cf6);"></div>
                                                <div class="avatar-status playing"></div>
                                            </div>
                                        </div>
                                        <div class="discord-info">
                                            <div class="discord-title">Cyberpunk: Edgerunners</div>
                                            <div class="discord-artist">This Fire by Franz Ferdinand</div>
                                            <div class="discord-meta">
                                                <span class="discord-duration">3:45</span>
                                                <span class="discord-status">PLAYING</span>
                                            </div>
                                        </div>
                                        <button class="discord-play-btn active" onclick="playDiscordTrack('cyberpunk.mp3', this)">
                                            <span class="play-icon">▶</span>
                                            <span class="pause-icon">⏸</span>
                                        </button>
                                    </div>
                                    <div class="discord-track" data-track="Let it happen.mp3">
                                        <div class="discord-avatar">
                                            <div class="avatar-circle">
                                                <div class="avatar-image" style="background: linear-gradient(135deg, #00e5ff, #00ff7a);"></div>
                                                <div class="avatar-status"></div>
                                            </div>
                                        </div>
                                        <div class="discord-info">
                                            <div class="discord-title">Let It Happen</div>
                                            <div class="discord-artist">Tame Impala</div>
                                            <div class="discord-meta">
                                                <span class="discord-duration">7:47</span>
                                                <span class="discord-status">READY</span>
                                            </div>
                                        </div>
                                        <button class="discord-play-btn" onclick="playDiscordTrack('Let it happen.mp3', this)">
                                            <span class="play-icon">▶</span>
                                            <span class="pause-icon">⏸</span>
                                        </button>
                                    </div>
                                    <div class="discord-track" data-track="DARE.mp3">
                                        <div class="discord-avatar">
                                            <div class="avatar-circle">
                                                <div class="avatar-image" style="background: linear-gradient(135deg, #ff6b6b, #ffd93d);"></div>
                                                <div class="avatar-status"></div>
                                            </div>
                                        </div>
                                        <div class="discord-info">
                                            <div class="discord-title">Dare</div>
                                            <div class="discord-artist">Sayfalse, TRXVELER & DJ ALIM</div>
                                            <div class="discord-meta">
                                                <span class="discord-duration">4:23</span>
                                                <span class="discord-status">READY</span>
                                            </div>
                                        </div>
                                        <button class="discord-play-btn" onclick="playDiscordTrack('DARE.mp3', this)">
                                            <span class="play-icon">▶</span>
                                            <span class="pause-icon">⏸</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Games Section -->
                        <div class="section-display games-display">
                            <div class="section-header">
                                <h3 class="section-title">JUEGOS</h3>
                                <div class="section-status">ACTIVE</div>
                                <div class="section-stats">
                                    <span class="stat-item">12 GAMES</span>
                                    <span class="stat-item">85% COMPLETE</span>
                                </div>
                            </div>
                            <div class="section-content">
                                <div class="games-showcase">
                                    <div class="featured-game">
                                        <div class="game-preview">
                                            <div class="game-thumbnail">🎮</div>
                                            <div class="game-overlay">
                                                <div class="game-title-large">CYBER RUN</div>
                                                <div class="game-description">Corre por la ciudad cyberpunk evitando drones de seguridad</div>
                                                <button class="game-launch-btn" onclick="openMiniGame()">LAUNCH</button>
                                            </div>
                                        </div>
                                        <div class="game-stats">
                                            <div class="game-stat">
                                                <span class="stat-label">LEVEL</span>
                                                <span class="stat-value">12</span>
                                            </div>
                                            <div class="game-stat">
                                                <span class="stat-label">SCORE</span>
                                                <span class="stat-value">8,450</span>
                                            </div>
                                            <div class="game-stat">
                                                <span class="stat-label">TIME</span>
                                                <span class="stat-value">2:34</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="games-grid">
                                        <div class="game-item">
                                            <div class="game-icon">🎯</div>
                                            <div class="game-title">NEURAL ARENA</div>
                                            <div class="game-genre">FPS</div>
                                            <div class="game-rating">★★★★★</div>
                                        </div>
                                        <div class="game-item">
                                            <div class="game-icon">⚔</div>
                                            <div class="game-title">MATRIX QUEST</div>
                                            <div class="game-genre">RPG</div>
                                            <div class="game-rating">★★★★</div>
                                        </div>
                                        <div class="game-item">
                                            <div class="game-icon">🏎</div>
                                            <div class="game-title">QUANTUM RUSH</div>
                                            <div class="game-genre">RACING</div>
                                            <div class="game-rating">★★★★★</div>
                                        </div>
                                        <div class="game-item">
                                            <div class="game-icon">⚡</div>
                                            <div class="game-title">CYBER NINJA</div>
                                            <div class="game-genre">ACTION</div>
                                            <div class="game-rating">★★★★</div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Mini-Game Panel -->
                                <div class="mini-game-panel" id="miniGamePanel">
                                    <div class="mini-game-header">
                                        <h3 class="mini-game-title">CYBER RUN - DEMO</h3>
                                        <div class="mini-game-controls">
                                            <button class="mini-btn mini-btn--play" id="gamePlayBtn">PLAY</button>
                                            <button class="mini-btn mini-btn--pause" id="gamePauseBtn">PAUSE</button>
                                            <button class="mini-btn mini-btn--reset" id="gameResetBtn">RESET</button>
                                            <button class="mini-btn mini-btn--close" id="gameCloseBtn">CLOSE</button>
                                        </div>
                                    </div>
                                    <div class="mini-game-content">
                                        <div class="game-canvas" id="gameCanvas">
                                            <div class="game-player" id="gamePlayer">🏃‍♂️</div>
                                            <div class="game-obstacle" style="left: 300px;">🚁</div>
                                            <div class="game-obstacle" style="left: 500px;">🚁</div>
                                            <div class="game-obstacle" style="left: 700px;">🚁</div>
                                            <div class="game-score">
                                                <span class="score-label">SCORE:</span>
                                                <span class="score-value" id="gameScore">0</span>
                                            </div>
                                            <div class="game-lives">
                                                <span class="lives-label">LIVES:</span>
                                                <span class="lives-value" id="gameLives">❤️❤️❤️</span>
                                            </div>
                                        </div>
                                        <div class="game-instructions">
                                            <p>⌨️ Use Arrow Keys or WASD to move</p>
                                            <p>🚫 Avoid the drones and survive as long as possible</p>
                                            <p>⬆️ Press SPACE to jump over obstacles</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Tastes Section -->
                        <div class="section-display tastes-display">
                            <div class="section-header">
                                <h3 class="section-title">GUSTOS</h3>
                                <div class="section-status">ACTIVE</div>
                                <div class="section-filter">
                                    <button class="filter-btn active">ALL</button>
                                    <button class="filter-btn">TECH</button>
                                    <button class="filter-btn">ART</button>
                                </div>
                            </div>
                            <div class="section-content">
                                <div class="tastes-showcase">
                                    <div class="taste-category">
                                        <h4 class="category-title">TECNOLOGÍA</h4>
                                        <div class="taste-items">
                                            <div class="taste-item featured">
                                                <div class="taste-icon">🎨</div>
                                                <div class="taste-info">
                                                    <div class="taste-name">DISEÑO CYBERPUNK</div>
                                                    <div class="taste-description">Estética futurista con neón y tecnología avanzada</div>
                                                    <div class="taste-tags">
                                                        <span class="tag">UI/UX</span>
                                                        <span class="tag">FUTURISTA</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="taste-item">
                                                <div class="taste-icon">⚛</div>
                                                <div class="taste-info">
                                                    <div class="taste-name">TECNOLOGIA CUANTICA</div>
                                                    <div class="taste-description">Computación cuántica y procesamiento paralelo</div>
                                                    <div class="taste-tags">
                                                        <span class="tag">QUANTUM</span>
                                                        <span class="tag">INNOVACION</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="taste-category">
                                        <h4 class="category-title">CREATIVIDAD</h4>
                                        <div class="taste-items">
                                            <div class="taste-item featured">
                                                <div class="taste-icon">🥽</div>
                                                <div class="taste-info">
                                                    <div class="taste-name">REALIDAD VIRTUAL</div>
                                                    <div class="taste-description">Inmersión total en mundos digitales</div>
                                                    <div class="taste-tags">
                                                        <span class="tag">VR</span>
                                                        <span class="tag">IMMERSIVE</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="taste-item">
                                                <div class="taste-icon">✎</div>
                                                <div class="taste-info">
                                                    <div class="taste-name">ARTE DIGITAL</div>
                                                    <div class="taste-description">Creación de arte con herramientas digitales</div>
                                                    <div class="taste-tags">
                                                        <span class="tag">DIGITAL</span>
                                                        <span class="tag">CREATIVE</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Neural Activity -->
                    <div class="neural-activity">
                        <div class="activity-pulse pulse-1"></div>
                        <div class="activity-pulse pulse-2"></div>
                        <div class="activity-pulse pulse-3"></div>
                        <div class="activity-pulse pulse-4"></div>
                        <div class="activity-pulse pulse-5"></div>
                        <div class="activity-pulse pulse-6"></div>
                        <div class="activity-pulse pulse-7"></div>
                        <div class="activity-pulse pulse-8"></div>
                    </div>
                    
                    <!-- Background Effects -->
                    <div class="brain-background">
                        <div class="circuit-lines"></div>
                        <div class="data-particles"></div>
                        <div class="glitch-effect"></div>
                    </div>
                </div>
            `,

            contact: `
                <div class="layout-grid layout-grid--2">
                    <div class="panel panel--scan">
                        <h3 class="panel-title">Canales</h3>
                        <p class="muted">Elige un canal. Respuesta rápida por WhatsApp.</p>

                        <div class="contact-cards">
                            <a class="contact-card" href="mailto:velasquezhuillcab@gmail.com">
                                <span class="contact-icon" aria-hidden="true">✉</span>
                                <span class="contact-main">
                                    <span class="contact-label">Email</span>
                                    <span class="contact-value">velasquezhuillcab@gmail.com</span>
                                </span>
                            </a>
                            <a class="contact-card" href="https://wa.me/51988514570" target="_blank" rel="noopener">
                                <span class="contact-icon" aria-hidden="true">☎</span>
                                <span class="contact-main">
                                    <span class="contact-label">WhatsApp</span>
                                    <span class="contact-value">+51 988 514 570</span>
                                </span>
                            </a>
                            <a class="contact-card" href="https://github.com/Brauliovh3" target="_blank" rel="noopener">
                                <span class="contact-icon" aria-hidden="true">⌂</span>
                                <span class="contact-main">
                                    <span class="contact-label">GitHub</span>
                                    <span class="contact-value">github.com/Brauliovh3</span>
                                </span>
                            </a>
                        </div>

                        <div class="availability">
                            <span class="status-indicator" aria-hidden="true"></span>
                            <span>DISPONIBLE PARA NUEVOS PROYECTOS</span>
                        </div>
                    </div>

                    <div class="panel panel--glass">
                        <h3 class="panel-title">Enviar mensaje</h3>
                        <form class="contact-form" id="contactForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="name">NOMBRE</label>
                                    <input id="name" type="text" name="name" autocomplete="name" required>
                                </div>
                                <div class="form-group">
                                    <label for="email">EMAIL</label>
                                    <input id="email" type="email" name="email" autocomplete="email" required>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="subject">TIPO DE PROYECTO</label>
                                <select id="subject" name="subject" required>
                                    <option value="" selected>Seleccionar…</option>
                                    <option value="Desarrollo Web">Desarrollo Web</option>
                                    <option value="App Móvil">App Móvil</option>
                                    <option value="Automatización">Automatización</option>
                                    <option value="Consultoría">Consultoría</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="message">MENSAJE</label>
                                <textarea id="message" name="message" rows="5" required placeholder="Cuéntame qué necesitas…"></textarea>
                            </div>

                            <button type="submit" class="submit-btn">
                                <span>ENVIAR A WHATSAPP</span>
                                <div class="btn-glitch"></div>
                            </button>
                        </form>
                    </div>
                </div>
            `
        };

        return content[section] || '<p>Contenido no disponible</p>';
    }
    startParticles() {
        if (this.prefersReducedMotion) return;
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const particleCount = Math.max(40, Math.min(90, Math.floor((window.innerWidth * window.innerHeight) / 20000)));

        // Create particles
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            this.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${particle.opacity})`;
                ctx.fill();
            });
            
            // Draw connections
            this.particles.forEach((particle1, i) => {
                this.particles.slice(i + 1).forEach(particle2 => {
                    const dx = particle1.x - particle2.x;
                    const dy = particle1.y - particle2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle1.x, particle1.y);
                        ctx.lineTo(particle2.x, particle2.y);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * (1 - distance / 100)})`;
                        ctx.stroke();
                    }
                });
            });
            
            requestAnimationFrame(animateParticles);
        };
        
        animateParticles();
    }

    startTerminal() {
        const terminal = document.querySelector('.terminal-body');
        const addTerminalLine = () => {
            if (this.currentTerminalLine < this.terminalLines.length) {
                const line = document.createElement('div');
                line.className = 'terminal-line';
                line.innerHTML = `<span class="prompt">root@bvh3:~$</span> ${this.terminalLines[this.currentTerminalLine]}`;
                terminal.appendChild(line);
                this.currentTerminalLine++;
                
                setTimeout(addTerminalLine, 2000);
            }
        };
        
        setTimeout(addTerminalLine, 3000);
    }

    toggleTerminal() {
        const terminal = document.getElementById('terminal');
        const terminalBody = terminal.querySelector('.terminal-body');
        
        if (terminalBody.style.display === 'none') {
            terminalBody.style.display = 'block';
            terminal.querySelector('.terminal-toggle').textContent = '_';
        } else {
            terminalBody.style.display = 'none';
            terminal.querySelector('.terminal-toggle').textContent = '□';
        }
    }

    toggleMobileMenu(navMenu, navToggle) {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        
        // Prevent body scroll when menu is open on mobile
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMobileMenu(navMenu, navToggle) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    handleResize() {
        // Handle responsive behavior
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.getElementById('navToggle');
        
        if (window.innerWidth > 768) {
            this.closeMobileMenu(navMenu, navToggle);
        }
    }

    loadContent() {
        console.log('BVH3 INDUSTRIES - Cyberpunk Portfolio Loaded');
        this.showSection(this.activeSection);
    }

    handleFormSubmission(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        
        const whatsappMessage = `
🚀 *NUEVO CONTACTO - BVH3 INDUSTRIES*

👤 *Nombre:* ${data.name}
📧 *Email:* ${data.email}
📋 *Tipo de Proyecto:* ${data.subject}

💬 *Mensaje:*
${data.message}

---
_Enviado desde el portafolio BVH3 Industries_
        `.trim();
        
        
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/51988514570?text=${encodedMessage}`;
        
       
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>CONECTANDO...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<span>REDIRIGIENDO A WHATSAPP...</span>';
            setTimeout(() => {
               
                window.open(whatsappURL, '_blank');
                
                
                submitBtn.innerHTML = '<span>✅ ENVIADO A WHATSAPP</span>';
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    e.target.reset();
                }, 2000);
            }, 1000);
        }, 1500);
        
        console.log('Form data prepared for WhatsApp:', data);
    }
}

// Initialize the portfolio when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.cyberpunkPortfolio = new CyberpunkPortfolio();
});

// Add some global effects
const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
const hasFinePointer = window.matchMedia?.('(pointer: fine)')?.matches ?? true;

if (!prefersReducedMotion && hasFinePointer) {
    document.addEventListener('mousemove', (e) => {
        const cursor = document.querySelector('.cursor-effect');
        if (!cursor) {
            const cursorEffect = document.createElement('div');
            cursorEffect.className = 'cursor-effect';
            document.body.appendChild(cursorEffect);
        }

        const cursorEffect = document.querySelector('.cursor-effect');
        cursorEffect.style.left = e.clientX - 10 + 'px';
        cursorEffect.style.top = e.clientY - 10 + 'px';
    });
}

// Add glitch effect to random elements
if (!prefersReducedMotion) {
    setInterval(() => {
        const elements = document.querySelectorAll('h1, h2, h3');
        const randomElement = elements[Math.floor(Math.random() * elements.length)];
        if (randomElement && !randomElement.classList.contains('glitching')) {
            randomElement.classList.add('glitching');
            setTimeout(() => {
                randomElement.classList.remove('glitching');
            }, 500);
        }
    }, 15000);
}

// Music Player Functionality
class MusicPlayer {
    constructor() {
        this.player = null;
        this.isPlaying = false;
        this.currentTrack = 0;
        this.tracks = [
            {
                file: 'cyberpunk.mp3',
                title: 'Cyberpunk: Edgerunners',
                artist: 'This Fire by Franz Ferdinand',
                duration: '3:45'
            }
        ];
        this.init();
    }

    init() {
        // Initialize when DEPOOL section is loaded
        const checkInterval = setInterval(() => {
            if (document.getElementById('musicPlayer')) {
                clearInterval(checkInterval);
                this.initMusicPlayer();
            }
        }, 100);
    }

    initMusicPlayer() {
        this.setupPlayer();
        this.setupEventListeners();
        console.log('MusicPlayer initialized');
    }

    setupPlayer() {
        this.player = document.getElementById('musicPlayer');
        if (!this.player) {
            console.error('Music player element not found');
            return;
        }

        // Set initial volume
        this.player.volume = 0.7;

        // Add event listeners
        this.player.addEventListener('loadedmetadata', () => {
            console.log('Audio metadata loaded');
            this.updateTimeDisplay();
            // Auto play when loaded
            setTimeout(() => this.play(), 500);
        });

        this.player.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.player.addEventListener('ended', () => {
            console.log('Audio ended');
            this.nextTrack();
        });

        this.player.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            console.error('Audio src:', this.player.src);
        });

        this.player.addEventListener('canplay', () => {
            console.log('Audio can play');
        });

        // Load first track
        this.loadTrack();
    }

    setupEventListeners() {
        const playBtn = document.querySelector('.play-btn');
        const pauseBtn = document.querySelector('.pause-btn');
        const nextBtn = document.querySelector('.next-btn');

        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Play button clicked');
                this.play();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Pause button clicked');
                this.pause();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Next button clicked');
                this.nextTrack();
            });
        }

        // Playlist items
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Playlist item clicked:', index);
                this.selectTrack(index);
            });
        });
    }

    play() {
        if (!this.player) {
            console.error('Player not available');
            return;
        }
        
        console.log('Attempting to play audio...');
        console.log('Current src:', this.player.src);
        
        // Try to load and play
        const playPromise = this.player.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Audio playing successfully');
                this.isPlaying = true;
                this.updatePlayPauseButtons();
                this.startVisualizer();
            }).catch(error => {
                console.error('Error playing audio:', error);
                console.log('Trying to reload audio...');
                // Try reloading
                this.player.load();
                setTimeout(() => {
                    this.player.play().then(() => {
                        this.isPlaying = true;
                        this.updatePlayPauseButtons();
                        this.startVisualizer();
                    }).catch(e => console.error('Still failed:', e));
                }, 500);
            });
        } else {
            this.isPlaying = true;
            this.updatePlayPauseButtons();
            this.startVisualizer();
        }
    }

    pause() {
        if (!this.player) return;
        
        console.log('Pausing audio');
        this.player.pause();
        this.isPlaying = false;
        this.updatePlayPauseButtons();
        this.stopVisualizer();
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack();
    }

    selectTrack(index) {
        this.currentTrack = index;
        this.loadTrack();
    }

    loadTrack() {
        if (!this.player) return;

        const track = this.tracks[this.currentTrack];
        const audioPath = `src/musicas/${track.file}`;
        
        console.log('Loading track:', audioPath);
        
        this.player.src = audioPath;
        this.player.load(); // Force reload
        
        // Update UI
        const trackNameEl = document.querySelector('.track-name');
        const artistNameEl = document.querySelector('.artist-name');
        
        if (trackNameEl) trackNameEl.textContent = track.title;
        if (artistNameEl) artistNameEl.textContent = track.artist;
        
        // Update playlist active state
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrack);
        });

        // Auto play if was playing
        if (this.isPlaying) {
            setTimeout(() => this.play(), 500);
        }
    }

    updatePlayPauseButtons() {
        const playBtn = document.querySelector('.play-btn');
        const pauseBtn = document.querySelector('.pause-btn');
        
        if (this.isPlaying) {
            playBtn?.classList.add('hidden');
            pauseBtn?.classList.remove('hidden');
        } else {
            playBtn?.classList.remove('hidden');
            pauseBtn?.classList.add('hidden');
        }
    }

    updateProgress() {
        if (!this.player) return;

        const progress = (this.player.currentTime / this.player.duration) * 100;
        const progressFill = document.getElementById('progressFill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }

        this.updateTimeDisplay();
    }

    updateTimeDisplay() {
        if (!this.player) return;

        const current = this.formatTime(this.player.currentTime);
        const duration = this.formatTime(this.player.duration);
        const timeDisplay = document.getElementById('timeDisplay');
        if (timeDisplay) {
            timeDisplay.textContent = `${current} / ${duration}`;
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    startVisualizer() {
        const bars = document.querySelectorAll('.wave-bar');
        bars.forEach(bar => {
            bar.style.animationPlayState = 'running';
        });
        
        // Create audio context for real visualization
        if (!this.audioContext && this.player) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.source = this.audioContext.createMediaElementSource(this.player);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            this.analyser.fftSize = 256;
            
            this.visualize();
        }
    }

    stopVisualizer() {
        const bars = document.querySelectorAll('.wave-bar');
        bars.forEach(bar => {
            bar.style.animationPlayState = 'paused';
        });
    }

    visualize() {
        if (!this.analyser) return;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        const bars = document.querySelectorAll('.wave-bar');
        
        const draw = () => {
            if (!this.isPlaying) return;
            
            requestAnimationFrame(draw);
            this.analyser.getByteFrequencyData(dataArray);
            
            bars.forEach((bar, index) => {
                const value = dataArray[index * 2] || 0;
                const height = Math.max(20, (value / 255) * 100);
                bar.style.height = `${height}%`;
            });
        };
        
        draw();
    }
}

// Available tracks for preloading
const musicTracks = [
    'cyberpunk.mp3',
    'Let it happen.mp3',
    'DARE.mp3'
];

// Preload all tracks
const preloadedAudio = {};

// Initialize music player when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing audio...');
    
    // Preload all tracks for instant playback
    musicTracks.forEach(track => {
        const audio = new Audio();
        audio.src = `src/musicas/${track}`;
        audio.preload = 'auto';
        preloadedAudio[track] = audio;
    });
    console.log('Preloaded tracks:', Object.keys(preloadedAudio));
    
    // Ultra-simple audio initialization
    const initAudio = () => {
        const audioPlayer = document.getElementById('musicPlayer');
        const playBtn = document.querySelector('.play-btn');
        const pauseBtn = document.querySelector('.pause-btn');
        
        console.log('Elements found:', {
            audioPlayer: !!audioPlayer,
            playBtn: !!playBtn,
            pauseBtn: !!pauseBtn
        });
        
        if (audioPlayer && playBtn && pauseBtn) {
            // Set volume
            audioPlayer.volume = 0.7;
            
            // Set initial track
            audioPlayer.src = 'src/musicas/cyberpunk.mp3';
            
            // Simple play function
            window.playAudio = () => {
                console.log('Playing audio...');
                audioPlayer.play().then(() => {
                    console.log('Audio playing successfully');
                    playBtn.style.display = 'none';
                    pauseBtn.style.display = 'flex';
                }).catch(error => {
                    console.error('Error playing audio:', error);
                });
            };
            
            // Simple pause function
            window.pauseAudio = () => {
                console.log('Pausing audio...');
                audioPlayer.pause();
                playBtn.style.display = 'flex';
                pauseBtn.style.display = 'none';
            };
            
            // Event listeners
            playBtn.addEventListener('click', window.playAudio);
            pauseBtn.addEventListener('click', window.pauseAudio);
            
            console.log('Audio player initialized successfully');
        } else {
            console.error('Missing elements for audio player');
        }
    };
    
    // Try initialization repeatedly until DEPOOL section is loaded
    const checkInterval = setInterval(() => {
        const audioPlayer = document.getElementById('musicPlayer');
        const playBtn = document.querySelector('.play-btn');
        const pauseBtn = document.querySelector('.pause-btn');
        
        if (audioPlayer && playBtn && pauseBtn) {
            clearInterval(checkInterval);
            initAudio();
        }
    }, 500);
});

// Global function to play individual tracks
window.playTrack = function(trackFile, buttonElement) {
    const audioPlayer = document.getElementById('musicPlayer');
    const allButtons = document.querySelectorAll('.disc-play-btn');
    const allItems = document.querySelectorAll('.playlist-item');
    const allStatuses = document.querySelectorAll('.disc-status');
    
    // Reset all buttons and items
    allButtons.forEach(btn => btn.classList.remove('active'));
    allItems.forEach(item => item.classList.remove('active'));
    allStatuses.forEach(status => {
        status.textContent = 'READY';
        status.style.color = 'var(--secondary-green)';
    });
    
    // Set current track as active
    buttonElement.classList.add('active');
    const currentItem = buttonElement.closest('.playlist-item');
    currentItem.classList.add('active');
    
    const currentStatus = currentItem.querySelector('.disc-status');
    currentStatus.textContent = 'PLAYING';
    currentStatus.style.color = 'var(--primary-cyan)';
    
    // Update audio source
    const trackPath = `src/musicas/${trackFile}`;
    
    // Pause current audio
    audioPlayer.pause();
    
    // Load new track with minimal delay
    audioPlayer.src = trackPath;
    audioPlayer.load();
    
    // Play immediately when ready
    const playWhenReady = () => {
        audioPlayer.play().then(() => {
            console.log(`Playing track: ${trackFile}`);
        }).catch(error => {
            console.error('Error playing track:', error);
        });
        audioPlayer.removeEventListener('canplay', playWhenReady);
    };
    
    audioPlayer.addEventListener('canplay', playWhenReady);
    
    // Update main track info
    const trackTitle = currentItem.querySelector('.disc-title').textContent;
    const trackArtist = currentItem.querySelector('.disc-artist').textContent;
    document.querySelector('.track-name').textContent = trackTitle;
    document.querySelector('.artist-name').textContent = trackArtist;
};

// Horizontal scroll with mouse wheel
document.addEventListener('DOMContentLoaded', () => {
    const playlist = document.getElementById('musicPlaylist');
    if (playlist) {
        playlist.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                playlist.scrollLeft += e.deltaY;
            }
        }, { passive: false });
    }
});
