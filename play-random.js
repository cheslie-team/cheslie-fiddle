var Runner = this.Runner || {};

(function (r) {
    var black = SamplePlayers.RndJesus,
        // black = SamplePlayers.Endgamer,
        // black = SamplePlayers.Minmaxer,
        chess = new Chess(),
        SUPPORT_UNICODE = true,
        unicodeMap = {
            'K': '\u2654',
            'Q': '\u2655',
            'R': '\u2656',
            'B': '\u2657',
            'N': '\u2658',
            'P': '\u2659',
            'k': '\u265A',
            'q': '\u265B',
            'r': '\u265C',
            'b': '\u265D',
            'n': '\u265E',
            'p': '\u265F'
        },
        board;

    var unicode = function (ascii) {
        if (!SUPPORT_UNICODE) {
            return ascii;
        }
        return Object.keys(unicodeMap).reduce(function (acc, val) {
            return acc.replace(new RegExp(val, 'g'), unicodeMap[val]);
        }, ascii);
    };

    var reason = function (chess) {
        if (chess.in_checkmate()) {
            var winner = chess.turn() === 'w' ? 'Black' : 'White';
            return winner + ' won by checkmate';
        }

        if (chess.insufficient_material()) {
            return 'Draw by insufficient material';
        }

        if (chess.in_stalemate()) {
            return 'Draw by stalemate';
        }

        if (chess.in_threefold_repetition()) {
            return 'Draw by threefold repetition';
        }

        return 'Draw since the game lasted over 100 moves';
    };

    var doMove = function (chess, white, black, move, delay) {
        chess.move(move);

        if (!board) {
            board = ChessBoard('board');
        }

        board.position(chess.fen());
        console.log(unicode(chess.ascii() + '\n\r K = White, k = ') + 'Black');
        
        setTimeout(function () {
            play(chess, white, black, delay);
        }, delay);
    };

    var play = function (chess, white, black, delay) {
        if (chess.game_over()) {
            console.log(reason(chess));
            return;
        };

        var board = chess.fen(),
            player = chess.turn() === 'w' ? white : black;
            move = player.move(board);

        if (typeof move === "string") {
            doMove(chess, white, black, move, delay);
        } else {
            move.then(function (move) {
                doMove(chess, white, black, move, delay);
            }).catch(function (err) {
                console.log(err.error);
                doMove(chess, white, black, err.move, delay);
            });        
        }    
    };

    r.run = function (ai, delay) {
        play(chess, ai, black, delay);
    };
}(Runner));