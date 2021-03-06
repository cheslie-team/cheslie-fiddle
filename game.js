var Tournament = {
    connect: function (ai) {
        var gameIo = io('https://cheslie-game.azurewebsites.net'),
            tournamentIo = io('https://cheslie-tourney.azurewebsites.net');

        tournamentIo.on('connect', function () {
            console.log('Player ' + ai.name + ' is connected to cheslie-tourney');
            tournamentIo.emit('enter', ai.name);
        });

        tournamentIo.on('join', function (gameId) {
            console.log('Player is joining game: ' + gameId);
            if (gameIo.connected) {
                gameIo.emit('join', gameId, ai.name);
            } else {
                tournamentIo.emit('leave');
                gameIo.connect();
            }
        });

        tournamentIo.on('reconnect', function () {
            if (gameIo.connected) {
                tournamentIo.emit('enter', ai.name);
            }
        });

        tournamentIo.on('disconnect', function () {
            tournamentIo.connect();
        });

        gameIo.on('connect', function () {
            if (tournamentIo.connected) {
                tournamentIo.emit('enter', ai.name);
            }
            console.log('Player ' + ai.name + ' is connected to game');
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

        gameIo.on('disconnect', function () {
            tournamentIo.emit('leave');
            gameIo.connect();
        });
    }
};