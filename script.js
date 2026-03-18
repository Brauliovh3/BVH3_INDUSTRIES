// Cyberpunk Portfolio JavaScript
class CyberpunkPortfolio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.startParticles();
        this.startTerminal();
        this.loadContent();
        this.navigateFromHash();
    }

    init() {
        this.loadedSections = new Set();
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
            });
        });

        
        const terminalToggle = document.getElementById('terminalToggle');
        terminalToggle.addEventListener('click', () => {
            this.toggleTerminal();
        });

        
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
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
        const activeSection = this.showSection(section);
        this.loadSectionContentOnce(activeSection);
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

    loadSectionContentOnce(section) {
        if (section === 'home') return;
        if (this.loadedSections.has(section)) return;
        this.loadedSections.add(section);
        this.loadSectionContent(section);
    }

    async loadSectionContent(section) {
        const contentId = `${section}Content`;
        const contentElement = document.getElementById(contentId);

        if (!contentElement) return;

        const loadingText = {
            about: 'CARGANDO PERFIL...',
            projects: 'CARGANDO PROYECTOS...',
            apps: 'CARGANDO APLICACIONES...',
            skills: 'ANALIZANDO COMPETENCIAS...',
            contact: 'INICIALIZANDO COMUNICACIÓN...'
        }[section] || 'CARGANDO...';

        contentElement.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>${loadingText}</p>
            </div>
        `;

        setTimeout(() => {
            const content = this.getContentForSection(section);
            this.animateContentLoad(contentElement, content, () => {
                this.onSectionRendered(section, contentElement);
            });
        }, 1500);
    }

    animateContentLoad(element, content, afterRender) {
        // Fade out loading spinner
        element.style.opacity = '0';
        setTimeout(() => {
            element.innerHTML = content;
            element.style.opacity = '1';
            element.style.transition = 'opacity 0.5s ease';
            afterRender?.();
        }, 300);
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

        this.showSection('project-view');
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    handleResize() {
        // Handle responsive behavior
        const navMenu = document.querySelector('.nav-menu');
        if (window.innerWidth > 768) {
            navMenu.classList.remove('active');
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
_Enviado desde el portafolio cyberpunk BVH3 Industries_
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
    new CyberpunkPortfolio();
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
