var ai = this.ai || {};

// var RndJesus = require('./sample-players/rnd-jesus.js');
// var Endgamer = require('./sample-players/Endgamer.js');
// var Minmaxer = require('./sample-players/Minmaxer.js');

ai.name = 'Tørrfisk - ' + Math.floor(Math.random() * 1000);

// rnd-jesus.js
ai.move = function (board) {
    var chess = new Chess(board),
        moves = chess.moves(),
        move = moves[Math.floor(Math.random() * moves.length)];

    return move;
};

Runner.run(ai);
Tournament.connect(ai);