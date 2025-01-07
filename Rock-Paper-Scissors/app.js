document.addEventListener('DOMContentLoaded', () => {

    const buttons = document.querySelectorAll('.game-button');
    const playerChoiceDisplay = document.querySelector('#player-choice span');
    const computerChoiceDisplay = document.querySelector('#computer-choice span');
    const resultDisplay = document.querySelector('#result span');

    buttons.forEach(button => {
        button.addEventListener('click', handlePlayerChoice);
    });

    function handlePlayerChoice(event) {
        const playerChoice = event.target.id;
        console.log('Player chose:', playerChoice);
        playerChoiceDisplay.textContent = playerChoice;

        const computerChoice = getComputerChoice();
        console.log('Computer chose:', computerChoice);
        computerChoiceDisplay.textContent = computerChoice;
    }

    function getComputerChoice() {
        const choices = ['rock', 'paper', 'scissors'];
        const randomIndex = Math.floor(Math.random() * choices.length);
        return choices[randomIndex];
    }
});