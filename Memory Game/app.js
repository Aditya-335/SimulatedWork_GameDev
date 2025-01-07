document.addEventListener('DOMContentLoaded', () => {
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let matches = 0;
    let gameTimer;
    let gameTime = 0;

    const gameBoard = document.getElementById('game-board');
    const movesDisplay = document.getElementById('moves');
    const matchesDisplay = document.getElementById('matches');
    const timeDisplay = document.getElementById('time');
    const restartButton = document.getElementById('restart');
    const playAgainButton = document.getElementById('play-again');
    const winMessage = document.getElementById('win-message');
    const finalMovesDisplay = document.getElementById('final-moves');
    const finalTimeDisplay = document.getElementById('final-time');

    const cardImages = [
        'assets/blank.png',
        'assets/cheeseburger.png',
        'assets/fries.png',
        'assets/hotdog.png',
        'assets/ice-cream.png',
        'assets/milkshake.png',
        'assets/pizza.png',
        'assets/white.png'
    ];

    const gameCards = [...cardImages, ...cardImages];

    function initializeGame() {
        
        moves = 0;
        matches = 0;
        gameTime = 0;
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;

        if (gameTimer) clearInterval(gameTimer);

        startTimer();

        updateDisplays();
        
        winMessage.classList.remove('show');

        createBoard();
    }

    function startTimer() {
        gameTimer = setInterval(() => {
            gameTime++;
            updateTimeDisplay();
        }, 1000);
    }

    function updateTimeDisplay() {
        const minutes = Math.floor(gameTime / 60);
        const seconds = gameTime % 60;
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        gameBoard.innerHTML = '';
        const shuffledCards = shuffle([...gameCards]);
        
        shuffledCards.forEach((img, index) => {
            const card = createCard(img, index);
            gameBoard.appendChild(card);
        });
    }

    function createCard(img, index) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.framework = img;

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front');

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back');

        const image = document.createElement('img');
        image.src = img;
        image.alt = `Card ${index + 1}`;
        cardBack.appendChild(image);

        card.appendChild(cardFront);
        card.appendChild(cardBack);

        card.addEventListener('click', flipCard);
        return card;
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        if (this.classList.contains('matched')) return;

        this.classList.add('flipped');
        moves++;
        updateDisplays();

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        const isMatch = firstCard.dataset.framework === secondCard.dataset.framework;

        if (isMatch) {
            matches++;
            updateDisplays();
            handleMatch();
            checkWin();
        } else {
            unflipCards();
        }
    }

    function handleMatch() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    function updateDisplays() {
        movesDisplay.textContent = moves;
        matchesDisplay.textContent = matches;
    }

    function checkWin() {
        if (matches === cardImages.length) {
            clearInterval(gameTimer);
            setTimeout(showWinMessage, 500);
        }
    }

    function showWinMessage() {
        finalMovesDisplay.textContent = moves;
        finalTimeDisplay.textContent = timeDisplay.textContent;
        winMessage.classList.add('show');
    }

    restartButton.addEventListener('click', initializeGame);
    playAgainButton.addEventListener('click', initializeGame);

    initializeGame();
});