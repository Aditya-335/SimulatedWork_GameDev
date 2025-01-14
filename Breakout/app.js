class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.startButton = document.getElementById('startButton');
        this.resetButton = document.getElementById('resetButton');
        this.gameOverMessage = document.getElementById('gameOver');
        this.gameWonMessage = document.getElementById('gameWon');

        this.score = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.gameStarted = false;
        this.animationId = null;

        this.BLOCK_ROWS = 5;
        this.BLOCK_COLS = 8;
        this.BLOCK_PADDING = 10;
        this.BLOCK_HEIGHT = 20;
        this.PADDLE_SPEED = 8;

        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.score = 0;
        this.gameOver = false;
        this.gameWon = false;
        this.gameStarted = false;
        this.scoreElement.textContent = '0';

        this.blocks = [];
        const blockWidth = (this.canvas.width - (this.BLOCK_COLS + 1) * this.BLOCK_PADDING) / this.BLOCK_COLS;
        
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        
        for (let row = 0; row < this.BLOCK_ROWS; row++) {
            for (let col = 0; col < this.BLOCK_COLS; col++) {
                const block = {
                    x: (col * (blockWidth + this.BLOCK_PADDING)) + this.BLOCK_PADDING,
                    y: (row * (this.BLOCK_HEIGHT + this.BLOCK_PADDING)) + this.BLOCK_PADDING + 40,
                    width: blockWidth,
                    height: this.BLOCK_HEIGHT,
                    color: colors[row],
                    visible: true
                };
                this.blocks.push(block);
            }
        }

        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height - 50,
            dx: 5,
            dy: -5,
            radius: 8
        };

        this.paddle = {
            x: this.canvas.width / 2 - 50,
            y: this.canvas.height - 30,
            width: 100,
            height: 15,
            dx: 0
        };

        this.gameOverMessage.classList.add('hidden');
        this.gameWonMessage.classList.add('hidden');
        this.startButton.classList.remove('hidden');
        this.resetButton.classList.add('hidden');
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.paddle.dx = -this.PADDLE_SPEED;
            if (e.key === 'ArrowRight') this.paddle.dx = this.PADDLE_SPEED;
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowLeft' && this.paddle.dx < 0) this.paddle.dx = 0;
            if (e.key === 'ArrowRight' && this.paddle.dx > 0) this.paddle.dx = 0;
        });

        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => {
            cancelAnimationFrame(this.animationId);
            this.initializeGame();
            this.startGame();
        });
    }

    startGame() {
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startButton.classList.add('hidden');
            this.resetButton.classList.add('hidden');
            this.gameLoop();
        }
    }

    checkCollision(ball, rect) {
        return ball.x + ball.radius > rect.x &&
               ball.x - ball.radius < rect.x + rect.width &&
               ball.y + ball.radius > rect.y &&
               ball.y - ball.radius < rect.y + rect.height;
    }

    update() {
        this.paddle.x += this.paddle.dx;
        
        if (this.paddle.x < 0) this.paddle.x = 0;
        if (this.paddle.x + this.paddle.width > this.canvas.width) {
            this.paddle.x = this.canvas.width - this.paddle.width;
        }

        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        if (this.ball.x + this.ball.radius > this.canvas.width || 
            this.ball.x - this.ball.radius < 0) {
            this.ball.dx = -this.ball.dx;
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.dy = -this.ball.dy;
        }

        if (this.checkCollision(this.ball, this.paddle)) {
            this.ball.dy = -Math.abs(this.ball.dy);
            this.ball.dx = this.ball.dx + (Math.random() - 0.5) * 2;
        }

        this.blocks.forEach(block => {
            if (block.visible && this.checkCollision(this.ball, block)) {
                block.visible = false;
                this.ball.dy = -this.ball.dy;
                this.score += 10;
                this.scoreElement.textContent = this.score;
            }
        });

        if (this.ball.y + this.ball.radius > this.canvas.height) {
            this.gameOver = true;
            this.gameOverMessage.classList.remove('hidden');
            this.resetButton.classList.remove('hidden');
            cancelAnimationFrame(this.animationId);
        }

        if (this.blocks.every(block => !block.visible)) {
            this.gameWon = true;
            this.gameWonMessage.classList.remove('hidden');
            this.resetButton.classList.remove('hidden');
            cancelAnimationFrame(this.animationId);
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.blocks.forEach(block => {
            if (block.visible) {
                this.ctx.fillStyle = block.color;
                this.ctx.fillRect(block.x, block.y, block.width, block.height);
                this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                this.ctx.strokeRect(block.x, block.y, block.width, block.height);
            }
        });

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();
        this.ctx.closePath();
    }

    gameLoop() {
        this.update();
        this.draw();
        if (!this.gameOver && !this.gameWon) {
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        }
    }
}

window.addEventListener('load', () => {
    new Game();
});