const threadsRef = React.createRef([]);
threadsRef.current = [];

function App() {
    const [currentPage, setCurrentPage] = React.useState('about');
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [shareModalOpen, setShareModalOpen] = React.useState(false);
    const [language, setLanguage] = React.useState('en');

    const pages = {
        about: { name: 'About', ru: 'О проекте', es: 'Acerca de' },
        instructions: { name: 'Instructions', ru: 'Инструкции', es: 'Instrucciones' },
        myGobelin: { name: 'My Gobelin', ru: 'Мой гобелен', es: 'Mi Gobelino' },
        aiChat: { name: 'AI Chat', ru: 'AI чат', es: 'Chat IA' },
        socials: { name: 'Socials', ru: 'Соцсети', es: 'Redes Sociales' },
        support: { name: 'Support', ru: 'Поддержать', es: 'Apoyar' }
    };

    const translations = {
        en: {
            download: 'Download',
            share: 'Share',
            placeholder: "Ask a question about feminism...",
            detailsToggle: { open: "Hide Details", closed: "Show Details" },
            namePlaceholder: "Name (e.g., Anna)",
            countryPlaceholder: "Country",
            cityPlaceholder: "City",
            save: "Save",
            reset: "Reset",
            clear: "Clear",
            clearHistory: "Clear History",
            regenerate: "Regenerate",
            copy: "Copy",
            errorResponse: "An error occurred. Please try again later.",
            fallbackResponse: "Feminism is a movement advocating for equal rights and opportunities for women across social, political, and economic spheres. (Please verify information with official sources.)",
            modalTitle: "User Details"
        },
        ru: {
            download: 'Скачать',
            share: 'Поделиться',
            placeholder: "Задайте вопрос о феминизме...",
            detailsToggle: { open: "Скрыть детали", closed: "Показать детали" },
            namePlaceholder: "Имя (например, Анна)",
            countryPlaceholder: "Страна",
            cityPlaceholder: "Город",
            save: "Сохранить",
            reset: "Сбросить",
            clear: "Очистить",
            clearHistory: "Очистить историю",
            regenerate: "Перегенерировать",
            copy: "Скопировать",
            errorResponse: "Произошла ошибка. Пожалуйста, попробуйте снова.",
            fallbackResponse: "Феминизм — это движение за равные права и возможности для женщин в социальной, политической и экономической сферах. (Пожалуйста, проверьте информацию в официальных источниках.)",
            modalTitle: "Данные пользователя"
        },
        es: {
            download: 'Descargar',
            share: 'Compartir',
            placeholder: "Haz una pregunta sobre feminismo...",
            detailsToggle: { open: "Ocultar detalles", closed: "Mostrar detalles" },
            namePlaceholder: "Nombre (ej., Anna)",
            countryPlaceholder: "País",
            cityPlaceholder: "Ciudad",
            save: "Guardar",
            reset: "Restablecer",
            clear: "Limpiar",
            clearHistory: "Limpiar historial",
            regenerate: "Regenerar",
            copy: "Copiar",
            errorResponse: "Ocurrió un error. Por favor, intenta de nuevo.",
            fallbackResponse: "El feminismo es un movimiento que aboga por los derechos y oportunidades iguales para las mujeres en las esferas social, política y económica. (Por favor, verifica la información con fuentes oficiales.)",
            modalTitle: "Detalles del usuario"
        }
    };

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        closeMenu();
    };

    return (
        <div className="app-container">
            <header className="header">
                <button className="hamburger" onClick={toggleMenu} aria-label="Toggle Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                </button>
                <div className="language-switcher">
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                        <option value="es">Español</option>
                    </select>
                </div>
            </header>
            <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
                <button className="menu-close" onClick={closeMenu} aria-label="Close Menu">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {Object.keys(pages).map((page) => (
                    <div
                        key={page}
                        className={`menu-item ${currentPage === page ? 'active' : ''}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {pages[page][language] || pages[page].name}
                    </div>
                ))}
            </div>
            <div className={`overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
            <main className="content">
                {currentPage === 'about' && (
                    <div className="page">
                        <h1>{pages.about[language] || pages.about.name}</h1>
                        <p>
                            Feminist Gobelin is a digital platform dedicated to raising awareness about feminism and gender equality. Our mission is to provide a safe space for learning, creating data-art based on your questions, and supporting initiatives against domestic violence. Join us to explore, create, and contribute to a more equitable world.
                        </p>
                    </div>
                )}
                {currentPage === 'instructions' && (
                    <div className="page">
                        <h1>{pages.instructions[language] || pages.instructions.name}</h1>
                        <p>
                            If you or someone you know is experiencing domestic violence, here are steps to seek help:
                            <ul style={{ textAlign: 'left', margin: '16px 0' }}>
                                <li>Call emergency services (e.g., 911 in the US, 112 in the EU, or local equivalents).</li>
                                <li>Contact local shelters or hotlines for support (e.g., National Domestic Violence Hotline: 1-800-799-7233).</li>
                                <li>Document incidents safely for legal purposes.</li>
                                <li>Reach out to trusted friends or family for support.</li>
                                <li>Explore legal options, such as restraining orders.</li>
                            </ul>
                            Always prioritize your safety and seek professional help when needed.
                        </p>
                    </div>
                )}
                {currentPage === 'myGobelin' && <MyGobelin threadsRef={threadsRef} language={language} translations={translations} setShareModalOpen={setShareModalOpen} />}
                {currentPage === 'aiChat' && <AIChat threadsRef={threadsRef} language={language} translations={translations} />}
                {currentPage === 'socials' && (
                    <div className="page">
                        <h1>{pages.socials[language] || pages.socials.name}</h1>
                        <p>
                            Connect with us on social media to stay updated and join the conversation:
                            <div className="footer-socials" style={{ marginTop: '16px' }}>
                                <a href="https://twitter.com/feministgobelin" target="_blank" rel="noopener noreferrer">Twitter</a>
                                <a href="https://instagram.com/feministgobelin" target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a href="https://facebook.com/feministgobelin" target="_blank" rel="noopener noreferrer">Facebook</a>
                            </div>
                            Email: contact@feministgobelin.org
                            <br />
                            Phone: +1-555-123-4567
                        </p>
                    </div>
                )}
                {currentPage === 'support' && (
                    <div className="page">
                        <h1>{pages.support[language] || pages.support.name}</h1>
                        <p>
                            You can support Feminist Gobelin in the following ways:
                            <ul style={{ textAlign: 'left', margin: '16px 0' }}>
                                <li>Donate via our crowdfunding platform: <a href="https://patreon.com/feministgobelin" target="_blank" rel="noopener noreferrer">Patreon</a></li>
                                <li>Volunteer your skills (contact us at volunteer@feministgobelin.org).</li>
                                <li>Spread the word by sharing our mission on social media.</li>
                            </ul>
                            Your support helps us continue our work in promoting gender equality.
                        </p>
                    </div>
                )}
            </main>
            <footer className="footer">
                <div className="footer-menu">
                    {Object.keys(pages).map((page) => (
                        <div
                            key={page}
                            className="footer-item"
                            onClick={() => handlePageChange(page)}
                        >
                            {pages[page][language] || pages[page].name}
                        </div>
                    ))}
                </div>
                <div className="footer-contact">
                    Email: contact@feministgobelin.org | Phone: +1-555-123-4567
                </div>
                <div className="footer-socials">
                    <a href="https://twitter.com/feministgobelin" target="_blank" rel="noopener noreferrer">Twitter</a>
                    <a href="https://instagram.com/feministgobelin" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://facebook.com/feministgobelin" target="_blank" rel="noopener noreferrer">Facebook</a>
                </div>
            </footer>
            {shareModalOpen && (
                <div className="modal">
                    <div className="modal-header">
                        <span className="modal-title">{translations[language].share}</span>
                        <span
                            className="modal-close"
                            onClick={() => setShareModalOpen(false)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && setShareModalOpen(false)}
                            aria-label="Close"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </span>
                    </div>
                    <div className="modal-content share-modal">
                        {navigator.share ? (
                            <button
                                className="share-button"
                                onClick={() => {
                                    navigator.share({
                                        title: 'My Feminist Gobelin',
                                        text: 'Check out my unique data-art gobelin created with Feminist Gobelin!',
                                        url: 'https://feminist-gobelin-site.netlify.app'
                                    }).then(() => setShareModalOpen(false));
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Share via Native Share
                            </button>
                        ) : (
                            <>
                                <button
                                    className="share-button"
                                    onClick={() => {
                                        navigator.clipboard.writeText('https://feminist-gobelin-site.netlify.app');
                                        alert(translations[language].copy + 'ed!');
                                        setShareModalOpen(false);
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy Link
                                </button>
                                <a
                                    href="https://twitter.com/intent/tweet?text=Check%20out%20my%20Feminist%20Gobelin!&url=https://feminist-gobelin-site.netlify.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                    </svg>
                                    Share on Twitter
                                </a>
                                <a
                                    href="https://www.facebook.com/sharer/sharer.php?u=https://feminist-gobelin-site.netlify.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                                    </svg>
                                    Share on Facebook
                                </a>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

function MyGobelin({ threadsRef, language, translations, setShareModalOpen }) {
    const canvasRef = React.useRef(null);
    const [threads, setThreads] = React.useState([]);

    const createTexture = (material, ctx) => {
        console.log('Creating texture for material:', material);
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = 100;
        textureCanvas.height = 100;
        const tCtx = textureCanvas.getContext('2d');
        tCtx.fillStyle = '#fff';
        tCtx.fillRect(0, 0, 100, 100);
        if (material === 'silk') {
            tCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            for (let i = 0; i < 100; i += 5) {
                tCtx.beginPath();
                tCtx.moveTo(i, 0);
                tCtx.lineTo(i, 100);
                tCtx.stroke();
            }
        } else if (material === 'cotton') {
            tCtx.fillStyle = 'rgba(200, 200, 200, 0.1)';
            for (let i = 0; i < 100; i += 5) {
                for (let j = 0; j < 100; j += 5) {
                    tCtx.fillRect(i, j, 2, 2);
                }
            }
        } else if (material === 'wool') {
            tCtx.fillStyle = 'rgba(150, 150, 150, 0.3)';
            for (let i = 0; i < 100; i += 3) {
                tCtx.beginPath();
                tCtx.arc(i, 50 + Math.random() * 10, 1, 0, Math.PI * 2);
                tCtx.fill();
            }
        } else if (material === 'fur') {
            tCtx.strokeStyle = 'rgba(100, 100, 100, 0.4)';
            for (let i = 0; i < 100; i += 5) {
                tCtx.beginPath();
                tCtx.moveTo(i, 50);
                tCtx.lineTo(i + Math.random() * 5, 50 + Math.random() * 10);
                tCtx.stroke();
            }
        } else if (material === 'satin') {
            tCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            tCtx.fillRect(0, 0, 100, 100);
            tCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            tCtx.fillRect(0, 0, 100, 50);
        }
        return ctx.createPattern(textureCanvas, 'repeat');
    };

    const keywordRules = {
        'насилие': { color: '#000000', thickness: 2, material: 'fur', shape: 'horizontal', effect: 'matte' },
        'поддержка': { color: '#F97316', thickness: 6, material: 'cotton', shape: 'horizontal', effect: 'glow' },
        'семья': { color: '#EC4899', thickness: 2, material: 'silk', shape: 'horizontal', effect: 'shine' },
        'страх': { color: '#1E3A8A', thickness: 4, material: 'fur', shape: 'dashed', effect: 'texture' },
        'радость': { color: '#FFD700', thickness: 2, material: 'satin', shape: 'wave', effect: 'strong-shine' },
        'помощь': { color: '#10B981', thickness: 4, material: 'cotton', shape: 'horizontal', effect: 'gradient' },
        'свобода': { color: '#FFFFFF', thickness: 8, material: 'silk', shape: 'horizontal', effect: 'transparent' },
        'надежда': { color: '#2DD4BF', thickness: 4, material: 'satin', shape: 'wave', effect: 'twinkle' },
        'потеря': { color: '#6B7280', thickness: 2, material: 'wool', shape: 'dashed', effect: 'texture' },
        'любовь': { color: '#EF4444', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'gradient-pink' },
        'violence': { color: '#000000', thickness: 2, material: 'fur', shape: 'horizontal', effect: 'matte' },
        'support': { color: '#F97316', thickness: 6, material: 'cotton', shape: 'horizontal', effect: 'glow' },
        'family': { color: '#EC4899', thickness: 2, material: 'silk', shape: 'horizontal', effect: 'shine' },
        'fear': { color: '#1E3A8A', thickness: 4, material: 'fur', shape: 'dashed', effect: 'texture' },
        'joy': { color: '#FFD700', thickness: 2, material: 'satin', shape: 'wave', effect: 'strong-shine' },
        'help': { color: '#10B981', thickness: 4, material: 'cotton', shape: 'horizontal', effect: 'gradient' },
        'freedom': { color: '#FFFFFF', thickness: 8, material: 'silk', shape: 'horizontal', effect: 'transparent' },
        'hope': { color: '#2DD4BF', thickness: 4, material: 'satin', shape: 'wave', effect: 'twinkle' },
        'loss': { color: '#6B7280', thickness: 2, material: 'wool', shape: 'dashed', effect: 'texture' },
        'love': { color: '#EF4444', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'gradient-pink' }
    };

    const countryRules = {
        'Serbia': [{ color: '#FFC107', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'shine' }],
        'Ukraine': [
            { color: '#005BBB', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'shine' },
            { color: '#FFD500', thickness: 4, material: 'cotton', shape: 'horizontal', effect: 'matte' }
        ],
        'France': [
            { color: '#0055A4', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'shine' },
            { color: '#FFFFFF', thickness: 4, material: 'satin', shape: 'horizontal', effect: 'transparent' },
            { color: '#EF4135', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'shine' }
        ],
        'Germany': [
            { color: '#000000', thickness: 4, material: 'wool', shape: 'horizontal', effect: 'texture' },
            { color: '#DD0000', thickness: 4, material: 'cotton', shape: 'horizontal', effect: 'matte' },
            { color: '#FFCE00', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'shine' }
        ],
        'Italy': [
            { color: '#009246', thickness: 4, material: 'cotton', shape: 'horizontal', effect: 'matte' },
            { color: '#FFFFFF', thickness: 4, material: 'satin', shape: 'horizontal', effect: 'transparent' },
            { color: '#CE2B37', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'shine' }
        ],
        'United States': [
            { color: '#B22234', thickness: 2, material: 'cotton', shape: 'stripes', effect: 'matte' },
            { color: '#FFFFFF', thickness: 2, material: 'cotton', shape: 'stripes', effect: 'matte' },
            { color: '#3C3B6E', thickness: 4, material: 'satin', shape: 'rectangle', effect: 'stars' }
        ],
        'Japan': [
            { color: '#FFFFFF', thickness: 4, material: 'satin', shape: 'horizontal', effect: 'transparent' },
            { color: '#BC002D', thickness: 4, material: 'silk', shape: 'circle', effect: 'shine' }
        ],
        'Turkey': [
            { color: '#E30A17', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'shine' },
            { color: '#FFFFFF', thickness: 4, material: 'cotton', shape: 'crescent-star', effect: 'matte' }
        ]
    };

    const cityRules = {
        'Belgrade': { color: '#FFC107', thickness: 4, material: 'cotton', shape: 'wave', effect: 'shine' },
        'Kyiv': { color: '#005BBB', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'glow-gold' },
        'Paris': { color: '#FFFFFF', thickness: 4, material: 'satin', shape: 'horizontal', effect: 'glow-pink' },
        'Berlin': { color: '#000000', thickness: 4, material: 'wool', shape: 'dashed', effect: 'white-inserts' },
        'New York': { color: '#6B7280', thickness: 4, material: 'cotton', shape: 'skyline', effect: 'matte' },
        'Tokyo': { color: '#FFFFFF', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'red-splashes' }
    };

    React.useEffect(() => {
        const savedThreads = localStorage.getItem('threads');
        if (savedThreads) {
            const parsedThreads = JSON.parse(savedThreads);
            threadsRef.current = parsedThreads;
            setThreads(parsedThreads);
            console.log('Loaded threads from localStorage:', parsedThreads);
        }
        // Добавляем нити для страны и города только если они ещё не были добавлены
        const country = localStorage.getItem('country');
        const city = localStorage.getItem('city');
        const newThreads = [];
        if (country && countryRules[country]) {
            countryRules[country].forEach(rule => {
                // Проверяем, нет ли уже такой нити
                if (!threadsRef.current.some(t => t.color === rule.color && t.material === rule.material)) {
                    const thread = createThread(rule, threadsRef.current.length + newThreads.length);
                    newThreads.push(thread);
                }
            });
        }
        if (city && cityRules[city]) {
            // Проверяем, нет ли уже такой нити
            if (!threadsRef.current.some(t => t.color === cityRules[city].color && t.material === cityRules[city].material)) {
                const thread = createThread(cityRules[city], threadsRef.current.length + newThreads.length);
                newThreads.push(thread);
            }
        }
        if (newThreads.length > 0) {
            threadsRef.current = [...threadsRef.current, ...newThreads];
            setThreads(threadsRef.current);
            localStorage.setItem('threads', JSON.stringify(threadsRef.current));
            console.log('Added country/city threads:', newThreads);
        }
    }, []);

    const createThread = (rule, index) => {
        const yPos = 50 + index * 20;
        return {
            ...rule,
            startX: 50,
            startY: yPos,
            endX: window.innerWidth - 50,
            endY: yPos,
            progress: 0,
            opacity: 0,
            timestamp: new Date().toISOString()
        };
    };

    const animateThreads = (ctx) => {
        if (!ctx) {
            console.error('Canvas context is not available');
            return;
        }
        console.log('Animating threads:', threads);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        let hasAnimatingThreads = false;
        threads.forEach(thread => {
            thread.progress = Math.min(thread.progress + 0.02, 1);
            thread.opacity = thread.progress < 0.8 ? thread.progress : Math.max(1 - (thread.progress - 0.8) / 0.2, 0);
            drawThread(ctx, thread);
            if (thread.progress < 1) hasAnimatingThreads = true;
        });
        if (hasAnimatingThreads) {
            requestAnimationFrame(() => animateThreads(ctx));
        } else {
            console.log('Animation completed for threads:', threads);
        }
    };

    const drawThread = (ctx, thread) => {
        console.log('Drawing thread:', thread);
        ctx.globalAlpha = thread.opacity;
        ctx.strokeStyle = thread.color;
        ctx.fillStyle = thread.color;
        ctx.lineWidth = thread.thickness;
        const texture = createTexture(thread.material, ctx);
        ctx.strokeStyle = texture;
        ctx.fillStyle = texture;

        if (thread.effect === 'glow') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = `${thread.color}80`;
        } else if (thread.effect === 'shine') {
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#FFFFFF80';
        } else if (thread.effect === 'strong-shine') {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#FFFFFFCC';
        } else if (thread.effect === 'texture') {
            ctx.shadowBlur = 3;
            ctx.shadowColor = '#00000040';
        } else if (thread.effect === 'gradient') {
            const gradient = ctx.createLinearGradient(thread.startX, thread.startY, thread.endX, thread.endY);
            gradient.addColorStop(0, thread.color);
            gradient.addColorStop(1, '#FFFFFF80');
            ctx.strokeStyle = gradient;
            ctx.fillStyle = gradient;
        } else if (thread.effect === 'gradient-pink') {
            const gradient = ctx.createLinearGradient(thread.startX, thread.startY, thread.endX, thread.endY);
            gradient.addColorStop(0, thread.color);
            gradient.addColorStop(1, '#F472B680');
            ctx.strokeStyle = gradient;
            ctx.fillStyle = gradient;
        } else if (thread.effect === 'transparent') {
            ctx.globalAlpha = thread.opacity * 0.5;
        } else if (thread.effect === 'twinkle') {
            ctx.globalAlpha = thread.opacity * (0.8 + Math.random() * 0.2);
        } else if (thread.effect === 'glow-gold') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#FFD70080';
        } else if (thread.effect === 'glow-pink') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#EC489980';
        } else if (thread.effect === 'white-inserts') {
            ctx.setLineDash([10, 5]);
            ctx.strokeStyle = '#FFFFFF';
        } else if (thread.effect === 'red-splashes') {
            ctx.fillStyle = '#BC002D';
            for (let i = 0; i < 5; i++) {
                ctx.fillRect(thread.startX + Math.random() * (thread.endX - thread.startX), thread.startY - 5, 2, 2);
            }
        } else if (thread.effect === 'matte') {
            ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        if (thread.shape === 'horizontal') {
            ctx.moveTo(thread.startX, thread.startY);
            ctx.lineTo(thread.startX + (thread.endX - thread.startX) * thread.progress, thread.startY);
            ctx.stroke();
        } else if (thread.shape === 'wave') {
            ctx.moveTo(thread.startX, thread.startY);
            for (let x = 0; x <= (thread.endX - thread.startX) * thread.progress; x += 5) {
                const y = Math.sin(x * 0.02) * 20;
                ctx.lineTo(thread.startX + x, thread.startY + y);
            }
            ctx.stroke();
        } else if (thread.shape === 'dashed') {
            ctx.setLineDash([10, 10]);
            ctx.moveTo(thread.startX, thread.startY);
            ctx.lineTo(thread.startX + (thread.endX - thread.startX) * thread.progress, thread.startY);
            ctx.stroke();
            ctx.setLineDash([]);
        } else if (thread.shape === 'stripes') {
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(thread.startX, thread.startY + i * 10);
                ctx.lineTo(thread.startX + (thread.endX - thread.startX) * thread.progress, thread.startY + i * 10);
                ctx.strokeStyle = i % 2 === 0 ? '#B22234' : '#FFFFFF';
                ctx.stroke();
            }
        } else if (thread.shape === 'rectangle') {
            ctx.fillRect(thread.startX, thread.startY - 20, (thread.endX - thread.startX) * thread.progress, 40);
            if (thread.effect === 'stars') {
                ctx.fillStyle = '#FFFFFF';
                for (let i = 0; i < 10; i++) {
                    ctx.beginPath();
                    ctx.arc(thread.startX + i * 20, thread.startY, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        } else if (thread.shape === 'circle') {
            ctx.beginPath();
            ctx.arc((thread.startX + thread.endX) / 2, thread.startY, 20 * thread.progress, 0, Math.PI * 2);
            ctx.fill();
        } else if (thread.shape === 'crescent-star') {
            ctx.beginPath();
            ctx.arc((thread.startX + thread.endX) / 2, thread.startY, 20 * thread.progress, 0.5 * Math.PI, 2.5 * Math.PI);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo((thread.startX + thread.endX) / 2 + 10, thread.startY);
            for (let i = 0; i < 5; i++) {
                const angle = i * (Math.PI * 2 / 5);
                ctx.lineTo(
                    (thread.startX + thread.endX) / 2 + Math.cos(angle) * 5 * thread.progress,
                    thread.startY + Math.sin(angle) * 5 * thread.progress
                );
            }
            ctx.fill();
        } else if (thread.shape === 'skyline') {
            ctx.beginPath();
            ctx.moveTo(thread.startX, thread.startY);
            for (let x = 0; x <= (thread.endX - thread.startX) * thread.progress; x += 20) {
                ctx.lineTo(thread.startX + x, thread.startY - Math.random() * 20);
            }
            ctx.lineTo(thread.startX + (thread.endX - thread.startX) * thread.progress, thread.startY);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    };

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.error('Canvas ref is null');
            return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error('Failed to get canvas context');
            return;
        }
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        console.log('Canvas initialized with size:', canvas.width, canvas.height);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            console.log('Canvas resized to:', canvas.width, canvas.height);
            animateThreads(ctx);
        };
        window.addEventListener('resize', handleResize);

        // Запускаем анимацию
        animateThreads(ctx);

        return () => window.removeEventListener('resize', handleResize);
    }, [threads]);

    React.useEffect(() => {
        if (threadsRef.current.length !== threads.length || threadsRef.current.some((t, i) => t !== threads[i])) {
            console.log('Updating threads state:', threadsRef.current);
            setThreads([...threadsRef.current]);
            localStorage.setItem('threads', JSON.stringify(threadsRef.current));
        }
    }, [threadsRef.current]);

    return (
        <div className="page">
            <h1>{translations[language].myGobelin || 'My Gobelin'}</h1>
            <div className="gobelin-buttons">
                <button
                    className="gobelin-button"
                    onClick={() => {
                        const canvas = canvasRef.current;
                        if (canvas) {
                            const link = document.createElement('a');
                            link.href = canvas.toDataURL('image/png');
                            link.download = 'my-gobelin.png';
                            link.click();
                        } else {
                            console.error('Canvas not available for download');
                        }
                    }}
                >
                    {translations[language].download}
                </button>
                <button
                    className="gobelin-button"
                    onClick={() => {
                        const canvas = canvasRef.current;
                        if (canvas) {
                            canvas.toBlob(blob => {
                                const file = new File([blob], 'my-gobelin.png', { type: 'image/png' });
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'My Feminist Gobelin',
                                        text: 'Check out my unique data-art gobelin created with Feminist Gobelin!',
                                        files: [file]
                                    }).then(() => setShareModalOpen(false));
                                } else {
                                    setShareModalOpen(true);
                                }
                            });
                        } else {
                            console.error('Canvas not available for share');
                        }
                    }}
                >
                    {translations[language].share}
                </button>
            </div>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}></canvas>
        </div>
    );
}

function AIChat({ threadsRef, language, translations }) {
    const [userId] = React.useState('user_' + Math.random().toString(36).substr(2, 9));
    const [name, setName] = React.useState(localStorage.getItem('name') || '');
    const [tempName, setTempName] = React.useState(name);
    const [country, setCountry] = React.useState(localStorage.getItem('country') || '');
    const [tempCountry, setTempCountry] = React.useState(country);
    const [city, setCity] = React.useState(localStorage.getItem('city') || '');
    const [tempCity, setTempCity] = React.useState(city);
    const [prompt, setPrompt] = React.useState('');
    const [messages, setMessages] = React.useState(() => {
        const saved = localStorage.getItem('chatHistory');
        return saved ? JSON.parse(saved) : [];
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [showDetails, setShowDetails] = React.useState(false);
    const [editingIndex, setEditingIndex] = React.useState(null);
    const [editText, setEditText] = React.useState('');
    const chatContainerRef = React.useRef(null);

    const countries = [
        'Serbia', 'Ukraine', 'France', 'Germany', 'Italy', 'United States', 'Japan', 'Turkey'
    ];
    const citiesByCountry = {
        'Serbia': ['Belgrade'],
        'Ukraine': ['Kyiv'],
        'France': ['Paris'],
        'Germany': ['Berlin'],
        'Italy': [],
        'United States': ['New York'],
        'Japan': ['Tokyo'],
        'Turkey': []
    };

    const keywordRules = {
        'насилие': { color: '#000000', thickness: 2, material: 'fur', shape: 'horizontal', effect: 'matte' },
        'поддержка': { color: '#F97316', thickness: 6, material: 'cotton', shape: 'horizontal', effect: 'glow' },
        'семья': { color: '#EC4899', thickness: 2, material: 'silk', shape: 'horizontal', effect: 'shine' },
        'страх': { color: '#1E3A8A', thickness: 4, material: 'fur', shape: 'dashed', effect: 'texture' },
        'радость': { color: '#FFD700', thickness: 2, material: 'satin', shape: 'wave', effect: 'strong-shine' },
        'помощь': { color: '#10B981', thickness: 4, material: 'cotton', shape: 'horizontal', effect: 'gradient' },
        'свобода': { color: '#FFFFFF', thickness: 8, material: 'silk', shape: 'horizontal', effect: 'transparent' },
        'надежда': { color: '#2DD4BF', thickness: 4, material: 'satin', shape: 'wave', effect: 'twinkle' },
        'потеря': { color: '#6B7280', thickness: 2, material: 'wool', shape: 'dashed', effect: 'texture' },
        'любовь': { color: '#EF4444', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'gradient-pink' },
        'violence': { color: '#000000', thickness: 2, material: 'fur', shape: 'horizontal', effect: 'matte' },
        'support': { color: '#F97316', thickness: 6, material: 'cotton', shape: 'horizontal', effect: 'glow' },
        'family': { color: '#EC4899', thickness: 2, material: 'silk', shape: 'horizontal', effect: 'shine' },
        'fear': { color: '#1E3A8A', thickness: 4, material: 'fur', shape: 'dashed', effect: 'texture' },
        'joy': { color: '#FFD700', thickness: 2, material: 'satin', shape: 'wave', effect: 'strong-shine' },
        'help': { color: '#10B981', thickness: 4, material: 'cotton', shape: 'horizontal', effect: 'gradient' },
        'freedom': { color: '#FFFFFF', thickness: 8, material: 'silk', shape: 'horizontal', effect: 'transparent' },
        'hope': { color: '#2DD4BF', thickness: 4, material: 'satin', shape: 'wave', effect: 'twinkle' },
        'loss': { color: '#6B7280', thickness: 2, material: 'wool', shape: 'dashed', effect: 'texture' },
        'love': { color: '#EF4444', thickness: 4, material: 'silk', shape: 'horizontal', effect: 'gradient-pink' }
    };

    const saveData = () => {
        setName(tempName);
        setCountry(tempCountry);
        setCity(tempCity);
        localStorage.setItem('name', tempName);
        localStorage.setItem('country', tempCountry);
        localStorage.setItem('city', tempCity);
        setShowDetails(false);
        const newThreads = [];
        if (tempCountry && countryRules[tempCountry]) {
            countryRules[tempCountry].forEach(rule => {
                if (!threadsRef.current.some(t => t.color === rule.color && t.material === rule.material)) {
                    const thread = createThread(rule, threadsRef.current.length + newThreads.length);
                    newThreads.push(thread);
                }
            });
        }
        if (tempCity && cityRules[tempCity]) {
            if (!threadsRef.current.some(t => t.color === cityRules[tempCity].color && t.material === cityRules[tempCity].material)) {
                const thread = createThread(cityRules[tempCity], threadsRef.current.length + newThreads.length);
                newThreads.push(thread);
            }
        }
        if (newThreads.length > 0) {
            threadsRef.current = [...threadsRef.current, ...newThreads];
            localStorage.setItem('threads', JSON.stringify(threadsRef.current));
            console.log('Saved new threads from saveData:', newThreads);
        }
    };

    const resetData = () => {
        setTempName('');
        setTempCountry('');
        setTempCity('');
        setName('');
        setCountry('');
        setCity('');
        localStorage.removeItem('name');
        localStorage.removeItem('country');
        localStorage.removeItem('city');
        setShowDetails(false);
    };

    const clearMessage = (index) => {
        const newMessages = messages.filter((_, i) => i !== index);
        setMessages(newMessages);
        localStorage.setItem('chatHistory', JSON.stringify(newMessages));
        if (newMessages.length === 0) {
            threadsRef.current = [];
            localStorage.setItem('threads', JSON.stringify([]));
            console.log('Cleared all threads due to empty chat history');
        }
    };

    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem('chatHistory');
        threadsRef.current = [];
        localStorage.setItem('threads', JSON.stringify([]));
        console.log('Cleared chat history and threads');
    };

    const startEditing = (index, content) => {
        setEditingIndex(index);
        setEditText(content);
    };

    const saveEdit = (index) => {
        const fullPrompt = name && city && country ? `${name} from ${city}, ${country}: ${editText}` : editText;
        const newMessages = [...messages];
        newMessages[index] = { ...newMessages[index], content: editText, fullPrompt };
        setMessages(newMessages);
        localStorage.setItem('chatHistory', JSON.stringify(newMessages));
        setEditingIndex(null);
        setEditText('');
    };

    const copyText = (text) => {
        navigator.clipboard.writeText(text);
        alert(translations[language].copy + 'ed!');
    };

    const shareResponse = (content) => {
        const shareText = `${content}\n\nGenerated by Feminist Gobelin: https://feminist-gobelin-site.netlify.app`;
        navigator.clipboard.writeText(shareText);
        alert(translations[language].share + ' link copied!');
    };

    const regenerateResponse = async (index) => {
        const promptMessage = messages[index - 1];
        if (!promptMessage || promptMessage.role !== 'user') return;
        setIsLoading(true);
        try {
            const keywords = Object.keys(keywordRules).filter(k => promptMessage.content.toLowerCase().includes(k));
            console.log('Regenerate keywords found:', keywords);
            keywords.forEach(keyword => {
                const thread = createThread(keywordRules[keyword], threadsRef.current.length);
                threadsRef.current.push(thread);
            });
            localStorage.setItem('threads', JSON.stringify(threadsRef.current));
            const res = await fetch('https://SlavaYZMA-feminist-gobelin-server.hf.space/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, name, country, city, prompt: promptMessage.content })
            });
            const data = await res.json();
            let responseText = data.response || 'No response received.';
            const fullPrompt = promptMessage.fullPrompt || promptMessage.content;
            if (responseText.startsWith(fullPrompt)) {
                responseText = responseText.substring(fullPrompt.length).trim();
            }
            if (responseText.length < 10 || responseText.includes('What is it about')) {
                responseText = translations[language].fallbackResponse;
            }
            const newMessages = [...messages];
            newMessages[index] = { role: 'assistant', content: responseText, timestamp: new Date().toLocaleString() };
            setMessages(newMessages);
            localStorage.setItem('chatHistory', JSON.stringify(newMessages));
        } catch (error) {
            console.error('Error:', error);
            const newMessages = [...messages];
            newMessages[index] = { role: 'assistant', content: translations[language].errorResponse, timestamp: new Date().toLocaleString() };
            setMessages(newMessages);
            localStorage.setItem('chatHistory', JSON.stringify(newMessages));
        } finally {
            setIsLoading(false);
        }
    };

    const createThread = (rule, index) => {
        const yPos = 50 + index * 20;
        return {
            ...rule,
            startX: 50,
            startY: yPos,
            endX: window.innerWidth - 50,
            endY: yPos,
            progress: 0,
            opacity: 0,
            timestamp: new Date().toISOString()
        };
    };

    const handleSubmit = async () => {
        if (!prompt) return;
        const timestamp = new Date().toLocaleString();
        const fullPrompt = name && city && country ? `${name} from ${city}, ${country}: ${prompt}` : prompt;
        setMessages([...messages, { role: 'user', content: prompt, fullPrompt, timestamp }]);
        setIsLoading(true);
        setPrompt('');
        try {
            const keywords = Object.keys(keywordRules).filter(k => prompt.toLowerCase().includes(k));
            console.log('Keywords found:', keywords);
            keywords.forEach(keyword => {
                const thread = createThread(keywordRules[keyword], threadsRef.current.length);
                threadsRef.current.push(thread);
            });
            localStorage.setItem('threads', JSON.stringify(threadsRef.current));
            const res = await fetch('https://SlavaYZMA-feminist-gobelin-server.hf.space/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, name, country, city, prompt })
            });
            const data = await res.json();
            let responseText = data.response || 'No response received.';
            const fullPromptForResponse = name && city && country ? `${name} from ${city}, ${country}: ${prompt}` : prompt;
            if (responseText.startsWith(fullPromptForResponse)) {
                responseText = responseText.substring(fullPromptForResponse.length).trim();
            }
            if (responseText.length < 10 || responseText.includes('What is it about')) {
                responseText = translations[language].fallbackResponse;
            }
            setMessages(prev => [...prev, { role: 'assistant', content: responseText, timestamp: new Date().toLocaleString() }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: translations[language].errorResponse, timestamp: new Date().toLocaleString() }]);
        } finally {
            setIsLoading(false);
        }
    };

    const cancelRequest = () => {
        setIsLoading(false);
        setMessages(prev => prev.filter((_, i) => i !== prev.length - 1));
        threadsRef.current.pop();
        localStorage.setItem('threads', JSON.stringify(threadsRef.current));
    };

    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }, [messages]);

    return (
        <div className="page">
            <h1>{translations[language].aiChat || 'AI Chat'}</h1>
            {messages.length > 0 && (
                <>
                    <div className="chat-container" ref={chatContainerRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.role}`}>
                                {editingIndex === index && msg.role === 'user' ? (
                                    <div style={{ width: '100%' }}>
                                        <textarea
                                            className="edit-input"
                                            value={editText}
                                            onChange={(e) => {
                                                setEditText(e.target.value);
                                                e.target.style.height = 'auto';
                                                e.target.style.height = e.target.scrollHeight + 'px';
                                            }}
                                            rows={Math.max(1, editText.split('\n').length)}
                                            style={{ resize: 'none', overflow: 'hidden', minHeight: '40px' }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    saveEdit(index);
                                                }
                                            }}
                                        />
                                        <div className="message-actions" style={{ opacity: 1 }}>
                                            <button
                                                onClick={() => saveEdit(index)}
                                                className="action-button"
                                                aria-label="Save Edit"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setEditingIndex(null)}
                                                className="action-button"
                                                aria-label="Cancel Edit"
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {msg.content}
                                        <div className="message-timestamp">{msg.timestamp}</div>
                                        <div className="message-actions">
                                            {msg.role === 'user' && (
                                                <button
                                                    onClick={() => startEditing(index, msg.content)}
                                                    className="action-button"
                                                    aria-label={translations[language].edit}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => copyText(msg.content)}
                                                className="action-button"
                                                aria-label={translations[language].copy}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            </button>
                                            {msg.role === 'assistant' && (
                                                <>
                                                    <button
                                                        onClick={() => regenerateResponse(index)}
                                                        className="action-button"
                                                        aria-label={translations[language].regenerate}
                                                        disabled={isLoading}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => shareResponse(msg.content)}
                                                        className="action-button"
                                                        aria-label={translations[language].share}
                                                    >
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => clearMessage(index)}
                                                className="action-button"
                                                aria-label={translations[language].clear}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={clearHistory}
                        className="clear-history"
                        aria-label={translations[language].clearHistory}
                    >
                        {translations[language].clearHistory}
                    </button>
                </>
            )}
            <div className="prompt-container">
                <textarea
                    className="submit-input"
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = e.target.scrollHeight + "px";
                    }}
                    placeholder={translations[language].placeholder}
                    rows={1}
                    style={{ resize: "none", overflow: "hidden" }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            if (!isLoading) {
                                handleSubmit();
                            } else {
                                cancelRequest();
                            }
                        }
                    }}
                />
                <button
                    onClick={isLoading ? cancelRequest : handleSubmit}
                    disabled={!prompt && !isLoading}
                    className="submit-button"
                    aria-label={isLoading ? "Cancel" : "Submit"}
                >
                    {isLoading ? (
                        <div className="spinner"></div>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    )}
                </button>
            </div>
            <span
                className="clear-history"
                onClick={() => setShowDetails(true)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && setShowDetails(true)}
                aria-expanded={showDetails}
                aria-label={translations[language].detailsToggle[showDetails ? 'open' : 'closed']}
            >
                {translations[language].detailsToggle[showDetails ? 'open' : 'closed']}
            </span>
            {showDetails && (
                <div className="modal">
                    <div className="modal-header">
                        <span className="modal-title">{translations[language].modalTitle}</span>
                        <span
                            className="modal-close"
                            onClick={() => setShowDetails(false)}
                            role="button"
                            tabIndex={0}
                            onKeyPress={(e) => e.key === 'Enter' && setShowDetails(false)}
                            aria-label="Close"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </span>
                    </div>
                    <div className="modal-content">
                        <input
                            className="modal-input"
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder={translations[language].namePlaceholder}
                        />
                        <select
                            className="modal-select"
                            value={tempCountry}
                            onChange={(e) => { setTempCountry(e.target.value); setTempCity(''); }}
                        >
                            <option value="">{translations[language].countryPlaceholder}</option>
                            {countries.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            className="modal-select"
                            value={tempCity}
                            onChange={(e) => setTempCity(e.target.value)}
                            disabled={!tempCountry}
                        >
                            <option value="">{translations[language].cityPlaceholder}</option>
                            {(citiesByCountry[tempCountry] || []).map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="modal-footer">
                        <button
                            onClick={saveData}
                            className="modal-button"
                            aria-label={translations[language].save}
                        >
                            {translations[language].save}
                        </button>
                        <button
                            onClick={resetData}
                            className="modal-button"
                            aria-label={translations[language].reset}
                        >
                            {translations[language].reset}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
