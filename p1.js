const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status");
const restartButton = document.querySelector(".restart");

let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let humanPlayer = "X";
let aiPlayer = "O";
let firstMoveByHuman = true; // Track who starts

const winConditions = [
    [1, 2, 3], [4, 5, 6], [7, 8, 9], // Rows
    [1, 4, 7], [2, 5, 8], [3, 6, 9], // Columns
    [1, 5, 9], [3, 5, 7]  // Diagonals
];

// Handle Human Move
function handleCellClick(event) {
    const index = parseInt(event.target.getAttribute("data-index")) - 1; // Convert 1-9 to 0-8

    if (board[index] !== "" || !gameActive) return;

    board[index] = humanPlayer;
    event.target.textContent = humanPlayer;

    if (checkWinner(humanPlayer)) {
        statusText.textContent = "You Win!";
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    setTimeout(aiMove, 300); // AI plays after a delay
}

// AI Move using Minimax
function aiMove() {
    let bestMove = minimax(board, aiPlayer).index;
    board[bestMove] = aiPlayer;
    cells[bestMove].textContent = aiPlayer;

    if (checkWinner(aiPlayer)) {
        statusText.textContent = "AI Wins!";
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a Draw!";
        gameActive = false;
    }
}

// Check for a winner
function checkWinner(player) {
    return winConditions.some(condition =>
        condition.map(i => i - 1).every(index => board[index] === player) // Convert 1-9 to 0-8
    );
}

// Minimax Algorithm (AI Decision Making)
function minimax(newBoard, player) {
    let availableSpots = newBoard.map((cell, index) => cell === "" ? index : null).filter(i => i !== null);

    if (checkWinner(humanPlayer)) {
        return { score: -10 };
    } else if (checkWinner(aiPlayer)) {
        return { score: 10 };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }

    let moves = [];

    for (let i of availableSpots) {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        if (player === aiPlayer) {
            let result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[i] = ""; // Undo move
        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

// Restart Game and Alternate First Move
function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    
    firstMoveByHuman = !firstMoveByHuman; // Alternate who starts
    statusText.textContent = firstMoveByHuman ? "Player X's Turn" : "AI's Turn";
    
    cells.forEach(cell => (cell.textContent = ""));
    
    if (!firstMoveByHuman) {
        setTimeout(aiMove, 300); // AI moves first if it's AI's turn
    }
}

// Event Listeners
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
restartButton.addEventListener("click", restartGame);
