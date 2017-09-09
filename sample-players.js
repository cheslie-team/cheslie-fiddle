var samplePlayers = {
    rndJesus: {
        move: function (board) {
            var chess = new Chess(board),
                moves = chess.moves(),
                move = moves[Math.floor(Math.random() * moves.length)];

            return move;
        }
    },
    endgamer: {
        move: function (board) {
            var chess = new Chess(board);

            if (chess.number_of_pieces() <= 5) {
                // This will return a promise
                return modules.endgame(board);
            } else {
                return samplePlayers.rndJesus.move(board);
            }
        }
    },
    minmaxer: {
        move: function (board) {
            var depth = 2,
                score = function (chess) {
                    // chess is a chess.js instance
                    // A number between Number.NEGATIVE_INFINITY and Number.POSITIVE_INFINITY
                    return Math.random() * 200 - 100;
                };

            return modules.minmax(board, depth, score);
        }
    },
    decender: {
        move: function (board) {
                var depth = 3,
                span = 6,
                score = function (chess) {
                    // chess is a chess.js instance
                    // A number between Number.NEGATIVE_INFINITY and Number.POSITIVE_INFINITY
                    return Math.random() * 200 - 100;
                };

            return deepening.move(board, depth, score, span);
        }
    }
};