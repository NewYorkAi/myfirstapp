let currentPlayer = 'X';
let xScore = 0;
let oScore = 0;
const cells = document.querySelectorAll('.cell');
const gameMessage = document.getElementById('game-message');
const gameResult = document.getElementById('game-result');
const congratulations = document.getElementById('congratulations');
const restartButton = document.getElementById('restart-button');
const backgroundMusic = document.getElementById('background-music');

document.getElementById('start-button').addEventListener('click', startGame);
document.getElementById('finish-button').addEventListener('click', finishGame);
document.getElementById('play-music').addEventListener('click', () => backgroundMusic.play());
document.getElementById('pause-music').addEventListener('click', () => backgroundMusic.pause());
document.getElementById('switch-track').addEventListener('click', switchTrack);
restartButton.addEventListener('click', startGame);

initializeScores();

function startGame() {
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win');
        cell.addEventListener('click', cellClicked, { once: true });
    });
    gameResult.classList.remove('show')
    gameMessage.textContent = `Player ${currentPlayer}'s turn`;
    gameResult.style.display = 'none';
    backgroundMusic.play();
}

function finishGame() {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    gameMessage.textContent = 'Game Finished! Thanks for playing.';
    cells.forEach(cell => {
        cell.removeEventListener('click', cellClicked);
    });
}

function cellClicked(event) {
    const cell = event.target;
    cell.textContent = currentPlayer;
    if (checkForWin(currentPlayer)) {
        updateScore(currentPlayer);
        endGame(true);
    } else if (checkForDraw()) {
        endGame(false);
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        gameMessage.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkForWin(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winConditions.some(condition => {
        if (condition.every(index => cells[index].textContent === player)) {
            condition.forEach(index => cells[index].classList.add('win'));
            return true;
        }
        return false;
    });
}

function checkForDraw() {
    return [...cells].every(cell => cell.textContent.trim() !== '');
}

function initializeScores() {
    xScore = localStorage.getItem('xScore') ? parseInt(localStorage.getItem('xScore')) : 0;
    oScore = localStorage.getItem('oScore') ? parseInt(localStorage.getItem('oScore')) : 0;
    updateScoreDisplay();
}

function updateScore(player) {
    if (player === 'X') {
        xScore++;
        localStorage.setItem('xScore', xScore);
    } else {
        oScore++;
        localStorage.setItem('oScore', oScore);
    }
    updateScoreDisplay();
}

function updateScoreDisplay() {
    document.getElementById('x-score').textContent = xScore;
    document.getElementById('o-score').textContent = oScore;
}

function switchTrack() {
    if (backgroundMusic.paused || backgroundMusic.src.includes('relax.mp3')) {
        backgroundMusic.src = 'music/relax1.mp3';
    } else {
        backgroundMusic.src = 'music/relax.mp3';
    }
    backgroundMusic.play();
}

function endGame(win) {
    cells.forEach(cell => {
        cell.removeEventListener('click', cellClicked);
    });
    if (win) {
        congratulations.innerHTML = `Congratulations Player ${currentPlayer}! <span class="star">★</span><span class="star">★</span><span class="star">★</span>`;
    } else {
        congratulations.textContent = "It's a draw!";
    }
    gameResult.style.display = 'block';
    gameResult.classList.add('show');
}
