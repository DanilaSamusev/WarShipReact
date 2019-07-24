export class SquarePainterManager{

    getSquareNumbersToPaint(direction, shipsOnField, firstSquareNumber) {

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
            for (let i = 1; i < squareNumbers.length; i++) {
                squareNumbers[i] = squareNumbers[i - 1] + 1;
            }
        } else {
            for (let i = 1; i < squareNumbers.length; i++) {
                squareNumbers[i] = squareNumbers[i - 1] - 10;
            }
        }

        return squareNumbers;
    }
}