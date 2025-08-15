import React from 'react';
import { keywordRules } from './keywordRules.js';
import { translations } from './config.js';

function MyGobelin({ threadsRef, language }) {
    const canvasRef = React.useRef(null);
    const [mode, setMode] = React.useState('history');
    const [historyText, setHistoryText] = React.useState('');
    const [submittedHistory, setSubmittedHistory] = React.useState(localStorage.getItem('submittedHistory') || '');
    const [isEditing, setIsEditing] = React.useState(false);

    // Анализирует текст, извлекая метрики для управления фракталом
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

    // Подсчитывает триггерные слова для эмоционального отклика
    const countTriggers = (text, triggerWords) => {
        const words = text.toLowerCase().split(/\s+/);
        return triggerWords.reduce((sum, word) => sum + words.includes(word), 0);
    };

    // Генерирует параметры фрактала на основе текста
    const getFractalParams = (text) => {
        const metrics = analyzeText(text);
        const params = {
            cX: (metrics.avgWordLen / 10) - 0.5, // Центр фрактала по X
            cY: (metrics.avgSentLen / 50) - 0.5, // Центр фрактала по Y
            zoom: Math.min(10, 1 + (metrics.textLen / 500)), // Масштаб
            iterations: Math.min(200, 100 + metrics.uniqueWords * 5), // Детализация (оптимизировано)
            hue: (metrics.upperCaseCount * 3) % 360, // Базовый цвет
            sat: Math.min(100, metrics.maxWordFreq * 20), // Насыщенность
            bright: Math.min(100, metrics.vowelsRatio * 120), // Яркость
            speed: Math.max(0.1, metrics.punctuationCount * 0.12), // Скорость анимации
            distortion: metrics.lineBreakCount * 0.1, // Искажение
            symmetryBreak: metrics.digitCount * 0.15, // Асимметрия
            breathingRate: Math.max(0.5, Math.min(2.0, metrics.avgSentLen / 10)), // Пульсация
            waveAmplitude: metrics.punctuationCount * 0.04, // Волны
            textureGrain: (1 - metrics.vowelsRatio) * 1, // Минимальная зернистость
            depthLayers: Math.max(1, metrics.lineBreakCount), // Глубина
            rotationDir: metrics.vowelsRatio > 0.45 ? 1 : -1, // Направление вращения
            rgbSplit: 0, // RGB-сплит (смягчён)
            escapeRadius: 4 + metrics.textLen / 1000, // Радиус выхода
            twist: metrics.uniqueWords * 0.01 // Скручивание форм
        };

        // Модификаторы от триггерных слов для синестетической гаммы
        let palette = 'feminist';
        Object.keys(keywordRules.TRIGGERS).forEach(category => {
            const count = countTriggers(text, keywordRules.TRIGGERS[category]);
            if (count > 0) {
                if (category === 'fear') {
                    params.zoom += count * 0.3;
                    params.rgbSplit += count * 0.01;
                    params.hue = (params.hue + 180) % 360; // Бирюзовый с фиолетовым
                    params.twist += count * 0.02;
                } else if (category === 'anger') {
                    params.sat += count * 15;
                    params.hue = (params.hue + 330) % 360; // Розовый с фиолетовым
                    params.distortion += count * 0.1;
                } else if (category === 'body') {
                    params.iterations += count * 15;
                    params.cX += count * 0.02;
                } else if (category === 'place') {
                    params.cX -= count * 0.04;
                    params.cY -= count * 0.04;
                    params.twist += count * 0.01;
                } else if (category === 'silence') {
                    params.speed -= count * 0.1;
                    params.bright = Math.min(100, params.bright * 0.9);
                    params.hue = (params.hue + 300) % 360; // Пастельный розовый/фиолетовый
                } else if (category === 'escape') {
                    params.distortion += count * 0.2;
                    params.twist += count * 0.03;
                } else if (category === 'nature') {
                    params.distortion += count * 0.1;
                    params.hue = (params.hue + 180) % 360; // Бирюзовый с персиковым
                    params.waveAmplitude += count * 0.03;
                } else if (category === 'hope') {
                    params.bright += count * 15;
                    params.hue = (params.hue + 60) % 360; // Золотой с персиковым
                    params.breathingRate += count * 0.2;
                }
            }
        });

        params.palette = palette;
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
        let gl, program, animationFrameId, time = 0;
        let prevBreathe = 0, prevWave = 0, prevRotation = 0, prevTwist = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth - 32;
            canvas.height = 800;
            if (gl) {
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
        };

        // Линейная интерполяция для плавных переходов
        const lerp = (start, end, factor) => start + (end - start) * factor;

        // Вершинный шейдер
        const vertexShaderSource = `
            attribute vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        // Фрагментный шейдер для фрактала Julia с синестетической гаммой
        const fragmentShaderSource = `
            precision highp float;
            uniform vec2 u_resolution;
            uniform float u_time;
            uniform vec2 u_c;
            uniform float u_zoom;
            uniform float u_iterations;
            uniform float u_hue;
            uniform float u_sat;
            uniform float u_bright;
            uniform float u_distortion;
            uniform float u_symmetryBreak;
            uniform float u_breathingRate;
            uniform float u_waveAmplitude;
            uniform float u_textureGrain;
            uniform float u_depthLayers;
            uniform float u_rotationDir;
            uniform float u_rgbSplit;
            uniform float u_escapeRadius;
            uniform float u_twist;

            vec3 hsvToRgb(float h, float s, float v) {
                // Синестетическая палитра: розовый, фиолетовый, золотой, персиковый, бирюзовый
                float hues[5];
                hues[0] = 60.0; // Персиковый
                hues[1] = 180.0; // Бирюзовый
                hues[2] = 300.0; // Фиолетовый
                hues[3] = 330.0; // Розовый
                hues[4] = 50.0; // Золотой
                float closestHue = hues[0];
                for (int i = 1; i < 5; i++) {
                    if (abs(h - hues[i]) < abs(h - closestHue)) {
                        closestHue = hues[i];
                    }
                }
                vec3 colors[5];
                colors[0] = vec3(1.0, 0.8, 0.6); // Персиковый (#FFCC99)
                colors[1] = vec3(0.4, 0.8, 0.8); // Бирюзовый (#66CCCC)
                colors[2] = vec3(0.8, 0.6, 1.0); // Фиолетовый (#CC99FF)
                colors[3] = vec3(1.0, 0.6, 0.6); // Розовый (#FF9999)
                colors[4] = vec3(1.0, 0.84, 0.0); // Золотой (#FFD700)
                vec3 color = colors[0];
                for (int i = 0; i < 5; i++) {
                    if (closestHue == hues[i]) {
                        color = colors[i];
                        break;
                    }
                }
                return color * v * (s * 0.8 + 0.2);
            }

            void main() {
                vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / u_resolution.y;
                float scale = 4.0 / u_zoom;
                vec2 z = uv * scale;
                float breathe = sin(u_time * u_breathingRate * 0.6) * 0.06;
                float wave = sin(u_time * 1.2) * u_waveAmplitude * 1.0;
                float rotation = u_time * u_rotationDir * 0.01;
                float twistEffect = sin(u_time * u_twist) * 0.02;
                vec2 rotatedZ = vec2(
                    z.x * cos(rotation + twistEffect) - z.y * sin(rotation + twistEffect),
                    z.x * sin(rotation + twistEffect) + z.y * cos(rotation + twistEffect)
                );
                z = rotatedZ + vec2(sin(z.y * u_distortion) * wave, cos(z.x * u_distortion) * u_symmetryBreak);
                vec2 c = u_c + vec2(breathe, wave);
                float i = 0.0;
                for (int n = 0; n < int(u_iterations); n++) {
                    float tempZx = z.x * z.x - z.y * z.y + c.x;
                    float tempZy = 2.0 * z.x * z.y + c.y;
                    z = vec2(tempZx, tempZy);
                    if (dot(z, z) > u_escapeRadius) break;
                    i += 1.0;
                }
                vec3 color = vec3(0.0);
                if (i < u_iterations) {
                    float h = mod(u_hue + i * 15.0, 360.0);
                    float s = min(1.0, u_sat + (i / u_iterations) * 0.2);
                    float v = min(1.0, u_bright + (i / u_iterations) * 0.8);
                    color = hsvToRgb(h, s, v);
                    if (u_rgbSplit > 0.0) {
                        color.r += sin(u_time + gl_FragCoord.x * 0.01) * u_rgbSplit * 0.2;
                        color.g += sin(u_time + gl_FragCoord.y * 0.01) * u_rgbSplit * 0.2;
                        color.b += cos(u_time + (gl_FragCoord.x + gl_FragCoord.y) * 0.01) * u_rgbSplit * 0.2;
                    }
                    if (u_textureGrain > 0.0) {
                        float noise = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) * 43758.5453)) - 0.5) * u_textureGrain;
                        color += noise * 0.05;
                    }
                    float layerFactor = 1.0 - (i / u_iterations) * u_depthLayers * 0.5;
                    color *= layerFactor;
                }
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        React.useEffect(() => {
            const canvas = canvasRef.current;
            gl = canvas.getContext('webgl');
            if (!gl) {
                console.error('WebGL не поддерживается');
                return;
            }

            // Создание шейдеров
            const createShader = (type, source) => {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error('Ошибка компиляции шейдера:', gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                    return null;
                }
                return shader;
            };

            const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
            const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
            if (!vertexShader || !fragmentShader) return;

            // Создание программы
            program = gl.createProgram();
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Ошибка линковки программы:', gl.getProgramInfoLog(program));
                return;
            }
            gl.useProgram(program);

            // Создание буфера для вершин
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            const positions = new Float32Array([
                -1, -1, 1, -1, -1, 1,
                -1, 1, 1, -1, 1, 1
            ]);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            const positionLocation = gl.getAttribLocation(program, 'a_position');
            gl.enableVertexAttribArray(positionLocation);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            let time = 0;
            let prevBreathe = 0, prevWave = 0, prevRotation = 0, prevTwist = 0;

            const resizeCanvas = () => {
                canvas.width = window.innerWidth - 32;
                canvas.height = 800;
                gl.viewport(0, 0, canvas.width, canvas.height);
            };

            // Линейная интерполяция для плавных переходов
            const lerp = (start, end, factor) => start + (end - start) * factor;

            const animate = () => {
                if (threadsRef.current.length > 0) {
                    const params = threadsRef.current[0];
                    const { cX, cY, zoom, iterations, hue, sat, bright, speed, distortion, symmetryBreak, breathingRate, waveAmplitude, textureGrain, depthLayers, rotationDir, rgbSplit, escapeRadius, twist, palette } = params;

                    // Плавные анимационные параметры
                    const targetBreathe = Math.sin(time * breathingRate * 0.6) * 0.06;
                    const targetWave = Math.sin(time * speed * 1.2) * waveAmplitude * 1.0;
                    const targetRotation = time * speed * rotationDir * 0.01;
                    const targetTwist = Math.sin(time * twist) * 0.02;

                    const breathe = lerp(prevBreathe, targetBreathe, 0.03);
                    const wave = lerp(prevWave, targetWave, 0.03);
                    const rotation = lerp(prevRotation, targetRotation, 0.03);
                    const twistEffect = lerp(prevTwist, targetTwist, 0.03);

                    prevBreathe = breathe;
                    prevWave = wave;
                    prevRotation = rotation;
                    prevTwist = twistEffect;

                    // Установка униформ
                    gl.uniform2f(gl.getUniformLocation(program, 'u_resolution'), canvas.width, canvas.height);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_time'), time);
                    gl.uniform2f(gl.getUniformLocation(program, 'u_c'), cX + breathe, cY + wave);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_zoom'), zoom);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_iterations'), iterations);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_hue'), hue);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_sat'), sat / 100);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_bright'), bright / 100);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_distortion'), distortion);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_symmetryBreak'), symmetryBreak);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_breathingRate'), breathingRate);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_waveAmplitude'), waveAmplitude);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_textureGrain'), textureGrain);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_depthLayers'), depthLayers);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_rotationDir'), rotationDir);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_rgbSplit'), rgbSplit);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_escapeRadius'), escapeRadius);
                    gl.uniform1f(gl.getUniformLocation(program, 'u_twist'), twist);

                    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Белый фон
                    gl.clear(gl.COLOR_BUFFER_BIT);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);

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
                if (gl) {
                    gl.deleteProgram(program);
                    gl.deleteShader(vertexShader);
                    gl.deleteShader(fragmentShader);
                    gl.deleteBuffer(positionBuffer);
                }
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
