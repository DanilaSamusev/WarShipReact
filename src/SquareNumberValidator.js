import {GameDataManager} from "./GameDataManager";
import {SquarePainterManager} from "./SquarePainterManager.js"

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

            let squarePainterManager = new SquarePainterManager();

            if (!this.isSquareNumberValidForShipNeighbour(squarePainterManager.getNearestSquareNumbers(squareNumbers[i]), playerField)) {
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

            if (Math.trunc(firstSquareNumber / 10) !== Math.trunc(squareNumbers[i] / 10)) {
                return false;
            }
        }

        return true;
    }

    isSquareNumberAlreadyClicked(squareNumber){

        let gameDataManager = new GameDataManager();

        return gameDataManager.getGameData().playerField.squares[squareNumber].isClicked;
    }

    isSquareNumberValidForShipNeighbour(nearestSquareNumbers, playerField) {

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