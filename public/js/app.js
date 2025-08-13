function App() {
    const [currentPage, setCurrentPage] = React.useState('about');
    const [menuOpen, setMenuOpen] = React.useState(false);
    const [shareModalOpen, setShareModalOpen] = React.useState(false);

    const pages = {
        about: { name: 'About', ru: 'О проекте', es: 'Acerca de' },
        instructions: { name: 'Instructions', ru: 'Инструкции', es: 'Instrucciones' },
        myGobelin: { name: 'My Gobelin', ru: 'Мой гобелен', es: 'Mi Gobelino' },
        socials: { name: 'Socials', ru: 'Соцсети', es: 'Redes Sociales' },
        support: { name: 'Support', ru: 'Поддержать', es: 'Apoyar' }
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
                        {pages[page].name}
                    </div>
                ))}
                <button
                    className="menu-button"
                    onClick={() => {
                        const canvas = document.querySelector('canvas');
                        if (canvas) {
                            const link = document.createElement('a');
                            link.href = canvas.toDataURL('image/png');
                            link.download = 'my-gobelin.png';
                            link.click();
                        }
                    }}
                >
                    Download
                </button>
                <button
                    className="menu-button"
                    onClick={() => {
                        setShareModalOpen(true);
                        closeMenu();
                    }}
                >
                    Share
                </button>
            </div>
            <div className={`overlay ${menuOpen ? 'open' : ''}`} onClick={closeMenu}></div>
            <main className="content">
                {currentPage === 'about' && (
                    <div className="page">
                        <h1>About the Project</h1>
                        <p>
                            Feminist Gobelin is a digital platform dedicated to raising awareness about feminism and gender equality. Our mission is to provide a safe space for learning, creating data-art based on your questions, and supporting initiatives against domestic violence. Join us to explore, create, and contribute to a more equitable world.
                        </p>
                    </div>
                )}
                {currentPage === 'instructions' && (
                    <div className="page">
                        <h1>Instructions Against Domestic Violence</h1>
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
                {currentPage === 'myGobelin' && <MyGobelin />}
                {currentPage === 'socials' && (
                    <div className="page">
                        <h1>Socials</h1>
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
                        <h1>Support the Project</h1>
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
                            {pages[page].name}
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
                        <span className="modal-title">Share Your Gobelin</span>
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
                                        alert('Link copied!');
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

function MyGobelin() {
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
    const [language, setLanguage] = React.useState('en');
    const [editingIndex, setEditingIndex] = React.useState(null);
    const [editText, setEditText] = React.useState('');
    const canvasRef = React.useRef(null);
    const threadsRef = React.useRef([]);
    const abortControllerRef = React.useRef(null);
    const chatContainerRef = React.useRef(null);

    const translations = {
        en: {
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
            share: "Share",
            edit: "Edit",
            errorResponse: "An error occurred. Please try again later.",
            fallbackResponse: "Feminism is a movement advocating for equal rights and opportunities for women across social, political, and economic spheres. (Please verify information with official sources.)",
            modalTitle: "User Details"
        },
        ru: {
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
            share: "Поделиться",
            edit: "Редактировать",
            errorResponse: "Произошла ошибка. Пожалуйста, попробуйте снова.",
            fallbackResponse: "Феминизм — это движение за равные права и возможности для женщин в социальной, политической и экономической сферах. (Пожалуйста, проверьте информацию в официальных источниках.)",
            modalTitle: "Данные пользователя"
        },
        es: {
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
            share: "Compartir",
            edit: "Editar",
            errorResponse: "Ocurrió un error. Por favor, intenta de nuevo.",
            fallbackResponse: "El feminismo es un movimiento que aboga por los derechos y oportunidades iguales para las mujeres en las esferas social, política y económica. (Por favor, verifica la información con fuentes oficiales.)",
            modalTitle: "Detalles del usuario"
        }
    };

    const countries = [
        'Afghanistan', 'Albania', 'Argentina', 'Australia', 'Brazil',
        'Canada', 'China', 'France', 'Germany', 'India', 'Mexico',
        'Russia', 'Spain', 'United Kingdom', 'United States', 'Zimbabwe'
    ];
    const citiesByCountry = {
        'Afghanistan': ['Kabul', 'Kandahar', 'Herat'],
        'Albania': ['Tirana', 'Durrës', 'Vlorë'],
        'Argentina': ['Buenos Aires', 'Córdoba', 'Rosario'],
        'Australia': ['Sydney', 'Melbourne', 'Brisbane'],
        'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília'],
        'Canada': ['Toronto', 'Montreal', 'Vancouver'],
        'China': ['Beijing', 'Shanghai', 'Guangzhou'],
        'France': ['Paris', 'Marseille', 'Lyon'],
        'Germany': ['Berlin', 'Munich', 'Hamburg'],
        'India': ['Delhi', 'Mumbai', 'Bangalore'],
        'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey'],
        'Russia': ['Moscow', 'Saint Petersburg', 'Novosibirsk'],
        'Spain': ['Madrid', 'Barcelona', 'Valencia'],
        'United Kingdom': ['London', 'Manchester', 'Birmingham'],
        'United States': ['New York', 'Los Angeles', 'Chicago'],
        'Zimbabwe': ['Harare', 'Bulawayo', 'Chitungwiza']
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
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const clearHistory = () => {
        setMessages([]);
        localStorage.removeItem('chatHistory');
        threadsRef.current = [];
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
        abortControllerRef.current = new AbortController();
        try {
            const threadTypes = ['line', 'wave', 'text', 'pixels', 'fiber', 'glitch', 'spiral'];
            const type = threadTypes[Math.floor(Math.random() * threadTypes.length)];
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            drawThread(ctx, promptMessage.content, type);
            animateThreads(ctx);
            const res = await fetch('https://SlavaYZMA-feminist-gobelin-server.hf.space/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, name, country, city, prompt: promptMessage.content }),
                signal: abortControllerRef.current.signal
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
            if (error.name === 'AbortError') {
                threadsRef.current = [];
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                console.error('Error:', error);
                const newMessages = [...messages];
                newMessages[index] = { role: 'assistant', content: translations[language].errorResponse, timestamp: new Date().toLocaleString() };
                setMessages(newMessages);
                localStorage.setItem('chatHistory', JSON.stringify(newMessages));
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const detectEmotion = (text) => {
        const positive = ['support', 'help', 'love', 'joy', 'поддержка', 'помощь', 'любовь', 'радость', 'apoyo', 'ayuda', 'amor', 'alegría'];
        const negative = ['violence', 'fear', 'pain', 'насилие', 'страх', 'боль', 'violencia', 'miedo', 'dolor'];
        return positive.some(word => text.toLowerCase().includes(word)) ? 'positive' :
               negative.some(word => text.toLowerCase().includes(word)) ? 'negative' : 'neutral';
    };

    const drawThread = (ctx, input, type) => {
        const length = Math.min(input.length * 15, ctx.canvas.height);
        const emotion = detectEmotion(input);
        const isHorizontal = Math.random() > 0.5;
        const padding = 50;
        const startX = isHorizontal ? padding : Math.random() * (ctx.canvas.width - 2 * padding) + padding;
        const startY = isHorizontal ? Math.random() * (ctx.canvas.height - 2 * padding) + padding : padding;
        const endX = isHorizontal ? ctx.canvas.width - padding : startX;
        const endY = isHorizontal ? startY : length + padding;
        const color = emotion === 'positive' ? '#3b82f6' : emotion === 'negative' ? '#ec4899' : '#165DF5';
        const thickness = Math.min(input.length / 5, 6);
        let thread = { type, startX, startY, endX, endY, color, thickness, opacity: 0, progress: 0 };

        switch (type) {
            case 'line':
                thread = { ...thread, controlX: (startX + endX) / 2, controlY: (startY + endY) / 2 };
                break;
            case 'wave':
                thread = { ...thread, amplitude: 50 + Math.random() * 50, frequency: 0.02 + Math.random() * 0.03 };
                break;
            case 'text':
                thread = { ...thread, text: input.slice(0, 10), fontSize: 12 + input.length / 10 };
                break;
            case 'pixels':
                thread = { ...thread, particleCount: 20 + input.length * 2 };
                break;
            case 'fiber':
                thread = { ...thread, segments: 5 + Math.floor(input.length / 10) };
                break;
            case 'glitch':
                thread = { ...thread, glitchOffset: 5 + Math.random() * 10 };
                break;
            case 'spiral':
                thread = { ...thread, radius: 20 + input.length, turns: 2 + input.length / 20 };
                break;
        }

        threadsRef.current.push(thread);
        if (threadsRef.current.length > 30) {
            threadsRef.current.shift();
        }
    };

    const animateThreads = (ctx) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        threadsRef.current = threadsRef.current.filter(thread => thread.progress < 1);
        threadsRef.current.forEach((thread) => {
            thread.progress = Math.min(thread.progress + 0.02, 1);
            thread.opacity = thread.progress < 0.8 ? thread.progress : Math.max(1 - (thread.progress - 0.8) / 0.2, 0);
            ctx.globalAlpha = thread.opacity;

            ctx.beginPath();
            switch (thread.type) {
                case 'line':
                    ctx.moveTo(thread.startX, thread.startY);
                    ctx.quadraticCurveTo(thread.controlX, thread.controlY, thread.startX + (thread.endX - thread.startX) * thread.progress, thread.startY + (thread.endY - thread.startY) * thread.progress);
                    ctx.strokeStyle = thread.color;
                    ctx.lineWidth = thread.thickness;
                    ctx.stroke();
                    break;
                case 'wave':
                    ctx.moveTo(thread.startX, thread.startY);
                    for (let x = 0; x <= (thread.endX - thread.startX) * thread.progress; x += 5) {
                        const y = Math.sin(x * thread.frequency) * thread.amplitude;
                        ctx.lineTo(thread.startX + x, thread.startY + y);
                    }
                    ctx.strokeStyle = thread.color;
                    ctx.lineWidth = thread.thickness;
                    ctx.stroke();
                    break;
                case 'text':
                    ctx.font = `${thread.fontSize}px Inter`;
                    ctx.fillStyle = thread.color;
                    ctx.fillText(thread.text, thread.startX, thread.startY + (thread.endY - thread.startY) * thread.progress);
                    break;
                case 'pixels':
                    for (let i = 0; i < thread.particleCount; i++) {
                        const t = i / thread.particleCount;
                        if (t <= thread.progress) {
                            const x = thread.startX + (thread.endX - thread.startX) * t;
                            const y = thread.startY + (thread.endY - thread.startY) * t + (Math.random() - 0.5) * 10;
                            ctx.fillStyle = thread.color;
                            ctx.fillRect(x, y, thread.thickness / 2, thread.thickness / 2);
                        }
                    }
                    break;
                case 'fiber':
                    for (let i = 0; i < thread.segments; i++) {
                        const t = i / thread.segments;
                        if (t <= thread.progress) {
                            const x = thread.startX + (thread.endX - thread.startX) * t;
                            const y = thread.startY + (thread.endY - thread.startY) * t + (Math.random() - 0.5) * 5;
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(x + 5, y + 5);
                            ctx.strokeStyle = thread.color;
                            ctx.lineWidth = thread.thickness / 2;
                            ctx.stroke();
                        }
                    }
                    break;
                case 'glitch':
                    ctx.moveTo(thread.startX, thread.startY);
                    ctx.lineTo(thread.startX + (thread.endX - thread.startX) * thread.progress + (Math.random() - 0.5) * thread.glitchOffset, thread.startY + (thread.endY - thread.startY) * thread.progress);
                    ctx.strokeStyle = thread.color;
                    ctx.lineWidth = thread.thickness;
                    ctx.setLineDash([5, 5]);
                    ctx.stroke();
                    ctx.setLineDash([]);
                    break;
                case 'spiral':
                    ctx.moveTo(thread.startX, thread.startY);
                    for (let t = 0; t < thread.progress * thread.turns * 2 * Math.PI; t += 0.1) {
                        const r = thread.radius * t / (thread.turns * 2 * Math.PI);
                        const x = thread.startX + r * Math.cos(t);
                        const y = thread.startY + r * Math.sin(t);
                        ctx.lineTo(x, y);
                    }
                    ctx.strokeStyle = thread.color;
                    ctx.lineWidth = thread.thickness;
                    ctx.stroke();
                    break;
            }
            ctx.globalAlpha = 1;
        });
        if (threadsRef.current.length > 0) {
            requestAnimationFrame(() => animateThreads(ctx));
        }
    };

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);
        return () => window.addEventListener('resize', handleResize);
    }, []);

    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
        localStorage.setItem('chatHistory', JSON.stringify(messages));
    }, [messages]);

    const handleSubmit = async () => {
        if (!prompt) return;
        const timestamp = new Date().toLocaleString();
        const fullPrompt = name && city && country ? `${name} from ${city}, ${country}: ${prompt}` : prompt;
        setMessages([...messages, { role: 'user', content: prompt, fullPrompt, timestamp }]);
        setIsLoading(true);
        setPrompt('');
        abortControllerRef.current = new AbortController();
        try {
            const threadTypes = ['line', 'wave', 'text', 'pixels', 'fiber', 'glitch', 'spiral'];
            const type = threadTypes[Math.floor(Math.random() * threadTypes.length)];
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            drawThread(ctx, prompt, type);
            animateThreads(ctx);
            const res = await fetch('https://SlavaYZMA-feminist-gobelin-server.hf.space/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, name, country, city, prompt }),
                signal: abortControllerRef.current.signal
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
            if (error.name === 'AbortError') {
                setMessages(prev => prev.filter((_, i) => i !== prev.length - 1));
                threadsRef.current = [];
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            } else {
                console.error('Error:', error);
                setMessages(prev => [...prev, { role: 'assistant', content: translations[language].errorResponse, timestamp: new Date().toLocaleString() }]);
            }
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const cancelRequest = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            setIsLoading(false);
            setMessages(prev => prev.filter((_, i) => i !== prev.length - 1));
            threadsRef.current = [];
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    return (
        <div className="page">
            <h1>My Gobelin</h1>
            <select
                className="modal-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{ width: '150px', alignSelf: 'center' }}
            >
                <option value="en">English</option>
                <option value="ru">Русский</option>
                <option value="es">Español</option>
            </select>
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
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
