const threadsRef = React.createRef([]);
threadsRef.current = [];

function App() {
    const [currentPage, setCurrentPage] = React.useState('about');
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [shareModalOpen, setShareModalOpen] = React.useState(false);
    const [language, setLanguage] = React.useState('ru');

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
            modalTitle: "User Details",
            canvasError: "Cannot download or share an empty canvas."
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
            modalTitle: "Данные пользователя",
            canvasError: "Невозможно скачать или поделиться пустым холстом."
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
            modalTitle: "Detalles del usuario",
            canvasError: "No se puede descargar ni compartir un lienzo vacío."
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
                            Feminist Gobelin — это цифровая платформа, посвящённая повышению осведомлённости о феминизме и гендерном равенстве. Наша миссия — предоставить безопасное пространство для обучения, создания дата-арта на основе ваших вопросов и поддержки инициатив против домашнего насилия. Присоединяйтесь, чтобы исследовать, создавать и способствовать более справедливому миру.
                        </p>
                    </div>
                )}
                {currentPage === 'instructions' && (
                    <div className="page">
                        <h1>{pages.instructions[language] || pages.instructions.name}</h1>
                        <p>
                            Если вы или кто-то из ваших знакомых сталкивается с домашним насилием, вот шаги для получения помощи:
                            <ul style={{ textAlign: 'left', margin: '16px 0' }}>
                                <li>Обратитесь в экстренные службы (например, 112 в ЕС, 102 в Украине или местные аналоги).</li>
                                <li>Свяжитесь с местными приютами или горячими линиями (например, Национальная горячая линия по предотвращению домашнего насилия в Украине: 0 800 500 335).</li>
                                <li>Безопасно документируйте инциденты для юридических целей.</li>
                                <li>Обратитесь за поддержкой к доверенным друзьям или семье.</li>
                                <li>Изучите юридические возможности, такие как запретительные ордера.</li>
                            </ul>
                            Всегда ставьте свою безопасность на первое место и обращайтесь за профессиональной помощью.
                        </p>
                    </div>
                )}
                {currentPage === 'myGobelin' && <MyGobelin threadsRef={threadsRef} language={language} translations={translations} setShareModalOpen={setShareModalOpen} />}
                {currentPage === 'aiChat' && <AIChat threadsRef={threadsRef} language={language} translations={translations} />}
                {currentPage === 'socials' && (
                    <div className="page">
                        <h1>{pages.socials[language] || pages.socials.name}</h1>
                        <p>
                            Подключайтесь к нам в социальных сетях, чтобы оставаться в курсе и присоединиться к разговору:
                            <div className="footer-socials" style={{ marginTop: '16px' }}>
                                <a href="https://twitter.com/feministgobelin" target="_blank" rel="noopener noreferrer">Twitter</a>
                                <a href="https://instagram.com/feministgobelin" target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a href="https://facebook.com/feministgobelin" target="_blank" rel="noopener noreferrer">Facebook</a>
                            </div>
                            Email: contact@feministgobelin.org
                            <br />
                            Телефон: +1-555-123-4567
                        </p>
                    </div>
                )}
                {currentPage === 'support' && (
                    <div className="page">
                        <h1>{pages.support[language] || pages.support.name}</h1>
                        <p>
                            Вы можете поддержать Feminist Gobelin следующими способами:
                            <ul style={{ textAlign: 'left', margin: '16px 0' }}>
                                <li>Пожертвуйте через нашу платформу: <a href="https://patreon.com/feministgobelin" target="_blank" rel="noopener noreferrer">Patreon</a></li>
                                <li>Предложите свои навыки (свяжитесь с нами: volunteer@feministgobelin.org).</li>
                                <li>Распространите информацию, поделившись нашей миссией в соцсетях.</li>
                            </ul>
                            Ваша поддержка помогает нам продолжать работу по продвижению гендерного равенства.
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
                    Email: contact@feministgobelin.org | Телефон: +1-555-123-4567
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
                            aria-label="Закрыть"
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
                                        title: 'Мой феминистский гобелен',
                                        text: 'Посмотрите мой уникальный дата-арт гобелен, созданный с Feminist Gobelin!',
                                        url: 'https://feminist-gobelin-site.netlify.app'
                                    }).then(() => setShareModalOpen(false));
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                                Поделиться через нативный шаринг
                            </button>
                        ) : (
                            <>
                                <button
                                    className="share-button"
                                    onClick={() => {
                                        navigator.clipboard.writeText('https://feminist-gobelin-site.netlify.app');
                                        alert(translations[language].copy + '!');
                                        setShareModalOpen(false);
                                    }}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Скопировать ссылку
                                </button>
                                <a
                                    href="https://twitter.com/intent/tweet?text=Посмотрите%20мой%20Феминистский%20Гобелен!&url=https://feminist-gobelin-site.netlify.app"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="share-button"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                                    </svg>
                                    Поделиться в Twitter
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
                                    Поделиться в Facebook
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
    const animationFrameRef = React.useRef(null);

    const createTexture = (material, ctx, color, texture) => {
        console.log('Creating texture for material:', material, 'with color:', color, 'and texture:', texture);
        const textureCanvas = document.createElement('canvas');
        textureCanvas.width = 100;
        textureCanvas.height = 100;
        const tCtx = textureCanvas.getContext('2d');
        tCtx.fillStyle = color;
        tCtx.fillRect(0, 0, 100, 100);

        if (material === 'wool') {
            if (texture.includes('грубая') || texture.includes('шероховатая')) {
                tCtx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                for (let i = 0; i < 100; i += 5) {
                    tCtx.beginPath();
                    tCtx.arc(i, 50 + Math.random() * 10, 1, 0, Math.PI * 2);
                    tCtx.fill();
                }
            }
            if (texture.includes('с узелками')) {
                tCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                for (let i = 0; i < 100; i += 10) {
                    tCtx.fillRect(i, 50, 3, 3);
                }
            }
            if (texture.includes('спутанная')) {
                tCtx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                for (let i = 0; i < 100; i += 5) {
                    tCtx.beginPath();
                    tCtx.moveTo(i, 50);
                    tCtx.lineTo(i + Math.random() * 10, 50 + Math.random() * 10);
                    tCtx.stroke();
                }
            }
        } else if (material === 'linen') {
            if (texture.includes('жёсткий') || texture.includes('грубая')) {
                tCtx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
                for (let i = 0; i < 100; i += 5) {
                    tCtx.beginPath();
                    tCtx.moveTo(i, 0);
                    tCtx.lineTo(i, 100);
                    tCtx.stroke();
                }
            }
            if (texture.includes('с пятнами')) {
                tCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                for (let i = 0; i < 5; i++) {
                    tCtx.fillRect(Math.random() * 90, Math.random() * 90, 10, 10);
                }
            }
            if (texture.includes('с узлами')) {
                tCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                for (let i = 0; i < 100; i += 15) {
                    tCtx.fillRect(i, 50, 4, 4);
                }
            }
        } else if (material === 'cotton') {
            if (texture.includes('мягкий') || texture.includes('гладкая')) {
                tCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                for (let i = 0; i < 100; i += 5) {
                    for (let j = 0; j < 100; j += 5) {
                        tCtx.fillRect(i, j, 2, 2);
                    }
                }
            }
            if (texture.includes('изношенный') || texture.includes('потёртая')) {
                tCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                for (let i = 0; i < 5; i++) {
                    tCtx.fillRect(Math.random() * 90, Math.random() * 90, 8, 8);
                }
            }
            if (texture.includes('рыхлая')) {
                tCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
                for (let i = 0; i < 100; i += 10) {
                    tCtx.fillRect(i, 50, 5, 5);
                }
            }
            if (texture.includes('хрупкая')) {
                tCtx.globalAlpha = 0.5;
                tCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                tCtx.fillRect(0, 0, 100, 100);
            }
        } else if (material === 'silk') {
            if (texture.includes('гладкая') || texture.includes('струящаяся')) {
                tCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                tCtx.fillRect(0, 0, 100, 50);
            }
            if (texture.includes('мятый')) {
                tCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                for (let i = 0; i < 100; i += 10) {
                    tCtx.beginPath();
                    tCtx.moveTo(i, 0);
                    tCtx.lineTo(i + 5, 100);
                    tCtx.stroke();
                }
            }
            if (texture.includes('липкая')) {
                tCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                for (let i = 0; i < 5; i++) {
                    tCtx.fillRect(Math.random() * 90, Math.random() * 90, 6, 6);
                }
            }
            if (texture.includes('тяжёлая')) {
                tCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                tCtx.fillRect(0, 0, 100, 100);
            }
        } else if (material === 'synthetic') {
            if (texture.includes('гладкая') || texture.includes('скользкая')) {
                tCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                tCtx.fillRect(0, 0, 100, 50);
            }
            if (texture.includes('жёсткая') || texture.includes('ломкая')) {
                tCtx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                for (let i = 0; i < 100; i += 8) {
                    tCtx.beginPath();
                    tCtx.moveTo(i, 0);
                    tCtx.lineTo(i, 100);
                    tCtx.stroke();
                }
            }
            if (texture.includes('спутанная')) {
                tCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                for (let i = 0; i < 100; i += 5) {
                    tCtx.beginPath();
                    tCtx.moveTo(i, 50);
                    tCtx.lineTo(i + Math.random() * 10, 50 + Math.random() * 10);
                    tCtx.stroke();
                }
            }
        } else if (material === 'velvet') {
            tCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
            for (let i = 0; i < 100; i += 5) {
                tCtx.fillRect(i, 50, 2, 2);
            }
            if (texture.includes('потёртый')) {
                tCtx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                for (let i = 0; i < 5; i++) {
                    tCtx.fillRect(Math.random() * 90, Math.random() * 90, 8, 8);
                }
            }
        } else if (material === 'burlap') {
            tCtx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            for (let i = 0; i < 100; i += 5) {
                tCtx.beginPath();
                tCtx.moveTo(i, 0);
                tCtx.lineTo(i, 100);
                tCtx.stroke();
                tCtx.beginPath();
                tCtx.moveTo(0, i);
                tCtx.lineTo(100, i);
                tCtx.stroke();
            }
            if (texture.includes('с комками')) {
                tCtx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                for (let i = 0; i < 100; i += 15) {
                    tCtx.fillRect(i, 50, 4, 4);
                }
            }
        }

        return ctx.createPattern(textureCanvas, 'repeat');
    };

    const keywordRules = {
        // Группа 1: Тяжёлые, триггерные слова
        'насилие': { color: '#8B0000', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'knotty' },
        'сексуализированное': { color: '#4B0082', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'rough' },
        'травма': { color: '#2F4F4F', thickness: 18, material: 'cotton', shape: 'horizontal', effect: 'torn' },
        'страх': { color: '#4682B4', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'slippery' },
        'вина': { color: '#708090', thickness: 18, material: 'silk', shape: 'horizontal', effect: 'sticky' },
        'стыд': { color: '#5C4033', thickness: 18, material: 'burlap', shape: 'horizontal', effect: 'lumpy' },
        'беспомощность': { color: '#D3D3D3', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'fragile' },
        'агрессия': { color: '#FF0000', thickness: 18, material: 'synthetic', shape: 'horizontal', effect: 'sharp' },
        'унижение': { color: '#B8860B', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'stained' },
        'жертва': { color: '#4B0082', thickness: 12, material: 'velvet', shape: 'horizontal', effect: 'worn' },

        // Группа 2: Слова, связанные с отсутствием согласия
        'секс': { color: '#C71585', thickness: 12, material: 'silk', shape: 'horizontal', effect: 'torn' },
        'согласие': { color: '#98FB98', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'smooth' },
        'нет': { color: '#000000', thickness: 18, material: 'linen', shape: 'horizontal', effect: 'knotty' },
        'принуждение': { color: '#00008B', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'brittle' },
        'игнорирование': { color: '#87CEEB', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'faded' },
        'проникновение': { color: '#A52A2A', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'knotty' },
        'отказ': { color: '#696969', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'rough' },
        'сопротивление': { color: '#FF4500', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'resilient' },

        // Группа 3: Эмоциональные и психологические слова
        'плач': { color: '#ADD8E6', thickness: 8, material: 'silk', shape: 'wave', effect: 'wet' },
        'слёзы': { color: '#E6E6FA', thickness: 4, material: 'silk', shape: 'wave', effect: 'transparent' },
        'оцепенение': { color: '#E6E6FA', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'fluffy' },
        'манипуляция': { color: '#006400', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'sticky' },
        'ретравиатизация': { color: '#800080', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'tangled' },
        'виктимблейминг': { color: '#FF8C00', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'stained' },
        'слатшейминг': { color: '#DAA520', thickness: 12, material: 'burlap', shape: 'horizontal', effect: 'knotty' },
        'обвинение': { color: '#8B4513', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'frayed' },

        // Группа 4: Позитивные и восстановительные слова
        'поддержка': { color: '#FFC107', thickness: 12, material: 'wool', shape: 'horizontal', effect: 'fluffy' },
        'исцеление': { color: '#00FF7F', thickness: 8, material: 'silk', shape: 'wave', effect: 'smooth' },
        'справедливость': { color: '#FFFFFF', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'resilient' },
        'помощь': { color: '#87CEFA', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'smooth' },
        'феминизм': { color: '#E6E6FA', thickness: 8, material: 'silk', shape: 'wave', effect: 'smooth' },
        'сестры': { color: '#FFB6C1', thickness: 12, material: 'wool', shape: 'horizontal', effect: 'fluffy' },
        'свобода': { color: '#87CEEB', thickness: 8, material: 'silk', shape: 'wave', effect: 'flowing' },

        // Группа 5: Контекстуальные и социальные слова
        'семья': { color: '#8B4513', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'resilient' },
        'родители': { color: '#F5F5DC', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'knotty' },
        'брат': { color: '#8B5A2B', thickness: 12, material: 'wool', shape: 'horizontal', effect: 'rough' },
        'свекровь': { color: '#FF4500', thickness: 18, material: 'linen', shape: 'horizontal', effect: 'rough' },
        'муж': { color: '#5C4033', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'knotty' },
        'квартира': { color: '#808080', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'faded' },
        'вечеринка': { color: '#FF69B4', thickness: 8, material: 'synthetic', shape: 'wave', effect: 'sticky' },
        'переписка': { color: '#D3D3D3', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'fragile' },
        'алкоголь': { color: '#8B0000', thickness: 12, material: 'silk', shape: 'horizontal', effect: 'stained' },
        'угроза': { color: '#4B0082', thickness: 18, material: 'synthetic', shape: 'horizontal', effect: 'sharp' },
        'суд': { color: '#2F4F4F', thickness: 18, material: 'linen', shape: 'horizontal', effect: 'resilient' },
        'анонимность': { color: '#00008B', thickness: 12, material: 'silk', shape: 'horizontal', effect: 'heavy' },
        'история': { color: '#F5F5DC', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'smooth' },
        'свидетельство': { color: '#FFF8DC', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'resilient' },
        'чат': { color: '#D3D3D3', thickness: 8, material: 'synthetic', shape: 'horizontal', effect: 'smooth' },

        // Группа 6: Физические и поведенческие слова
        'поцелуй': { color: '#FF4040', thickness: 8, material: 'silk', shape: 'wave', effect: 'sticky' },
        'минет': { color: '#C71585', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'slippery' },
        'боль': { color: '#FF0000', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'knotty' },
        'синяки': { color: '#483D8B', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'stained' },
        'крики': { color: '#FF4500', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'sharp' },
        'вспыльчивость': { color: '#FF4500', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'rough' },
        'непредсказуемость': { color: '#808080', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'tangled' },
        'шантаж': { color: '#000000', thickness: 18, material: 'linen', shape: 'horizontal', effect: 'frayed' },
        'оскорбление': { color: '#B8860B', thickness: 12, material: 'burlap', shape: 'horizontal', effect: 'stained' },
        'насмешка': { color: '#DAA520', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'faded' },

        // Группа 7: Прочие слова
        'самообвинение': { color: '#8B4513', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'knotty' },
        'серьёзность': { color: '#2F4F4F', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'heavy' },
        'влюблённость': { color: '#FFB6C1', thickness: 8, material: 'silk', shape: 'wave', effect: 'flowing' },
        'общение': { color: '#F5F5DC', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'smooth' },
        'деньги': { color: '#FFD700', thickness: 8, material: 'synthetic', shape: 'horizontal', effect: 'smooth' },
        'контроль': { color: '#006400', thickness: 18, material: 'linen', shape: 'horizontal', effect: 'resilient' },
        'безопасность': { color: '#FFFFFF', thickness: 8, material: 'silk', shape: 'horizontal', effect: 'smooth' },
        'дети': { color: '#FFFFE0', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'fluffy' },
        'школьница': { color: '#FFE4E1', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'fragile' },
        'подростки': { color: '#00FF00', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'resilient' },
        'дисциплина': { color: '#00008B', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'resilient' },
        'бдсм': { color: '#4B0082', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'knotty' },
        'фетиш': { color: '#800080', thickness: 8, material: 'silk', shape: 'horizontal', effect: 'sticky' }
    };

    React.useEffect(() => {
        const savedThreads = localStorage.getItem('threads');
        if (savedThreads) {
            const parsedThreads = JSON.parse(savedThreads);
            threadsRef.current = parsedThreads;
            setThreads(parsedThreads);
            console.log('Loaded threads from localStorage:', parsedThreads);
        }
    }, []);

    const createThread = (rule, existingThreads) => {
        const totalHeight = existingThreads.reduce((sum, thread) => sum + thread.thickness, 0);
        const yPos = 50 + totalHeight;
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
            if (thread.progress < 1) {
                thread.progress = Math.min(thread.progress + 0.02, 1);
                thread.opacity = Math.min(thread.opacity + 0.02, 1);
                hasAnimatingThreads = true;
            } else {
                thread.opacity = 1;
            }
            drawThread(ctx, thread);
        });
        if (hasAnimatingThreads) {
            animationFrameRef.current = requestAnimationFrame(() => animateThreads(ctx));
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
        const texture = createTexture(thread.material, ctx, thread.color, thread.effect);

        // Применение эффектов
        if (thread.effect === 'knotty') {
            ctx.strokeStyle = texture;
            ctx.setLineDash([10, 5]);
        } else if (thread.effect === 'rough') {
            ctx.strokeStyle = texture;
            ctx.lineCap = 'square';
        } else if (thread.effect === 'torn') {
            ctx.strokeStyle = texture;
            ctx.setLineDash([5, 10]);
        } else if (thread.effect === 'slippery') {
            ctx.strokeStyle = texture;
            ctx.globalAlpha = thread.opacity * 0.8;
        } else if (thread.effect === 'sticky') {
            ctx.strokeStyle = texture;
            ctx.globalAlpha = thread.opacity * 0.9;
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        } else if (thread.effect === 'lumpy') {
            ctx.strokeStyle = texture;
            ctx.setLineDash([15, 5]);
        } else if (thread.effect === 'fragile') {
            ctx.strokeStyle = texture;
            ctx.globalAlpha = thread.opacity * 0.5;
        } else if (thread.effect === 'sharp') {
            ctx.strokeStyle = texture;
            ctx.lineCap = 'square';
            ctx.setLineDash([10, 10]);
        } else if (thread.effect === 'stained') {
            ctx.strokeStyle = texture;
            ctx.globalAlpha = thread.opacity * 0.7;
        } else if (thread.effect === 'worn') {
            ctx.strokeStyle = texture;
            ctx.globalAlpha = thread.opacity * 0.6;
        } else if (thread.effect === 'smooth') {
            ctx.strokeStyle = texture;
            ctx.lineCap = 'round';
        } else if (thread.effect === 'fluffy') {
            ctx.strokeStyle = texture;
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
        } else if (thread.effect === 'resilient') {
            ctx.strokeStyle = texture;
            ctx.lineWidth = thread.thickness * 1.2;
        } else if (thread.effect === 'brittle') {
            ctx.strokeStyle = texture;
            ctx.setLineDash([5, 15]);
        } else if (thread.effect === 'faded') {
            ctx.strokeStyle = texture;
            ctx.globalAlpha = thread.opacity * 0.6;
        } else if (thread.effect === 'wet') {
            ctx.strokeStyle = texture;
            ctx.globalAlpha = thread.opacity * 0.7;
            ctx.shadowBlur = 5;
            ctx.shadowColor = 'rgba(0, 0, 255, 0.2)';
        } else if (thread.effect === 'transparent') {
            ctx.strokeStyle = texture;
            ctx.globalAlpha = thread.opacity * 0.3;
        } else if (thread.effect === 'flowing') {
            ctx.strokeStyle = texture;
            ctx.lineCap = 'round';
            ctx.globalAlpha = thread.opacity * 0.8;
        } else if (thread.effect === 'tangled') {
            ctx.strokeStyle = texture;
            ctx.setLineDash([10, 5]);
            ctx.lineCap = 'square';
        } else if (thread.effect === 'heavy') {
            ctx.strokeStyle = texture;
            ctx.lineWidth = thread.thickness * 1.5;
        } else if (thread.effect === 'frayed') {
            ctx.strokeStyle = texture;
            ctx.setLineDash([5, 10]);
            ctx.globalAlpha = thread.opacity * 0.7;
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
        }
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        ctx.lineCap = 'butt';
        ctx.setLineDash([]);
        ctx.strokeStyle = thread.color;
        ctx.fillStyle = thread.color;
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
            threads.forEach(thread => {
                thread.endX = window.innerWidth - 50;
            });
            animateThreads(ctx);
        };
        window.addEventListener('resize', handleResize);

        animateThreads(ctx);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [threads]);

    React.useEffect(() => {
        if (threadsRef.current.length !== threads.length || threadsRef.current.some((t, i) => t !== threads[i])) {
            console.log('Updating threads state:', threadsRef.current);
            setThreads([...threadsRef.current]);
            localStorage.setItem('threads', JSON.stringify(threadsRef.current));
        }
    }, [threadsRef.current]);

    const checkCanvasContent = (canvas) => {
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] !== 0) {
                return true;
            }
        }
        return false;
    };

    return (
        <div className="page">
            <h1>{translations[language].myGobelin || 'Мой гобелен'}</h1>
            <div className="gobelin-buttons">
                <button
                    className="gobelin-button"
                    onClick={() => {
                        const canvas = canvasRef.current;
                        if (!canvas) {
                            console.error('Canvas not available for download');
                            alert(translations[language].canvasError);
                            return;
                        }
                        if (!checkCanvasContent(canvas)) {
                            console.error('Canvas is empty, cannot download');
                            alert(translations[language].canvasError);
                            return;
                        }
                        try {
                            const link = document.createElement('a');
                            link.href = canvas.toDataURL('image/png');
                            link.download = 'my-gobelin.png';
                            link.click();
                        } catch (error) {
                            console.error('Error downloading canvas:', error);
                            alert(translations[language].canvasError);
                        }
                    }}
                >
                    {translations[language].download}
                </button>
                <button
                    className="gobelin-button"
                    onClick={() => {
                        const canvas = canvasRef.current;
                        if (!canvas) {
                            console.error('Canvas not available for share');
                            alert(translations[language].canvasError);
                            return;
                        }
                        if (!checkCanvasContent(canvas)) {
                            console.error('Canvas is empty, cannot share');
                            alert(translations[language].canvasError);
                            return;
                        }
                        try {
                            canvas.toBlob(blob => {
                                if (!blob) {
                                    console.error('Failed to create blob from canvas');
                                    alert(translations[language].canvasError);
                                    return;
                                }
                                const file = new File([blob], 'my-gobelin.png', { type: 'image/png' });
                                if (navigator.share) {
                                    navigator.share({
                                        title: 'Мой феминистский гобелен',
                                        text: 'Посмотрите мой уникальный дата-арт гобелен, созданный с Feminist Gobelin!',
                                        files: [file]
                                    }).then(() => setShareModalOpen(false)).catch(error => {
                                        console.error('Error sharing canvas:', error);
                                        alert(translations[language].canvasError);
                                    });
                                } else {
                                    setShareModalOpen(true);
                                }
                            }, 'image/png');
                        } catch (error) {
                            console.error('Error creating blob for sharing:', error);
                            alert(translations[language].canvasError);
                        }
                    }}
                >
                    {translations[language].share}
                </button>
            </div>
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 1, backgroundColor: '#f0f0f0' }}></canvas>
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
        'насилие': { color: '#8B0000', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'knotty' },
        'сексуализированное': { color: '#4B0082', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'rough' },
        'травма': { color: '#2F4F4F', thickness: 18, material: 'cotton', shape: 'horizontal', effect: 'torn' },
        'страх': { color: '#4682B4', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'slippery' },
        'вина': { color: '#708090', thickness: 18, material: 'silk', shape: 'horizontal', effect: 'sticky' },
        'стыд': { color: '#5C4033', thickness: 18, material: 'burlap', shape: 'horizontal', effect: 'lumpy' },
        'беспомощность': { color: '#D3D3D3', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'fragile' },
        'агрессия': { color: '#FF0000', thickness: 18, material: 'synthetic', shape: 'horizontal', effect: 'sharp' },
        'унижение': { color: '#B8860B', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'stained' },
        'жертва': { color: '#4B0082', thickness: 12, material: 'velvet', shape: 'horizontal', effect: 'worn' },
        'секс': { color: '#C71585', thickness: 12, material: 'silk', shape: 'horizontal', effect: 'torn' },
        'согласие': { color: '#98FB98', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'smooth' },
        'нет': { color: '#000000', thickness: 18, material: 'linen', shape: 'horizontal', effect: 'knotty' },
        'принуждение': { color: '#00008B', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'brittle' },
        'игнорирование': { color: '#87CEEB', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'faded' },
        'проникновение': { color: '#A52A2A', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'knotty' },
        'отказ': { color: '#696969', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'rough' },
        'сопротивление': { color: '#FF4500', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'resilient' },
        'плач': { color: '#ADD8E6', thickness: 8, material: 'silk', shape: 'wave', effect: 'wet' },
        'слёзы': { color: '#E6E6FA', thickness: 4, material: 'silk', shape: 'wave', effect: 'transparent' },
        'оцепенение': { color: '#E6E6FA', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'fluffy' },
        'манипуляция': { color: '#006400', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'sticky' },
        'ретравиатизация': { color: '#800080', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'tangled' },
        'виктимблейминг': { color: '#FF8C00', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'stained' },
        'слатшейминг': { color: '#DAA520', thickness: 12, material: 'burlap', shape: 'horizontal', effect: 'knotty' },
        'обвинение': { color: '#8B4513', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'frayed' },
        'поддержка': { color: '#FFC107', thickness: 12, material: 'wool', shape: 'horizontal', effect: 'fluffy' },
        'исцеление': { color: '#00FF7F', thickness: 8, material: 'silk', shape: 'wave', effect: 'smooth' },
        'справедливость': { color: '#FFFFFF', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'resilient' },
        'помощь': { color: '#87CEFA', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'smooth' },
        'феминизм': { color: '#E6E6FA', thickness: 8, material: 'silk', shape: 'wave', effect: 'smooth' },
        'сестры': { color: '#FFB6C1', thickness: 12, material: 'wool', shape: 'horizontal', effect: 'fluffy' },
        'свобода': { color: '#87CEEB', thickness: 8, material: 'silk', shape: 'wave', effect: 'flowing' },
        'семья': { color: '#8B4513', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'resilient' },
        'родители': { color: '#F5F5DC', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'knotty' },
        'брат': { color: '#8B5A2B', thickness: 12, material: 'wool', shape: 'horizontal', effect: 'rough' },
        'свекровь': { color: '#FF4500', thickness: 18, material: 'linen', shape: 'horizontal', effect: 'rough' },
        'муж': { color: '#5C4033', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'knotty' },
        'квартира': { color: '#808080', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'faded' },
        'вечеринка': { color: '#FF69B4', thickness: 8, material: 'synthetic', shape: 'wave', effect: 'sticky' },
        'переписка': { color: '#D3D3D3', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'fragile' },
        'алкоголь': { color: '#8B0000', thickness: 12, material: 'silk', shape: 'horizontal', effect: 'stained' },
        'угроза': { color: '#4B0082', thickness: 18, material: 'synthetic', shape: 'horizontal', effect: 'sharp' },
        'суд': { color: '#2F4F4F', thickness: 18, material: 'linen', shape: 'horizontal', effect: 'resilient' },
        'анонимность': { color: '#00008B', thickness: 12, material: 'silk', shape: 'horizontal', effect: 'heavy' },
        'история': { color: '#F5F5DC', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'smooth' },
        'свидетельство': { color: '#FFF8DC', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'resilient' },
        'чат': { color: '#D3D3D3', thickness: 8, material: 'synthetic', shape: 'horizontal', effect: 'smooth' },
        'поцелуй': { color: '#FF4040', thickness: 8, material: 'silk', shape: 'wave', effect: 'sticky' },
        'минет': { color: '#C71585', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'slippery' },
        'боль': { color: '#FF0000', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'knotty' },
        'синяки': { color: '#483D8B', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'stained' },
        'крики': { color: '#FF4500', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'sharp' },
        'вспыльчивость': { color: '#FF4500', thickness: 18, material: 'wool', shape: 'horizontal', effect: 'rough' },
        'непредсказуемость': { color: '#808080', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'tangled' },
        'шантаж': { color: '#000000', thickness: 18, material: 'linen', shape: 'horizontal', effect: 'frayed' },
        'оскорбление': { color: '#B8860B', thickness: 12, material: 'burlap', shape: 'horizontal', effect: 'stained' },
        'насмешка': { color: '#DAA520', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'faded' },
        'самообвинение': { color: '#8B4513', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'knotty' },
        'серьёзность': { color: '#2F4F4F', thickness: 12, material: 'cotton', shape: 'horizontal', effect: 'heavy' },
        'влюблённость': { color: '#FFB6C1', thickness: 8, material: 'silk', shape: 'wave', effect: 'flowing' },
        'общение': { color: '#F5F5DC', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'smooth' },
        'деньги': { color: '#FFD700', thickness: 8, material: 'synthetic', shape: 'horizontal', effect: 'smooth' },
        'контроль': { color: '#006400', thickness: 18, material: 'linen', shape: 'horizontal', effect: 'resilient' },
        'безопасность': { color: '#FFFFFF', thickness: 8, material: 'silk', shape: 'horizontal', effect: 'smooth' },
        'дети': { color: '#FFFFE0', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'fluffy' },
        'школьница': { color: '#FFE4E1', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'fragile' },
        'подростки': { color: '#00FF00', thickness: 8, material: 'cotton', shape: 'horizontal', effect: 'resilient' },
        'дисциплина': { color: '#00008B', thickness: 12, material: 'linen', shape: 'horizontal', effect: 'resilient' },
        'бдсм': { color: '#4B0082', thickness: 12, material: 'synthetic', shape: 'horizontal', effect: 'knotty' },
        'фетиш': { color: '#800080', thickness: 8, material: 'silk', shape: 'horizontal', effect: 'sticky' }
    };

    const saveData = () => {
        setName(tempName);
        setCountry(tempCountry);
        setCity(tempCity);
        localStorage.setItem('name', tempName);
        localStorage.setItem('country', tempCountry);
        localStorage.setItem('city', tempCity);
        setShowDetails(false);
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
        alert(translations[language].copy + '!');
    };

    const shareResponse = (content) => {
        const shareText = `${content}\n\nСоздано с Feminist Gobelin: https://feminist-gobelin-site.netlify.app`;
        navigator.clipboard.writeText(shareText);
        alert(translations[language].share + ' скопировано!');
    };

    const regenerateResponse = async (index) => {
        const promptMessage = messages[index - 1];
        if (!promptMessage || promptMessage.role !== 'user') return;
        setIsLoading(true);
        try {
            const keywords = Object.keys(keywordRules).filter(k => promptMessage.content.toLowerCase().includes(k));
            console.log('Regenerate keywords found:', keywords);
            keywords.forEach(keyword => {
                const thread = createThread(keywordRules[keyword], threadsRef.current);
                threadsRef.current.push(thread);
            });
            localStorage.setItem('threads', JSON.stringify(threadsRef.current));
            const res = await fetch('https://SlavaYZMA-feminist-gobelin-server.hf.space/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, name, country, city, prompt: promptMessage.content })
            });
            const data = await res.json();
            let responseText = data.response || 'Нет ответа.';
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
            console.error('Ошибка:', error);
            const newMessages = [...messages];
            newMessages[index] = { role: 'assistant', content: translations[language].errorResponse, timestamp: new Date().toLocaleString() };
            setMessages(newMessages);
            localStorage.setItem('chatHistory', JSON.stringify(newMessages));
        } finally {
            setIsLoading(false);
        }
    };

    const createThread = (rule, existingThreads) => {
        const totalHeight = existingThreads.reduce((sum, thread) => sum + thread.thickness, 0);
        const yPos = 50 + totalHeight;
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
            console.log('Найдены ключевые слова:', keywords);
            keywords.forEach(keyword => {
                const thread = createThread(keywordRules[keyword], threadsRef.current);
                threadsRef.current.push(thread);
            });
            localStorage.setItem('threads', JSON.stringify(threadsRef.current));
            const res = await fetch('https://SlavaYZMA-feminist-gobelin-server.hf.space/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, name, country, city, prompt })
            });
            const data = await res.json();
            let responseText = data.response || 'Нет ответа.';
            if (responseText.startsWith(fullPrompt)) {
                responseText = responseText.substring(fullPrompt.length).trim();
            }
            if (responseText.length < 10 || responseText.includes('What is it about')) {
                responseText = translations[language].fallbackResponse;
            }
            const newMessages = [...messages, { role: 'user', content: prompt, fullPrompt, timestamp }, { role: 'assistant', content: responseText, timestamp: new Date().toLocaleString() }];
            setMessages(newMessages);
            localStorage.setItem('chatHistory', JSON.stringify(newMessages));
        } catch (error) {
            console.error('Ошибка:', error);
            const newMessages = [...messages, { role: 'user', content: prompt, fullPrompt, timestamp }, { role: 'assistant', content: translations[language].errorResponse, timestamp: new Date().toLocaleString() }];
            setMessages(newMessages);
            localStorage.setItem('chatHistory', JSON.stringify(newMessages));
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="page chat-page">
            <h1>{translations[language].aiChat || 'AI чат'}</h1>
            <div className="details-toggle" onClick={() => setShowDetails(!showDetails)}>
                {translations[language].detailsToggle[showDetails ? 'open' : 'closed']}
            </div>
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
                            aria-label="Закрыть"
                        >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </span>
                    </div>
                    <div
