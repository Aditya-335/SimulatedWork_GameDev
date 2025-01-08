class Breakout {
    constructor() {
        // Game elements
        this.gameBoard = document.getElementById('gameBoard');
        this.ball = document.getElementById('ball');
        this.paddle = document.getElementById('paddle');
        this.scoreElement = document.getElementById('score');
        this.startButton = document.getElementById('startButton');

        this.score = 0;
        this.gameInterval = null;
        this.isGameActive = false;

        this.ballPos = { x: 300, y: 200 };
        this.ballDir = { x: 4, y: -4 };

        this.paddlePos = 250;
        this.paddleSpeed = 20;

        
        this.blocks = [];
        this.blockWidth = 80;
        this.blockHeight = 20;

        this.startGame = this.startGame.bind(this);
        this.movePaddle = this.movePaddle.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.checkCollision = this.checkCollision.bind(this);

        this.startButton.addEventListener('click', this.startGame);
        document.addEventListener('keydown', this.movePaddle);

        this.createBlocks();
    }

    createBlocks() {
        this.blocks = [];
        const blocksPerRow = 7;
        const rows = 4;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < blocksPerRow; col++) {
                const block = document.createElement('div');
                block.className = 'block';
                const x = col * (this.blockWidth + 5) + 10;
                const y = row * (this.blockHeight + 5) + 10;
                block.style.left = x + 'px';
                block.style.top = y + 'px';
                this.gameBoard.appendChild(block);
                this.blocks.push({
                    element: block,
                    x: x,
                    y: y,
                    width: this.blockWidth,
                    height: this.blockHeight
                });
            }
        }
    }

    startGame() {
        if (this.isGameActive) return;

        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.ballPos = { x: 300, y: 200 };
        this.ballDir = { x: 4, y: -4 };
        this.paddlePos = 250;
        this.isGameActive = true;

        this.blocks.forEach(block => block.element.remove());
        this.createBlocks();

        this.gameInterval = setInterval(this.gameLoop, 16);
        this.startButton.style.display = 'none';
    }

    movePaddle(event) {
        if (!this.isGameActive) return;

        if (event.key === 'ArrowLeft' && this.paddlePos > 0) {
            this.paddlePos = Math.max(0, this.paddlePos - this.paddleSpeed);
        }
        if (event.key === 'ArrowRight' && this.paddlePos < 500) {
            this.paddlePos = Math.min(500, this.paddlePos + this.paddleSpeed);
        }
        this.paddle.style.left = this.paddlePos + 'px';
    }

    checkCollision(x, y) {
        if (y >= 360 && y <= 370 &&
            x >= this.paddlePos && x <= this.paddlePos + 100) {
            return 'paddle';
        }

        if (x <= 0 || x >= 585) return 'wall';
        if (y <= 0) return 'ceiling';
        if (y >= 385) return 'floor';

        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            if (x >= block.x && x <= block.x + block.width &&
                y >= block.y && y <= block.y + block.height) {
                block.element.remove();
                this.blocks.splice(i, 1);
                this.score += 10;
                this.scoreElement.textContent = this.score;
                return 'block';
            }
        }

        return null;
    }

    gameLoop() {
        this.ballPos.x += this.ballDir.x;
        this.ballPos.y += this.ballDir.y;

        const collision = this.checkCollision(this.ballPos.x, this.ballPos.y);

        if (collision === 'paddle' || collision === 'ceiling') {
            this.ballDir.y = -this.ballDir.y;
        }
        if (collision === 'wall') {
            this.ballDir.x = -this.ballDir.x;
        }
        if (collision === 'floor') {
            this.endGame();
            return;
        }
        if (collision === 'block') {
            this.ballDir.y = -this.ballDir.y;
            if (this.blocks.length === 0) {
                this.winGame();
                return;
            }
        }

        this.ball.style.left = this.ballPos.x + 'px';
        this.ball.style.top = this.ballPos.y + 'px';
    }

    endGame() {
        this.isGameActive = false;
        clearInterval(this.gameInterval);
        alert(`Game Over! Final Score: ${this.score}`);
        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Play Again';
    }

    winGame() {
        this.isGameActive = false;
        clearInterval(this.gameInterval);
        alert(`Congratulations! You've won! Score: ${this.score}`);
        this.startButton.style.display = 'block';
        this.startButton.textContent = 'Play Again';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Breakout();
});