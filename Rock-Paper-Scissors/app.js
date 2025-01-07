document.addEventListener('DOMContentLoaded', () => {
    let scores = {
        player: 0,
        computer: 0
    };

    const buttons = document.querySelectorAll('.game-button');
    const playerChoiceDisplay = document.querySelector('#player-choice span');
    const computerChoiceDisplay = document.querySelector('#computer-choice span');
    const resultDisplay = document.querySelector('#result span');
    const resultContainer = document.querySelector('#result');
    const playerScoreDisplay = document.querySelector('#player-score');
    const computerScoreDisplay = document.querySelector('#computer-score');
    const resetButton = document.querySelector('#reset');

    buttons.forEach(button => {
        button.addEventListener('click', handlePlayerChoice);
    });
    resetButton.addEventListener('click', resetGame);

    function handlePlayerChoice(event) {
        buttons.forEach(btn => btn.classList.remove('winner'));

        const playerChoice = event.target.id;
        if (!isValidChoice(playerChoice)) {
            console.error('Invalid choice:', playerChoice);
            return;
        }

        const computerChoice = getComputerChoice();
        
        playerChoiceDisplay.textContent = capitalizeFirstLetter(playerChoice);
        computerChoiceDisplay.textContent = capitalizeFirstLetter(computerChoice);

        const result = determineWinner(playerChoice, computerChoice);
        displayResult(result, playerChoice, computerChoice);
        updateScores(result);
    }

    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }

    function determineWinner(playerChoice, computerChoice) {
        if (playerChoice === computerChoice) return 'tie';

        const winConditions = {
            rock: 'scissors',
            paper: 'rock',
            scissors: 'paper'
        };

        return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
    }

    function displayResult(result, playerChoice, computerChoice) {
        const messages = {
            win: 'You Win! 🎉',
            lose: 'Computer Wins! 😢',
            tie: "It's a Tie! 🤝"
        };

        resultDisplay.textContent = messages[result];
        resultContainer.className = 'result ' + result;

        if (result === 'win') {
            document.getElementById(playerChoice).classList.add('winner');
        } else if (result === 'lose') {
            document.getElementById(computerChoice).classList.add('winner');
        }
    }

    function updateScores(result) {
        if (result === 'win') scores.player++;
        else if (result === 'lose') scores.computer++;

        playerScoreDisplay.textContent = scores.player;
        computerScoreDisplay.textContent = scores.computer;
    }

    function resetGame() {
        scores.player = 0;
        scores.computer = 0;
        playerScoreDisplay.textContent = '0';
        computerScoreDisplay.textContent = '0';
        playerChoiceDisplay.textContent = '-';
        computerChoiceDisplay.textContent = '-';
        resultDisplay.textContent = '-';
        resultContainer.className = 'result';
        buttons.forEach(btn => btn.classList.remove('winner'));
    }

    function isValidChoice(choice) {
        return ['rock', 'paper', 'scissors'].includes(choice);
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});