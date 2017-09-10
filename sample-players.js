var SamplePlayers = {
    RndJesus: {
        move: function (board) {
            var chess = new Chess(board),
                moves = chess.moves(),
                move = moves[Math.floor(Math.random() * moves.length)];

            return move;
        }
    },
    Endgamer: {
        move: function (board) {
            var chess = new Chess(board);

            if (chess.numberOfPieces() <= 5) {
                // This will return a promise
                return Modules.endgame(board);
            } else {
                return SamplePlayers.RndJesus.move(board);
            }
        }
    },
    Minmaxer: {
        move: function (board) {
            var depth = 2,
                score = function (chess) {
                    // chess is a chess.js instance
                    // A number between Number.NEGATIVE_INFINITY and Number.POSITIVE_INFINITY
                    return Math.random() * 200 - 100;
                };

            return Modules.minmax(board, depth, score);
        }
    },
    Decender: {
        move: function (board) {
                var depth = 3,
                span = 6,
                score = function (chess) {
                    // chess is a chess.js instance
                    // A number between Number.NEGATIVE_INFINITY and Number.POSITIVE_INFINITY
                    return Math.random() * 200 - 100;
                };

            return Modules.deepening(board, depth, score, span);
        }
    }
};