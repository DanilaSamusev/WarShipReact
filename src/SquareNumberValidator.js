import {GameDataManager} from "./GameDataManager";
import {SquareNumberManager} from "./SquareNumberManager.js"
import {Direction} from "./Direction";

export class SquareNumberValidator {

    areSquareNumbersValid(squareNumbers, direction, playerField) {

        for (let i = 0; i < squareNumbers.length; i++) {

            if (!this.isSquareNumberValidForBounds(squareNumbers[i])) {
                return false;
            }
        }

        if (direction === Direction.horizontal) {

            for (let i = 0; i < squareNumbers.length; i++) {

                if (!this.areSquareNumbersInSimilarRow(squareNumbers[0], squareNumbers[i])) {
                    return false;
                }
            }
        }

        for (let i = 0; i < squareNumbers.length; i++) {

            let squarePainterManager = new SquareNumberManager();

            if (!this.isSquareNumberValidForShipNeighbour(squarePainterManager.getNearestSquareNumbers(squareNumbers[i]), playerField)) {
                return false;
            }
        }

        return true;
    }

    areSquareNumbersInSimilarRow(firstSquareNumber, squareNumber) {

        return Math.trunc(firstSquareNumber / 10) === Math.trunc(squareNumber / 10);

    }

    isSquareNumberValidForBounds(squareNumber) {

        return (squareNumber >= 0 &&
            squareNumber <= 99);

    }

    isSquareNumberValidForShipNeighbour(nearestSquareNumbers, playerField) {

        for (let i = 0; i < nearestSquareNumbers.length; i++) {

            if (this.isSquareNumberValidForBounds(nearestSquareNumbers[i])) {

                if (playerField[nearestSquareNumbers[i]].shipNumber !== -1) {

                    return false;
                }

            }
        }

        return true;
    }

    isSquareNumberValidToShoot(squareNumber, board) {

        return !this.hasDeadShipNeighbour(squareNumber, board) &&
            this.isSquareNumberValidForBounds(squareNumber) &&
            !this.isSquareAlreadyShot(squareNumber, board)
    }

    isSquareAlreadyShot(squareNumber, board) {

        return board.field.squares[squareNumber].isClicked;
    }

    hasDeadShipNeighbour(squareNumber, board) {

        let squareNumberManager = new SquareNumberManager();
        let squareNumberValidator = new SquareNumberValidator();
        let nearestSquareNumbers = squareNumberManager.getNearestSquareNumbers(squareNumber);
        let shipNumber;
        let ship;

        for (let i = 0; i < nearestSquareNumbers.length; i++) {

            if (squareNumberValidator.isSquareNumberValidForBounds(nearestSquareNumbers[i])) {

                shipNumber = board.field.squares[nearestSquareNumbers[i]].shipNumber;

                if (shipNumber !== -1) {

                    ship = board.fleet.ships[shipNumber];

                    if (!ship.isAlive) {

                        return true;
                    }
                }
            }
        }

        return false;
    }
}