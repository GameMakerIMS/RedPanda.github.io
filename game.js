const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 32;
const VACANT = "BLACK"; // color of an empty square

// draw a square
function drawSquare(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

    ctx.strokeStyle = "WHITE";
    ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// create the board
let board = [];
for (r = 0; r < ROW; r++) {
    board[r] = [];
    for (c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

// draw the board
function drawBoard() {
    for (r = 0; r < ROW; r++) {
        for (c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

// the pieces and their colors
const PIECES = [
    [Z, "red"],
    [S, "green"],
    [T, "yellow"],
    [O, "blue"],
    [L, "purple"],
    [I, "cyan"],
    [J, "orange"]
];

// generate random pieces
function randomPiece() {
    let r = randomN = Math.floor(Math.random() * PIECES.length) // 0 -> 6
    return new Piece(PIECES[r][0], PIECES[r][1]);
}

let p = randomPiece();

// The Object Piece
function Piece(tetromino, color) {
    this.tetromino = tetromino;
    this.color = color;

    this.tetrominoN = 0; // we start from the first pattern
    this.activeTetromino = this.tetromino[this.tetrominoN];

    // we need to control the pieces
    this.x = 3;
    this.y = -2;
}

// fill function
Piece.prototype.fill = function (color) {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // we draw only occupied squares
            if (this.activeTetromino[r][c]) {
                drawSquare(this.x + c, this.y + r, color);
            }
        }
    }
}

// draw a piece to the board
Piece.prototype.draw = function () {
    this.fill(this.color);
}

// undraw a piece
Piece.prototype.unDraw = function () {
    this.fill(VACANT);
}

// move Down the piece
Piece.prototype.moveDown = function () {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.unDraw();
        this.y++;
        this.draw();
    } else {
        // we lock the piece and generate a new one
        this.lock();
        p = randomPiece();
    }
}

// move Right the piece
Piece.prototype.moveRight = function () {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x++;
        this.draw();
    }
}

// move Left the piece
Piece.prototype.moveLeft = function () {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.unDraw();
        this.x--;
        this.draw();
    }
}

// rotate the piece
Piece.prototype.rotate = function () {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;

    if (this.collision(0, 0, nextPattern)) {
        if (this.x > COL / 2) {
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        } else {
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }

    if (!this.collision(kick, 0, nextPattern)) {
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = nextPattern;
        this.draw();
    }
}

let score = 0;

// lock the piece
Piece.prototype.lock = function () {
    for (r = 0; r < this.activeTetromino.length; r++) {
        for (c = 0; c < this.activeTetromino.length; c++) {
            // we skip the vacant squares
            if (!this.activeTetromino[r][c]) {
                continue;
            }
            // pieces to lock on top = game over
            if (this.y + r < 0) {
                alert("Game Over");
                // stop request animation frame
                gameOver = true;
                break;
            }
            // we lock the piece
            board[this.y + r][this.x + c] = this.color;
        }
    }
    // remove full rows
    for (r = 0; r < ROW; r++) {
        let isRowFull = true;
        for (c = 0; c < COL; c++) {
            isRowFull = isRowFull && (board[r][c] != VACANT);
        }
        if (isRowFull) {
            // if the row is full
            // we move down all the rows above it
            for (y = r; y > 1; y--) {
                for (c = 0; c < COL; c++) {
                    board[y][c] = board[y - 1][c];
                }
            }
            // the top row board[0][..] has no row above it
            for (c = 0; c < COL; c++) {
                board[0][c] = VACANT;
            }
            // increment the score
            score += 10;
        }
    }
    // update the board
    drawBoard();

    // update the score
    scoreElement.innerHTML = score;
}

// collision function
Piece.prototype.collision = function (x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            // if the square is empty, we skip it
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // conditions
            if (newX < 0 || newX >= COL || newY >= ROW) {
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if (newY < 0) {
                continue;
            }
            // check if there is a locked piece already in place
            if (board[newY][newX] != VACANT) {
                return true;
            }
        }
    }
    return false;
}

// control the piece
document.addEventListener("keydown", CONTROL);

function CONTROL(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode ==[_{{{CITATION{{{_1{](https://github.com/buribalazs/smooth-drag-order/tree/7b40d21d076c3e31765f61481f537beaf4c5ec9f/README.md)[_{{{CITATION{{{_2{](https://github.com/Michael-Mend/Michael-Mend.github.io/tree/529e697e8d47fccc64d7b60887deadc1bc535f21/assets%2Fjs%2Ftetris.js)[_{{{CITATION{{{_3{](https://github.com/eminvergil/eminvergil.github.io/tree/5662910a5c806ba0981cf9c3308fb65b7a0c6e2d/tetris%2Ftetris.js)[_{{{CITATION{{{_4{](https://github.com/beckermath/games/tree/f81e8acf29c8a2a8f888e3839fd5e5a4cabe10eb/tetris%2Ftetris.js)[_{{{CITATION{{{_5{](https://github.com/YavuzSelimGugen/advanced_homework/tree/073bf280ef9c811a1b62632dc256e6553dc22358/Tetris%2Ftetris.js)[_{{{CITATION{{{_6{](https://github.com/kscao/tetris-starter/tree/4df313effafe5d77bab37fd3719572b6d063b705/tetris.js)[_{{{CITATION{{{_7{](https://github.com/seungyeop-lee/tetris/tree/71b681529218a1b5b3800bb60766fdc3c754f8ef/example-tetris%2Ftetris.js)[_{{{CITATION{{{_8{](https://github.com/CerchiaCorneliu/006.TetrisGame/tree/fd5e16e432a40d5350b720003aafeb152bffb35a/tetris.js)