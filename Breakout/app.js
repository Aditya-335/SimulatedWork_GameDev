class Breakout {
    constructor() {
        // Game elements
        this.gameBoard = document.getElementById('gameBoard');
        this.ball = document.getElementById('ball');
        this.paddle = document.getElementById('paddle');
        this.scoreElement = document.getElementById('score');
        this.startButton = document.getElementById('startButton');

        this.config = {
            ballSpeed: 5,
            maxBallSpeed: 8,
            paddleSpeed: 20,
            ballSpeedIncrease: 0.2,
            initialLives: 3
        };

        this.score = 0;
        this.lives = this.config.initialLives;
        this.gameInterval = null;
        this.isGameActive = false;
        this.consecutiveHits = 0;

        this.ballPos = { x: 300, y: 200 };
        this.ballVelocity = {
            x: this.config.ballSpeed,
            y: -this.config.ballSpeed
        };

        this.paddlePos = 250;
        this.paddleWidth = 100;
        this.keys = {
            left: false,
            right: false
        };

        this.startGame = this.startGame.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.gameLoop = this.gameLoop.bind(this);

        this.setupEventListeners();
        this.createBlocks();
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', this.startGame);
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown(event) {
        if (event.key === 'ArrowLeft') this.keys.left = true;
        if (event.key === 'ArrowRight') this.keys.right = true;
    }

    handleKeyUp(event) {
        if (event.key === 'ArrowLeft') this.keys.left = false;
        if (event.key === 'ArrowRight') this.keys.right = false;
    }

    createBlocks() {
        this.blocks = [];
        const blocksPerRow = 7;
        const rows = 4;
        const blockWidth = 80;
        const blockHeight = 20;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < blocksPerRow; col++) {
                const block = document.createElement('div');
                block.className = 'block';
                const x = col * (blockWidth + 5) + 10;
                const y = row * (blockHeight + 5) + 10;
                block.style.left = `${x}px`;
                block.style.top = `${y}px`;
                this.gameBoard.appendChild(block);
                this.blocks.push({
                    element: block,
                    x: x,
                    y: y,
                    width: blockWidth,
                    height: blockHeight,
                    health: row === 0 ? 2 : 1 
                });
            }
        }
    }

    checkCollisions() {
        const ballRadius = 7.5; 

        const paddleCollision = this.checkPaddleCollision(ballRadius);
        if (paddleCollision) {
            this.handlePaddleCollision(paddleCollision);
            return true;
        }

        if (this.ballPos.x <= ballRadius || this.ballPos.x >= 585 - ballRadius) {
            this.ballVelocity.x = -this.ballVelocity.x;
            return true;
        }

        if (this.ballPos.y <= ballRadius) {
            this.ballVelocity.y = -this.ballVelocity.y;
            return true;
        }

        if (this.ballPos.y >= 385 - ballRadius) {
            this.loseLife();
            return true;
        }

        return this.checkBlockCollisions(ballRadius);
    }

    checkPaddleCollision(ballRadius) {
        if (this.ballPos.y >= 360 - ballRadius && this.ballPos.y <= 370 + ballRadius) {
            if (this.ballPos.x >= this.paddlePos && this.ballPos.x <= this.paddlePos + this.paddleWidth) {
                return (this.ballPos.x - (this.paddlePos + this.paddleWidth / 2)) / (this.paddleWidth / 2);
            }
        }
        return false;
    }

    handlePaddleCollision(relativePosition) {
        const maxAngle = Math.PI / 3; 
        const angle = relativePosition * maxAngle;
        const speed = Math.sqrt(this.ballVelocity.x ** 2 + this.ballVelocity.y ** 2);
        
        this.ballVelocity.x = speed * Math.sin(angle);
        this.ballVelocity.y = -speed * Math.cos(angle);

        this.consecutiveHits++;
        if (this.consecutiveHits > 3) {
            const newSpeed = Math.min(
                speed + this.config.ballSpeedIncrease,
                this.config.maxBallSpeed
            );
            const speedRatio = newSpeed / speed;
            this.ballVelocity.x *= speedRatio;
            this.ballVelocity.y *= speedRatio;
        }
    }

    checkBlockCollisions(ballRadius) {
        for (let i = this.blocks.length - 1; i >= 0; i--) {
            const block = this.blocks[i];
            const collision = this.checkBlockCollision(block, ballRadius);
            
            if (collision) {
                block.health--;
                if (block.health <= 0) {
                    block.element.remove();
                    this.blocks.splice(i, 1);
                    this.updateScore(10);
                } else {
                    block.element.style.opacity = '0.5';
                }
                
                if (collision === 'vertical') {
                    this.ballVelocity.y = -this.ballVelocity.y;
                } else {
                    this.ballVelocity.x = -this.ballVelocity.x;
                }
                
                return true;
            }
        }
        return false;
    }

    checkBlockCollision(block, ballRadius) {
        const ballLeft = this.ballPos.x - ballRadius;
        const ballRight = this.ballPos.x + ballRadius;
        const ballTop = this.ballPos.y - ballRadius;
        const ballBottom = this.ballPos.y + ballRadius;

        if (ballRight >= block.x && ballLeft <= block.x + block.width &&
            ballBottom >= block.y && ballTop <= block.y + block.height) {
            
            const fromBottom = Math.abs(ballTop - (block.y + block.height));
            const fromTop = Math.abs(ballBottom - block.y);
            const fromLeft = Math.abs(ballRight - block.x);
            const fromRight = Math.abs(ballLeft - (block.x + block.width));
            
            const min = Math.min(fromBottom, fromTop, fromLeft, fromRight);
            
            return (min === fromBottom || min === fromTop) ? 'vertical' : 'horizontal';
        }
        return null;
    }

    updateScore(points) {
        this.score += points;
        this.scoreElement.textContent = this.score;
        
        if (this.blocks.length === 0) {
            this.winGame();
        }
    }

    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.endGame();
        } else {
            this.resetBall();
        }
    }

    resetBall() {
        this.ballPos = { x: 300, y: 200 };
        this.ballVelocity = {
            x: this.config.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
            y: -this.config.ballSpeed
        };
        this.consecutiveHits = 0;
    }

    movePaddle() {
        if (this.keys.left && this.paddlePos > 0) {
            this.paddlePos = Math.max(0, this.paddlePos - this.config.paddleSpeed);
        }
        if (this.keys.right && this.paddlePos < 500) {
            this.paddlePos = Math.min(500, this.paddlePos + this.config.paddleSpeed);
        }
        this.paddle.style.left = `${this.paddlePos}px`;
    }

    gameLoop() {
        if (!this.isGameActive) return;

        this.movePaddle();

        this.ballPos.x += this.ballVelocity.x;
        this.ballPos.y += this.ballVelocity.y;

        this.checkCollisions();

        this.ball.style.left = `${this.ballPos.x}px`;
        this.ball.style.top = `${this.ballPos.y}px`;

        requestAnimationFrame(this.gameLoop);
    }

    startGame() {
        if (this.isGameActive) return;

        this.score = 0;
        this.lives = this.config.initialLives;
        this.scoreElement.textContent = this.score;
        this.isGameActive = true;
        this.consecutiveHits = 0;

        this.resetBall();
        this.paddlePos = 250;
        this.paddle.style.left = `${this.paddlePos}px`;

        this.blocks.forEach(block => block.element.remove());
        this.createBlocks();

        this.startButton.style.display = 'none';

        requestAnimationFrame(this.gameLoop);
    }

    endGame() {
        this.isGameActive = false;
        const message = `Game Over!\nFinal Score: ${this.score}`;
        setTimeout(() => {
            alert(message);
            this.startButton.style.display = 'block';
            this.startButton.textContent = 'Play Again';
        }, 100);
    }

    winGame() {
        this.isGameActive = false;
        const message = `Congratulations!\nYou've won with a score of ${this.score}!`;
        setTimeout(() => {
            alert(message);
            this.startButton.style.display = 'block';
            this.startButton.textContent = 'Play Again';
        }, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Breakout();
});