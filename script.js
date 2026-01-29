const wordLists = {
    easy: [
        "cat dog sun fun run play jump red blue green",
        "apple banana orange grape kiwi pear plum",
        "car bus bike train plane boat ship",
        "one two three four five six seven eight nine ten",
        "hat cap shoe sock shirt pant coat"
    ],
    medium: [
        "The quick brown fox jumps over the lazy dog.",
        "She sells sea shells by the sea shore.",
        "I like to play with my friends in the park.",
        "Reading books is fun and helps you learn.",
        "The sun rises in the east and sets in the west."
    ],
    hard: [
        "Photosynthesis is the process by which plants make their own food using sunlight.",
        "The solar system consists of the sun and everything that orbits around it.",
        "Elephants are the largest living land animals and have very long trunks.",
        "Computers are machines that can process information very quickly and accurately.",
        "Friendship is one of the most important things in life because friends help each other."
    ],
    shift: [
        "New York City is known as the Big Apple.",
        "The United States of America has 50 states.",
        "Harry Potter and the Sorcerer's Stone.",
        "Microsoft, Apple, Google, and Amazon are tech giants.",
        "The Quick Brown Fox Jumps Over The Lazy Dog."
    ],
    numbers: [
        "1 2 3 4 5 6 7 8 9 0",
        "My phone number is 555-0199.",
        "The year is 2023 and the time is 12:00 PM.",
        "10 + 20 = 30 and 100 - 50 = 50.",
        "There are 365 days in a year and 24 hours in a day."
    ],
    symbols: [
        "Hello, world! How are you today?",
        "user@example.com is a sample email address.",
        "Prices start at $9.99 for the first month.",
        "Use #hashtag to tag your posts!",
        "HTML uses tags like <div> and <span>."
    ],
    speed: [
        "the of and a to in is you that it",
        "he was for on are as with his they I",
        "at be this have from or one had by word",
        "but not what all were we when your can said",
        "there use an each which she do how their if"
    ],
    accuracy: [
        "Accommodate the embarrassment of the rhythm.",
        "The pronunciation of the word queue is interesting.",
        "Mischievous behavior can lead to unnecessary trouble.",
        "Conscience is the inner voice that warns us.",
        "Maintenance of the vehicle is necessary for safety."
    ]
};

let currentLevel = 'easy';
let currentText = "";
let startTime = null;
let timerInterval = null;
let gameActive = false;
let gameDuration = 60;
let timeLeft = 60;
let totalTyped = 0;
let correctTyped = 0;

const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const gameArea = document.getElementById('game-area');
const difficultySelector = document.querySelector('.difficulty-selector');
const restartBtn = document.getElementById('restart-btn');
const resultsModal = document.getElementById('results-modal');
const finalWpmEl = document.getElementById('final-wpm');
const finalAccuracyEl = document.getElementById('final-accuracy');

function startGame(level) {
    currentLevel = level;
    // Hide all difficulty selectors and headers
    document.querySelectorAll('.difficulty-selector').forEach(el => el.classList.add('hidden'));
    const skillHeading = document.querySelector('h3');
    if (skillHeading) skillHeading.classList.add('hidden');

    gameArea.classList.remove('hidden');
    document.querySelector('header').classList.add('hidden'); // Hide header to save space
    
    resetGame();
    nextText();
    
    typingInput.disabled = false;
    typingInput.focus();
    typingInput.addEventListener('input', handleInput);
    
    // Start timer on first input
    typingInput.addEventListener('keydown', startTimerOnce);
}

function startTimerOnce() {
    if (!gameActive) {
        gameActive = true;
        startTime = new Date();
        timerInterval = setInterval(updateTimer, 1000);
        typingInput.removeEventListener('keydown', startTimerOnce);
    }
}

function nextText() {
    const list = wordLists[currentLevel];
    currentText = list[Math.floor(Math.random() * list.length)];
    renderText();
    typingInput.value = '';
}

function renderText() {
    textDisplay.innerHTML = '';
    currentText.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        textDisplay.appendChild(charSpan);
    });
}

function handleInput() {
    const arrayQuote = textDisplay.querySelectorAll('span');
    const arrayValue = typingInput.value.split('');
    
    let correct = true;
    let currentCorrect = 0;
    
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        
        if (character == null) {
            characterSpan.classList.remove('correct');
            characterSpan.classList.remove('incorrect');
            correct = false;
        } else if (character === characterSpan.innerText) {
            characterSpan.classList.add('correct');
            characterSpan.classList.remove('incorrect');
            currentCorrect++;
        } else {
            characterSpan.classList.remove('correct');
            characterSpan.classList.add('incorrect');
            correct = false;
        }
    });
    
    // Update stats
    const totalChars = arrayValue.length;
    if (totalChars > 0) {
        // Calculate WPM: (characters / 5) / (time in minutes)
        // If time is small, WPM spikes, so we might want to dampen it or just show it raw.
        // Let's use elapsed time.
        const elapsedSeconds = (new Date() - startTime) / 1000;
        const elapsedMinutes = elapsedSeconds / 60;
        if (elapsedSeconds > 1) {
            const wpm = Math.round((currentCorrect / 5) / elapsedMinutes);
            wpmEl.innerText = wpm;
        }
        
        const accuracy = Math.round((currentCorrect / totalChars) * 100);
        accuracyEl.innerText = accuracy;
    }

    // Check if finished current text
    if (arrayValue.length === currentText.length && correct) {
        // Add score from this round (simplified logic for now, just infinite play until timer runs out)
        // Or we could reload new text.
        // Let's add to total and clear.
        totalTyped += currentText.length;
        correctTyped += currentText.length;
        nextText();
    }
}

function updateTimer() {
    if (timeLeft > 0) {
        timeLeft--;
        timeEl.innerText = timeLeft;
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(timerInterval);
    gameActive = false;
    typingInput.disabled = true;
    
    // Calculate final stats
    // We need to account for what was currently typed in the input
    const arrayValue = typingInput.value.split('');
    const arrayQuote = textDisplay.querySelectorAll('span');
    let currentSessionCorrect = 0;
     arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        if (character === characterSpan.innerText) {
            currentSessionCorrect++;
        }
    });

    const totalCorrect = correctTyped + currentSessionCorrect;
    const finalWpm = Math.round((totalCorrect / 5) / (gameDuration / 60));
    // Accuracy is tricky if we reset text. Let's just estimate or use the last known accuracy.
    // Better: Accuracy = (Total Correct Characters / Total Typed Characters) * 100
    // But we didn't track total typed perfectly across resets. 
    // Let's use the WPM we calculated and the accuracy from the display.
    
    finalWpmEl.innerText = finalWpm;
    finalAccuracyEl.innerText = accuracyEl.innerText;
    
    resultsModal.classList.remove('hidden');
}

function resetGame() {
    clearInterval(timerInterval);
    gameActive = false;
    timeLeft = gameDuration;
    timeEl.innerText = timeLeft;
    wpmEl.innerText = 0;
    accuracyEl.innerText = 100;
    totalTyped = 0;
    correctTyped = 0;
    typingInput.value = '';
}

function restartGame() {
    // Reload page or reset state
    location.reload(); 
}
