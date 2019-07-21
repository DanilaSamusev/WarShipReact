function getSquareNumbersToPaint(direction, shipsOnField, firstSquareNumber) {

    var squareNumbers;

    if (shipsOnField >= 0 && shipsOnField < 4) {
        squareNumbers = new Array(1);
    }

    if (shipsOnField >= 4 && shipsOnField < 7) {
        squareNumbers = new Array(2);
    }

    if (shipsOnField >= 7 && shipsOnField < 9) {
        squareNumbers = new Array(3);
    }

    if (shipsOnField >= 9 && shipsOnField < 10) {
        squareNumbers = new Array(4);
    }

    squareNumbers[0] = firstSquareNumber;

    if (direction === 0) {
        for (var i = 1; i < squareNumbers.length; i++) {
            squareNumbers[i] = squareNumbers[i - 1] + 1;
        }
    } else {
        for (var i = 1; i < squareNumbers.length; i++) {
            squareNumbers[i] = squareNumbers[i - 1] - 10;
        }
    }

    return squareNumbers;
}

function areSquareNumbersValid(squareNumbers, direction) {

    if (!this.areSquareNumbersValidForBounds(squareNumbers)) {

        return false;
    }

    for (var i = 0; i < squareNumbers.length; i++) {

        if (!this.isPointNumberValid(squareNumbers[i], direction)) {
            return false;
        }
    }

    return true;
}

function areSquareNumbersValidForBounds(squareNumbers) {

    for (var i = 0; i < squareNumbers.length; i++) {

        if (squareNumbers[i] < 0 ||
            squareNumbers[i] > 99) {
            return false;
        }
    }

    return true;
}

function isPointNumberValid(squareNumber, direction) {

    var nearestSquareNumbers = [
        squareNumber - 11, squareNumber - 10, squareNumber - 9,
        squareNumber - 1, squareNumber, squareNumber + 1,
        squareNumber + 9, squareNumber + 10, squareNumber + 11
    ];

    if (squareNumber % 10 === 9) {
        nearestSquareNumbers = [
            squareNumber - 11, squareNumber - 10,
            squareNumber - 1, squareNumber,
            squareNumber + 9, squareNumber + 10
        ];
    }

    if (squareNumber % 10 === 0) {
        nearestSquareNumbers = [
            squareNumber - 10, squareNumber - 9,
            squareNumber + 1, squareNumber,
            squareNumber + 10, squareNumber + 11
        ];
    }

    for (var i = 0; i < nearestSquareNumbers.length; i++) {

        if (nearestSquareNumbers[i] >= 0 &&
            nearestSquareNumbers[i] <= 99) {



            if (this.state.playerField[nearestSquareNumbers[i]].shipNumber !== -1) {

                return false;
            }

            if (direction !== 0 && nearestSquareNumbers[0] / 10 !== nearestSquareNumbers[i] / 10) {
                return false
            }

        }
    }

    return true;

}