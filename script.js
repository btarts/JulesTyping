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
    find_keys: [
        "a s d f j k l ;",
        "q w e r u i o p",
        "z x c v m n",
        "g h t y b n",
        "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        "1 2 3 4 5 6 7 8 9 0",
        "f j f j f j",
        "d k d k d k",
        "s l s l s l",
        "a ; a ; a ;"
    ],
    shift: [], // Replaced by adventureLevels logic
    numbers: [
        "1 2 3 4 5 6 7 8 9 0",
        "My phone number is 555-0199.",
        "The year is 2023 and the time is 12:00 PM.",
        "10 + 20 = 30 and 100 - 50 = 50.",
        "There are 365 days in a year and 24 hours in a day.",
        "The speed of light is approximately 299,792,458 meters per second.",
        "Pi is approximately 3.14159265359.",
        "Call me at 555-0123 or 555-0145.",
        "1st, 2nd, 3rd, 4th, 5th, 6th, 7th, 8th, 9th, 10th.",
        "The meeting is on 12/25/2023 at 10:30 AM.",
        "50% of 200 is 100.",
        "1000, 2000, 3000, 4000, 5000.",
        "Order #998877 is ready for pickup.",
        "The temperature dropped to -5 degrees Celsius.",
        "Height: 5'11\", Weight: 180 lbs."
    ],
    symbols: [
        "!@#", "$%^", "&*()", "_+-=", "{}[]", "|\\:;", "\"'<", ">?,.", "~`",
        "<>?", ":\"|", "{}_+", "!@#$", "%^&*", "()_+"
    ],
    speed: [
        "qwer", "asdf", "zxcv", "tyui", "ghjk", "bnm", "opkl", "rewq", "fdsa", "vcxz",
        "mjuy", "nhbg", "vfcd", "xswz", "zaq", "xsw", "cde", "vfr", "bgt", "nhy"
    ],
    accuracy: [
        "Accommodate the embarrassment of the rhythm.",
        "The pronunciation of the word queue is interesting.",
        "Mischievous behavior can lead to unnecessary trouble.",
        "Conscience is the inner voice that warns us.",
        "Maintenance of the vehicle is necessary for safety.",
        "Thorough thought through throughout.",
        "Receive, deceive, ceiling, receipt.",
        "Necessary, separate, definitely, embarrass.",
        "Which witch is which?",
        "Their there they're.",
        "Two too to.",
        "Affect effect.",
        "Loose lose.",
        "Weather whether.",
        "Principal principle."
    ]
};

const adventureLevels = [
    { name: "Goblin Scout", icon: "👺", text: "New York City is known as the Big Apple." },
    { name: "Orc Warrior", icon: "👹", text: "The United States of America has 50 states." },
    { name: "Dark Wizard", icon: "🧙‍♂️", text: "Microsoft, Apple, Google, and Amazon are tech giants." },
    { name: "Stone Golem", icon: "🗿", text: "NASA stands for National Aeronautics and Space Administration." },
    { name: "Dragon", icon: "🐉", text: "The Quick Brown Fox Jumps Over The Lazy Dog." }
];

let currentLevel = 'easy';
let currentText = "";
let startTime = null;
let timerInterval = null;
let gameActive = false;
let gameDuration = 60;
let timeLeft = 60;
let totalTyped = 0;
let correctTyped = 0;

// Space Mode Globals
let spaceGameInterval = null;
let asteroidSpawnInterval = null;
let activeAsteroids = [];
let spaceLives = 3;
let spaceTarget = null; // The asteroid currently being typed

// Race Mode Globals
let raceInterval = null;

const textDisplay = document.getElementById('text-display');
const typingInput = document.getElementById('typing-input');
const timeEl = document.getElementById('time');
const wpmEl = document.getElementById('wpm');
const accuracyEl = document.getElementById('accuracy');
const gameArea = document.getElementById('game-area');
const restartBtn = document.getElementById('restart-btn');
const resultsModal = document.getElementById('results-modal');
const finalWpmEl = document.getElementById('final-wpm');
const finalAccuracyEl = document.getElementById('final-accuracy');
const mainMenu = document.getElementById('main-menu');

const adventureArea = document.getElementById('adventure-area');
const spaceArea = document.getElementById('space-area');
const raceArea = document.getElementById('race-area');

