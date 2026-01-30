/**
 * Keyboard Drag and Drop Game Module
 * Namespaced to avoid conflicts.
 */
const KeyboardDragDropGame = {
    containerId: 'keyboard-game-root',
    rows: [
        ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
        ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
        ["z", "x", "c", "v", "b", "n", "m"]
    ],
    missingKeys: [],
    placedKeys: 0,
    totalMissing: 4,

    /**
     * Initialize the game.
     */
    init: function() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container #${this.containerId} not found.`);
            return;
        }

        this.resetState();
        this.render(container);
        this.attachEventListeners(container);
    },

    /**
     * Reset game state.
     */
    resetState: function() {
        this.missingKeys = [];
        this.placedKeys = 0;

        // Flatten rows to pick random keys
        const allKeys = this.rows.flat();

        // Randomly select 4 unique keys to be missing
        while (this.missingKeys.length < this.totalMissing) {
            const randomIndex = Math.floor(Math.random() * allKeys.length);
            const key = allKeys[randomIndex];
            if (!this.missingKeys.includes(key)) {
                this.missingKeys.push(key);
            }
        }
    },

    /**
     * Render the game board and pool.
     */
    render: function(container) {
        container.innerHTML = ''; // Clear container

        // 1. Create Game Board
        const board = document.createElement('div');
        board.className = 'kbd-game-board';

        this.rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'kbd-game-row';

            row.forEach(char => {
                if (this.missingKeys.includes(char)) {
                    // Render placeholder
                    const placeholder = document.createElement('div');
                    placeholder.className = 'kbd-game-placeholder';
                    placeholder.dataset.targetKey = char;
                    // Allow dropping
                    placeholder.addEventListener('dragover', this.handleDragOver.bind(this));
                    placeholder.addEventListener('dragleave', this.handleDragLeave.bind(this));
                    placeholder.addEventListener('drop', this.handleDrop.bind(this));
                    rowDiv.appendChild(placeholder);
                } else {
                    // Render static key
                    const keyDiv = document.createElement('div');
                    keyDiv.className = 'kbd-game-key';
                    keyDiv.textContent = char.toUpperCase();
                    rowDiv.appendChild(keyDiv);
                }
            });
            board.appendChild(rowDiv);
        });

        container.appendChild(board);

        // 2. Create Key Pool
        const pool = document.createElement('div');
        pool.className = 'kbd-game-pool';
        pool.id = 'kbd-game-pool'; // ID for easy access to reset incorrect drops

        // Shuffle missing keys for the pool
        const shuffledKeys = [...this.missingKeys].sort(() => Math.random() - 0.5);

        shuffledKeys.forEach(char => {
            const draggable = document.createElement('div');
            draggable.className = 'kbd-game-draggable';
            draggable.draggable = true;
            draggable.textContent = char.toUpperCase();
            draggable.dataset.key = char;

            // Drag events
            draggable.addEventListener('dragstart', this.handleDragStart.bind(this));
            draggable.addEventListener('dragend', this.handleDragEnd.bind(this));

            pool.appendChild(draggable);
        });

        container.appendChild(pool);
    },

    /**
     * Event Handlers
     */
    handleDragStart: function(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.key);
        e.dataTransfer.effectAllowed = 'move';
        e.target.classList.add('kbd-game-dragging');
        // Store reference if needed, but dataTransfer is standard
    },

    handleDragEnd: function(e) {
        e.target.classList.remove('kbd-game-dragging');
    },

    handleDragOver: function(e) {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = 'move';
        e.target.classList.add('kbd-game-drag-over');
    },

    handleDragLeave: function(e) {
        e.target.classList.remove('kbd-game-drag-over');
    },

    handleDrop: function(e) {
        e.preventDefault();
        const target = e.target;
        target.classList.remove('kbd-game-drag-over');

        const droppedKeyChar = e.dataTransfer.getData('text/plain');
        const targetKeyChar = target.dataset.targetKey;

        // Validation
        if (droppedKeyChar === targetKeyChar) {
            // Correct Drop
            this.handleCorrectDrop(target, droppedKeyChar);
        } else {
            // Incorrect Drop - Visual Feedback?
            // The key snaps back because we don't remove it from the pool unless it's correct.
            // We can add a shake animation to the target or the pool.
            this.handleIncorrectDrop(target);
        }
    },

    handleCorrectDrop: function(targetPlaceholder, char) {
        // Find the dragged element in the pool and remove it
        const pool = document.getElementById('kbd-game-pool');
        const draggable = pool.querySelector(`.kbd-game-draggable[data-key="${char}"]`);
        if (draggable) {
            draggable.remove();
        }

        // Update placeholder style
        targetPlaceholder.classList.remove('kbd-game-placeholder');
        targetPlaceholder.classList.add('kbd-game-key'); // Look like a normal key now
        targetPlaceholder.classList.add('kbd-game-filled'); // Add success style
        targetPlaceholder.textContent = char.toUpperCase();

        // Remove drop listeners
        const newClone = targetPlaceholder.cloneNode(true);
        targetPlaceholder.parentNode.replaceChild(newClone, targetPlaceholder);

        // Check Win Condition
        this.placedKeys++;
        if (this.placedKeys === this.totalMissing) {
            this.triggerWin();
        }
    },

    handleIncorrectDrop: function(target) {
        target.classList.add('incorrect');
        setTimeout(() => target.classList.remove('incorrect'), 500);
    },

    triggerWin: function() {
        // Dispatch custom event
        const event = new CustomEvent('gameComplete', {
            detail: { game: 'keyboard-puzzle' }
        });
        document.dispatchEvent(event);

        // Visual flair
        const container = document.getElementById(this.containerId);
        const msg = document.createElement('div');
        msg.innerHTML = "<h3>Puzzle Complete! 🎉</h3>";
        msg.style.marginTop = "20px";
        msg.style.color = "#4CAF50";
        msg.style.animation = "kbd-game-popIn 0.5s ease";
        container.appendChild(msg);
    },

    attachEventListeners: function(container) {
        // Any global listeners for the container if needed
    }
};
