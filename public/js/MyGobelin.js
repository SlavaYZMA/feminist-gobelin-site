import React from 'react';
import { keywordRules } from './keywordRules';

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

    const drawThread = (ctx, thread) => {
        console.log('Drawing thread:', thread);
        ctx.globalAlpha = thread.opacity;
        ctx.strokeStyle = thread.color;
        ctx.fillStyle = thread.color;
        ctx.lineWidth = thread.thickness;
        const texture = createTexture(thread.material, ctx, thread.color, thread.effect);

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
        const savedThreads = localStorage.getItem('threads');
        if (savedThreads) {
            const parsedThreads = JSON.parse(savedThreads);
            threadsRef.current = parsedThreads;
            setThreads(parsedThreads);
            console.log('Loaded threads from localStorage:', parsedThreads);
        }
    }, []);

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

export default MyGobelin;
