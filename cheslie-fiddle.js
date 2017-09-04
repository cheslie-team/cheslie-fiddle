var game = io('http://cheslie-game.azurewebsites.net'),
    name = ai.name;

game.on('connect', function () {
    console.log('Player ' + name + ' is connected to game');
});

var emitMove = function (gameState, move) {
    gameState.move = move;
    game.emit('move', gameState);
};

game.on('move', function (gameState) {
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

if (ai.playRandom) {
	runner.run();
}

console.log('I was loaded...');