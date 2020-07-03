var boardDisplay
var board = [
    [-5, -3, -3.5, -9, -99, -3.5, -3, -5],
    [-1, -1, -1, -1, -1, -1, -1, -1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [5, 3, 3.5, 9, 99, 3.5, 3, 5],
];
let turn = 1;
var selectedPiece;
const keys = {
    "1": "white-pawn",
    "3": "white-knight",
    "3.5": "white-bishop",
    "5": "white-rook",
    "9": "white-queen",
    "99": "white-king",
    "-1": "black-pawn",
    "-3": "black-knight",
    "-3.5": "black-bishop",
    "-5": "black-rook",
    "-9": "black-queen",
    "-99": "black-king"
}
document.addEventListener("DOMContentLoaded", () => {
    boardDisplay = document.querySelector(".chess-board");
    setupBoard().forEach((rank) => {
        boardDisplay.appendChild(rank);
        //board.push(createRank(rank))
    });
    updateDisplay();
    document.addEventListener("click", (e) => {
        let timeout= 400;
        if (selectedPiece) {
            let target = e.path[0];
            if (target.classList.contains("tile")) {
                let move = Array.from(target.children).filter((child) => child.classList.contains("move"))[0];
                if (move) {
                    board[selectedPiece.location[0]][selectedPiece.location[1]] = 0;
                    board[move.location[0]][move.location[1]] = selectedPiece.key;
                    setTimeout(() => {
                        let blackmove = getBestMove();
                        board[blackmove.startingLocation[0]][blackmove.startingLocation[1]] = 0;
                        board[blackmove.destination[0]][blackmove.destination[1]] = blackmove.pieceKey;
                        updateDisplay();
                    }, timeout)
                }
                updateDisplay();
                selectedPiece = null;

            } else if (target.classList.contains("piece")) {
                target = target.parentElement;
                if (target.classList.contains("tile")) {
                    let move = Array.from(target.children).filter((child) => child.classList.contains("move"))[0];
                    if (move) {
                        board[selectedPiece.location[0]][selectedPiece.location[1]] = 0;
                        board[move.location[0]][move.location[1]] = selectedPiece.key;
                        setTimeout(() => {
                            let blackmove = getBestMove();
                            board[blackmove.startingLocation[0]][blackmove.startingLocation[1]] = 0;
                            board[blackmove.destination[0]][blackmove.destination[1]] = blackmove.pieceKey;
                            updateDisplay();
                        }, timeout)
                    }
                    updateDisplay();
                    selectedPiece = null;

                } else {
                    selectedPiece = null;
                }
            }
            else if (target.classList.contains("move")) {
                const move = target;
                board[selectedPiece.location[0]][selectedPiece.location[1]] = 0;
                board[move.location[0]][move.location[1]] = selectedPiece.key;
                setTimeout(() => {
                    let blackmove = getBestMove();
                    board[blackmove.startingLocation[0]][blackmove.startingLocation[1]] = 0;
                    board[blackmove.destination[0]][blackmove.destination[1]] = blackmove.pieceKey;
                    updateDisplay();
                }, timeout);
                updateDisplay();

                selectedPiece = null;
            }
            unhighlightMoves();
            if (isKinginCheckMate(99, board)) {
                setTimeout(() => {
                    alert("White is CheckMate!")
                }, 300);
            }
            if (isKinginCheckMate(-99, board)) {
                setTimeout(() => {
                    alert("Black is CheckMate!")
                }, 300);
            }
        } else {
            let path = e.path;
            if (path[0].classList.contains("piece")) {
                selectedPiece = path[0];
                if (turn == 1) {
                    if (selectedPiece.key < turn) {
                        selectedPiece = null;
                        return;
                    }
                } else {
                    if (selectedPiece.key > turn) {
                        selectedPiece = null;
                        return;
                    }
                }

                let moves = getMoves(selectedPiece.key, selectedPiece.location[0], selectedPiece.location[1], board);
                highlightMoves(moves);
            }
        }

        // if(isKinginCheck(99, board)) {
        //     console.log("WHITE KING IS IN CHECK!");
        // }else if(isKinginCheck(-99, board)) {
        //     console.log("BLACK KING IN CHECK!");
        // }

    });
});

