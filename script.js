document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const languageSelect = document.getElementById('language');
    const modeSelect = document.getElementById('mode');
    const textToTypeElement = document.getElementById('text-to-type');
    const inputArea = document.getElementById('input-area');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const timeElement = document.getElementById('time');
    const errorsElement = document.getElementById('errors');

    // State
    let originalText = '';
    let timer = null;
    let timeLeft = 60;
    let startTime = null;
    let errors = 0;
    let isStarted = false;

    const texts = {
        english: {
            practice: "The quick brown fox jumps over the lazy dog. This pangram sentence contains every letter of the alphabet at least once.",
            test: "In the heart of the bustling city, where skyscrapers touch the clouds and streets hum with the rhythm of life, there exists a hidden oasis of tranquility. A small park, adorned with ancient trees and a serene pond, offers a refuge from the chaos. It is a place where time seems to slow down, allowing weary souls to find a moment of peace and reflection amidst the urban jungle."
        },
        hindi: {
            practice: "टाइपिंग एक कला है। इसमें अभ्यास का बहुत महत्व है। नियमित रूप से प्रैक्टिस करने से गति और सटीकता दोनों बढ़ती है।",
            test: "प्रौद्योगिकी के इस युग में कंप्यूटर और इंटरनेट हमारे जीवन का एक अभिन्न अंग बन चुके हैं। चाहे शिक्षा हो, व्यवसाय हो या मनोरंजन, हर क्षेत्र में टाइपिंग की स्किल की आवश्यकता महसूस होती है। एक अच्छी टाइपिंग स्पीड न केवल समय बचाती है, बल्कि कार्यक्षमता को भी बढ़ाती है।"
        }
    };

    function initializeApp() {
        reset();
        loadNewText();
    }

    function loadNewText() {
        const language = languageSelect.value;
        const mode = modeSelect.value;
        originalText = texts[language][mode];
        textToTypeElement.innerHTML = originalText.split('').map(char => `<span>${char}</span>`).join('');
        inputArea.value = '';
        inputArea.disabled = true;
    }

    function start() {
        if (isStarted) return;
        isStarted = true;
        startTime = new Date();
        inputArea.disabled = false;
        inputArea.focus();
        startBtn.disabled = true;
        languageSelect.disabled = true;
        modeSelect.disabled = true;

        if (modeSelect.value === 'test') {
            timeLeft = 60;
            timer = setInterval(updateTimer, 1000);
        }
    }

    function updateTimer() {
        timeLeft--;
        timeElement.textContent = timeLeft;
        if (timeLeft <= 0) {
            finish();
        }
    }

    function finish() {
        clearInterval(timer);
        inputArea.disabled = true;
        isStarted = false;
        alert(`Test Finished!\nWPM: ${wpmElement.textContent}\nAccuracy: ${accuracyElement.textContent}%`);
    }

    function reset() {
        clearInterval(timer);
        isStarted = false;
        errors = 0;
        startTime = null;
        timeLeft = 60;
        wpmElement.textContent = '0';
        accuracyElement.textContent = '100';
        timeElement.textContent = modeSelect.value === 'test' ? '60' : '∞';
        errorsElement.textContent = '0';
        startBtn.disabled = false;
        languageSelect.disabled = false;
        modeSelect.disabled = false;
        inputArea.disabled = true;
        loadNewText();
    }

    function calculateStats() {
        if (!startTime) return;

        const timeElapsed = (new Date() - startTime) / 1000 / 60; // in minutes
        const typedText = inputArea.value;
        const typedWords = typedText.trim().split(/\s+/).length;
        
        // WPM Calculation
        const wpm = timeElapsed > 0 ? Math.round(typedWords / timeElapsed) : 0;
        wpmElement.textContent = wpm;

        // Accuracy Calculation
        let correctChars = 0;
        const currentTextLength = typedText.length;
        for (let i = 0; i < currentTextLength; i++) {
            if (typedText[i] === originalText[i]) {
                correctChars++;
            }
        }
        const accuracy = currentTextLength > 0 ? Math.round((correctChars / currentTextLength) * 100) : 100;
        accuracyElement.textContent = accuracy;
    }

    function handleInput() {
        if (!isStarted) return;

        const typedText = inputArea.value;
        const textSpans = textToTypeElement.querySelectorAll('span');
        errors = 0;

        textSpans.forEach((span, index) => {
            span.classList.remove('correct', 'incorrect', 'current');
            if (index < typedText.length) {
                if (typedText[index] === originalText[index]) {
                    span.classList.add('correct');
                } else {
                    span.classList.add('incorrect');
                    errors++;
                }
            } else if (index === typedText.length) {
                span.classList.add('current');
            }
        });

        errorsElement.textContent = errors;
        calculateStats();

        if (typedText === originalText) {
            finish();
        }
    }

    // Event Listeners
    startBtn.addEventListener('click', start);
    resetBtn.addEventListener('click', reset);
    inputArea.addEventListener('input', handleInput);
    languageSelect.addEventListener('change', reset);
    modeSelect.addEventListener('change', () => {
        timeElement.textContent = modeSelect.value === 'test' ? '60' : '∞';
        reset();
    });

    // Initial load
    initializeApp();
});