var ai = this.ai || {};

// var rndJesus = require('./sample-players/rnd-jesus.js');
// var endgamer = require('./sample-players/endgamer.js');
// var minmaxer = require('./sample-players/minmaxer.js');

ai.name = 'Tørrfisk - ' + Math.floor(Math.random() * 1000);

// rnd-jesus.js
ai.move = function (board) {
    var chess = new Chess(board),
        moves = chess.moves(),
        move = moves[Math.floor(Math.random() * moves.length)];

    return move;
};

runner.run(ai);
game.connect(ai);