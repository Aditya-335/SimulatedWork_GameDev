document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    const resetButton = document.getElementById('reset-button');
    const shootSound = document.getElementById('shoot-sound');
    const explosionSound = document.getElementById('explosion-sound');

    const width = 15;
    const cellCount = width * width;
    const cells = [];
    let shooterIndex = 202;
    let invaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15, 16, 17, 18, 19, 20, 21, 22, 23, 24
    ];
    let direction = 1;
    let invaderInterval;
    let score = 0;
    let lives = 3;
    let isGameOver = false;

    function createGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
            cells.push(cell);
        }
    }

    function drawShooter() {
        cells[shooterIndex].classList.add('shooter');
    }

    function drawInvaders() {
        invaders.forEach(index => cells[index]?.classList.add('invader'));
    }

    function clearInvaders() {
        invaders.forEach(index => cells[index]?.classList.remove('invader'));
    }

    document.addEventListener('keydown', (e) => {
        if (isGameOver) return;
        cells[shooterIndex].classList.remove('shooter');
        if (e.key === 'ArrowLeft' && shooterIndex % width !== 0) {
            shooterIndex--;
        } else if (e.key === 'ArrowRight' && shooterIndex % width < width - 1) {
            shooterIndex++;
        }
        drawShooter();
    });

    document.addEventListener('keydown', (e) => {
        if (isGameOver || e.key !== 'ArrowUp') return;

        let laserIndex = shooterIndex;

        function moveLaser() {
            if (laserIndex >= width) {
                cells[laserIndex].classList.remove('laser');
                laserIndex -= width;

                if (cells[laserIndex].classList.contains('invader')) {
                    clearInterval(laserId);
                    cells[laserIndex].classList.remove('laser', 'invader');
                    cells[laserIndex].classList.add('boom');
                    explosionSound.play();

                    setTimeout(() => cells[laserIndex].classList.remove('boom'), 500);

                    const invaderIndex = invaders.indexOf(laserIndex);
                    invaders.splice(invaderIndex, 1);
                    score += 10;
                    scoreDisplay.textContent = score;

                    if (invaders.length === 0) {
                        gameOver('You win!');
                    }
                } else {
                    cells[laserIndex].classList.add('laser');
                }
            } else {
                clearInterval(laserId);
            }
        }

        shootSound.play();
        const laserId = setInterval(moveLaser, 100);
    });

    function moveInvaders() {
        clearInvaders();
        const leftEdge = invaders[0] % width === 0;
        const rightEdge = invaders[invaders.length - 1] % width === width - 1;

        if (rightEdge && direction === 1 || leftEdge && direction === -1) {
            direction = width;
        } else if (direction === width) {
            direction = leftEdge ? 1 : -1;
        }

        invaders = invaders.map(index => index + direction);
        drawInvaders();

        if (invaders.some(index => index >= cells.length - width)) {
            gameOver('Game Over! Invaders reached the Earth.');
        }

        if (cells[shooterIndex].classList.contains('invader')) {
            lives--;
            livesDisplay.textContent = lives;
            if (lives === 0) gameOver('Game Over! You were destroyed.');
        }
    }

    function gameOver(message) {
        isGameOver = true;
        clearInterval(invaderInterval);
        setTimeout(() => alert(`${message}\nScore: ${score}`), 100);
    }

    resetButton.addEventListener('click', () => {
        location.reload();
    });

    function startGame() {
        createGrid();
        drawShooter();
        drawInvaders();
        score = 0;
        lives = 3;
        scoreDisplay.textContent = score;
        livesDisplay.textContent = lives;
        isGameOver = false;
        invaderInterval = setInterval(moveInvaders, 500);
    }

    startGame();
});
