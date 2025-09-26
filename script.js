// Cyberpunk Portfolio JavaScript
class CyberpunkPortfolio {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.startParticles();
        this.startTerminal();
        this.loadContent();
    }

    init() {
        // Initialize variables
        this.isModalOpen = false;
        this.currentModal = null;
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

        // Add glitch effect to title
        const titleMain = document.querySelector('.title-main');
        if (titleMain) {
            titleMain.setAttribute('data-text', titleMain.textContent);
            titleMain.classList.add('glitch');
        }
    }

    setupEventListeners() {
        // Navigation buttons
        const navBtns = document.querySelectorAll('.nav-btn');
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.getAttribute('data-section') || e.target.parentElement.getAttribute('data-section');
                this.handleNavigation(section);
            });
        });

        // Modal close buttons
        const closeButtons = document.querySelectorAll('.modal-close');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.getAttribute('data-modal');
                this.closeModal(modal);
            });
        });

        // Modal overlay
        const modalOverlay = document.getElementById('modalOverlay');
        modalOverlay.addEventListener('click', () => {
            if (this.currentModal) {
                this.closeModal(this.currentModal);
            }
        });

        // Terminal toggle
        const terminalToggle = document.getElementById('terminalToggle');
        terminalToggle.addEventListener('click', () => {
            this.toggleTerminal();
        });

        // Mobile menu toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Escape key to close modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isModalOpen) {
                this.closeModal(this.currentModal);
            }
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleNavigation(section) {
        if (section === 'home') {
            // Close any open modal and return to home
            if (this.isModalOpen) {
                this.closeModal(this.currentModal);
            }
            return;
        }

        // Open corresponding modal
        const modalId = `${section}Modal`;
        this.openModal(modalId);
        this.loadModalContent(section);
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modalOverlay');

        if (modal) {
            // Close current modal if open
            if (this.isModalOpen && this.currentModal) {
                this.closeModal(this.currentModal);
                setTimeout(() => {
                    this.showModal(modal, overlay, modalId);
                }, 300);
            } else {
                this.showModal(modal, overlay, modalId);
            }
        }
    }

    showModal(modal, overlay, modalId) {
        overlay.classList.add('active');
        modal.classList.add('active');
        this.isModalOpen = true;
        this.currentModal = modalId;
        document.body.style.overflow = 'hidden';

        // Add opening animation
        setTimeout(() => {
            modal.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 50);
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        const overlay = document.getElementById('modalOverlay');

        if (modal) {
            modal.classList.remove('active');
            overlay.classList.remove('active');
            this.isModalOpen = false;
            this.currentModal = null;
            document.body.style.overflow = 'auto';
        }
    }

    async loadModalContent(section) {
        const contentId = `${section}Content`;
        const contentElement = document.getElementById(contentId);

        if (!contentElement) return;

        // Show loading spinner
        contentElement.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>CARGANDO DATOS...</p>
            </div>
        `;

        // Simulate AJAX loading with setTimeout
        setTimeout(() => {
            const content = this.getContentForSection(section);
            this.animateContentLoad(contentElement, content);
        }, 1500);
    }

    animateContentLoad(element, content) {
        // Fade out loading spinner
        element.style.opacity = '0';
        setTimeout(() => {
            element.innerHTML = content;
            element.style.opacity = '1';
            element.style.transition = 'opacity 0.5s ease';
        }, 300);
    }

    getContentForSection(section) {
        const content = {
            about: `
                <div class="profile-section" style="animation: slideInLeft 0.8s ease;">
                    <div class="profile-header">
                        <div class="avatar-frame">
                            <div class="avatar-placeholder">BVH3</div>
                        </div>
                        <div class="profile-info">
                            <h3>DESARROLLADOR FULL-STACK</h3>
                            <p class="profile-status">STATUS: <span style="color: var(--secondary-green);">ONLINE</span></p>
                            <p class="profile-level">NIVEL: <span style="color: var(--primary-cyan);">SENIOR</span></p>
                        </div>
                    </div>
                    
                    <div class="profile-details">
                        <h4>BIOGRAFÍA</h4>
                        <p>Especialista en desarrollo web con más de 5 años de experiencia creando aplicaciones robustas y escalables. Experto en tecnologías front-end y back-end modernas.</p>
                        
                        <h4 style="margin-top: 2rem;">ESPECIALIDADES</h4>
                        <div class="specialties-grid">
                            <div class="specialty-item">JAVASCRIPT/ES6+</div>
                            <div class="specialty-item">REACT/NEXT.JS</div>
                            <div class="specialty-item">NODE.JS</div>
                            <div class="specialty-item">PYTHON</div>
                            <div class="specialty-item">DATABASES</div>
                            <div class="specialty-item">CLOUD/AWS</div>
                        </div>

                        <h4 style="margin-top: 2rem;">STATS</h4>
                        <div class="stats-bars">
                            <div class="stat-bar">
                                <span>CREATIVIDAD</span>
                                <div class="bar"><div class="fill" style="width: 95%"></div></div>
                            </div>
                            <div class="stat-bar">
                                <span>PROBLEMA SOLVING</span>
                                <div class="bar"><div class="fill" style="width: 98%"></div></div>
                            </div>
                            <div class="stat-bar">
                                <span>TEAMWORK</span>
                                <div class="bar"><div class="fill" style="width: 92%"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <style>
                    .profile-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 2rem;
                        padding: 1.5rem;
                        background: rgba(0, 255, 255, 0.05);
                        border: 1px solid var(--primary-cyan);
                    }
                    .avatar-frame {
                        width: 80px;
                        height: 80px;
                        border: 2px solid var(--primary-cyan);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-right: 1.5rem;
                        background: var(--dark-bg);
                    }
                    .avatar-placeholder {
                        font-family: var(--font-primary);
                        font-weight: bold;
                        color: var(--primary-cyan);
                    }
                    .profile-info h3 {
                        color: var(--text-light);
                        margin-bottom: 0.5rem;
                        font-family: var(--font-primary);
                    }
                    .profile-details h4 {
                        color: var(--secondary-green);
                        margin-bottom: 1rem;
                        font-family: var(--font-primary);
                        font-size: 1.1rem;
                    }
                    .specialties-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                        gap: 1rem;
                        margin-bottom: 1rem;
                    }
                    .specialty-item {
                        padding: 0.8rem;
                        background: rgba(255, 0, 110, 0.1);
                        border: 1px solid var(--primary-pink);
                        text-align: center;
                        font-family: var(--font-primary);
                        font-size: 0.9rem;
                        color: var(--primary-pink);
                    }
                    .stats-bars {
                        margin-top: 1rem;
                    }
                    .stat-bar {
                        margin-bottom: 1rem;
                    }
                    .stat-bar span {
                        display: block;
                        margin-bottom: 0.5rem;
                        color: var(--text-muted);
                        font-size: 0.9rem;
                    }
                    .bar {
                        width: 100%;
                        height: 8px;
                        background: var(--light-gray);
                        position: relative;
                    }
                    .fill {
                        height: 100%;
                        background: linear-gradient(90deg, var(--secondary-green), var(--primary-cyan));
                        transition: width 2s ease;
                        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                    }
                </style>
            `,
            
            projects: `
                <div class="projects-grid" style="animation: slideInRight 0.8s ease;">
                    <div class="project-card">
                        <div class="project-header">
                            <h3>NEURAL NETWORK AI</h3>
                            <span class="project-status active">ACTIVO</span>
                        </div>
                        <div class="project-description">
                            <p>Sistema de inteligencia artificial avanzada con capacidades de deep learning para análisis predictivo.</p>
                            <div class="project-tech">
                                <span>PYTHON</span>
                                <span>TENSORFLOW</span>
                                <span>REACT</span>
                            </div>
                        </div>
                        <div class="project-progress">
                            <span>Progreso: 95%</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 95%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="project-card">
                        <div class="project-header">
                            <h3>BLOCKCHAIN WALLET</h3>
                            <span class="project-status completed">COMPLETADO</span>
                        </div>
                        <div class="project-description">
                            <p>Cartera digital segura con soporte para múltiples criptomonedas y contratos inteligentes.</p>
                            <div class="project-tech">
                                <span>SOLIDITY</span>
                                <span>WEB3.JS</span>
                                <span>NODE.JS</span>
                            </div>
                        </div>
                        <div class="project-progress">
                            <span>Progreso: 100%</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 100%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="project-card">
                        <div class="project-header">
                            <h3>CYBERSECURITY DASHBOARD</h3>
                            <span class="project-status development">EN DESARROLLO</span>
                        </div>
                        <div class="project-description">
                            <p>Panel de control en tiempo real para monitoreo de amenazas y análisis de seguridad.</p>
                            <div class="project-tech">
                                <span>ANGULAR</span>
                                <span>D3.JS</span>
                                <span>ELASTIC</span>
                            </div>
                        </div>
                        <div class="project-progress">
                            <span>Progreso: 67%</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 67%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="project-card">
                        <div class="project-header">
                            <h3>QUANTUM SIMULATOR</h3>
                            <span class="project-status planning">PLANEANDO</span>
                        </div>
                        <div class="project-description">
                            <p>Simulador cuántico para pruebas de algoritmos y computación experimental.</p>
                            <div class="project-tech">
                                <span>QISKIT</span>
                                <span>C++</span>
                                <span>CUDA</span>
                            </div>
                        </div>
                        <div class="project-progress">
                            <span>Progreso: 15%</span>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 15%"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>
                    .projects-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 2rem;
                    }
                    .project-card {
                        background: rgba(0, 0, 0, 0.7);
                        border: 2px solid var(--primary-cyan);
                        padding: 1.5rem;
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }
                    .project-card:hover {
                        border-color: var(--primary-pink);
                        box-shadow: 0 0 30px rgba(255, 0, 110, 0.3);
                        transform: translateY(-5px);
                    }
                    .project-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 1rem;
                    }
                    .project-header h3 {
                        font-family: var(--font-primary);
                        color: var(--text-light);
                        font-size: 1.1rem;
                    }
                    .project-status {
                        padding: 0.3rem 0.8rem;
                        font-size: 0.8rem;
                        font-family: var(--font-primary);
                        border-radius: 0;
                    }
                    .project-status.active {
                        background: var(--secondary-green);
                        color: var(--dark-bg);
                    }
                    .project-status.completed {
                        background: var(--primary-cyan);
                        color: var(--dark-bg);
                    }
                    .project-status.development {
                        background: var(--primary-pink);
                        color: var(--text-light);
                    }
                    .project-status.planning {
                        background: var(--secondary-purple);
                        color: var(--text-light);
                    }
                    .project-description p {
                        color: var(--text-muted);
                        line-height: 1.6;
                        margin-bottom: 1rem;
                    }
                    .project-tech {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 0.5rem;
                        margin-bottom: 1.5rem;
                    }
                    .project-tech span {
                        background: rgba(0, 255, 255, 0.1);
                        color: var(--primary-cyan);
                        padding: 0.3rem 0.8rem;
                        font-size: 0.8rem;
                        border: 1px solid var(--primary-cyan);
                    }
                    .project-progress span {
                        color: var(--text-muted);
                        font-size: 0.9rem;
                    }
                    .progress-bar {
                        width: 100%;
                        height: 6px;
                        background: var(--light-gray);
                        margin-top: 0.5rem;
                        position: relative;
                    }
                    .progress-fill {
                        height: 100%;
                        background: linear-gradient(90deg, var(--secondary-green), var(--primary-cyan));
                        transition: width 2s ease;
                        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                    }
                </style>
            `,

            skills: `
                <div class="skills-container" style="animation: fadeInUp 0.8s ease;">
                    <div class="skills-categories">
                        <div class="skill-category">
                            <h3>DESARROLLO FRONTEND</h3>
                            <div class="skill-items">
                                <div class="skill-item">
                                    <span class="skill-name">HTML5/CSS3</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 98%"></div>
                                        <span class="skill-percentage">98%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">JavaScript/ES6+</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 95%"></div>
                                        <span class="skill-percentage">95%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">React/Next.js</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 92%"></div>
                                        <span class="skill-percentage">92%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">Vue.js</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 85%"></div>
                                        <span class="skill-percentage">85%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="skill-category">
                            <h3>DESARROLLO BACKEND</h3>
                            <div class="skill-items">
                                <div class="skill-item">
                                    <span class="skill-name">Node.js</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 90%"></div>
                                        <span class="skill-percentage">90%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">Python</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 88%"></div>
                                        <span class="skill-percentage">88%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">PHP</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 82%"></div>
                                        <span class="skill-percentage">82%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">Java</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 75%"></div>
                                        <span class="skill-percentage">75%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="skill-category">
                            <h3>BASE DE DATOS</h3>
                            <div class="skill-items">
                                <div class="skill-item">
                                    <span class="skill-name">MongoDB</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 93%"></div>
                                        <span class="skill-percentage">93%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">MySQL</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 89%"></div>
                                        <span class="skill-percentage">89%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">PostgreSQL</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 85%"></div>
                                        <span class="skill-percentage">85%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">Redis</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 80%"></div>
                                        <span class="skill-percentage">80%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="skill-category">
                            <h3>HERRAMIENTAS & CLOUD</h3>
                            <div class="skill-items">
                                <div class="skill-item">
                                    <span class="skill-name">AWS/Azure</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 87%"></div>
                                        <span class="skill-percentage">87%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">Docker</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 91%"></div>
                                        <span class="skill-percentage">91%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">Git/GitHub</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 96%"></div>
                                        <span class="skill-percentage">96%</span>
                                    </div>
                                </div>
                                <div class="skill-item">
                                    <span class="skill-name">CI/CD</span>
                                    <div class="skill-level">
                                        <div class="skill-bar" style="width: 83%"></div>
                                        <span class="skill-percentage">83%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>
                    .skills-categories {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                        gap: 2rem;
                    }
                    .skill-category {
                        background: rgba(0, 0, 0, 0.5);
                        border: 2px solid var(--secondary-green);
                        padding: 1.5rem;
                    }
                    .skill-category h3 {
                        font-family: var(--font-primary);
                        color: var(--secondary-green);
                        margin-bottom: 1.5rem;
                        font-size: 1.1rem;
                        text-align: center;
                        text-shadow: 0 0 10px var(--secondary-green);
                    }
                    .skill-items {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .skill-item {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 1rem;
                    }
                    .skill-name {
                        color: var(--text-light);
                        font-weight: 600;
                        min-width: 120px;
                    }
                    .skill-level {
                        flex: 1;
                        margin-left: 1rem;
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                    }
                    .skill-bar {
                        height: 8px;
                        background: linear-gradient(90deg, var(--primary-cyan), var(--primary-pink));
                        flex: 1;
                        box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
                        transition: width 2s ease;
                    }
                    .skill-percentage {
                        color: var(--primary-cyan);
                        font-family: var(--font-primary);
                        font-weight: bold;
                        min-width: 40px;
                    }
                </style>
            `,

            contact: `
                <div class="contact-container" style="animation: slideInUp 0.8s ease;">
                    <div class="contact-info">
                        <div class="contact-section">
                            <h3>INFORMACIÓN DE CONTACTO</h3>
                            <div class="contact-methods">
                                <div class="contact-method">
                                    <span class="contact-icon">📧</span>
                                    <div class="contact-details">
                                        <strong>EMAIL</strong>
                                        <p>info@bvh3industries.com</p>
                                        <p>desarrollo@bvh3industries.com</p>
                                    </div>
                                </div>
                                <div class="contact-method">
                                    <span class="contact-icon">📱</span>
                                    <div class="contact-details">
                                        <strong>TELÉFONO</strong>
                                        <p>+1 (555) 123-4567</p>
                                        <p>+1 (555) 765-4321</p>
                                    </div>
                                </div>
                                <div class="contact-method">
                                    <span class="contact-icon">🌐</span>
                                    <div class="contact-details">
                                        <strong>REDES SOCIALES</strong>
                                        <p>GitHub: /BVH3Industries</p>
                                        <p>LinkedIn: /company/bvh3</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="contact-form-section">
                            <h3>ENVIAR MENSAJE</h3>
                            <form class="cyber-form" id="contactForm">
                                <div class="form-group">
                                    <label for="name">NOMBRE COMPLETO</label>
                                    <input type="text" id="name" name="name" required>
                                </div>
                                <div class="form-group">
                                    <label for="email">EMAIL</label>
                                    <input type="email" id="email" name="email" required>
                                </div>
                                <div class="form-group">
                                    <label for="subject">ASUNTO</label>
                                    <select id="subject" name="subject" required>
                                        <option value="">Seleccionar tipo de proyecto</option>
                                        <option value="web">Desarrollo Web</option>
                                        <option value="mobile">Aplicación Móvil</option>
                                        <option value="ai">Inteligencia Artificial</option>
                                        <option value="blockchain">Blockchain</option>
                                        <option value="consulting">Consultoría</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="message">MENSAJE</label>
                                    <textarea id="message" name="message" rows="5" required></textarea>
                                </div>
                                <button type="submit" class="submit-btn">
                                    <span>ENVIAR MENSAJE</span>
                                    <div class="btn-effect"></div>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div class="contact-map">
                        <h3>LOCALIZACIÓN</h3>
                        <div class="map-placeholder">
                            <div class="map-grid"></div>
                            <div class="location-marker">
                                <div class="marker-pulse"></div>
                                <span>BVH3 INDUSTRIES HQ</span>
                            </div>
                        </div>
                    </div>
                </div>

                <style>
                    .contact-container {
                        display: grid;
                        grid-template-columns: 2fr 1fr;
                        gap: 3rem;
                        margin-bottom: 2rem;
                    }
                    .contact-info {
                        display: flex;
                        flex-direction: column;
                        gap: 2rem;
                    }
                    .contact-section,
                    .contact-form-section {
                        background: rgba(0, 0, 0, 0.7);
                        border: 2px solid var(--primary-cyan);
                        padding: 2rem;
                    }
                    .contact-section h3,
                    .contact-form-section h3,
                    .contact-map h3 {
                        font-family: var(--font-primary);
                        color: var(--primary-cyan);
                        margin-bottom: 1.5rem;
                        text-shadow: 0 0 10px var(--primary-cyan);
                    }
                    .contact-methods {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .contact-method {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        padding: 1rem;
                        background: rgba(0, 255, 255, 0.05);
                        border: 1px solid rgba(0, 255, 255, 0.2);
                    }
                    .contact-icon {
                        font-size: 2rem;
                        width: 60px;
                        text-align: center;
                    }
                    .contact-details strong {
                        color: var(--secondary-green);
                        display: block;
                        margin-bottom: 0.5rem;
                        font-family: var(--font-primary);
                    }
                    .contact-details p {
                        color: var(--text-muted);
                        margin-bottom: 0.3rem;
                    }
                    .cyber-form {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                    }
                    .form-group {
                        display: flex;
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    .form-group label {
                        color: var(--secondary-green);
                        font-family: var(--font-primary);
                        font-size: 0.9rem;
                        letter-spacing: 1px;
                    }
                    .form-group input,
                    .form-group select,
                    .form-group textarea {
                        background: rgba(0, 0, 0, 0.8);
                        border: 2px solid var(--light-gray);
                        color: var(--text-light);
                        padding: 1rem;
                        font-family: var(--font-secondary);
                        transition: all 0.3s ease;
                    }
                    .form-group input:focus,
                    .form-group select:focus,
                    .form-group textarea:focus {
                        outline: none;
                        border-color: var(--primary-cyan);
                        box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
                    }
                    .submit-btn {
                        position: relative;
                        background: transparent;
                        border: 2px solid var(--primary-pink);
                        color: var(--text-light);
                        padding: 1rem 2rem;
                        font-family: var(--font-primary);
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        overflow: hidden;
                        text-transform: uppercase;
                        letter-spacing: 1px;
                    }
                    .submit-btn:hover {
                        color: var(--dark-bg);
                        background: var(--primary-pink);
                        box-shadow: 0 0 30px var(--primary-pink);
                    }
                    .contact-map {
                        background: rgba(0, 0, 0, 0.7);
                        border: 2px solid var(--secondary-green);
                        padding: 2rem;
                        height: fit-content;
                    }
                    .map-placeholder {
                        height: 300px;
                        background: var(--dark-bg);
                        position: relative;
                        border: 1px solid var(--secondary-green);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        overflow: hidden;
                    }
                    .map-grid {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-image: 
                            linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px);
                        background-size: 20px 20px;
                        animation: gridMove 10s linear infinite;
                    }
                    @keyframes gridMove {
                        0% { transform: translate(0, 0); }
                        100% { transform: translate(20px, 20px); }
                    }
                    .location-marker {
                        position: relative;
                        text-align: center;
                        color: var(--secondary-green);
                        font-family: var(--font-primary);
                        z-index: 10;
                    }
                    .marker-pulse {
                        width: 20px;
                        height: 20px;
                        background: var(--secondary-green);
                        border-radius: 50%;
                        margin: 0 auto 1rem;
                        animation: pulse 2s infinite;
                    }
                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 0 rgba(0, 255, 65, 0.7); }
                        70% { box-shadow: 0 0 0 20px rgba(0, 255, 65, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(0, 255, 65, 0); }
                    }
                    
                    @media (max-width: 768px) {
                        .contact-container {
                            grid-template-columns: 1fr;
                            gap: 2rem;
                        }
                    }
                </style>
            `
        };

        return content[section] || '<p>Contenido no disponible</p>';
    }

    startParticles() {
        const canvas = document.getElementById('particles-canvas');
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create particles
        for (let i = 0; i < 100; i++) {
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
        // Simulate initial content loading
        console.log('BVH3 INDUSTRIES - Cyberpunk Portfolio Loaded');
        
        // Add contact form handler
        setTimeout(() => {
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleFormSubmission(e);
                });
            }
        }, 1000);
    }

    handleFormSubmission(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        // Simulate form processing
        const submitBtn = e.target.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>ENVIANDO...</span>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = '<span>MENSAJE ENVIADO</span>';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                e.target.reset();
            }, 2000);
        }, 3000);
        
        console.log('Form submitted:', data);
    }
}

// Initialize the portfolio when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CyberpunkPortfolio();
});

// Add some global effects
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-effect');
    if (!cursor) {
        const cursorEffect = document.createElement('div');
        cursorEffect.className = 'cursor-effect';
        cursorEffect.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            mix-blend-mode: screen;
            transition: transform 0.1s ease;
        `;
        document.body.appendChild(cursorEffect);
    }
    
    const cursorEffect = document.querySelector('.cursor-effect');
    cursorEffect.style.left = e.clientX - 10 + 'px';
    cursorEffect.style.top = e.clientY - 10 + 'px';
});

// Add glitch effect to random elements
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