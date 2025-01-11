document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const scoreDisplay = document.getElementById('score');
    const livesDisplay = document.getElementById('lives');
    
    const width = 15; 
    const cellCount = width * width;
    const cells = [];
    
    let currentShooterIndex = 202; 
    let score = 0;
    let lives = 3;
    let invaders = [
        0,1,2,3,4,5,6,7,8,9,
        15,16,17,18,19,20,21,22,23,24
    ];
    let direction = 1;
    let invaderId;
    
    function createGrid() {
        for (let i = 0; i < cellCount; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            grid.appendChild(cell);
            cells.push(cell);
        }
        cells[currentShooterIndex].classList.add('shooter');
    }
    
    function moveShooter(e) {
        cells[currentShooterIndex].classList.remove('shooter');
        switch(e.key) {
            case 'ArrowLeft':
                if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
                break;
            case 'ArrowRight':
                if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
                break;
        }
        cells[currentShooterIndex].classList.add('shooter');
    }
    
    function moveInvaders() {
        const leftEdge = invaders[0] % width === 0;
        const rightEdge = invaders[invaders.length - 1] % width === width - 1;
        
        removeInvaders();
        
        if (rightEdge && direction === 1) {
            for (let i = 0; i < invaders.length; i++) {
                invaders[i] += width + 1;
                direction = -1;
            }
        }
        
        if (leftEdge && direction === -1) {
            for (let i = 0; i < invaders.length; i++) {
                invaders[i] += width - 1;
                direction = 1;
            }
        }
        
        for (let i = 0; i < invaders.length; i++) {
            invaders[i] += direction;
        }
        
        drawInvaders();
        
        if (cells[currentShooterIndex].classList.contains('invader')) {
            lives--;
            livesDisplay.textContent = lives;
            if (lives === 0) {
                alert('GAME OVER');
                clearInterval(invaderId);
            }
        }
        
        if (invaders.length === 0) {
            alert('YOU WIN');
            clearInterval(invaderId);
        }
    }
    
    function drawInvaders() {
        for (let i = 0; i < invaders.length; i++) {
            if (!cells[invaders[i]].classList.contains('bullet')) {
                cells[invaders[i]].classList.add('invader');
            }
        }
    }
    
    function removeInvaders() {
        for (let i = 0; i < invaders.length; i++) {
            cells[invaders[i]].classList.remove('invader');
        }
    }
    
    function shoot(e) {
        if (e.key !== ' ') return;
        
        let bulletId;
        let bulletIndex = currentShooterIndex;
        
        function moveBullet() {
            cells[bulletIndex].classList.remove('bullet');
            bulletIndex -= width;
            
            if (bulletIndex < 0) {
                clearInterval(bulletId);
                return;
            }
            
            if (cells[bulletIndex].classList.contains('invader')) {
                clearInterval(bulletId);
                cells[bulletIndex].classList.remove('invader', 'bullet');
                const invaderRemoved = invaders.indexOf(bulletIndex);
                invaders.splice(invaderRemoved, 1);
                score += 10;
                scoreDisplay.textContent = score;
            } else {
                cells[bulletIndex].classList.add('bullet');
            }
        }
        
        bulletId = setInterval(moveBullet, 100);
    }
    
    document.addEventListener('keydown', moveShooter);
    document.addEventListener('keydown', shoot);
    
    createGrid();
    drawInvaders();
    invaderId = setInterval(moveInvaders, 500);
});