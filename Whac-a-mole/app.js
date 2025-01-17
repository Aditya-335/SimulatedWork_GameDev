class WhacAMole {
    constructor() {
        this.scoreElement = document.getElementById('score');
        this.holes = document.querySelectorAll('.hole');
        this.startButton = document.getElementById('startButton');
        this.levelElement = document.getElementById('level');
        this.timerElement = document.getElementById('timer');
        
        this.score = 0;
        this.currentLevel = 1;
        this.isGameActive = false;
        this.moleTimers = [];
        this.activeMoles = new Set();
        this.timeLeft = 30;
        this.gameTimer = null;

        this.config = {
            baseInterval: 1500,
            minInterval: 400,
            bonusProbability: 0.2,
            levelThreshold: 100,
            speedIncrease: 100
        };

        this.startGame = this.startGame.bind(this);
        this.stopGame = this.stopGame.bind(this);
        this.whackMole = this.whackMole.bind(this);
        this.showMole = this.showMole.bind(this);
        this.updateTimer = this.updateTimer.bind(this);

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', this.startGame);
        this.holes.forEach(hole => {
            hole.addEventListener('click', () => this.whackMole(hole));
        });
    }

    updateTimer() {
        this.timeLeft--;
        this.timerElement.textContent = this.timeLeft;
        
        if (this.timeLeft <= 0) {
            this.stopGame();
        }
    }

    startGame() {
        this.score = 0;
        this.currentLevel = 1;
        this.isGameActive = true;
        this.activeMoles.clear();
        this.timeLeft = 30;
        
        this.updateScore();
        this.updateLevel();
        this.timerElement.textContent = this.timeLeft;
        this.startButton.style.display = 'none';

        this.gameTimer = setInterval(this.updateTimer, 1000);

        this.scheduleNextMole();
    }

    stopGame() {
        this.isGameActive = false;
        this.moleTimers.forEach(timer => clearTimeout(timer));
        this.moleTimers = [];
        this.activeMoles.clear();
        
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        
        this.holes.forEach(hole => {
            hole.classList.remove('mole', 'bonus-mole');
            hole.dataset.active = 'false';
        });

        alert(`Game Over! Final Score: ${this.score}`);
        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Play Again';
    }

    scheduleNextMole() {
        if (!this.isGameActive) return;

        const baseDelay = Math.max(
            this.config.minInterval,
            this.config.baseInterval - (this.currentLevel - 1) * this.config.speedIncrease
        );
        const randomDelay = baseDelay * (0.5 + Math.random());

        const timer = setTimeout(() => {
            this.showMole();
            this.scheduleNextMole();
        }, randomDelay);

        this.moleTimers.push(timer);
    }

    showMole() {
        if (!this.isGameActive) return;

        const availableHoles = Array.from(this.holes)
            .filter(hole => !this.activeMoles.has(hole));

        if (availableHoles.length === 0) return;

        const hole = availableHoles[Math.floor(Math.random() * availableHoles.length)];
        
        const isBonus = Math.random() < this.config.bonusProbability;
        
        hole.classList.add(isBonus ? 'bonus-mole' : 'mole');
        hole.dataset.active = 'true';
        hole.dataset.bonus = isBonus;
        this.activeMoles.add(hole);

        const duration = isBonus ? 1000 : 2000;
        const timer = setTimeout(() => {
            this.hideMole(hole);
        }, duration);

        this.moleTimers.push(timer);
    }

    hideMole(hole) {
        hole.classList.remove('mole', 'bonus-mole');
        hole.dataset.active = 'false';
        this.activeMoles.delete(hole);
    }

    whackMole(hole) {
        if (!this.isGameActive || hole.dataset.active !== 'true') return;

        const isBonus = hole.dataset.bonus === 'true';
        const points = isBonus ? 20 : 10;
        this.score += points;

        this.updateScore();
        this.checkLevel();

        this.hideMole(hole);

        this.showWhackEffect(hole);
    }

    showWhackEffect(hole) {
        const effect = document.createElement('div');
        effect.className = 'whack-effect';
        hole.appendChild(effect);
        
        setTimeout(() => effect.remove(), 300);
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    checkLevel() {
        const newLevel = Math.floor(this.score / this.config.levelThreshold) + 1;
        if (newLevel !== this.currentLevel) {
            this.currentLevel = newLevel;
            this.updateLevel();
            this.showLevelUpMessage();
        }
    }

    updateLevel() {
        this.levelElement.textContent = this.currentLevel;
    }

    showLevelUpMessage() {
        const message = document.createElement('div');
        message.className = 'level-up-message';
        message.textContent = `Level ${this.currentLevel}!`;
        document.body.appendChild(message);
        
        setTimeout(() => message.remove(), 1500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WhacAMole();
});