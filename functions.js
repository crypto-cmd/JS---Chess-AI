function getMoves(pieceKey, x, y, boardMatrix, istryingMove = false) {
    let legalMoves = [];
    let piece = keys[pieceKey];
    let offsets;
    if (piece.includes("rook")) {
        offsets = [
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1]
        ];

    } else if (piece.includes("bishop")) {
        offsets = [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1]
        ];
    } else if (piece.includes("queen")) {
        offsets = [
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1]
        ];
    } else if (piece.includes("pawn")) {
        let startingLocation;
        if (piece.includes("black")) {
            startingLocation = 1;
            offsets = [
                [1, 0],
                [1, 1],
                [1, -1],
                [2, 0]
            ];
        } else {
            offsets = [
                [-1, 0],
                [-1, -1],
                [-1, 1],
                [-2, 0]
            ]
            startingLocation = 6;
        }

        let newX = x + offsets[0][0];
        let newY = y + offsets[0][1];
        if (inBounds(newX, newY)) {
            if (!isTileOccupied(newX, newY, boardMatrix)) {
                legalMoves.push([newX, newY]);
                if (x == startingLocation) {
                    newX = x + offsets[3][0];
                    newY = y + offsets[3][1];
                    if (inBounds(newX, newY)) {
                        if (!isTileOccupied(newX, newY, boardMatrix)) {
                            legalMoves.push([newX, newY]);
                        }
                    }
                }
            }
        }
        newX = x + offsets[1][0];
        newY = y + offsets[1][1];
        if (inBounds(newX, newY)) {
            if (isTileOccupied(newX, newY, boardMatrix)) {
                if (!isPieceAlly(pieceKey, newX, newY, boardMatrix)) {
                    legalMoves.push([newX, newY])
                }
            }
        }
        newX = x + offsets[2][0];
        newY = y + offsets[2][1];
        if (inBounds(newX, newY)) {

            if (isTileOccupied(newX, newY, boardMatrix)) {
                if (!isPieceAlly(pieceKey, newX, newY, boardMatrix)) {
                    legalMoves.push([newX, newY])
                }
            }
        }
        return istryingMove ? legalMoves : legalMoves.filter(move => !willKingBeinCheck([x, y], move, pieceKey));
    } else if (piece.includes("knight")) {
        offsets = [
            [-2, 1],
            [-2, -1],
            [-1, -2],
            [-1, 2],
            [2, 1],
            [2, -1],
            [1, -2],
            [1, 2]

        ];
        for (const offset of offsets) {
            let newX = x + offset[0];
            let newY = y + offset[1];
            if (!inBounds(newX, newY)) continue;
            if (isTileOccupied(newX, newY, boardMatrix)) {
                if (!isPieceAlly(pieceKey, newX, newY, boardMatrix)) {
                    legalMoves.push([newX, newY])
                }
                continue;
            }
            legalMoves.push([newX, newY]);

        }
        return istryingMove ? legalMoves : legalMoves.filter(move => !willKingBeinCheck([x, y], move, pieceKey));

    } else if (piece.includes("king")) {
        offsets = [
            [1, 0],
            [1, 1],
            [1, -1],
            [-1, 0],
            [-1, 1],
            [-1, -1],
            [0, 1],
            [0, -1],
        ];
        for (const offset of offsets) {
            let newX = x + offset[0];
            let newY = y + offset[1];
            if (!inBounds(newX, newY)) continue;
            if (isTileOccupied(newX, newY, boardMatrix)) {
                if (!isPieceAlly(pieceKey, newX, newY, boardMatrix)) {
                    legalMoves.push([newX, newY])
                }
                continue;
            }
            legalMoves.push([newX, newY]);

        }
        return istryingMove ? legalMoves : legalMoves.filter(move => !willKingBeinCheck([x, y], move, pieceKey));
        ;
    }
    for (const offset of offsets) {
        let newX = x + offset[0];
        let newY = y + offset[1];
        if (inBounds(newX, newY)) {
            do {
                if (isTileOccupied(newX, newY, boardMatrix)) {
                    if (!isPieceAlly(pieceKey, newX, newY, boardMatrix)) {
                        legalMoves.push([newX, newY])
                    }
                    break;
                }
                legalMoves.push([newX, newY]);
                newX += offset[0];
                newY += offset[1];
            } while (inBounds(newX, newY));
        }
    }
    return istryingMove ? legalMoves : legalMoves.filter((move) => !willKingBeinCheck([x, y], move, pieceKey));
}
function isTileOccupied(x, y, boardMatrix) {
    return !boardMatrix[x][y] == 0;
}
function isPieceAlly(alliance, x, y, boardMatrix) {
    return (alliance > 0 ? boardMatrix[x][y] > 0 : boardMatrix[x][y] < 0);

}
function inBounds(x, y) {
    return ((x < 8 && x >= 0) && (y < 8 && y >= 0));
}
function isKinginCheckMate(pieceKey, boardMatrix) {
    const isAlly = pieceKey > 0 ? val => val > 0 : val => val < 0;
    for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix[i].length; j++) {
            let piece = boardMatrix[i][j];
            if (isTileOccupied(i, j, boardMatrix)) {
                if (isAlly(piece)) {
                    let allMoves = getMoves(piece, i, j, boardMatrix);
                    if (allMoves.length != 0) return false;
                }
            }
        }
    }
    return true;
}
function willKingBeinCheck(currentPos, move, pieceKey) {
    let boardMatrix = new Array(board.length);
    //Create a copy of the current boardState
    for (let i = 0; i < board.length; i++) {
        boardMatrix[i] = new Array(board[i].length)
        for (let j = 0; j < board[i].length; j++) {
            boardMatrix[i][j] = board[i][j];
        }
    }

    //Move piece on copied board
    boardMatrix[currentPos[0]][currentPos[1]] = 0;
    boardMatrix[move[0]][move[1]] = pieceKey;

    //Check if king is in check in copied board
    return isKinginCheck(pieceKey, boardMatrix);

}

