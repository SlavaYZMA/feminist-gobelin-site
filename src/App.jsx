import React from 'react';
import MyGobelin from './MyGobelin.js';
import AIChat from './AIChat.js';
import { translations, pages } from './config.js';

const threadsRef = React.createRef([]);
threadsRef.current = [];

function App() {
    const [currentPage, setCurrentPage] = React.useState('about');
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [shareModalOpen, setShareModalOpen] = React.useState(false);
    const [language, setLanguage] = React.useState('ru');

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

export default App;
