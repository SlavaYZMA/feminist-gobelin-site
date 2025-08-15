import React from 'react';
import { keywordRules } from './keywordRules.js';
import { translations } from './config.js';

function MyGobelin({ threadsRef, language }) {
    const canvasRef = React.useRef(null);
    const [mode, setMode] = React.useState('history');
    const [historyText, setHistoryText] = React.useState('');
    const [submittedHistory, setSubmittedHistory] = React.useState(localStorage.getItem('submittedHistory') || '');
    const [isEditing, setIsEditing] = React.useState(false);
    const particlesRef = React.useRef([]);

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
        particlesRef.current = [];
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
        particlesRef.current = [];
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
        const shareText = `${translations[language].share} Feminist Data Art: https://feminist-gobelin-site.netlify.app`;
        navigator.clipboard.writeText(shareText);
        alert(translations[language].share + ' скопировано!');
    };

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth - 32;
            canvas.height = 600; // Увеличим высоту для эффектности
        };

        const createParticle = (x, y, color, thickness) => ({
            x,
            y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            life: Math.random() * 100 + 50,
            maxLife: Math.random() * 100 + 50,
            size: Math.random() * thickness * 0.2 + 1,
            color
        });

        const drawSmoothThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            if (thread.shape === 'wave') {
                let x = thread.startX;
                ctx.moveTo(x, thread.startY);
                while (x < currentX) {
                    const nextX = Math.min(x + 5, currentX);
                    const y = thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5;
                    ctx.lineTo(nextX, y);
                    x = nextX;
                }
            } else {
                ctx.moveTo(thread.startX, thread.startY);
                ctx.lineTo(currentX, thread.endY);
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'silk' ? 0.8 : 1);
            const gradient = ctx.createLinearGradient(thread.startX, thread.startY, currentX, thread.endY);
            gradient.addColorStop(0, thread.color);
            gradient.addColorStop(1, thread.color + 'cc');
            ctx.strokeStyle = gradient;
            ctx.shadowBlur = 20;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawTornThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const yOffset = (Math.random() - 0.5) * thread.thickness * 0.5;
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 + yOffset : thread.startY + yOffset;
                ctx.lineTo(nextX, y);
                if (Math.random() < 0.1) {
                    particlesRef.current.push(createParticle(nextX, y, thread.color, thread.thickness));
                }
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'wool' ? 1.2 : 1);
            ctx.strokeStyle = thread.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawKnottyThread = (ctx, thread, currentX) => {
            let x = thread.startX;
            ctx.beginPath();
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 15, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                if (Math.random() < 0.2) {
                    ctx.arc(nextX, y, thread.thickness * 0.3, 0, Math.PI * 2);
                    ctx.fillStyle = thread.color;
                    ctx.fill();
                    particlesRef.current.push(createParticle(nextX, y, thread.color, thread.thickness));
                }
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'burlap' ? 1.3 : 1);
            ctx.strokeStyle = thread.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawRoughThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 5, currentX);
                const yOffset = (Math.random() - 0.5) * thread.thickness * 0.2;
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 + yOffset : thread.startY + yOffset;
                ctx.lineTo(nextX, y);
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'linen' ? 1.2 : 1);
            ctx.strokeStyle = thread.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawSlipperyThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 5, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'silk' ? 0.8 : 1);
            const gradient = ctx.createLinearGradient(thread.startX, thread.startY, currentX, thread.endY);
            gradient.addColorStop(0, thread.color);
            gradient.addColorStop(1, thread.color + '80');
            ctx.strokeStyle = gradient;
            ctx.shadowBlur = 25;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawStickyThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                if (Math.random() < 0.1) {
                    ctx.beginPath();
                    ctx.moveTo(nextX, y);
                    ctx.lineTo(nextX, y + thread.thickness * (Math.random() > 0.5 ? 1 : -1) * 0.5);
                    ctx.strokeStyle = thread.color + '66';
                    ctx.stroke();
                    particlesRef.current.push(createParticle(nextX, y, thread.color, thread.thickness));
                }
                x = nextX;
            }
            ctx.lineWidth = thread.thickness;
            ctx.strokeStyle = thread.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawLumpyThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const lump = Math.random() < 0.15 ? thread.thickness * 1.5 : thread.thickness;
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                ctx.lineWidth = lump * (thread.material === 'burlap' ? 1.3 : 1);
                ctx.strokeStyle = thread.color;
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(nextX, y);
                x = nextX;
            }
            ctx.shadowBlur = 10;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawFragileThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 15, currentX);
                if (Math.random() < 0.1) {
                    x += 5;
                    ctx.moveTo(x, thread.startY);
                    continue;
                }
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * 0.7;
            ctx.strokeStyle = thread.color + '80';
            ctx.shadowBlur = 10;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawSharpThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const yOffset = (Math.random() > 0.5 ? 1 : -1) * thread.thickness * 0.4;
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 + yOffset : thread.startY + yOffset;
                ctx.lineTo(nextX, y);
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'synthetic' ? 0.9 : 1);
            ctx.strokeStyle = thread.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawStainedThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 20, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                const gradient = ctx.createLinearGradient(x, thread.startY, nextX, thread.endY);
                gradient.addColorStop(0, thread.color);
                gradient.addColorStop(0.5, thread.color + '66');
                gradient.addColorStop(1, thread.color);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = thread.thickness;
                ctx.lineTo(nextX, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(nextX, y);
                x = nextX;
            }
            ctx.shadowBlur = 10;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawWornThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                ctx.strokeStyle = Math.random() < 0.1 ? thread.color + '33' : thread.color;
                ctx.lineWidth = thread.thickness * (thread.material === 'velvet' ? 1.1 : 1);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(nextX, y);
                x = nextX;
            }
            ctx.shadowBlur = 10;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawWetThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                if (Math.random() < 0.05) {
                    particlesRef.current.push(createParticle(nextX, y, thread.color, thread.thickness));
                }
                x = nextX;
            }
            ctx.lineWidth = thread.thickness;
            ctx.strokeStyle = thread.color;
            ctx.globalAlpha = thread.opacity * 0.7;
            ctx.shadowBlur = 20;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.globalAlpha = thread.opacity;
            ctx.shadowBlur = 0;
        };

        const drawTransparentThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                x = nextX;
            }
            ctx.lineWidth = thread.thickness;
            ctx.strokeStyle = thread.color + '66';
            ctx.shadowBlur = 15;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawFluffyThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'wool' || thread.material === 'cotton' ? 1.2 : 1);
            ctx.strokeStyle = thread.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            for (let i = 0; i < thread.thickness; i++) {
                ctx.beginPath();
                x = thread.startX;
                while (x < currentX) {
                    const nextX = Math.min(x + 10, currentX);
                    const yOffset = (Math.random() - 0.5) * thread.thickness * 0.2;
                    const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 + yOffset : thread.startY + yOffset;
                    ctx.moveTo(x, y);
                    ctx.lineTo(nextX, y);
                    x = nextX;
                }
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = thread.color + '33';
                ctx.stroke();
            }
            ctx.shadowBlur = 0;
        };

        const drawBrittleThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 15, currentX);
                if (Math.random() < 0.15) {
                    x += 5;
                    ctx.moveTo(x, thread.startY);
                    continue;
                }
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                if (Math.random() < 0.05) {
                    particlesRef.current.push(createParticle(nextX, y, thread.color, thread.thickness));
                }
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'synthetic' ? 0.8 : 1);
            ctx.strokeStyle = thread.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawFadedThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 20, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                const gradient = ctx.createLinearGradient(x, thread.startY, nextX, thread.endY);
                gradient.addColorStop(0, thread.color);
                gradient.addColorStop(1, thread.color + '33');
                ctx.strokeStyle = gradient;
                ctx.lineWidth = thread.thickness;
                ctx.lineTo(nextX, y);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(nextX, y);
                x = nextX;
            }
            ctx.shadowBlur = 10;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawResilientThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'cotton' || thread.material === 'linen' ? 1.1 : 1);
            ctx.strokeStyle = thread.color;
            ctx.shadowBlur = 20;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawTangledThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const yOffset = (Math.random() - 0.5) * thread.thickness * 0.6;
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 + yOffset : thread.startY + yOffset;
                ctx.lineTo(nextX, y);
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'wool' ? 1.2 : 1);
            ctx.strokeStyle = thread.color;
            ctx.shadowBlur = 15;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawFlowingThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 5, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.03) * thread.thickness * 0.7 : thread.startY;
                ctx.lineTo(nextX, y);
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * (thread.material === 'silk' ? 0.9 : 1);
            const gradient = ctx.createLinearGradient(thread.startX, thread.startY, currentX, thread.endY);
            gradient.addColorStop(0, thread.color);
            gradient.addColorStop(1, thread.color + 'cc');
            ctx.strokeStyle = gradient;
            ctx.shadowBlur = 25;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const drawHeavyThread = (ctx, thread, currentX) => {
            ctx.beginPath();
            let x = thread.startX;
            ctx.moveTo(x, thread.startY);
            while (x < currentX) {
                const nextX = Math.min(x + 10, currentX);
                const y = thread.shape === 'wave' ? thread.startY + Math.sin((x - thread.startX) * 0.05) * thread.thickness * 0.5 : thread.startY;
                ctx.lineTo(nextX, y);
                x = nextX;
            }
            ctx.lineWidth = thread.thickness * 1.3;
            ctx.strokeStyle = thread.color;
            ctx.shadowBlur = 30;
            ctx.shadowColor = thread.color;
            ctx.stroke();
            ctx.shadowBlur = 0;
        };

        const animate = () => {
            ctx.fillStyle = '#1a1a1a'; // Тёмный фон для неона
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighter';
            threadsRef.current.forEach(thread => {
                if (thread.progress < 1) {
                    thread.progress += 0.01;
                    thread.opacity = Math.min(thread.opacity + 0.02, 1);
                }
                const currentX = thread.startX + (thread.endX - thread.startX) * thread.progress;
                ctx.globalAlpha = thread.opacity;
                switch (thread.effect) {
                    case 'smooth':
                        drawSmoothThread(ctx, thread, currentX);
                        break;
                    case 'torn':
                        drawTornThread(ctx, thread, currentX);
                        break;
                    case 'knotty':
                        drawKnottyThread(ctx, thread, currentX);
                        break;
                    case 'rough':
                        drawRoughThread(ctx, thread, currentX);
                        break;
                    case 'slippery':
                        drawSlipperyThread(ctx, thread, currentX);
                        break;
                    case 'sticky':
                        drawStickyThread(ctx, thread, currentX);
                        break;
                    case 'lumpy':
                        drawLumpyThread(ctx, thread, currentX);
                        break;
                    case 'fragile':
                        drawFragileThread(ctx, thread, currentX);
                        break;
                    case 'sharp':
                        drawSharpThread(ctx, thread, currentX);
                        break;
                    case 'stained':
                        drawStainedThread(ctx, thread, currentX);
                        break;
                    case 'worn':
                        drawWornThread(ctx, thread, currentX);
                        break;
                    case 'wet':
                        drawWetThread(ctx, thread, currentX);
                        break;
                    case 'transparent':
                        drawTransparentThread(ctx, thread, currentX);
                        break;
                    case 'fluffy':
                        drawFluffyThread(ctx, thread, currentX);
                        break;
                    case 'brittle':
                        drawBrittleThread(ctx, thread, currentX);
                        break;
                    case 'faded':
                        drawFadedThread(ctx, thread, currentX);
                        break;
                    case 'resilient':
                        drawResilientThread(ctx, thread, currentX);
                        break;
                    case 'tangled':
                        drawTangledThread(ctx, thread, currentX);
                        break;
                    case 'flowing':
                        drawFlowingThread(ctx, thread, currentX);
                        break;
                    case 'heavy':
                        drawHeavyThread(ctx, thread, currentX);
                        break;
                    default:
                        drawSmoothThread(ctx, thread, currentX);
                }
            });

            // Рендер частиц
            particlesRef.current = particlesRef.current.filter(p => p.life > 0);
            particlesRef.current.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= 1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * (p.life / p.maxLife), 0, Math.PI * 2);
                ctx.fillStyle = p.color + Math.floor((p.life / p.maxLife) * 255).toString(16).padStart(2, '0');
                ctx.fill();
            });

            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
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
        React.createElement('h1', null, translations[language].myGobelin || 'My Data Art'),
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
                            particlesRef.current = [];
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
                        particlesRef.current = [];
                    }
                },
                translations[language].aiGorgon || 'Create based on AI Gorgon'
            )
        ),
        React.createElement('canvas', { ref: canvasRef, className: 'data-art-canvas' }),
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