function isKinginCheck(pieceKey, boardMatrix) {
    const king = pieceKey < 0 ? getKings(boardMatrix).black : getKings(boardMatrix).white;
    const isEnemy = pieceKey < 0 ? (val) => { return val > 0 } : (val) => { return val < 0 };
    for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix[i].length; j++) {
            const spot = boardMatrix[i][j];
            if (isEnemy(spot)) {
                const allMoves = getMoves(spot, i, j, boardMatrix, true);
                for (const move of allMoves) {
                    if (move[0] == king[0] && move[1] == king[1]) {
                        return true;
                    }
                }
            }
        }
    }
    return false;

}
function getKings(boardMatrix = board) {
    let kings = {};
    for (let i = 0; i < boardMatrix.length; i++) {
        for (let j = 0; j < boardMatrix.length; j++) {
            if (boardMatrix[i][j] == 99) {
                kings.white = [i, j];
            } else if (boardMatrix[i][j] == -99) {
                kings.black = [i, j];
            }
        }
    }
    return kings;
}




/**
 * 
 * @param {HTMLDivElement} rank 
 */
function createRank(rank) {
    let arr = [];
    for (let i = 0; i < rank.children.length; i++) {
        arr.push(0);
    }
    return arr;
}
function setupBoard() {
    let colour = "white";
    let tilesArray = [];
    for (let i = 0; i < 8; i++) {
        let rank = document.createElement("div");
        rank.classList.add("rank", `rank-${i + 1}`);
        for (let file = 0; file < 8; file++) {
            let tile = document.createElement("div");
            tile.piece = null;
            tile.classList.add("tile", `${colour}-tile`);
            rank.appendChild(tile);
            colour = colour == "black" ? "white" : "black";
        }
        colour = colour == "black" ? "white" : "black";
        tilesArray.push(rank);
    }
    return tilesArray;
}
function highlightMoves(moves) {
    unhighlightMoves();
    for (const move of moves) {
        let rank = move[0];
        let file = move[1];
        const moveDisplay = document.createElement("div");
        moveDisplay.classList.add("move");
        moveDisplay.location = [rank, file];
        boardDisplay.children[rank].children[file].appendChild(moveDisplay);
    }
}
function unhighlightMoves() {
    for (let rank = 0; rank < board.length; rank++) {
        for (let file = 0; file < board[rank].length; file++) {
            const square = boardDisplay.children[rank].children[file];
            Array.from(square.children).forEach((child) => {
                if (child.classList.contains("move")) {
                    child.remove();
                }
            })
        }
    }
}
function updateDisplay() {
    for (let rank = 0; rank < board.length; rank++) {
        for (let file = 0; file < board[rank].length; file++) {
            const square = boardDisplay?.children[rank]?.children[file];
            Array.from(square.children).forEach((child) => { if (child instanceof HTMLImageElement) { child.remove() } });
            let piece = keys[board[rank][file]]
            if (piece) {
                let img = document.createElement("img");
                img.src = `images/${piece}.png`;
                img.location = [rank, file];
                img.key = board[rank][file];
                img.classList.add(piece, "piece");
                square.appendChild(img)
            }
        }
    }

}

