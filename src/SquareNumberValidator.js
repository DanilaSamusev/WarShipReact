import {GameDataManager} from "../GameDataManager";

export class SquareNumberValidator{

    areSquareNumbersValid(squareNumbers, direction, playerField) {

        if (!this.areSquareNumbersValidForBounds(squareNumbers, direction)) {

            return false;
        }

        if (direction === 0) {
            if (!this.areSquareNumbersValidForRows(squareNumbers[0], squareNumbers)){
                return false;
            }
        }

        for (let i = 0; i < squareNumbers.length; i++) {

            if (!this.isSquareNumberValidForShipNeighbour(squareNumbers[i], playerField)) {
                return false;
            }
        }

        return true;
    }

    areSquareNumbersValidForBounds(squareNumbers) {

        for (let i = 0; i < squareNumbers.length; i++) {

            if (squareNumbers[i] < 0 ||
                squareNumbers[i] > 99) {
                return false;
            }
        }

        return true;
    }

    areSquareNumbersValidForRows(firstSquareNumber, squareNumbers){

        for (let i = 0; i < squareNumbers.length; i++) {

            if (firstSquareNumber !== Math.trunc(squareNumbers[i] / 10)) {
                return false;
            }
        }

        return true;
    }

    isSquareNumberAlreadyClicked(squareNumber){

        let gameDataManager = new GameDataManager();

        return gameDataManager.getGameData().playerField.squares[squareNumber].isClicked;
    }

    isSquareNumberValidForShipNeighbour(squareNumber, playerField) {

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