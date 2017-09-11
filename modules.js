var Modules = this.Modules || {};

(function (mod) {
    var minOrMax = function (a, b, maximizing) {
        if (maximizing && a.score > b.score) {
            return a;
        }
        if (!maximizing && a.score < b.score) {
            return a;
        }
        return b;
    }

    var exploreChildren = function (board, moves, depth, alphaBeta, maximizing, score, v) {
        if (alphaBeta.beta <= alphaBeta.alpha || moves.length === 0) {
            return v;
        }

        var child = moves.pop();

        v = minOrMax(v, minmaxAlphaBeta(board, depth - 1, alphaBeta, !maximizing, score, child), maximizing);

        alphaBeta = {
            alpha: maximizing ? Math.max(alphaBeta.alpha, v.score) : alphaBeta.alpha,
            beta: maximizing ? alphaBeta.beta : Math.min(alphaBeta.beta, v.score)
        };

        return exploreChildren(board, moves, depth, alphaBeta, maximizing, score, v);
    }

    var minmaxAlphaBeta = function (fen, depth, alphaBeta, maximizing, score, child) {
        var node = new Chess(fen),
            winning = { score: Number.POSITIVE_INFINITY, move: child },
            loosing = { score: Number.NEGATIVE_INFINITY, move: child };

        if (child) {
            node.move(child);
        }

        if (node.game_over()) {
            if (node.in_draw()) {
                return { score: 0, move: child };
            }

            return maximizing ? loosing : winning;
        }

        if (depth <= 0) {
            return { score: score(node), move: child };
        }

        var v = exploreChildren(node.fen(), node.moves(), depth, alphaBeta, maximizing, score, maximizing ? loosing : winning);
        
        return { score: v.score, move: child ? child : v.move };
    };

    var minmax = function (fen, score, depth) {
        var node = new Chess(fen);
        return minmaxAlphaBeta(fen, depth, {alpha: Number.NEGATIVE_INFINITY, beta: Number.POSITIVE_INFINITY}, true, score, null);
    };

    mod.minmax = function (board, depth, score) {
        return minmax(board, score, depth).move;
    };
}(Modules));

(function (mod) {
    var minOrMax = function (a, b, maximizing) {
        if (maximizing && a.score > b.score) {
            return a;
        }
        if (!maximizing && a.score < b.score) {
            return a;
        }
        return b;
    };

    var exploreChildren = function (board, moves, depth, span, maximizing, score, v) {
        if (moves.length === 0) {
            return v;
        }

        var child = moves.pop();

        v = minOrMax(v, decent(board, depth - 1, span, !maximizing, score, child), maximizing);

        return exploreChildren(board, moves, depth, span, maximizing, score, v);
    };

    var firstInteresting = function (node, score, n) {
        var interesting = node.moves()
            .map(function (move) {
                var c = new Chess(node.fen());
                c.move(move);
                return {chess: c, move: move};
            })
            .map(function (chessmove) {
                return {score: score(chessmove.chess), move: chessmove.move};
            })
            .sort(function (a, b) {
                if (a.score < b.score) return -1;
                if (a.score > b.score) return 1;
                return 0;
            })
            .map(function (move) {
                return move.move;
            });


        if (interesting.length >= n) {
            return interesting.slice(0, n);
        }
        return interesting;
    };

    var decent = function (fen, depth, span, maximizing, score, child) {
        var node = new Chess(fen),
            winning = { score: Number.POSITIVE_INFINITY, move: child },
            loosing = { score: Number.NEGATIVE_INFINITY, move: child };

        if (child) {
            node.move(child);
        }

        if (node.game_over()) {
            if (node.in_draw()) {
                return { score: 0, move: child };
            }

            return maximizing ? loosing : winning;
        }

        if (depth <= 0) {
            return { score: score(node), move: child };
        }

        var interestingMoves = firstInteresting(node.moves(), score, span);
        var v = exploreChildren(node.fen(), interestingMoves, depth, span, maximizing, score, maximizing ? loosing : winning);
        
        return { score: v.score, move: child ? child : v.move };
    };

    var deepening = function (fen, score, depth, span) {
        return decent(fen, depth, span, true, score, null);
    };

    mod.deepening = function (board, depth, score, span) {
        return deepening(board, score, depth, span).move;
    };
}(Modules));

(function (mod) {
    var getEndgameMove = function (board) {
        var query = 'fen=' + encodeURIComponent(board),
            path = '/v1/syzygy?' + query,
            url = 'https://cheslie-endgame.azurewebsites.net' + path,
            // path = '/api/v2?' + query,
            // url = 'https://syzygy-tables.info' + path,
            moves = new Chess(board).moves({verbose: true});

        return new Promise(function(resolve, reject) {
                // Do the usual XHR stuff
                var req = new XMLHttpRequest();
                req.open('GET', url);

                req.onload = function() {
                    if (req.status == 200) {
                        var parsed = JSON.parse(req.response);
                        if (parsed.bestMove) {
                            var move = moves.find(function (move) {
                                return parsed.bestMove.includes(move.from) && parsed.bestMove.includes(move.to);
                            });
                            if (move) {
                                resolve(move.san);
                            }
                        } else {
                            reject({
                                error: 'Endgame failed to return a legal move',
                                move: moves[Math.floor(Math.random() * moves.length)].san
                            });
                        }
                    }
                    else {
                        reject({
                            error: req.statusText,
                            move: moves[Math.floor(Math.random() * moves.length)].san
                        });
                    }
                };

                req.onerror = function() {
                    reject({
                        error: 'Network error',
                        move: moves[Math.floor(Math.random() * moves.length)].san
                    });
                };

                req.send();
            });
    };

    mod.endgame = function (board) {
        return getEndgameMove(board);
    };

}(Modules));