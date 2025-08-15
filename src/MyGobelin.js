import React from 'react';
import { keywordRules } from './keywordRules.js';
import { translations } from './config.js';

function MyGobelin({ threadsRef, language }) {
    const canvasRef = React.useRef(null);
    const blsCanvasRef = React.useRef(null);
    const [mode, setMode] = React.useState('history');
    const [historyText, setHistoryText] = React.useState('');
    const [submittedHistory, setSubmittedHistory] = React.useState(localStorage.getItem('submittedHistory') || '');
    const [isEditing, setIsEditing] = React.useState(false);
    const [blsActive, setBlsActive] = React.useState(false);
    const [blsFrequency, setBlsFrequency] = React.useState(1.2); // Гц
    const [blsMode, setBlsMode] = React.useState('standard'); // Мягко, Стандарт, Интенсивнее
    const [setActive, setSetActive] = React.useState(false);
    const [setCount, setSetCount] = React.useState(0);
    const [showConsent, setShowConsent] = React.useState(true);
    const [survey, setSurvey] = React.useState({ distress: 0, tension: 0, calm: 0, completed: false });

    // Анализирует текст
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
        const upperCaseCount = text.split('').filter(c => c.match(/[A-ZА-Я]/)).length;
        const digitCount = text.split('').filter(c => c.match(/\d/)).length;
        const punctuationCount = text.split('').filter(c => c.match(/[.,!?;:]/)).length;
        const lineBreakCount = text.split('\n').length - 1;
        const vowels = text.split('').filter(c => c.match(/[aeiouyаеёиоуыэюя]/i)).length;
        const consonants = text.split('').filter(c => c.match(/[bcdfghjklmnpqrstvwxyzбвгджзйклмнпрстфхцчшщ]/i)).length;
        const vowelsRatio = consonants ? vowels / consonants : 0;

        return {
            textLen, wordCount, avgWordLen, sentCount, avgSentLen,
            uniqueWords, maxWordFreq, upperCaseCount, digitCount,
            punctuationCount, lineBreakCount, vowelsRatio
        };
    };

    // Подсчитывает триггерные слова
    const countTriggers = (text, triggerWords) => {
        const words = text.toLowerCase().split(/\s+/);
        return triggerWords.reduce((sum, word) => sum + words.includes(word), 0);
    };

    // Генерирует параметры фрактала
    const getFractalParams = (text, setProgress) => {
        const metrics = analyzeText(text);
        const params = {
            cX: (metrics.avgWordLen / 10) - 0.5,
            cY: (metrics.avgSentLen / 50) - 0.5,
            zoom: Math.min(10, 1 + (metrics.textLen / 500)),
            iterations: Math.min(400, 100 + metrics.uniqueWords * 5),
            hue: (metrics.upperCaseCount * 3) % 360,
            sat: Math.min(100, metrics.maxWordFreq * 15 * (setProgress < 0.75 ? 1 : 0.8)),
            bright: Math.min(100, metrics.vowelsRatio * 120 * (setProgress < 0.75 ? 1 : 0.9)),
            speed: Math.max(0.1, metrics.punctuationCount * 0.15 * (setProgress < 0.75 ? 1 : 0.5)),
            distortion: metrics.lineBreakCount * 0.1,
            symmetryBreak: metrics.digitCount * 0.15,
            breathingRate: Math.max(0.5, Math.min(2.0, metrics.avgSentLen / 10)) * (setProgress < 0.75 ? 1 : 0.5),
            waveAmplitude: metrics.punctuationCount * 0.05,
            textureGrain: (1 - metrics.vowelsRatio) * 2,
            depthLayers: Math.max(1, metrics.lineBreakCount),
            rotationDir: metrics.vowelsRatio > 0.45 ? 1 : -1,
            flashFreq: 0,
            rgbSplit: 0,
            escapeRadius: 4 + metrics.textLen / 1000,
            twist: metrics.uniqueWords * 0.01
        };

        let palette = 'default';
        Object.keys(keywordRules.TRIGGERS).forEach(category => {
            const count = countTriggers(text, keywordRules.TRIGGERS[category]);
            if (count > 0) {
                if (category === 'fear') {
                    params.zoom += count * 0.3;
                    params.rgbSplit += count * 0.015;
                    params.hue = (params.hue + 180) % 360;
                    params.twist += count * 0.02;
                    palette = 'fear';
                } else if (category === 'anger') {
                    params.sat += count * 10;
                    params.flashFreq += count * 0.2;
                    params.hue = (params.hue + 360) % 360;
                    params.distortion += count * 0.1;
                    palette = 'anger';
                } else if (category === 'body') {
                    params.iterations += count * 20;
                    params.cX += count * 0.02;
                    palette = palette === 'default' ? 'body' : palette;
                } else if (category === 'place') {
                    params.cX -= count * 0.04;
                    params.cY -= count * 0.04;
                    params.twist += count * 0.01;
                    palette = palette === 'default' ? 'place' : palette;
                } else if (category === 'silence') {
                    params.speed -= count * 0.1;
                    params.bright = Math.min(100, params.bright * 0.9);
                    params.hue = (params.hue + 200) % 360;
                    palette = 'silence';
                } else if (category === 'escape') {
                    params.distortion += count * 0.2;
                    params.twist += count * 0.03;
                    palette = palette === 'default' ? 'escape' : palette;
                } else if (category === 'nature') {
                    params.distortion += count * 0.1;
                    params.hue = (params.hue + 120) % 360;
                    params.waveAmplitude += count * 0.03;
                    palette = 'nature';
                } else if (category === 'hope') {
                    params.bright += count * 10;
                    params.hue = (params.hue + 60) % 360;
                    params.breathingRate += count * 0.2;
                    palette = 'hope';
                }
            }
        });

        params.palette = palette;
        return params;
    };

    // Обработка текста и сохранение
    const handleSubmitHistory = () => {
        if (!historyText) return;
        setSubmittedHistory(historyText);
        localStorage.setItem('submittedHistory', historyText);
        threadsRef.current = [getFractalParams(historyText, 0)];
        localStorage.setItem('threads', JSON.stringify(threadsRef.current));
        setHistoryText('');
        setIsEditing(false);
        setShowConsent(true);
    };

    const handleClearHistory = () => {
        setHistoryText('');
        setSubmittedHistory('');
        localStorage.removeItem('submittedHistory');
        threadsRef.current = [];
        localStorage.setItem('threads', JSON.stringify([]));
        setBlsActive(false);
        setSetCount(0);
    };

    const handleEditHistory = () => {
        setHistoryText(submittedHistory);
        setIsEditing(true);
        setBlsActive(false);
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

    // Управление BLS и сетами
    const handleStartBls = () => {
        setBlsActive(true);
        setSetActive(true);
        setSetCount(1);
        setSurvey({ distress: 0, tension: 0, calm: 0, completed: false });
    };

    const handlePauseBls = () => {
        setSetActive(false);
    };

    const handleStopBls = () => {
        setBlsActive(false);
        setSetActive(false);
        setSetCount(0);
        threadsRef.current = [{
            ...threadsRef.current[0],
            hue: 60,
            sat: 50,
            bright: 80,
            speed: 0,
            breathingRate: 0,
            waveAmplitude: 0,
            rgbSplit: 0,
            flashFreq: 0
        }];
    };

    const handleCalmDown = () => {
        setBlsFrequency(prev => Math.max(0.8, prev - 0.2));
        threadsRef.current = [{
            ...threadsRef.current[0],
            sat: Math.max(20, threadsRef.current[0].sat * 0.8),
            bright: Math.max(20, threadsRef.current[0].bright * 0.9),
            speed: Math.max(0.05, threadsRef.current[0].speed * 0.7),
            zoom: Math.max(1, threadsRef.current[0].zoom * 0.9)
        }];
    };

    const handleConsent = () => {
        setShowConsent(false);
        setSurvey({ distress: 0, tension: 0, calm: 0, completed: false });
    };

    // Обработка опроса
    const handleSurveySubmit = (type, value) => {
        setSurvey(prev => ({ ...prev, [type]: value }));
    };

    const handleSurveyComplete = () => {
        setSurvey(prev => ({ ...prev, completed: true }));
        console.log('Survey results:', survey);
    };

    React.useEffect(() => {
        const canvas = canvasRef.current;
        const blsCanvas = blsCanvasRef.current;
        const ctx = canvas.getContext('2d');
        const blsCtx = blsCanvas.getContext('2d');
        let animationFrameId;
        let time = 0;
        let prevBreathe = 0, prevWave = 0, prevRotation = 0, prevTwist = 0;
        let setStartTime = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth - 32;
            canvas.height = 600; // Из твоего CSS
            blsCanvas.width = canvas.width;
            blsCanvas.height = canvas.height;
        };

        const lerp = (start, end, factor) => start + (end - start) * factor;

        const hsvToRgb = (h, s, v, palette) => {
            s /= 100;
            v /= 100;
            if (palette === 'hope') h = (h + 60) % 360;
            else if (palette === 'fear') h = (h + 180) % 360;
            else if (palette === 'anger') h = (h + 360) % 360;
            else if (palette === 'nature') h = (h + 120) % 360;
            else if (palette === 'silence') {
                s *= 0.8;
                h = (h + 200) % 360;
            }
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

        const renderFractal = (params, t, setProgress) => {
            const { cX, cY, zoom, iterations, hue, sat, bright, speed, distortion, symmetryBreak, breathingRate, waveAmplitude, textureGrain, depthLayers, rotationDir, flashFreq, rgbSplit, palette, escapeRadius, twist } = params;
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            const scale = 4 / zoom;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const targetBreathe = Math.sin(t * breathingRate * 0.8) * 0.1;
            const targetWave = Math.sin(t * speed * 1.2) * waveAmplitude * 1.2;
            const targetRotation = t * speed * rotationDir * 0.015;
            const targetTwist = Math.sin(t * twist) * 0.04;

            const breathe = lerp(prevBreathe, targetBreathe, 0.1);
            const wave = lerp(prevWave, targetWave, 0.1);
            const rotation = lerp(prevRotation, targetRotation, 0.1);
            const twistEffect = lerp(prevTwist, targetTwist, 0.1);

            prevBreathe = breathe;
            prevWave = wave;
            prevRotation = rotation;
            prevTwist = twistEffect;

            for (let x = 0; x < canvas.width; x += 1) {
                for (let y = 0; y < canvas.height; y += 1) {
                    let zx = ((x - centerX) / canvas.width) * scale;
                    let zy = ((y - centerY) / canvas.height) * scale;
                    const rotatedZx = zx * Math.cos(rotation + twistEffect) - zy * Math.sin(rotation + twistEffect);
                    const rotatedZy = zx * Math.sin(rotation + twistEffect) + zy * Math.cos(rotation + twistEffect);
                    zx = rotatedZx + Math.sin(zy * distortion) * wave;
                    zy = rotatedZy + Math.cos(zx * distortion) * symmetryBreak;

                    let i = 0;
                    let tempZx, tempZy;
                    while (i < iterations) {
                        tempZx = zx * zx - zy * zy + cX + breathe;
                        tempZy = 2 * zx * zy + cY + wave;
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
                        const h = (hue + (i * 20) % 360) % 360;
                        const s = Math.min(100, sat + (Math.sin(t * flashFreq) * 15));
                        const v = Math.min(100, bright + (i / iterations) * 80);
                        color = hsvToRgb(h, s, v, palette);
                        if (rgbSplit > 0) {
                            color[0] += Math.sin(t + x * 0.01) * rgbSplit * 30;
                            color[1] += Math.sin(t + y * 0.01) * rgbSplit * 30;
                            color[2] += Math.cos(t + (x + y) * 0.01) * rgbSplit * 30;
                        }
                        if (textureGrain > 0) {
                            const noise = (Math.random() - 0.5) * textureGrain;
                            color = color.map(c => Math.max(0, Math.min(255, c + noise)));
                        }
                    }

                    const layerFactor = 1 - (i / iterations) * depthLayers * 0.5;
                    color = color.map(c => Math.max(0, Math.min(255, c * layerFactor)));

                    data[idx] = color[0];
                    data[idx + 1] = color[1];
                    data[idx + 2] = color[2];
                    data[idx + 3] = 255;
                }
            }

            ctx.putImageData(imageData, 0, 0);
        };

        const renderBlsMarker = (t) => {
            blsCtx.clearRect(0, 0, blsCanvas.width, blsCanvas.height);
            if (!blsActive || !setActive) return;

            const amplitude = blsCanvas.width * 0.8;
            const centerX = blsCanvas.width / 2;
            const centerY = blsCanvas.height / 2;
            const x = centerX + amplitude * 0.5 * Math.sin(t * blsFrequency * 2 * Math.PI);
            const hueShift = x < centerX ? -5 : 5;
            const brightShift = Math.abs(x - centerX) < amplitude * 0.1 ? 1.05 : 1;

            const gradient = blsCtx.createRadialGradient(x, centerY, 0, x, centerY, 30);
            const baseHue = (threadsRef.current[0]?.hue || 0) + hueShift;
            const [r, g, b] = hsvToRgb(baseHue, 80 * brightShift, 90 * brightShift, threadsRef.current[0]?.palette);
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

            blsCtx.beginPath();
            blsCtx.arc(x, centerY, 30, 0, 2 * Math.PI);
            blsCtx.fillStyle = gradient;
            blsCtx.fill();
        };

        const animate = () => {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (threadsRef.current.length > 0) {
                const setDuration = 25;
                const pauseDuration = 12;
                const maxSets = 6;
                const setProgress = setCount > 0 ? (time - setStartTime) / setDuration : 0;

                if (blsActive && setActive && setCount <= maxSets) {
                    if (setProgress >= 1) {
                        setSetActive(false);
                        setTimeout(() => {
                            setSetCount(prev => prev + 1);
                            setSetActive(true);
                            setStartTime = time;
                            threadsRef.current = [getFractalParams(submittedHistory, setCount / maxSets)];
                        }, pauseDuration * 1000);
                    }
                } else if (setCount > maxSets) {
                    handleStopBls();
                    setSurvey(prev => ({ ...prev, completed: false }));
                }

                renderFractal(threadsRef.current[0], time, setCount / maxSets);
                renderBlsMarker(time);
                time += 0.008;
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [threadsRef, language, blsActive, setActive, setCount, blsFrequency, submittedHistory]);

    const renderConsentScreen = () => (
        React.createElement(
            'div',
            { className: 'consent-screen' },
            React.createElement('h2', null, translations[language].disclaimer || 'Disclaimer'),
            React.createElement('p', null, translations[language].disclaimerText || 'This is an artistic visualization with bilateral stimulation (BLS) inspired by EMDR. It is not psychotherapy and does not replace professional help. Consult a certified specialist for therapy.'),
            React.createElement('p', null, translations[language].warning || 'Content may be triggering. Use grounding techniques (e.g., deep breathing, orienting in the room). Do not use in case of dissociation, crisis, psychosis, or suicidal thoughts without professional support.'),
            React.createElement('p', null, translations[language].privacy || 'Your text is processed locally and not stored unless you choose to save it.'),
            React.createElement(
                'button',
                { onClick: handleConsent, className: 'consent-button' },
                translations[language].consent || 'I Understand and Agree'
            ),
            React.createElement(
                'a',
                { href: 'https://www.nice.org.uk/guidance/ng116', target: '_blank', className: 'guideline-link' },
                translations[language].guidelines || 'Learn more about EMDR guidelines'
            )
        )
    );

    const renderSurvey = () => (
        React.createElement(
            'div',
            { className: 'survey-screen' },
            React.createElement('h2', null, translations[language].survey || 'How do you feel?'),
            ['distress', 'tension', 'calm'].map(type => (
                React.createElement(
                    'div',
                    { key: type, className: 'survey-item' },
                    React.createElement('label', null, translations[language][type] || type.charAt(0).toUpperCase() + type.slice(1)),
                    React.createElement('input', {
                        type: 'range',
                        min: 0,
                        max: 10,
                        value: survey[type],
                        onChange: (e) => handleSurveySubmit(type, parseInt(e.target.value))
                    }),
                    React.createElement('span', null, survey[type])
                )
            )),
            React.createElement(
                'button',
                { onClick: handleSurveyComplete, className: 'survey-button', disabled: survey.completed },
                translations[language].submitSurvey || 'Submit'
            )
        )
    );

    return React.createElement(
        'div',
        { className: 'page gobelin-page' },
        showConsent && renderConsentScreen(),
        !showConsent && [
            React.createElement('h1', { key: 'title' }, translations[language].myGobelin || 'My Data Art'),
            React.createElement(
                'div',
                { key: 'mode-switcher', className: 'mode-switcher' },
                React.createElement(
                    'button',
                    {
                        className: `mode-button ${mode === 'history' ? 'active' : ''}`,
                        onClick: () => {
                            setMode('history');
                            if (submittedHistory) {
                                threadsRef.current = [getFractalParams(submittedHistory, 0)];
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
            React.createElement('canvas', { key: 'fractal-canvas', ref: canvasRef, className: 'data-art-canvas' }),
            React.createElement('canvas', { key: 'bls-canvas', ref: blsCanvasRef, className: 'bls-canvas', style: { position: 'absolute', pointerEvents: 'none' } }),
            mode === 'history' && React.createElement(
                'div',
                { key: 'history-container', className: 'history-container' },
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
            submittedHistory && !showConsent && React.createElement(
                'div',
                { key: 'bls-controls', className: 'bls-controls' },
                React.createElement(
                    'button',
                    { onClick: handleStartBls, className: 'bls-button', disabled: blsActive },
                    translations[language].startBls || 'Start BLS'
                ),
                React.createElement(
                    'button',
                    { onClick: handlePauseBls, className: 'bls-button', disabled: !blsActive },
                    translations[language].pauseBls || 'Pause BLS'
                ),
                React.createElement(
                    'button',
                    { onClick: handleStopBls, className: 'bls-button', disabled: !blsActive },
                    translations[language].stopBls || 'Stop BLS'
                ),
                React.createElement(
                    'button',
                    { onClick: handleCalmDown, className: 'bls-button' },
                    translations[language].calmDown || 'Make Calmer'
                ),
                React.createElement(
                    'div',
                    { className: 'bls-frequency' },
                    React.createElement('label', null, translations[language].frequency || 'BLS Frequency (Hz)'),
                    React.createElement('input', {
                        type: 'range',
                        min: 0.8,
                        max: 2.0,
                        step: 0.1,
                        value: blsFrequency,
                        onChange: (e) => setBlsFrequency(parseFloat(e.target.value))
                    }),
                    React.createElement('span', null, blsFrequency.toFixed(1))
                ),
                React.createElement(
                    'div',
                    { className: 'bls-mode' },
                    ['soft', 'standard', 'intense'].map(mode => (
                        React.createElement(
                            'button',
                            {
                                key: mode,
                                className: `bls-mode-button ${blsMode === mode ? 'active' : ''}`,
                                onClick: () => {
                                    setBlsMode(mode);
                                    setBlsFrequency(mode === 'soft' ? 0.8 : mode === 'standard' ? 1.2 : 1.8);
                                }
                            },
                            translations[language][mode] || mode.charAt(0).toUpperCase() + mode.slice(1)
                        )
                    ))
                )
            ),
            React.createElement(
                'div',
                { key: 'gobelin-buttons', className: 'gobelin-buttons' },
                React.createElement(
                    'button',
                    { onClick: shareGobelin, className: 'gobelin-button share-button' },
                    translations[language].share || 'Share'
                )
            ),
            blsActive && !survey.completed && renderSurvey()
        ]
    );
}

export default MyGobelin;
