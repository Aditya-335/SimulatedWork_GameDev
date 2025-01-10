class ConnectFour {
    constructor() {
        this.ROWS = 6;
        this.COLS = 7;
        this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(null));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.scores = { 1: 0, 2: 0 };
        this.soundEnabled = true;
        this.currentTheme = 'classic';
        
        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');
        this.resetButton = document.getElementById('resetButton');
        this.resetScoresButton = document.getElementById('resetScoresButton');
        this.soundToggle = document.getElementById('soundToggle');
        this.themeSelector = document.getElementById('theme');
        this.player1ScoreElement = document.getElementById('player1Score');
        this.player2ScoreElement = document.getElementById('player2Score');
        
        this.dropSound = document.getElementById('dropSound');
        this.winSound = document.getElementById('winSound');
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.boardElement.innerHTML = '';
        this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(null));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.updateTheme(this.currentTheme);
        this.createBoard();
        this.updateStatus();
    }

    setupEventListeners() {
        this.resetButton.addEventListener('click', () => this.resetGame());
        this.resetScoresButton.addEventListener('click', () => this.resetScores());
        this.soundToggle.addEventListener('change', (e) => this.soundEnabled = e.target.checked);
        this.themeSelector.addEventListener('change', (e) => this.updateTheme(e.target.value));
    }

    createBoard() {
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => this.handleCellClick(col));
                this.boardElement.appendChild(cell);
            }
        }
    }

    updateTheme(theme) {
        this.currentTheme = theme;
        this.boardElement.className = `board ${theme}`;
    }

    handleCellClick(col) {
        if (this.gameOver) return;
        
        const row = this.findLowestEmptyRow(col);
        if (row === -1) return;

        this.board[row][col] = this.currentPlayer;
        this.renderPiece(row, col);
        
        if (this.soundEnabled) {
            this.dropSound.currentTime = 0;
            this.dropSound.play();
        }

        if (this.checkWin(row, col)) {
            this.handleWin();
            return;
        }

        if (this.checkDraw()) {
            this.handleDraw();
            return;
        }

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.updateStatus();
    }

    findLowestEmptyRow(col) {
        for (let row = this.ROWS - 1; row >= 0; row--) {
            if (!this.board[row][col]) return row;
        }
        return -1;
    }

    renderPiece(row, col) {
        const cell = this.boardElement.children[row * this.COLS + col];
        const piece = document.createElement('div');
        piece.className = `piece player${this.currentPlayer}`;
        cell.appendChild(piece);
    }

    checkWin(row, col) {
        const directions = [
            [[0, 1], [0, -1]], 
            [[1, 0], [-1, 0]], 
            [[1, 1], [-1, -1]], 
            [[1, -1], [-1, 1]] 
        ];

        for (const [dir1, dir2] of directions) {
            const winningCells = [[row, col]];
            let count = 1;
            const player = this.board[row][col];

            for (const [dx, dy] of [dir1, dir2]) {
                let newRow = row + dx;
                let newCol = col + dy;

                while (
                    newRow >= 0 && 
                    newRow < this.ROWS && 
                    newCol >= 0 && 
                    newCol < this.COLS && 
                    this.board[newRow][newCol] === player
                ) {
                    count++;
                    winningCells.push([newRow, newCol]);
                    newRow += dx;
                    newCol += dy;
                }
            }

            if (count >= 4) {
                this.highlightWinningCells(winningCells);
                return true;
            }
        }
        return false;
    }

    highlightWinningCells(cells) {
        cells.forEach(([row, col]) => {
            const cell = this.boardElement.children[row * this.COLS + col];
            const piece = cell.querySelector('.piece');
            piece.classList.add('winning-piece');
        });
    }

    checkDraw() {
        return this.board[0].every(cell => cell !== null);
    }

    handleWin() {
        this.gameOver = true;
        this.scores[this.currentPlayer]++;
        this.updateScores();
        this.statusElement.textContent = `Player ${this.currentPlayer} wins!`;
        
        if (this.soundEnabled) {
            this.winSound.currentTime = 0;
            this.winSound.play();
        }
    }

    handleDraw() {
        this.gameOver = true;
        this.statusElement.textContent = "It's a draw!";
    }

    updateStatus() {
        this.statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
    }

    updateScores() {
        this.player1ScoreElement.textContent = this.scores[1];
        this.player2ScoreElement.textContent = this.scores[2];
    }

    resetGame() {
        this.initializeGame();
    }

    resetScores() {
        this.scores = { 1: 0, 2: 0 };
        this.updateScores();
        this.resetGame();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ConnectFour();
});