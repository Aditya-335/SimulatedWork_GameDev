class WhacAMole {
    constructor() {
        this.score = 0;
        this.timeLeft = 30;
        this.isGameActive = false;
        this.currentPosition = null;
        
        this.squares = document.querySelectorAll('.hole');
        this.scoreDisplay = document.getElementById('score');
        this.timeDisplay = document.getElementById('time');
        this.startButton = document.getElementById('startButton');
        
        this.startGame = this.startGame.bind(this);
        this.whackMole = this.whackMole.bind(this);
        this.moveMole = this.moveMole.bind(this);
        this.countDown = this.countDown.bind(this);
        
        this.startButton.addEventListener('click', this.startGame);
        this.squares.forEach(square => {
            square.addEventListener('click', () => this.whackMole(square));
        });
    }

    whackMole(square) {
        if (!this.isGameActive) return;
        
        if (square.classList.contains('mole')) {
            this.score++;
            this.scoreDisplay.textContent = this.score;
            
            square.classList.remove('mole');
            
            this.moveMole();
        }
    }

    moveMole() {
        this.squares.forEach(square => {
            square.classList.remove('mole');
        });

        let randomSquare = this.squares[Math.floor(Math.random() * this.squares.length)];
        
        randomSquare.classList.add('mole');
        this.currentPosition = randomSquare;
    }

    countDown() {
        this.timeLeft--;
        this.timeDisplay.textContent = this.timeLeft;

        if (this.timeLeft === 0) {
            this.endGame();
        }
    }

    // Start the game
    startGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.isGameActive = true;
        
        this.scoreDisplay.textContent = this.score;
        this.timeDisplay.textContent = this.timeLeft;
        
        this.startButton.style.display = 'none';

        let moveInterval = setInterval(this.moveMole, 1000);
        
        let timeInterval = setInterval(this.countDown, 1000);

        this.intervals = {
            move: moveInterval,
            time: timeInterval
        };

        this.moveMole();
    }

    endGame() {
        this.isGameActive = false;
        
        clearInterval(this.intervals.move);
        clearInterval(this.intervals.time);
        
        if (this.currentPosition) {
            this.currentPosition.classList.remove('mole');
        }
        
        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Play Again';
        
        alert(`Game Over! Your final score is: ${this.score}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WhacAMole();
});