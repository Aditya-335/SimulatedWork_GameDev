class ConnectFour {
    constructor() {
        this.ROWS = 6;
        this.COLS = 7;
        this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(null));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.boardElement = document.getElementById('board');
        this.statusElement = document.getElementById('status');
        this.resetButton = document.getElementById('resetButton');
        
        this.initializeBoard();
        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    initializeBoard() {
        this.boardElement.innerHTML = '';
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

    handleCellClick(col) {
        if (this.gameOver) return;
        
        const row = this.findLowestEmptyRow(col);
        if (row === -1) return; 

        this.board[row][col] = this.currentPlayer;
        this.renderPiece(row, col);

        if (this.checkWin(row, col)) {
            this.statusElement.textContent = `Player ${this.currentPlayer} wins!`;
            this.gameOver = true;
            return;
        }

        if (this.checkDraw()) {
            this.statusElement.textContent = "It's a draw!";
            this.gameOver = true;
            return;
        }

        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
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
            [[1, -1], [-1, 1]],
        ];

        for (const [dir1, dir2] of directions) {
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
                    newRow += dx;
                    newCol += dy;
                }
            }

            if (count >= 4) return true;
        }
        return false;
    }

    checkDraw() {
        return this.board[0].every(cell => cell !== null);
    }

    resetGame() {
        this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(null));
        this.currentPlayer = 1;
        this.gameOver = false;
        this.statusElement.textContent = `Player ${this.currentPlayer}'s turn`;
        this.initializeBoard();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ConnectFour();
});