function getBestMove() {
    let depth = 2;
    let bestMove = {};
    let bestEval = Infinity;
    let eval;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j];
            if (piece == 0 || piece > 0) continue;
            let allMoves = getMoves(piece, i, j, board);
            for (const move of allMoves) {
                let temp = board[move[0]][move[1]];
                board[move[0]][move[1]] = piece;
                board[i][j] = 0;
                eval = negamax(board, depth, -Infinity, Infinity, 1);
                if (!bestMove.pieceKey) {
                    bestMove.pieceKey = piece;
                    bestMove.startingLocation = [i, j];
                    bestMove.destination = [move[0], move[1]];
                }
                if (eval < bestEval) {
                    bestEval = eval;
                    bestMove.pieceKey = piece;
                    bestMove.startingLocation = [i, j];
                    bestMove.destination = [move[0], move[1]];
                }
                board[move[0]][move[1]] = temp;
                board[i][j] = piece;
            }
        }
    }
    console.log(bestEval);
    return bestMove
}
/**
 * 
 * @param {Number[][]} node 
 * @param {number} depth 
 * @param {number} alpha 
 * @param {number} beta 
 * @param {number} colour 
 */
function negamax(node, depth, alpha, beta, colour) {
    if (isKinginCheckMate(99, node)) {
        return Infinity ;
    }
    if(isKinginCheckMate(-99, node)) {
        return -Infinity;
    }
    if (depth <= 0) {
        return colour * evaluate(board);
    }
    const onTeam = colour == 1 ? val => val > 0 : val => val < 0;
    let value = -Infinity;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j];
            if (piece == 0) continue;
            if (!onTeam(piece)) continue;
            const allMoves = order(getMoves(piece, i, j, board), board);
            for (const move of allMoves) {
                let temp = board[move[0]][move[1]];
                board[move[0]][move[1]] = piece;
                board[i][j] = 0;
                value = Math.max(value, -negamax(board, depth - 1,-beta, -alpha, -colour));
                alpha = Math.max(alpha, value);
                board[move[0]][move[1]] = temp;
                board[i][j] = piece;
                if(alpha >= beta) break;
            }
        }
    }
    
    return value;
}
function evaluate(board) {
    let sum = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            let piece = board[i][j];
            sum+= piece;
        }
    }
    return sum;
}
function order(moves, boardState) {
    const attackingMoves = [];
    const nothingMoves = [];
    for(let i =0; i < moves.length; i++){
        const move = moves[i];
        if(boardState[move[0]][move[1]] != 0) {
            attackingMoves.push(move);
        }else {
            nothingMoves.push(move);
        }
    }
    return attackingMoves.concat(nothingMoves);

}