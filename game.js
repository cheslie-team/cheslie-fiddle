var Tournament = {
    connect: function (ai) {
        var gameIo = io('https://cheslie-game.azurewebsites.net'),
            tournamentIo = io('https://cheslie-tourney.azurewebsites.net'),
            name = 'CORS Test ai.name';

        tournamentIo.on('connect', function () {
            console.log('Player ' + name + ' is connected to cheslie-tourney');
            tournamentIo.emit('enter', name);
        });

        tournamentIo.on('join', function (gameId) {
            console.log('Player is joining game: ' + gameId);
            game.emit('join', gameId, name);
        });

        gameIo.on('connect', function () {
            console.log('Player ' + name + ' is connected to game');
        });

        var emitMove = function (gameState, move) {
            gameState.move = move;
            gameIo.emit('move', gameState);
        };

        gameIo.on('move', function (gameState) {
            var move = ai.move(gameState.board);
            if (typeof move === "string") {
                emitMove(gameState, move);
            } else {
                move.then(function (move) {
                    emitMove(gameState, move);
                }).catch(function (err) {
                    console.log(err.error);
                    emitMove(gameState, err.move);
                });        
            }
        });
    }
};