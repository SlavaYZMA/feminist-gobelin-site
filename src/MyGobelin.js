import React from 'react';
import { keywordRules } from './keywordRules.js';
import { translations } from './config.js';

function MyGobelin({ threadsRef, language }) {
    const canvasRef = React.useRef(null);
    const [mode, setMode] = React.useState('history'); // По умолчанию режим "Моя история"
    const [historyText, setHistoryText] = React.useState('');
    const [submittedHistory, setSubmittedHistory] = React.useState(localStorage.getItem('submittedHistory') || '');
    const [isEditing, setIsEditing] = React.useState(false);

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

    const handleSubmitHistory = () => {
        if (!historyText) return;
        setSubmittedHistory(historyText);
        localStorage.setItem('submittedHistory', historyText);
        const keywords = Object.keys(keywordRules).filter(k => historyText.toLowerCase().includes(k));
        console.log('History keywords found:', keywords);
        threadsRef.current = [];
        keywords.forEach(keyword => {
            const thread = createThread(keywordRules[keyword], threadsRef.current);
            threadsRef.current.push(thread);
        });
        localStorage.setItem('threads', JSON.stringify(threadsRef.current));
        setHistoryText('');
        setIsEditing(false);
    };

    const handleClearHistory = () => {
        setHistoryText('');
        setSubmittedHistory('');
        localStorage.removeItem('submittedHistory');
        threadsRef.current = [];
        localStorage.setItem('threads', JSON.stringify([]));
        console.log('Cleared history and threads');
    };

    const handleEditHistory = () => {
        setHistoryText(submittedHistory);
        setIsEditing(true);
    };

    const shareGobelin = () => {
        if (!canvasRef.current || threadsRef.current.length === 0) {
            alert(translations[language].canvasError || 'Cannot download or share an empty canvas.');
            return;
        }
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        const shareText = `${translations[language].share} Feminist Gobelin: https://feminist-gobelin-site.netlify.app`;
        navigator.clipboard.writeText(shareText);
        alert(translations[language].share + ' скопировано!');
    };

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth - 32;
            canvas.height = 400;
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            threadsRef.current.forEach(thread => {
                if (thread.progress < 1) {
                    thread.progress += 0.01;
                    thread.opacity = Math.min(thread.opacity + 0.02, 1);
                }
                ctx.beginPath();
                ctx.moveTo(thread.startX, thread.startY);
                const currentX = thread.startX + (thread.endX - thread.startX) * thread.progress;
                ctx.lineTo(currentX, thread.endY);
                ctx.lineWidth = thread.thickness;
                ctx.strokeStyle = thread.color;
                ctx.globalAlpha = thread.opacity;
                ctx.stroke();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [threadsRef]);

    return React.createElement(
        'div',
        { className: 'page gobelin-page' },
        React.createElement('h1', null, translations[language].myGobelin || 'My Gobelin'),
        React.createElement(
            'div',
            { className: 'mode-switcher' },
            React.createElement(
                'button',
                {
                    className: `mode-button ${mode === 'history' ? 'active' : ''}`,
                    onClick: () => {
                        setMode('history');
                        if (submittedHistory) {
                            const keywords = Object.keys(keywordRules).filter(k => submittedHistory.toLowerCase().includes(k));
                            threadsRef.current = [];
                            keywords.forEach(keyword => {
                                const thread = createThread(keywordRules[keyword], threadsRef.current);
                                threadsRef.current.push(thread);
                            });
                            localStorage.setItem('threads', JSON.stringify(threadsRef.current));
                        }
                    }
                },
                translations[language].myHistory || 'Create based on my history'
            ),
            React.createElement(
                'button',
                {
                    className: `mode-button ${mode === 'aiGorgon' ? 'active' : ''}`,
                    onClick: () => {
                        setMode('aiGorgon');
                        const savedThreads = localStorage.getItem('threads');
                        threadsRef.current = savedThreads ? JSON.parse(savedThreads) : [];
                    }
                },
                translations[language].aiGorgon || 'Create based on AI Gorgon'
            )
        ),
        React.createElement('canvas', { ref: canvasRef, className: 'gobelin-canvas' }),
        mode === 'history' && React.createElement(
            'div',
            { className: 'history-container' },
            React.createElement('textarea', {
                value: historyText,
                onChange: (e) => setHistoryText(e.target.value),
                placeholder: translations[language].historyPlaceholder || 'Enter your story...',
                rows: 5,
                className: 'history-textarea'
            }),
            React.createElement(
                'div',
                { className: 'history-buttons' },
                React.createElement(
                    'button',
                    { onClick: handleSubmitHistory, className: 'history-button', disabled: !historyText },
                    translations[language].submit || 'Submit'
                ),
                React.createElement(
                    'button',
                    { onClick: handleClearHistory, className: 'history-button clear', disabled: !historyText && !submittedHistory },
                    translations[language].clear || 'Clear'
                )
            ),
            submittedHistory && !isEditing && React.createElement(
                'div',
                { className: 'history-text' },
                React.createElement('p', null, submittedHistory),
                React.createElement(
                    'button',
                    { onClick: handleEditHistory, className: 'history-button edit' },
                    translations[language].edit || 'Edit'
                )
            )
        ),
        React.createElement(
            'div',
            { className: 'gobelin-buttons' },
            React.createElement(
                'button',
                { onClick: shareGobelin, className: 'gobelin-button share-button' },
                translations[language].share || 'Share'
            )
        )
    );
}

export default MyGobelin;
