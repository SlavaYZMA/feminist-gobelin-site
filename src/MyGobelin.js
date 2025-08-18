import React from 'react';
import { keywordRules } from './keywordRules.js';
import { translations } from './config.js';

function MyGobelin({ threadsRef, language = 'en' }) {
    const canvasRef = React.useRef(null);
    const blsCanvasRef = React.useRef(null);
    const [mode, setMode] = React.useState('history');
    const [historyText, setHistoryText] = React.useState('');
    const [submittedHistory, setSubmittedHistory] = React.useState(localStorage.getItem('submittedHistory') || '');
    const [isEditing, setIsEditing] = React.useState(false);
    const [blsActive, setBlsActive] = React.useState(false);
    const [blsFrequency, setBlsFrequency] = React.useState(1.2);
    const [setActive, setSetActive] = React.useState(false);
    const [setCount, setSetCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);
    const [canvasReady, setCanvasReady] = React.useState(false);
    const [fpsWarning, setFpsWarning] = React.useState(false);
    const [dynamicStep, setDynamicStep] = React.useState(1);
    const [showConsentScreen, setShowConsentScreen] = React.useState(false);
    const [consentSensitivity, setConsentSensitivity] = React.useState('standard');
    const [dontSaveHistory, setDontSaveHistory] = React.useState(false);
    const [showInfoModal, setShowInfoModal] = React.useState(false);
    const [loadingProgress, setLoadingProgress] = React.useState(0); // Прогресс загрузки
    const cachedFrames = React.useRef([]);
    const prevBreathe = React.useRef(0); // Переменные для интерполяции
    const prevWave = React.useRef(0);
    const prevRotation = React.useRef(0);
    const prevTwist = React.useRef(0);
    const validLanguage = ['en', 'ru'].includes(language) ? language : 'en';

    const analyzeText = (text) => {
        const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        const wordCount = words.length;
        const textLen = text.length;
        const avgWordLen = wordCount ? textLen / wordCount : 0;
        const sentences = text.split(/[.!?]/).filter(s => s.trim().length > 0);
        const sentCount = sentences.length;
        const avgSentLen = sentCount ? wordCount / sentCount : 0;
        const uniqueWords = new Set(words).size;
        const wordFreq = words.reduce((acc, w) => { acc[w] = (acc[w] || 0) + 1; return acc; }, {});
        const maxWordFreq = Math.max(...Object.values(wordFreq), 1);
        return {
            textLen, wordCount, avgWordLen, sentCount, avgSentLen,
            uniqueWords, maxWordFreq
        };
    };

    const countTriggers = (text, triggerWords) => {
        const words = text.toLowerCase().split(/\s+/);
        return triggerWords.reduce((sum, word) => sum + words.includes(word), 0);
    };

    const getFractalParams = React.useMemo(() => (text) => {
        const metrics = analyzeText(text);
        const baseHue = (metrics.textLen * 10) % 360;
        const params = {
            cX: (metrics.avgWordLen / 10) - 0.5 + Math.random() * 0.3,
            cY: (metrics.avgSentLen / 50) - 0.5 + Math.random() * 0.3,
            zoom: Math.min(12, 1 + (metrics.textLen / 250) + metrics.uniqueWords * 0.2),
            iterations: Math.min(150, 50 + metrics.uniqueWords * 5),
            hue: baseHue,
            sat: Math.min(90, 60 + metrics.maxWordFreq * 15),
            bright: Math.min(90, 50 + metrics.avgWordLen * 20),
            speed: Math.max(0.05, metrics.sentCount * 0.25),
            distortion: metrics.avgSentLen * 0.15 + metrics.uniqueWords * 0.03,
            symmetryBreak: metrics.wordCount * 0.02,
            breathingRate: Math.max(0.3, Math.min(2.5, metrics.avgSentLen / 10 * 1.5)),
            waveAmplitude: metrics.sentCount * 0.07,
            textureGrain: 0,
            depthLayers: Math.max(1, metrics.sentCount / 2),
            rotationDir: Math.random() > 0.5 ? 1 : -1,
            escapeRadius: 4 + metrics.textLen / 1000,
            twist: metrics.uniqueWords * 0.04
        };

        let palette = 'default';
        Object.keys(keywordRules.TRIGGERS).forEach(category => {
            const count = countTriggers(text, keywordRules.TRIGGERS[category]);
            if (count > 0) {
                if (category === 'fear') {
                    params.zoom += count * 0.4;
                    params.hue = (baseHue + 180 + count * 30) % 360;
                    params.bright = Math.max(20, params.bright * 0.5);
                    palette = 'fear';
                } else if (category === 'anger') {
                    params.sat += count * 15;
                    params.hue = (baseHue + 360 + count * 40) % 360;
                    params.distortion += count * 0.15;
                    palette = 'anger';
                } else if (category === 'body') {
                    params.iterations += count * 20;
                    params.cX += count * 0.03;
                    params.hue = (baseHue + 90 + count * 15) % 360;
                    palette = palette === 'default' ? 'body' : palette;
                } else if (category === 'place') {
                    params.cX -= count * 0.04;
                    params.cY -= count * 0.04;
                    params.twist += count * 0.015;
                    params.hue = (baseHue + 270 + count * 20) % 360;
                    palette = palette === 'default' ? 'place' : palette;
                } else if (category === 'silence') {
                    params.speed -= count * 0.15;
                    params.bright = Math.min(90, params.bright * 0.7);
                    params.hue = (baseHue + 200 + count * 30) % 360;
                    palette = 'silence';
                } else if (category === 'escape') {
                    params.distortion += count * 0.2;
                    params.twist += count * 0.025;
                    params.hue = (baseHue + 300 + count * 25) % 360;
                    palette = palette === 'default' ? 'escape' : palette;
                } else if (category === 'nature') {
                    params.distortion += count * 0.15;
                    params.hue = (baseHue + 120 + count * 20) % 360;
                    params.waveAmplitude += count * 0.03;
                    palette = 'nature';
                } else if (category === 'hope') {
                    params.bright += count * 15;
                    params.hue = (baseHue + 60 + count * 30) % 360;
                    params.breathingRate += count * 0.2;
                    palette = 'hope';
                }
            }
        });

        params.palette = palette;
        return params;
    }, []);

    const staticWarmFractalParams = {
        cX: 0,
        cY: 0,
        zoom: 2,
        iterations: 100,
        hue: 40,
        sat: 80,
        bright: 90,
        speed: 0,
        distortion: 0,
        symmetryBreak: 0,
        breathingRate: 0,
        waveAmplitude: 0,
        textureGrain: 0,
        depthLayers: 1,
        rotationDir: 1,
        escapeRadius: 4,
        twist: 0,
        palette: 'hope'
    };

    const handleSubmitHistory = () => {
        if (!historyText) return;
        setSubmittedHistory(historyText);
        if (!dontSaveHistory) {
            localStorage.setItem('submittedHistory', historyText);
            threadsRef.current = [getFractalParams(historyText)];
            localStorage.setItem('threads', JSON.stringify(threadsRef.current));
        } else {
            threadsRef.current = [getFractalParams(historyText)];
            localStorage.removeItem('submittedHistory');
            localStorage.removeItem('threads');
        }
        setHistoryText('');
        setIsEditing(false);
        setIsLoading(true);
        setLoadingProgress(0); // Сбрасываем прогресс
        setBlsActive(false);
    };

    const handleClearHistory = () => {
        setHistoryText('');
        setSubmittedHistory('');
        localStorage.removeItem('submittedHistory');
        threadsRef.current = [];
        localStorage.setItem('threads', JSON.stringify([]));
        setBlsActive(false);
        setSetCount(0);
        setIsLoading(true);
        setLoadingProgress(0);
        cachedFrames.current = [];
    };

    const handleEditHistory = () => {
        setHistoryText(submittedHistory);
        setIsEditing(true);
        setBlsActive(false);
        cachedFrames.current = [];
    };

    const shareGobelin = () => {
        if (!canvasRef.current || threadsRef.current.length === 0) {
            alert(translations[validLanguage].canvasError || 'Cannot download or share an empty canvas.');
            return;
        }
        const canvas = canvasRef.current;
        const dataUrl = canvas.toDataURL('image/png');
        const shareText = `${translations[validLanguage].share} Feminist Data Art: https://feminist-gobelin-site.netlify.app`;
        navigator.clipboard.writeText(shareText);
        alert(translations[validLanguage].share + ' скопировано!');
    };

    const handleStartBls = () => {
        setShowConsentScreen(true);
    };

    const handlePauseBls = () => {
        setSetActive(false);
    };

    const handleStopBls = () => {
        setBlsActive(false);
        setSetActive(false);
        setSetCount(0);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && threadsRef.current.length > 0) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            renderFractal(staticWarmFractalParams, 0);
        }
        cachedFrames.current = [];
    };

    const handleCalmDown = () => {
        setBlsFrequency(prev => Math.max(0.8, prev - 0.2));
    };

    const acceptConsent = () => {
        setBlsActive(true);
        setSetActive(true);
        setSetCount(1);
        setShowConsentScreen(false);
        setBlsFrequency(
            consentSensitivity === 'soft' ? 0.8 :
            consentSensitivity === 'intense' ? 1.6 : 1.2
        );
        if (dontSaveHistory) {
            localStorage.removeItem('submittedHistory');
            localStorage.removeItem('threads');
        }
    };

    const declineConsent = () => {
        setShowConsentScreen(false);
    };

    const openInfoModal = () => {
        setShowInfoModal(true);
    };

    const closeInfoModal = () => {
        setShowInfoModal(false);
    };

    React.useEffect(() => {
        console.log('useEffect triggered', { canvasRef: !!canvasRef.current, blsCanvasRef: !!blsCanvasRef.current });

        const checkCanvas = () => {
            if (!canvasRef.current || !blsCanvasRef.current) {
                console.error('Canvas refs are not initialized', {
                    canvas: !!document.querySelector('.data-art-canvas'),
                    blsCanvas: !!document.querySelector('.bls-canvas')
                });
                setTimeout(checkCanvas, 500);
                return false;
            }
            return true;
        };

        const canvas = canvasRef.current;
        const blsCanvas = blsCanvasRef.current;
        let ctx, blsCtx;
        if (canvas && blsCanvas) {
            ctx = canvas.getContext('2d');
            blsCtx = blsCanvas.getContext('2d');
            if (!ctx || !blsCtx) {
                console.error('Failed to get 2D context for canvas');
                return;
            }
            ctx.imageSmoothingEnabled = true;
        }

        let animationFrameId;
        let frameIndex = 0;
        let lastFrameFPS = performance.now();
        let frameCount = 0;
        let fps = 0;
        let setStartTime = performance.now() / 1000;

        const resizeCanvas = () => {
            if (!canvas || !blsCanvas) return;
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const cssWidth = Math.min(window.innerWidth - 32, 600);
            const cssHeight = 450;
            canvas.width = cssWidth * dpr;
            canvas.height = cssHeight * dpr;
            canvas.style.width = `${cssWidth}px`;
            canvas.style.height = `${cssHeight}px`;
            blsCanvas.width = canvas.width;
            blsCanvas.height = canvas.height;
            blsCanvas.style.width = canvas.style.width;
            blsCanvas.style.height = canvas.style.height;
            ctx.scale(dpr, dpr);
            blsCtx.scale(dpr, dpr);
            console.log('Canvas resized', { width: canvas.width, height: canvas.height, cssWidth, cssHeight, dpr });
            cachedFrames.current = [];
        };

        const lerp = (start, end, factor) => start + (end - start) * factor;

        const hsvToRgb = (h, s, v, palette) => {
            s /= 100;
            v /= 100;
            if (palette === 'fear') v *= 0.5;
            else if (palette === 'anger') s = Math.min(1, s * 1.3);
            else if (palette === 'hope') v = Math.min(1, v * 1.3);
            else if (palette === 'nature') h = (h + 120) % 360;
            else if (palette === 'silence') s *= 0.7;
            const c = v * s;
            const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
            const m = v - c;
            let r, g, b;
            if (h < 60) [r, g, b] = [c, x, 0];
            else if (h < 120) [r, g, b] = [x, c, 0];
            else if (h < 180) [r, g, b] = [0, c, x];
            else if (h < 240) [r, g, b] = [0, x, c];
            else if (h < 300) [r, g, b] = [x, 0, c];
            else [r, g, b] = [c, 0, x];
            return [
                Math.round((r + m) * 255),
                Math.round((g + m) * 255),
                Math.round((b + m) * 255)
            ];
        };

        const renderFractal = (params, t) => {
            if (!ctx) return null;
            const { cX, cY, zoom, iterations, hue, sat, bright, speed, distortion, symmetryBreak, breathingRate, waveAmplitude, depthLayers, rotationDir, escapeRadius, twist } = params;
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            const scale = 4 / zoom;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const targetBreathe = Math.sin(t * breathingRate * 1.5) * 0.05;
            const targetWave = Math.sin(t * speed * 1.2) * waveAmplitude * 1.2;
            const targetRotation = t * speed * rotationDir * 0.01;
            const targetTwist = Math.sin(t * twist) * 0.02;

            prevBreathe.current = lerp(prevBreathe.current, targetBreathe, 0.1);
            prevWave.current = lerp(prevWave.current, targetWave, 0.1);
            prevRotation.current = lerp(prevRotation.current, targetRotation, 0.1);
            prevTwist.current = lerp(prevTwist.current, targetTwist, 0.1);

            const dynamicHueShift = Math.sin(t * 0.5) * 120;
            const dynamicSat = sat + Math.sin(t * speed) * 30;
            const dynamicBright = bright + Math.sin(t * speed * 0.5) * 30;
            const flicker = 0.9 + 0.1 * Math.sin(t * 2);

            const step = dynamicStep;
            console.log('Rendering fractal', { step, iterations, hue: (hue + dynamicHueShift) % 360, sat: dynamicSat, bright: dynamicBright, zoom, twist });

            for (let x = 0; x < canvas.width; x += step) {
                for (let y = 0; y < canvas.height; y += step) {
                    let zx = ((x - centerX) / canvas.width) * scale;
                    let zy = ((y - centerY) / canvas.height) * scale;
                    const rotatedZx = zx * Math.cos(prevRotation.current + prevTwist.current) - zy * Math.sin(prevRotation.current + prevTwist.current);
                    const rotatedZy = zx * Math.sin(prevRotation.current + prevTwist.current) + zy * Math.cos(prevRotation.current + prevTwist.current);
                    zx = rotatedZx + Math.sin(zy * distortion) * prevWave.current;
                    zy = rotatedZy + Math.cos(zx * distortion) * symmetryBreak;

                    let i = 0;
                    let tempZx, tempZy;
                    while (i < iterations) {
                        tempZx = zx * zx - zy * zy + cX + prevBreathe.current;
                        tempZy = 2 * zx * zy + cY + prevWave.current;
                        zx = tempZx;
                        zy = tempZy;
                        if (zx * zx + zy * zy > escapeRadius) break;
                        i++;
                    }

                    const idx = (y * canvas.width + x) * 4;
                    let color;
                    if (i === iterations) {
                        color = [0, 0, 0];
                    } else {
                        const h = ((hue + dynamicHueShift + (i * 15)) % 360);
                        const s = Math.min(90, dynamicSat);
                        const v = Math.min(90, dynamicBright + (i / iterations) * 50);
                        color = hsvToRgb(h, s, v, params.palette);
                    }

                    const layerFactor = 1 - (i / iterations) * depthLayers * 0.5;
                    ctx.globalAlpha = flicker;
                    color = color.map(c => Math.max(0, Math.min(255, c * layerFactor)));

                    for (let dx = 0; dx < step; dx++) {
                        for (let dy = 0; dy < step; dy++) {
                            if (x + dx < canvas.width && y + dy < canvas.height) {
                                const dIdx = ((y + dy) * canvas.width + (x + dx)) * 4;
                                data[dIdx] = color[0];
                                data[dIdx + 1] = color[1];
                                data[dIdx + 2] = color[2];
                                data[dIdx + 3] = 255;
                            }
                        }
                    }
                }
            }

            ctx.globalAlpha = 1.0;
            return imageData;
        };

        const renderBlsMarker = (t) => {
            if (!blsCtx) return;
            blsCtx.clearRect(0, 0, blsCanvas.width, blsCanvas.height);
            if (!blsActive || !setActive) return;

            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const cssWidth = Math.min(window.innerWidth - 32, 600);
            const margin = 10;
            const radius = 15 + 7.5 * Math.sin(t * 3);
            const amplitude = cssWidth * 0.5 - radius - margin;
            const centerX = cssWidth / 2;
            const centerY = blsCanvas.height / (2 * dpr);
            const x = centerX + amplitude * Math.sin(t * blsFrequency * 2 * Math.PI);
            const hueShift = x < centerX ? -5 : 5;

            console.log('Rendering BLS marker', { 
                x, 
                radius, 
                amplitude, 
                cssWidth, 
                centerX, 
                blsCanvasWidth: blsCanvas.width, 
                blsCanvasHeight: blsCanvas.height, 
                dpr, 
                minX: centerX - amplitude, 
                maxX: centerX + amplitude 
            });

            blsCtx.shadowBlur = 20;
            blsCtx.shadowColor = `hsl(${(threadsRef.current[0]?.hue || 0) + hueShift}, 80%, 90%)`;
            blsCtx.beginPath();
            blsCtx.arc(x * dpr, centerY * dpr, radius, 0, 2 * Math.PI);
            blsCtx.fillStyle = `hsl(${(threadsRef.current[0]?.hue || 0) + hueShift}, 80%, 90%)`;
            blsCtx.fill();
            blsCtx.shadowBlur = 0;
        };

        const preRenderFrames = async (params) => {
            if (!ctx || !canvas) return;
            setIsLoading(true);
            setLoadingProgress(0);
            cachedFrames.current = [];
            const frameCount = 60;
            const timeStep = 2 / frameCount;

            for (let i = 0; i < frameCount; i++) {
                const t = i * timeStep;
                const frameData = renderFractal(params, t);
                if (frameData) {
                    cachedFrames.current.push(frameData);
                }
                setLoadingProgress((i + 1) / frameCount * 100); // Обновляем прогресс
                await new Promise(resolve => setTimeout(resolve, 0));
            }
            setIsLoading(false);
            setCanvasReady(true);
            console.log('Pre-rendering complete', { frameCount: cachedFrames.current.length });
        };

        const animate = () => {
            if (!ctx || !blsCtx) {
                console.error('Context not available for animation');
                return;
            }
            const now = performance.now();
            frameCount++;
            if (now - lastFrameFPS >= 1000) {
                fps = frameCount;
                frameCount = 0;
                lastFrameFPS = now;
                console.log('FPS:', fps);
                if (fps < 15) setFpsWarning(true);
                else setFpsWarning(false);
            }

            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (threadsRef.current.length > 0 && cachedFrames.current.length > 0) {
                const setDuration = 25;
                const pauseDuration = 12;
                const maxSets = 6;
                const setProgress = setCount > 0 ? (performance.now() / 1000 - setStartTime) / setDuration : 0;

                if (blsActive && setActive && setCount <= maxSets) {
                    if (setProgress >= 1) {
                        setSetActive(false);
                        setTimeout(() => {
                            setSetCount(prev => prev + 1);
                            setSetActive(true);
                            setStartTime = performance.now() / 1000;
                        }, pauseDuration * 1000);
                    }
                } else if (setCount > maxSets) {
                    handleStopBls();
                }

                const frame = cachedFrames.current[frameIndex % cachedFrames.current.length];
                ctx.putImageData(frame, 0, 0);
                frameIndex = (frameIndex + 1) % cachedFrames.current.length;

                renderBlsMarker(frameIndex * (2 / 60));
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (checkCanvas()) {
                console.log('Starting animation', { canvas: !!canvasRef.current, blsCanvas: !!blsCanvasRef.current, ctx: !!ctx, blsCtx: !!blsCtx });
                resizeCanvas();
                if (threadsRef.current.length > 0) {
                    preRenderFrames(threadsRef.current[0]).then(() => {
                        setCanvasReady(true);
                        animate();
                    });
                } else {
                    setCanvasReady(true);
                    setIsLoading(false);
                    animate();
                }
            } else {
                console.warn('Retrying animation start');
                setTimeout(startAnimation, 500);
            }
        };

        setTimeout(startAnimation, 500);
        window.addEventListener('resize', () => {
            resizeCanvas();
            if (threadsRef.current.length > 0) {
                preRenderFrames(threadsRef.current[0]);
            }
        });

        return () => {
            console.log('Cleaning up useEffect');
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [threadsRef, validLanguage, blsActive, setActive, setCount, blsFrequency, submittedHistory]);

    React.useEffect(() => {
        console.log('Render debug', { canvasInDOM: !!document.querySelector('.data-art-canvas'), blsCanvasInDOM: !!document.querySelector('.bls-canvas') });
    }, []);

    return React.createElement(
        'div',
        { className: 'page gobelin-page' },
        isLoading && !canvasReady && React.createElement(
            'div',
            { className: 'loading-screen' },
            React.createElement('p', null, translations[validLanguage].loadingAnimation || 'Generating animation...'),
            React.createElement(
                'div',
                { className: 'progress-bar' },
                React.createElement('div', {
                    className: 'progress-bar-fill',
                    style: { width: `${loadingProgress}%` }
                })
            ),
            React.createElement('p', null, `${Math.round(loadingProgress)}%`)
        ),
        fpsWarning && React.createElement('div', { className: 'fps-warning' }, translations[validLanguage].fpsWarning || 'Low performance detected. Try a smaller screen or simpler settings.'),
        showConsentScreen && React.createElement(
            'div',
            { className: 'consent-screen' },
            React.createElement('h2', { key: 'consent-title' }, translations[validLanguage].consentTitle || 'Before Starting BLS'),
            React.createElement(
                'p',
                { key: 'disclaimer' },
                translations[validLanguage].disclaimer ||
                'This is an artistic visualization with elements of bilateral stimulation inspired by EMDR. It is not psychotherapy and does not replace working with a certified professional. Learn more at ',
                React.createElement('a', { href: 'https://www.nice.org.uk/guidance/conditions-and-diseases/mental-health-conditions/post-traumatic-stress-disorder', target: '_blank', rel: 'noopener noreferrer' }, 'NICE'),
                ' or ',
                React.createElement('a', { href: 'https://www.apa.org/topics/psychotherapy', target: '_blank', rel: 'noopener noreferrer' }, 'APA'),
                '.'
            ),
            React.createElement(
                'p',
                { key: 'self-regulation' },
                translations[validLanguage].selfRegulation ||
                'To stay grounded, try slow breathing (4 seconds in, 4 seconds out), look around the room to orient yourself, or visualize a safe, calming place.'
            ),
            React.createElement(
                'p',
                { key: 'content-warning' },
                translations[validLanguage].contentWarning ||
                'Stories may contain descriptions of violence. The "Stop" button is always available and will replace the animation with a static warm fractal.'
            ),
            React.createElement(
                'div',
                { key: 'sensitivity', className: 'consent-sensitivity' },
                ['soft', 'standard', 'intense'].map(sensitivity => (
                    React.createElement(
                        'button',
                        {
                            key: `sensitivity-${sensitivity}`,
                            className: `consent-sensitivity-button ${consentSensitivity === sensitivity ? 'active' : ''}`,
                            onClick: () => setConsentSensitivity(sensitivity)
                        },
                        translations[validLanguage][sensitivity] ||
                        (sensitivity === 'soft' ? 'Soft' : sensitivity === 'standard' ? 'Standard' : 'Intense')
                    )
                ))
            ),
            React.createElement(
                'p',
                { key: 'contraindications' },
                translations[validLanguage].contraindications ||
                'Do not use during severe dissociation, acute crisis, psychosis, or active suicidal thoughts. Seek professional help at ',
                React.createElement('a', { href: 'https://988lifeline.org', target: '_blank', rel: 'noopener noreferrer' }, '988lifeline.org'),
                '.'
            ),
            React.createElement(
                'p',
                { key: 'privacy' },
                translations[validLanguage].privacy ||
                'Your stories are anonymized and processed locally. You can choose not to save your story.'
            ),
            React.createElement(
                'div',
                { key: 'checkbox', className: 'consent-checkbox' },
                React.createElement('input', {
                    type: 'checkbox',
                    checked: dontSaveHistory,
                    onChange: (e) => setDontSaveHistory(e.target.checked)
                }),
                React.createElement('span', null, translations[validLanguage].dontSave || 'Do not save my story')
            ),
            React.createElement(
                'div',
                { key: 'consent-buttons', className: 'consent-buttons' },
                React.createElement(
                    'button',
                    { key: 'accept', className: 'consent-button', onClick: acceptConsent },
                    translations[validLanguage].accept || 'Accept'
                ),
                React.createElement(
                    'button',
                    { key: 'decline', className: 'consent-button decline', onClick: declineConsent },
                    translations[validLanguage].decline || 'Decline'
                )
            )
        ),
        showInfoModal && React.createElement(
            'div',
            { className: 'info-modal' },
            React.createElement('h2', { key: 'info-title' }, translations[validLanguage].whatIsBls || 'What is BLS?'),
            React.createElement(
                'p',
                { key: 'bls-info' },
                translations[validLanguage].blsInfo ||
                'Bilateral Stimulation (BLS) is when attention alternates between the left and right sides (visually, auditory, or tactile). It is used in EMDR therapy to process traumatic memories.'
            ),
            React.createElement(
                'p',
                { key: 'emdr-info' },
                translations[validLanguage].emdrInfo ||
                'Eye Movement Desensitization and Reprocessing (EMDR) is a scientifically validated psychotherapy method for trauma. We use only an artistic visualization inspired by this method.'
            ),
            React.createElement(
                'p',
                { key: 'not-therapy' },
                translations[validLanguage].notTherapy ||
                'Important: This is not therapy and does not replace working with a psychologist.'
            ),
            React.createElement(
                'button',
                { key: 'close-info', onClick: closeInfoModal },
                translations[validLanguage].close || 'Close'
            )
        ),
        showInfoModal && React.createElement('div', { className: 'overlay open', onClick: closeInfoModal }),
        React.createElement(
            'div',
            { className: 'header' },
            React.createElement('button', { className: 'info-button', onClick: openInfoModal }, translations[validLanguage].whatIsBls || 'What is BLS?')
        ),
        React.createElement('h1', { key: 'title' }, translations[validLanguage].myGobelin || 'My Data Art'),
        React.createElement(
            'div',
            { key: 'mode-switcher', className: 'mode-switcher' },
            React.createElement(
                'button',
                {
                    key: 'history-mode',
                    className: `mode-button ${mode === 'history' ? 'active' : ''}`,
                    onClick: () => {
                        setMode('history');
                        if (submittedHistory) {
                            threadsRef.current = [getFractalParams(submittedHistory)];
                            if (!dontSaveHistory) {
                                localStorage.setItem('threads', JSON.stringify(threadsRef.current));
                            }
                            setIsLoading(true);
                            setLoadingProgress(0);
                            cachedFrames.current = [];
                        }
                    }
                },
                translations[validLanguage].myHistory || 'Create based on my history'
            ),
            React.createElement(
                'button',
                {
                    key: 'aiGorgon-mode',
                    className: `mode-button ${mode === 'aiGorgon' ? 'active' : ''}`,
                    onClick: () => {
                        setMode('aiGorgon');
                        const savedThreads = localStorage.getItem('threads');
                        threadsRef.current = savedThreads ? JSON.parse(savedThreads) : [];
                        setIsLoading(true);
                        setLoadingProgress(0);
                        cachedFrames.current = [];
                    }
                },
                translations[validLanguage].aiGorgon || 'Create based on AI Gorgon'
            )
        ),
        React.createElement(
            'div',
            { key: 'canvas-container', style: { position: 'relative', margin: '0 auto', maxWidth: '600px' } },
            React.createElement('canvas', { key: 'fractal-canvas', ref: canvasRef, className: 'data-art-canvas' }),
            React.createElement('canvas', {
                key: 'bls-canvas',
                ref: blsCanvasRef,
                className: 'bls-canvas',
                style: { position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }
            })
        ),
        submittedHistory && React.createElement(
            'div',
            { key: 'bls-controls', className: 'bls-controls' },
            React.createElement(
                'button',
                { key: 'start-bls', onClick: handleStartBls, className: 'bls-button', disabled: blsActive },
                translations[validLanguage].startBls || 'Start BLS'
            ),
            React.createElement(
                'button',
                { key: 'pause-bls', onClick: handlePauseBls, className: 'bls-button', disabled: !blsActive },
                translations[validLanguage].pauseBls || 'Pause BLS'
            ),
            React.createElement(
                'button',
                { key: 'stop-bls', onClick: handleStopBls, className: 'bls-button', disabled: !blsActive },
                translations[validLanguage].stopBls || 'Stop BLS'
            ),
            React.createElement(
                'button',
                { key: 'calm-down', onClick: handleCalmDown, className: 'bls-button' },
                translations[validLanguage].calmDown || 'Make Calmer'
            ),
            React.createElement(
                'div',
                { key: 'bls-frequency', className: 'bls-frequency' },
                React.createElement('label', null, translations[validLanguage].frequency || 'BLS Frequency (Hz)'),
                React.createElement('input', {
                    type: 'range',
                    min: 0.8,
                    max: 1.6,
                    step: 0.1,
                    value: blsFrequency,
                    onChange: (e) => setBlsFrequency(parseFloat(e.target.value))
                }),
                React.createElement('span', null, blsFrequency.toFixed(1))
            )
        ),
        React.createElement(
            'div',
            { key: 'gobelin-buttons', className: 'gobelin-buttons' },
            React.createElement(
                'button',
                { key: 'share-button', onClick: shareGobelin, className: 'gobelin-button share-button', disabled: !canvasReady },
                translations[validLanguage].share || 'Share'
            )
        ),
        mode === 'history' && React.createElement(
            'div',
            { key: 'history-container', className: 'history-container' },
            React.createElement('textarea', {
                key: 'history-textarea',
                value: historyText,
                onChange: (e) => setHistoryText(e.target.value),
                placeholder: translations[validLanguage].historyPlaceholder || 'Enter your story...',
                rows: 5,
                className: 'history-textarea'
            }),
            React.createElement(
                'div',
                { key: 'history-buttons', className: 'history-buttons' },
                React.createElement(
                    'button',
                    { key: 'submit-button', onClick: handleSubmitHistory, className: 'history-button', disabled: !historyText },
                    translations[validLanguage].submit || 'Submit'
                ),
                React.createElement(
                    'button',
                    { key: 'clear-button', onClick: handleClearHistory, className: 'history-button clear', disabled: !historyText && !submittedHistory },
                    translations[validLanguage].clear || 'Clear'
                )
            ),
            submittedHistory && !isEditing && React.createElement(
                'div',
                { key: 'history-text', className: 'history-text' },
                React.createElement('p', { key: 'history-content' }, submittedHistory),
                React.createElement(
                    'button',
                    { key: 'edit-button', onClick: handleEditHistory, className: 'history-button edit' },
                    translations[validLanguage].edit || 'Edit'
                )
            )
        )
    );
}

export default React.memo(MyGobelin);
