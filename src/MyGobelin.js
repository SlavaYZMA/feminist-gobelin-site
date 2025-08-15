import React from 'react';
import { keywordRules } from './keywordRules.js';
import { translations } from './config.js';

function MyGobelin({ threadsRef, language }) {
    const canvasRef = React.useRef(null);
    const [mode, setMode] = React.useState('history');
    const [historyText, setHistoryText] = React.useState('');
    const [submittedHistory, setSubmittedHistory] = React.useState(localStorage.getItem('submittedHistory') || '');
    const [isEditing, setIsEditing] = React.useState(false);

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

    const countTriggers = (text, triggerWords) => {
        const words = text.toLowerCase().split(/\s+/);
        return triggerWords.reduce((sum, word) => sum + words.includes(word), 0);
    };

    const getFractalParams = (text) => {
        const metrics = analyzeText(text);
        const params = {
            cX: (metrics.avgWordLen / 10) - 0.5,
            cY: (metrics.avgSentLen / 50) - 0.5,
            zoom: Math.min(10, 1 + (metrics.textLen / 500)),
            iterations: Math.min(500, 100 + metrics.uniqueWords * 5),
            hue: (metrics.upperCaseCount * 3) % 360,
            sat: Math.min(100, metrics.maxWordFreq * 10),
            bright: Math.min(100, metrics.vowelsRatio * 100),
            speed: Math.max(0.1, metrics.punctuationCount * 0.1),
            distortion: metrics.lineBreakCount * 0.05,
            symmetryBreak: metrics.digitCount * 0.1,
            breathingRate: Math.max(0.5, Math.min(2.0, metrics.avgSentLen / 10)),
            waveAmplitude: metrics.punctuationCount * 0.02,
            textureGrain: (1 - metrics.vowelsRatio) * 5,
            depthLayers: Math.max(1, metrics.lineBreakCount),
            rotationDir: metrics.vowelsRatio > 0.45 ? 1 : -1,
            flashFreq: 0,
            rgbSplit: 0
        };

        // Модификаторы от триггерных слов
        Object.keys(keywordRules.TRIGGERS).forEach(category => {
            const count = countTriggers(text, keywordRules.TRIGGERS[category]);
            if (category === 'fear') {
                params.zoom += count * 0.3;
                params.rgbSplit += count * 0.05; // Усиленный RGB-сплит
            } else if (category === 'anger') {
                params.sat += count * 10;
                params.flashFreq += count * 0.8; // Более частое мерцание
            } else if (category === 'body') {
                params.iterations += count * 20;
            } else if (category === 'place') {
                params.cX -= count * 0.03;
                params.cY -= count * 0.03;
            } else if (category === 'silence') {
                params.speed -= count * 0.1;
            } else if (category === 'escape') {
                params.distortion += count * 0.2; // Усиленное искажение
            } else if (category === 'nature') {
                params.distortion += count * 0.1;
                params.textureGrain += count * 2; // Хаотичная текстура
            } else if (category === 'hope') {
                params.bright += count * 10; // Яркое свечение
            }
        });

        return params;
    };

    const handleSubmitHistory = () => {
        if (!historyText) return;
        setSubmittedHistory(historyText);
        localStorage.setItem('submittedHistory', historyText);
        threadsRef.current = [getFractalParams(historyText)];
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
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth - 32;
            canvas.height = 800; // Увеличено для эпичности
        };

        const hsvToRgb = (h, s, v) => {
            s /= 100;
            v /= 100;
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
            const { cX, cY, zoom, iterations, hue, sat, bright, speed, distortion, symmetryBreak, breathingRate, waveAmplitude, textureGrain, depthLayers, rotationDir, flashFreq, rgbSplit } = params;
            const imageData = ctx.createImageData(canvas.width, canvas.height);
            const data = imageData.data;

            const scale = 4 / zoom;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            // Анимационные параметры
            const breathe = Math.sin(t * breathingRate * 1.5) * 0.15; // Усиленная пульсация
            const wave = Math.sin(t * speed) * waveAmplitude * 2; // Усиленные волны
            const rotation = t * speed * rotationDir * 0.02; // Спиральное вращение
            const chaos = Math.tan(t * distortion) * 0.01; // Странное искажение

            for (let x = 0; x < canvas.width; x += 4) {
                for (let y = 0; y < canvas.height; y += 4) {
                    let zx = ((x - centerX) / canvas.width) * scale;
                    let zy = ((y - centerY) / canvas.height) * scale;
                    // Применяем спиральное вращение
                    const rotatedZx = zx * Math.cos(rotation) - zy * Math.sin(rotation);
                    const rotatedZy = zx * Math.sin(rotation) + zy * Math.cos(rotation);
                    zx = rotatedZx + chaos * Math.sin(zy); // Странное искажение
                    zy = rotatedZy + chaos * Math.cos(zx);
                    // Применяем distortion и symmetryBreak
                    zx += Math.sin(zy * distortion * 2) * wave; // Усиленное искажение
                    zy += Math.cos(zx * distortion * 2) * symmetryBreak;

                    let i = 0;
                    let tempZx, tempZy;
                    while (i < iterations) {
                        tempZx = zx * zx - zy * zy + cX + breathe;
                        tempZy = 2 * zx * zy + cY + wave;
                        zx = tempZx;
                        zy = tempZy;
                        if (zx * zx + zy * zy > 4) break;
                        i++;
                    }

                    const idx = (y * canvas.width + x) * 4;
                    let color;
                    if (i === iterations) {
                        color = [0, 0, 0]; // Внутри множества — чёрный
                    } else {
                        const h = (hue + (i * 15) % 360) % 360; // Динамичный градиент
                        const s = Math.min(100, sat + (Math.sin(t * flashFreq * 2) * 30)); // Яркое мерцание
                        const v = Math.min(100, bright + (i / iterations) * 70); // Неоновое свечение
                        color = hsvToRgb(h, s, v);
                        // Усиленный RGB-сплит
                        if (rgbSplit > 0) {
                            color[0] += Math.sin(t + x * 0.02) * rgbSplit * 100;
                            color[1] += Math.sin(t + y * 0.02) * rgbSplit * 100;
                            color[2] += Math.cos(t + (x + y) * 0.02) * rgbSplit * 100;
                        }
                        // Хаотичная текстура
                        if (textureGrain > 0) {
                            const noise = (Math.random() - 0.5) * textureGrain * 2;
                            color = color.map(c => Math.max(0, Math.min(255, c + noise)));
                            if (Math.random() < 0.01 * textureGrain) { // Случайные вспышки
                                color = color.map(c => Math.min(255, c + 50));
                            }
                        }
                    }

                    // Глубина и свечение
                    const layerFactor = 1 - (i / iterations) * depthLayers * 0.8;
                    color = color.map(c => Math.max(0, Math.min(255, c * layerFactor)));

                    data[idx] = color[0];
                    data[idx + 1] = color[1];
                    data[idx + 2] = color[2];
                    data[idx + 3] = 255;
                }
            }

            ctx.putImageData(imageData, 0, 0);
        };

        const animate = () => {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            if (threadsRef.current.length > 0) {
                renderFractal(threadsRef.current[0], time);
                time += 0.016; // ~60fps
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
    }, [threadsRef, language]);

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
                            threadsRef.current = [getFractalParams(submittedHistory)];
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
