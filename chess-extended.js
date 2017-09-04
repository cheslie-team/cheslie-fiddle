var _Chess = Chess;

var Chess = function (fen) {
    var chess = new _Chess(fen);
    
    chess.pieces = function (color) {
        var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
            squares = [];

        for (var i = 1; i <= 8; i++) {
            letters.forEach(function (letter) {
                squares.push(letter + i);
            });
        };

        return squares.map(function (square) {
            return chess.get(square);
        }).filter(function (val) {
            if (color && val) {
                return val.color === color;
            }
            return val;
        });
    };

    chess.number_of_pieces = function (color) {
        return chess.pieces(color).length;
    };

    chess.moves_informaton = function () {
        return chess.moves({ verbose: true });
    };

    return chess;
};