function startGame(level) {
    currentLevel = level;

    // Hide main menu
    mainMenu.classList.add('hidden');
    gameArea.classList.remove('hidden');
    
    createKeyboard();

    cleanupGame(); // Clean previous state

    if (level === 'shift') {
        startAdventureGame();
    } else if (level === 'symbols') {
        startSpaceGame();
    } else if (level === 'speed') {
        startRaceGame();
    } else {
        // Standard modes
        textDisplay.classList.remove('hidden');
        nextText();

        typingInput.disabled = false;
        typingInput.focus();
        typingInput.addEventListener('input', handleInput);
        typingInput.addEventListener('keydown', startTimerOnce);
    }
}

function goHome() {
    cleanupGame();

    // Hide game, show menu
    gameArea.classList.add('hidden');
    resultsModal.classList.add('hidden');
    mainMenu.classList.remove('hidden');
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
    currentText.split('').forEach((char, index) => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        textDisplay.appendChild(charSpan);
        if (index === 0) {
            charSpan.classList.add('current');
        }
    });
    // Highlight first key
    if (currentText.length > 0) {
        highlightKey(currentText[0]);
    }
}

function handleInput() {
    const arrayQuote = textDisplay.querySelectorAll('span');
    const arrayValue = typingInput.value.split('');
    
    let correct = true;
    let currentCorrect = 0;
    
    arrayQuote.forEach((characterSpan, index) => {
        const character = arrayValue[index];
        
        // Remove current class from all
        characterSpan.classList.remove('current');

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

    // Add current class to the next character to be typed
    if (arrayValue.length < arrayQuote.length) {
        arrayQuote[arrayValue.length].classList.add('current');
        highlightKey(arrayQuote[arrayValue.length].innerText);
    } else {
        // Clear keyboard highlight if done
        highlightKey(null);
    }
    
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

        if (currentLevel === 'shift') {
            updateAdventureVisuals(currentCorrect, currentText.length);
        } else if (currentLevel === 'speed') {
            updateRaceVisuals(currentCorrect, currentText.length);
        }
    }

    // Check if finished current text
    if (arrayValue.length === currentText.length && correct) {
        if (currentLevel === 'shift') {
            triggerLootAndMove();
        } else {
            // Add score from this round (simplified logic for now, just infinite play until timer runs out)
            // Or we could reload new text.
            // Let's add to total and clear.
            totalTyped += currentText.length;
            correctTyped += currentText.length;
            nextText();
        }
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

function cleanupGame() {
    clearInterval(timerInterval);
    clearInterval(spaceGameInterval);
    clearInterval(asteroidSpawnInterval);
    clearInterval(raceInterval);
    gameActive = false;

    // Remove all possible event listeners we might have added
    typingInput.removeEventListener('keydown', startTimerOnce);
    typingInput.removeEventListener('input', handleInput);
    typingInput.removeEventListener('input', handleSpaceInput);

    // Reset stats
    timeLeft = gameDuration;
    timeEl.innerText = timeLeft;
    wpmEl.innerText = 0;
    accuracyEl.innerText = 100;
    totalTyped = 0;
    correctTyped = 0;
    typingInput.value = '';

    // Hide all mode specific areas
    textDisplay.classList.add('hidden');
    document.getElementById('lives-stat').classList.add('hidden');
    if (adventureArea) adventureArea.classList.add('hidden');
    if (spaceArea) spaceArea.classList.add('hidden');
    if (raceArea) raceArea.classList.add('hidden');

    textDisplay.innerHTML = '';

    // Remove asteroids
    document.querySelectorAll('.asteroid').forEach(el => el.remove());
    activeAsteroids = [];
    spaceTarget = null;
}

function restartGame() {
    cleanupGame();
    startGame(currentLevel);
}

// Placeholders for new modes
function startAdventureGame() {
    adventureArea.classList.remove('hidden');
    // Hide battle area, show map
    document.getElementById('adventure-battle').classList.add('hidden');
    document.getElementById('adventure-map').classList.remove('hidden');
    textDisplay.classList.add('hidden'); // Hide text display until level starts

    renderAdventureMap();
}

function renderAdventureMap() {
    const grid = document.querySelector('.level-grid');
    grid.innerHTML = '';
    adventureLevels.forEach((level, index) => {
        const node = document.createElement('div');
        node.className = 'level-node';
        node.innerHTML = `
            <div class="icon">${level.icon}</div>
            <h4>${level.name}</h4>
        `;
        node.onclick = () => startAdventureLevel(index);
        grid.appendChild(node);
    });
}

function startAdventureLevel(index) {
    document.getElementById('adventure-map').classList.add('hidden');
    document.getElementById('adventure-battle').classList.remove('hidden');
    textDisplay.classList.remove('hidden');

    const level = adventureLevels[index];
    currentText = level.text;
    document.getElementById('monster-avatar').innerText = level.icon;

    // Reset visuals
    document.getElementById('player-avatar').style.left = '10%';
    document.getElementById('monster-avatar').style.opacity = '1';
    document.getElementById('monster-health-fill').style.width = '100%';
    document.getElementById('monster-avatar').style.transform = 'none';

    renderText();

    typingInput.disabled = false;
    typingInput.focus();
    typingInput.addEventListener('input', handleInput);
    typingInput.addEventListener('keydown', startTimerOnce);
}

function updateAdventureVisuals(currentLen, totalLen) {
    const healthPercent = 100 - ((currentLen / totalLen) * 100);
    document.getElementById('monster-health-fill').style.width = `${healthPercent}%`;
}

function triggerLootAndMove() {
    // Show Loot
    const lootEl = document.getElementById('loot-display');
    lootEl.classList.remove('hidden');

    // Animate Monster Death
    const monsterEl = document.getElementById('monster-avatar');
    monsterEl.style.transform = 'rotate(180deg) scale(0.5)';
    monsterEl.style.opacity = '0';

    // Move Player
    const playerEl = document.getElementById('player-avatar');
    playerEl.style.left = '80%'; // Move to monster position

    setTimeout(() => {
        // Return to Map
        lootEl.classList.add('hidden');

        // Add score
        totalTyped += currentText.length;
        correctTyped += currentText.length;

        typingInput.value = '';
        typingInput.disabled = true;

        // Go back to map
        document.getElementById('adventure-battle').classList.add('hidden');
        textDisplay.classList.add('hidden');
        document.getElementById('adventure-map').classList.remove('hidden');

    }, 1500); // 1.5s delay
}

function startSpaceGame() {
    spaceArea.classList.remove('hidden');
    document.getElementById('lives-stat').classList.remove('hidden');
    spaceLives = 3;
    document.getElementById('lives').innerText = spaceLives;

    activeAsteroids = [];
    spaceTarget = null;

    typingInput.disabled = false;
    typingInput.focus();
    // Use specific handler
    typingInput.addEventListener('input', handleSpaceInput);

    gameActive = true;

    // Start Loops
    spaceGameInterval = setInterval(updateSpaceGame, 50); // 20fps
    asteroidSpawnInterval = setInterval(spawnAsteroid, 2000); // Every 2s
}

function spawnAsteroid() {
    if (!gameActive) return;

    // Get random word/symbol
    const list = wordLists.symbols;
    const randomSentence = list[Math.floor(Math.random() * list.length)];
    const words = randomSentence.split(' ');
    const text = words[Math.floor(Math.random() * words.length)];

    const asteroid = document.createElement('div');
    asteroid.classList.add('asteroid');
    asteroid.innerText = text;

    const gameWidth = spaceArea.clientWidth;
    const x = Math.random() * (gameWidth - 100) + 50; // Padding

    asteroid.style.left = `${x}px`;
    asteroid.style.top = '0px';

    document.getElementById('space-canvas').appendChild(asteroid);

    activeAsteroids.push({
        el: asteroid,
        text: text,
        remainingText: text,
        x: x,
        y: 0,
        speed: 1 + (Math.random() * 2) // Speed 1-3
    });
}

function updateSpaceGame() {
    const height = spaceArea.clientHeight;

    activeAsteroids.forEach((ast, index) => {
        ast.y += ast.speed;
        ast.el.style.top = `${ast.y}px`;

        // Check collision
        if (ast.y > height - 50) { // Hit bottom
            damagePlayer();
            // Remove asteroid
            ast.el.remove();
            activeAsteroids.splice(index, 1);
            if (ast === spaceTarget) spaceTarget = null;
        }
    });
}

function handleSpaceInput() {
    const inputVal = typingInput.value;
    if (inputVal.length === 0) return;

    const char = inputVal.slice(-1); // Last typed char

    // If we have a target, check against it
    if (spaceTarget) {
        if (spaceTarget.remainingText.startsWith(char)) {
            // Correct
            spaceTarget.remainingText = spaceTarget.remainingText.substring(1);
            // Visual feedback? maybe highlight the asteroid text
            spaceTarget.el.innerHTML = `<span class="correct">${spaceTarget.text.slice(0, spaceTarget.text.length - spaceTarget.remainingText.length)}</span>${spaceTarget.remainingText}`;

            shootLaser(spaceTarget.el);

            if (spaceTarget.remainingText.length === 0) {
                // Destroyed
                spaceTarget.el.remove();
                activeAsteroids = activeAsteroids.filter(a => a !== spaceTarget);
                spaceTarget = null;
                totalTyped += 1; // Simplify score
            }
        } else {
            // Wrong key for target?
            // Maybe play error sound or shake
        }
    } else {
        // Find a target that starts with this char
        // Prefer lowest (highest y)
        const candidates = activeAsteroids.filter(a => a.remainingText.startsWith(char));
        if (candidates.length > 0) {
            // Sort by Y descending
            candidates.sort((a, b) => b.y - a.y);
            spaceTarget = candidates[0];

            // Process the hit
            spaceTarget.remainingText = spaceTarget.remainingText.substring(1);
            spaceTarget.el.innerHTML = `<span class="correct">${spaceTarget.text.slice(0, spaceTarget.text.length - spaceTarget.remainingText.length)}</span>${spaceTarget.remainingText}`;
            spaceTarget.el.classList.add('targeted');

            shootLaser(spaceTarget.el);

            if (spaceTarget.remainingText.length === 0) {
                spaceTarget.el.remove();
                activeAsteroids = activeAsteroids.filter(a => a !== spaceTarget);
                spaceTarget = null;
                totalTyped += 1;
            }
        }
    }

    // Always clear input in this mode so we capture raw keystrokes essentially
    typingInput.value = '';
}

function damagePlayer() {
    spaceLives--;
    document.getElementById('lives').innerText = spaceLives;
    if (spaceLives <= 0) {
        endGame();
    }
}

function shootLaser(targetEl) {
    const canvas = document.getElementById('space-canvas');
    const laser = document.createElement('div');
    laser.classList.add('laser');

    // Calculate angle? For now just vertical line or simple beam
    // Let's make it a line from ship to target
    const ship = document.getElementById('spaceship');
    const shipRect = ship.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const startX = shipRect.left + shipRect.width / 2 - canvasRect.left;
    const startY = shipRect.top - canvasRect.top;

    const endX = targetRect.left + targetRect.width / 2 - canvasRect.left;
    const endY = targetRect.top + targetRect.height - canvasRect.top;

    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;

    laser.style.height = `${length}px`; // Actually width if we rotate, but let's use height and rotate
    // Wait, div line usually is height.
    // Let's use simple CSS trick: rotate from bottom center
    // Rotation is 90 deg offset because 0 deg is right usually.
    // If using height, 0 deg is down?

    // Simpler: Just position laser at target center and animate opacity
    // Or just a flash.

    // Let's try drawing a line
    laser.style.left = `${startX}px`;
    laser.style.top = `${startY}px`;
    laser.style.width = '4px';
    laser.style.height = `${length}px`;
    laser.style.transformOrigin = 'top center';
    // Angle needs to be calculated carefully.
    // atan2(y, x). y is negative (up).
    const angle2 = Math.atan2(endX - startX, startY - endY) * (180 / Math.PI); // Angle from vertical up
    laser.style.transform = `rotate(${-angle2}deg)`; // Negative?

    // Actually, let's just use the simplest "beam" - a quick flash on the target
    // The complexity of drawing a rotated line in pure DOM without SVG/Canvas is annoying.
    // I'll stick to the "Laser" class I added which is just a vertical line, but maybe I won't use it for angled shots.

    // Alternative: A small explosion at the target.
    const explosion = document.createElement('div');
    explosion.style.position = 'absolute';
    explosion.style.left = `${endX}px`;
    explosion.style.top = `${endY}px`;
    explosion.style.width = '20px';
    explosion.style.height = '20px';
    explosion.style.background = '#f44336';
    explosion.style.borderRadius = '50%';
    explosion.style.zIndex = '100';
    canvas.appendChild(explosion);

    setTimeout(() => explosion.remove(), 100);
}

function startRaceGame() {
    raceArea.classList.remove('hidden');
    textDisplay.classList.remove('hidden');

    // Reset cars
    document.getElementById('player-car').style.left = '0%';
    document.getElementById('cpu-car-1').style.left = '0%';
    document.getElementById('cpu-car-2').style.left = '0%';
    document.getElementById('cpu-car-3').style.left = '0%';

    nextText();

    typingInput.disabled = false;
    typingInput.focus();
    typingInput.addEventListener('input', handleInput);
    typingInput.addEventListener('keydown', startTimerOnce);

    startCPUCars();
}

function updateRaceVisuals(currentLen, totalLen) {
    const progress = (currentLen / totalLen) * 90; // Max 90%
    document.getElementById('player-car').style.left = `${progress}%`;
}

function startCPUCars() {
    let cpu1Progress = 0;
    let cpu2Progress = 0;
    let cpu3Progress = 0;
    const finishLine = 90;

    raceInterval = setInterval(() => {
        if (!gameActive) return;

        cpu1Progress += 0.2; // Slow
        cpu2Progress += 0.35; // Medium
        cpu3Progress += 0.45; // Fast

        const c1 = document.getElementById('cpu-car-1');
        const c2 = document.getElementById('cpu-car-2');
        const c3 = document.getElementById('cpu-car-3');

        if(c1) c1.style.left = `${Math.min(cpu1Progress, 90)}%`;
        if(c2) c2.style.left = `${Math.min(cpu2Progress, 90)}%`;
        if(c3) c3.style.left = `${Math.min(cpu3Progress, 90)}%`;

        if (cpu1Progress >= finishLine || cpu2Progress >= finishLine || cpu3Progress >= finishLine) {
            // CPU Wins
            endGame();
            // Could add custom message here
            const modalH2 = resultsModal.querySelector('h2');
            if(modalH2) modalH2.innerText = "CPU Won! 🏎️";
        }
    }, 100);
}

function createKeyboard() {
    const keyboardContainer = document.getElementById('virtual-keyboard');
    if (!keyboardContainer || keyboardContainer.children.length > 0) return;

    const layout = [
        ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
        ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
        ["Caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
        ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
        ["Space"]
    ];

    layout.forEach(row => {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'keyboard-row';
        row.forEach(key => {
            const keyDiv = document.createElement('div');
            keyDiv.className = 'key';
            if (key === "Space") {
                keyDiv.innerText = "Space";
                keyDiv.dataset.key = " ";
            } else {
                keyDiv.innerText = key;
                keyDiv.dataset.key = key;
            }

            if (key.length > 1) keyDiv.classList.add('special');
            if (key === "Space") keyDiv.classList.add('space');

            rowDiv.appendChild(keyDiv);
        });
        keyboardContainer.appendChild(rowDiv);
    });
}

function highlightKey(char) {
    // Remove active class from all keys
    document.querySelectorAll('.key').forEach(k => k.classList.remove('active'));

    if (char == null) return;

    let keysToHighlight = [];
    const shiftMap = {
        '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5', '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-', '+': '=',
        '{': '[', '}': ']', '|': '\\', ':': ';', '"': "'", '<': ',', '>': '.', '?': '/'
    };

    if (shiftMap[char]) {
        keysToHighlight.push('Shift');
        keysToHighlight.push(shiftMap[char]);
    } else if (char >= 'A' && char <= 'Z') {
        keysToHighlight.push('Shift');
        keysToHighlight.push(char.toLowerCase());
    } else {
        keysToHighlight.push(char);
    }

    keysToHighlight.forEach(keyVal => {
        // Find key by data-key
        // We need to handle duplicate Shift keys
        if (keyVal === 'Shift') {
             const shifts = document.querySelectorAll('.key[data-key="Shift"]');
             shifts.forEach(s => s.classList.add('active'));
        } else {
             const keyEl = document.querySelector(`.key[data-key="${keyVal}"]`);
             if (keyEl) keyEl.classList.add('active');
        }
    });
}
