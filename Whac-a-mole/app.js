class WhacAMole {
    constructor() {
        this.score = 0;
        this.timeLeft = 30;
        this.isGameActive = false;
        this.molePosition = null;
        this.gameInterval = null;
        this.timeInterval = null;

        this.scoreElement = document.getElementById('score');
        this.timeElement = document.getElementById('time');
        this.startButton = document.getElementById('startButton');
        this.holes = document.querySelectorAll('.hole');

        
        this.startGame = this.startGame.bind(this);
        this.endGame = this.endGame.bind(this);
        this.moveMole = this.moveMole.bind(this);
        this.whackMole = this.whackMole.bind(this);

        this.startButton.addEventListener('click', this.startGame);
        this.holes.forEach(hole => {
            hole.addEventListener('click', () => this.whackMole(hole));
        });
    }

    startGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.isGameActive = true;
        this.scoreElement.textContent = this.score;
        this.timeElement.textContent = this.timeLeft;
        this.startButton.style.display = 'none';

        this.gameInterval = setInterval(this.moveMole, 1000);

        this.timeInterval = setInterval(() => {
            this.timeLeft--;
            this.timeElement.textContent = this.timeLeft;

            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);

        this.moveMole();
    }

    endGame() {
        this.isGameActive = false;
        clearInterval(this.gameInterval);
        clearInterval(this.timeInterval);
        
        if (this.molePosition !== null) {
            this.holes[this.molePosition].classList.remove('mole');
        }

        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Play Again';
        alert(`Game Over! Your score: ${this.score}`);
    }

    moveMole() {
        if (this.molePosition !== null) {
            this.holes[this.molePosition].classList.remove('mole');
        }

        const newPosition = Math.floor(Math.random() * this.holes.length);
        this.molePosition = newPosition;
        this.holes[newPosition].classList.add('mole');
    }

    whackMole(hole) {
        if (!this.isGameActive) return;

        const index = parseInt(hole.dataset.index);
        if (index === this.molePosition) {
            this.score++;
            this.scoreElement.textContent = this.score;
            hole.classList.remove('mole');
            this.moveMole();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WhacAMole();
});