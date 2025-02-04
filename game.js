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
for (let r = 0; r < ROW; r++) {
    board[r] = [];
    for (let c = 0; c < COL; c++) {
        board[r][c] = VACANT;
    }
}

// draw the board
function drawBoard() {
    for (let r = 0; r < ROW; r++) {
        for (let c = 0; c < COL; c++) {
            drawSquare(c, r, board[r][c]);
        }
    }
}

drawBoard();

// tetromino shapes
const Z = [
    [[1, 1, 0],
     [0, 1, 1],
     [0, 0, 0]],

    [[0, 0, 1],
     [0, 1, 1],
     [0, 1, 0]]
];

const S = [
    [[0, 1, 1],
     [1, 1, 0],
     [0, 0, 0]],

    [[0, 1, 0],
     [0, 1, 1],
     [0, 0, 1]]
];

const T = [
    [[0, 1, 0],
     [1, 1, 1],
     [0, 0, 0]],

    [[0, 1, 0],
     [0, 1, 1],
     [0, 1, 0]],

    [[0, 0, 0],
     [1, 1, 1],
     [0, 1, 0]],

    [[0, 1, 0],
     [1, 1, 0],
     [0, 1, 0]]
];

const O = [
    [[0, 0, 0, 0],
     [0, 1, 1, 0],
     [0, 1, 1, 0],
     [0, 0, 0, 0]]
];

const L = [
    [[0, 0, 1],
     [1, 1, 1],
     [0, 0, 0]],

    [[0, 1, 0],
     [0, 1, 0],
     [0, 1, 1]],

    [[0, 0, 0],
     [1, 1, 1],
     [1, 0, 0]],

    [[1, 1, 0],
     [0, 1, 0],
     [0, 1, 0]]
];

const I = [
    [[0, 0, 0, 0],
     [1, 1, 1, 1],
     [0, 0, 0, 0],
     [0, 0, 0, 0]],

    [[0, 0, 1, 0],
     [0, 0, 1, 0],
     [0, 0, 1, 0],
     [0, 0, 1, 0]]
];

const J = [
    [[1, 0, 0],
     [1, 1, 1],
     [0, 0, 0]],

    [[0, 1, 1],
     [0, 1, 0],
     [0, 1, 0]],

    [[0, 0, 0],
     [1, 1, 1],
     [0, 0, 1]],

    [[0, 1, 0],
     [0, 1, 0],
     [1, 1, 0]]
];

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
    let r = Math.floor(Math.random() * PIECES.length); // 0 -> 6
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
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
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
    for (let r = 0; r < this.activeTetromino.length; r++) {
        for (let c = 0; c < this.activeTetromino.length; c++) {
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
            // we[_{{{CITATION{{{_1{](https://github.com/diegoperezm/from-text-to-html-emmet/tree/5413baca824c7a21078e0986682449ace80d9cf5/README.md)[_{{{CITATION{{{_2{](https://github.com/Michael-Mend/Michael-Mend.github.io/tree/529e697e8d47fccc64d7b60887deadc1bc535f21/assets%2Fjs%2Ftetris.js)[_{{{CITATION{{{_3{](https://github.com/eminvergil/eminvergil.github.io/tree/5662910a5c806ba0981cf9c3308fb65b7a0c6e2d/tetris%2Ftetris.js)[_{{{CITATION{{{_4{](https://github.com/Elogeek/FunGames/tree/5e733ca4ed51a8cd88d91674d70b271bf48e62ae/Tetris%2Fapp.js)[_{{{CITATION{{{_5{](https://github.com/nddmanh/ilec-fullstack-web-1.0/tree/5f71f16b82f9aa26f999e4f5b3e5f2e9ec3ba905/section-6%2Fgame_xep_hinh%2Fmain.js)[_{{{CITATION{{{_6{](https://github.com/sdipietro/Tetris_pro/tree/ed754dbfc45b75c030681346ceaf42326bea25aa/src%2Fscripts%2Fpieces.js)[_{{{CITATION{{{_7{](https://github.com/kendalharland/Tetrad/tree/f4f1fac3f2f91002910f5a6d93660e46082f9efc/tetrad.js)[_{{{CITATION{{{_8{](https://github.com/bermarte/the_hills_js/tree/6797ebc131203070f9cbba9fa585a6a57e1ba9f7/Cordova%2Fgames%2Fplatforms%2Fbrowser%2Fwww%2Ftetris%2Fjs%2Ftetrominoes.js)[_{{{CITATION{{{_9{](https://github.com/beckermath/games/tree/f81e8acf29c8a2a8f888e3839fd5e5a4cabe10eb/tetris%2Ftetris.js)[_{{{CITATION{{{_10{](https://github.com/n3sta/react-tetris/tree/5006c6af0f938e67515bd988bde788d126f1cbd4/src%2Fcomponents%2FGame%2Fpieces.js)[_{{{CITATION{{{_11{](https://github.com/DealPete/c64-remakes/tree/a9623fb54ba14e57f720df31a8e2f615cded06f2/games%2F13994-tetris%2Ftetris.py)[_{{{CITATION{{{_12{](https://github.com/bugdlr/tetris/tree/494058dd18cf4ed9f3a043648afe7176796205f8/tetriminoes.js)[_{{{CITATION{{{_13{](https://github.com/Paroxyste/Javascript/tree/3f9c7bc5ca084e4b856a78a2522229022dedba80/JS-Games%2FTetris%2Ftetromino.js)[_{{{CITATION{{{_14{](https://github.com/javila35/Mod-3-Tetris-Frontend/tree/d8a9cababbb0867d11e10af993e051f1b9ae6f56/pieces.js)[_{{{CITATION{{{_15{](https://github.com/raphaelminacio/Tetris/tree/fd8515080e96ab42c30448cac2f84627bc36fa8e/tetrominoes.js)[_{{{CITATION{{{_16{](https://github.com/amrutapatil1720/Block-Game/tree/10e6d826419edb050575903fac2393a5f9878e14/block.js)[_{{{CITATION{{{_17{](https://github.com/kesiev/akihabara/tree/b40e0e418ebf7dcff6dcbc63be79cb7579adcefd/resources%2Ftspin%2Fdata%2Frot-sega.js)[_{{{CITATION{{{_18{](https://github.com/BroJoon/Tetris-using-js/tree/44d7f6c15defcc937ae034bf5169f2ed98aba384/Tetris%2Ftetris.js)[_{{{CITATION{{{_19{](https://github.com/Abangpa1ace/wecode-prep-week2/tree/984c0eaa0918117b73986d72ae57fe62355f014e/tetris%2Ftetris.js)