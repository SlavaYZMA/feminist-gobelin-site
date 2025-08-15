import React from 'react';
import { keywordRules } from './keywordRules.js';
import { translations } from './config.js';

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

    return React.createElement(
        'div',
        { className: 'page chat-page' },
        React.createElement('h1', null, translations[language].aiChat || 'AI Chat'),
        React.createElement(
            'div',
            {
                className: 'details-toggle',
                onClick: () => setShowDetails(!showDetails)
            },
            translations[language].detailsToggle[showDetails ? 'open' : 'closed']
        ),
        showDetails && React.createElement(
            'div',
            { className: 'details-form' },
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('label', null, translations[language].name),
                React.createElement('input', {
                    type: 'text',
                    value: tempName,
                    onChange: (e) => setTempName(e.target.value),
                    placeholder: translations[language].namePlaceholder
                })
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('label', null, translations[language].country),
                React.createElement(
                    'select',
                    {
                        value: tempCountry,
                        onChange: (e) => setTempCountry(e.target.value)
                    },
                    React.createElement('option', { value: '' }, translations[language].selectCountry),
                    countries.map(country => React.createElement('option', { key: country, value: country }, country))
                )
            ),
            React.createElement(
                'div',
                { className: 'form-group' },
                React.createElement('label', null, translations[language].city),
                React.createElement(
                    'select',
                    {
                        value: tempCity,
                        onChange: (e) => setTempCity(e.target.value),
                        disabled: !tempCountry || citiesByCountry[tempCountry].length === 0
                    },
                    React.createElement('option', { value: '' }, translations[language].selectCity),
                    tempCountry && citiesByCountry[tempCountry].map(city => React.createElement('option', { key: city, value: city }, city))
                )
            ),
            React.createElement(
                'button',
                { onClick: saveData, className: 'action-button' },
                translations[language].save
            ),
            React.createElement(
                'button',
                { onClick: resetData, className: 'action-button reset' },
                translations[language].reset
            )
        ),
        React.createElement(
            'div',
            { className: 'chat-container', ref: chatContainerRef },
            messages.map((message, index) => React.createElement(
                'div',
                { key: index, className: `message ${message.role}` },
                message.role === 'user' && editingIndex === index
                    ? React.createElement(
                        'div',
                        { className: 'edit-container' },
                        React.createElement('textarea', {
                            value: editText,
                            onChange: (e) => setEditText(e.target.value)
                        }),
                        React.createElement(
                            'button',
                            { onClick: () => saveEdit(index) },
                            translations[language].save
                        ),
                        React.createElement(
                            'button',
                            { onClick: () => setEditingIndex(null) },
                            translations[language].cancel
                        )
                    )
                    : React.createElement(
                        React.Fragment,
                        null,
                        React.createElement('div', { className: 'message-content' }, message.content),
                        React.createElement('div', { className: 'message-timestamp' }, message.timestamp),
                        React.createElement(
                            'div',
                            { className: 'message-actions' },
                            message.role === 'user' && React.createElement(
                                'button',
                                { onClick: () => startEditing(index, message.content) },
                                translations[language].edit
                            ),
                            message.role === 'user' && React.createElement(
                                'button',
                                { onClick: () => clearMessage(index) },
                                translations[language].delete
                            ),
                            message.role === 'assistant' && React.createElement(
                                'button',
                                { onClick: () => copyText(message.content) },
                                translations[language].copy
                            ),
                            message.role === 'assistant' && React.createElement(
                                'button',
                                { onClick: () => shareResponse(message.content) },
                                translations[language].share
                            ),
                            message.role === 'assistant' && React.createElement(
                                'button',
                                { onClick: () => regenerateResponse(index) },
                                translations[language].regenerate
                            )
                        )
                    )
            ))
        ),
        isLoading && React.createElement(
            'div',
            { className: 'loading' },
            translations[language].loading
        ),
        React.createElement(
            'button',
            {
                onClick: clearHistory,
                className: 'action-button clear-history',
                disabled: messages.length === 0
            },
            translations[language].clearHistory
        ),
        React.createElement(
            'div',
            { className: 'input-container' },
            React.createElement('textarea', {
                value: prompt,
                onChange: (e) => setPrompt(e.target.value),
                placeholder: translations[language].promptPlaceholder,
                rows: 3
            }),
            React.createElement(
                'button',
                {
                    onClick: handleSubmit,
                    className: 'action-button',
                    disabled: isLoading || !prompt
                },
                translations[language].send
            )
        )
    );
}

export default AIChat;
