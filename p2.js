const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status");
const restartButton = document.querySelector(".restart");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

const winConditions = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9], // Rows
    [1, 4, 7], [2, 5, 8], [3, 6, 9], // Columns
    [1, 5, 9], [3, 5, 7]  // Diagonals
];

function handleCellClick(event) {
    const index = parseInt(event.target.getAttribute("data-index")) - 1; // Adjust index to match array

    if (board[index] !== "" || !gameActive) return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    checkWinner();
}

function checkWinner() {
    let roundWon = false;
    let winningCells = [];

    for (let condition of winConditions) {
        let [a, b, c] = condition.map(i => i - 1); // Adjust indexes to match array
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        highlightWinningCells(winningCells);
        return;
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function highlightWinningCells(cells) {
    cells.forEach(index => {
        document.querySelector(`.cell[data-index="${index + 1}"]`).classList.add("highlight");
    });
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = "Player X's Turn";
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("highlight");
    });
}

cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartButton.addEventListener("click", restartGame);
