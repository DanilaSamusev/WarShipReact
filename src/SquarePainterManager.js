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

    areSquareNumbersValid(squareNumbers, direction, playerField) {

        if (!this.areSquareNumbersValidForBounds(squareNumbers, direction)) {

            return false;
        }


        for (let i = 0; i < squareNumbers.length; i++) {

            if (!this.isPointNumberValid(squareNumbers[i], playerField)) {
                return false;
            }
        }

        return true;
    }

    areSquareNumbersValidForBounds(squareNumbers, direction) {

        for (let i = 0; i < squareNumbers.length; i++) {

            if (squareNumbers[i] < 0 ||
                squareNumbers[i] > 99) {
                return false;
            }
        }

        if (direction === 0) {
            for (let i = 0; i < squareNumbers.length; i++) {

                if (Math.trunc(squareNumbers[0] / 10) !==
                    Math.trunc(squareNumbers[i] / 10)) {
                    return false;
                }
            }
        }

        return true;
    }

    isPointNumberValid(squareNumber, playerField) {

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

                if (playerField[nearestSquareNumbers[i]].shipNumber !== -1) {

                    return false;
                }

            }
        }

        return true;

    };

}