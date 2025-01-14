class Game {
  constructor() {
      this.grid = document.querySelector('.game-grid');
      this.startBtn = document.getElementById('startBtn');
      this.timerDisplay = document.querySelector('.timer');
      this.gameOver = document.querySelector('.game-over');
      this.resultMessage = document.querySelector('.result-message');
      this.retryBtn = document.querySelector('.retry-btn');
      
      this.gridSize = 13;
      this.cellSize = 40;
      this.timeLeft = 20;
      this.isPlaying = false;
      this.isPaused = false;
      this.gameTimer = null;
      this.obstacles = [];
      this.obstacleTimers = [];
      
      this.frog = {
          x: 6,
          y: 12,
          element: document.createElement('div')
      };
      
      this.init();
  }

  init() {
      this.createGrid();
      this.createFrog();
      this.setupEventListeners();
      this.createObstacles();
  }

  createGrid() {
      for (let y = 0; y < this.gridSize; y++) {
          for (let x = 0; x < this.gridSize; x++) {
              const cell = document.createElement('div');
              cell.classList.add('cell');
              
              // Starting block (blue)
              if (y === 12 && x === 6) {
                  cell.classList.add('starting-block');
              }
              // Ending block (red)
              else if (y === 0 && x === 6) {
                  cell.classList.add('ending-block');
              }
              // River rows
              else if (y >= 1 && y <= 3) {
                  cell.classList.add('river');
              }
              // Safe zones
              else if (y === 4 || y === 8) {
                  cell.classList.add('safe');
              }
              // Road rows
              else if (y >= 5 && y <= 7) {
                  cell.classList.add('road');
              }
              
              this.grid.appendChild(cell);
          }
      }
  }

  createFrog() {
      this.frog.element.classList.add('frog');
      this.grid.appendChild(this.frog.element);
      this.updateFrogPosition();
  }

  updateFrogPosition() {
      this.frog.element.style.left = `${this.frog.x * this.cellSize}px`;
      this.frog.element.style.top = `${this.frog.y * this.cellSize}px`;
  }

  createObstacles() {
      // Cars
      this.createObstacleRow(7, 'car', 1, -1);
      this.createObstacleRow(6, 'car', 2, 1);
      this.createObstacleRow(5, 'car', 1.5, -1);

      // Logs
      this.createObstacleRow(3, 'log', 1, 1);
      this.createObstacleRow(2, 'log', 2, -1);
      this.createObstacleRow(1, 'log', 1.5, 1);
  }

  createObstacleRow(row, type, speed, direction) {
      const spacing = 3;
      for (let i = 0; i < 4; i++) {
          const obstacle = document.createElement('div');
          obstacle.classList.add(type);
          
          const x = i * (spacing + 1);
          const obstacleObj = {
              element: obstacle,
              x: x,
              y: row,
              speed: speed,
              direction: direction
          };
          
          this.obstacles.push(obstacleObj);
          this.grid.appendChild(obstacle);
          this.updateObstaclePosition(obstacleObj);
      }
  }

  updateObstaclePosition(obstacle) {
      obstacle.element.style.left = `${obstacle.x * this.cellSize}px`;
      obstacle.element.style.top = `${obstacle.y * this.cellSize}px`;
  }

  moveObstacles() {
      this.obstacles.forEach(obstacle => {
          obstacle.x += obstacle.speed * obstacle.direction * 0.01;
          
          if (obstacle.x > this.gridSize) {
              obstacle.x = -1;
          } else if (obstacle.x < -1) {
              obstacle.x = this.gridSize;
          }
          
          this.updateObstaclePosition(obstacle);
      });
  }

  checkCollisions() {
      const frogBox = {
          left: this.frog.x,
          right: this.frog.x + 1,
          top: this.frog.y,
          bottom: this.frog.y + 1
      };

      // Check obstacle collisions
      for (const obstacle of this.obstacles) {
          const obstacleBox = {
              left: obstacle.x,
              right: obstacle.x + 1,
              top: obstacle.y,
              bottom: obstacle.y + 1
          };

          if (this.boxesIntersect(frogBox, obstacleBox)) {
              if (obstacle.element.classList.contains('car')) {
                  this.endGame('You got hit by a car!');
                  return;
              } else if (obstacle.element.classList.contains('log')) {
                  // Move with the log
                  this.frog.x += obstacle.speed * obstacle.direction * 0.02;
                  this.updateFrogPosition();
              }
          }
      }

      // Check if in river without log
      if (this.frog.y >= 1 && this.frog.y <= 3) {
          let onLog = false;
          for (const obstacle of this.obstacles) {
              if (obstacle.element.classList.contains('log') && this.boxesIntersect(frogBox, {
                  left: obstacle.x,
                  right: obstacle.x + 1,
                  top: obstacle.y,
                  bottom: obstacle.y + 1
              })) {
                  onLog = true;
                  break;
              }
          }
          if (!onLog) {
              this.endGame('You fell in the river!');
          }
      }

      // Check win condition
      if (this.frog.y === 0 && this.frog.x === 6) {
          this.endGame('You won!', true);
      }
  }

  boxesIntersect(a, b) {
      return !(a.left >= b.right || 
              a.right <= b.left || 
              a.top >= b.bottom || 
              a.bottom <= b.top);
  }

  setupEventListeners() {
      document.addEventListener('keydown', (e) => {
          if (!this.isPlaying || this.isPaused) return;
          
          switch(e.key) {
              case 'ArrowLeft':
                  if (this.frog.x > 0) this.frog.x--;
                  break;
              case 'ArrowRight':
                  if (this.frog.x < this.gridSize - 1) this.frog.x++;
                  break;
              case 'ArrowUp':
                  if (this.frog.y > 0) this.frog.y--;
                  break;
              case 'ArrowDown':
                  if (this.frog.y < this.gridSize - 1) this.frog.y++;
                  break;
          }
          
          this.updateFrogPosition();
          this.checkCollisions();
      });

      this.startBtn.addEventListener('click', () => this.toggleGame());
      this.retryBtn.addEventListener('click', () => this.resetGame());
  }

  toggleGame() {
      if (!this.isPlaying) {
          this.startGame();
      } else {
          this.isPaused = !this.isPaused;
          this.startBtn.textContent = this.isPaused ? 'Resume' : 'Pause';
      }
  }

  startGame() {
      this.isPlaying = true;
      this.isPaused = false;
      this.startBtn.textContent = 'Pause';
      this.gameOver.style.display = 'none';
      
      this.gameTimer = setInterval(() => {
          if (!this.isPaused) {
              this.timeLeft--;
              this.timerDisplay.textContent = this.timeLeft;
              this.moveObstacles();
              this.checkCollisions();
              
              if (this.timeLeft <= 0) {
                  this.endGame('Time\'s up!');
              }
          }
      }, 1000);

      // Start obstacle animation
      requestAnimationFrame(() => this.animateObstacles());
  }

  animateObstacles() {
      if (this.isPlaying && !this.isPaused) {
          this.moveObstacles();
          this.checkCollisions();
      }
      if (this.isPlaying) {
          requestAnimationFrame(() => this.animateObstacles());
      }
  }

  endGame(message, won = false) {
      this.isPlaying = false;
      this.isPaused = false;
      clearInterval(this.gameTimer);
      
      this.resultMessage.textContent = message;
      this.gameOver.style.display = 'block';
      this.startBtn.textContent = 'Start Game';
      
      if (won) {
          this.resultMessage.style.color = '#22c55e';
      } else {
          this.resultMessage.style.color = '#dc2626';
      }
  }

  resetGame() {
      this.timeLeft = 20;
      this.timerDisplay.textContent = this.timeLeft;
      this.frog.x = 6;
      this.frog.y = 12;
      this.updateFrogPosition();
      this.gameOver.style.display = 'none';
      this.startGame();
  }
}

new Game();