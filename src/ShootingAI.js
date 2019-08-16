import {Direction} from "./Direction";
import {SquareNumberValidator} from "./SquareNumberValidator";

let squareNumberValidator = new SquareNumberValidator();

export class ShootingAI {

    static _lastShotSquareNumber = -1;
    static _firstShotSquareNumber = -1;
    static _shipPosition = -1;
    static _roundShotDirection = -1;
    static _nextShotDirection = -1;

    getRandomSquareNumber() {

        return Math.floor(Math.random() * (100));
    }

    getRoundSquareNumber(middleSquareNumber, board) {

        if (this.isSquareNumberOkToShoot(middleSquareNumber - 1, board)
            && squareNumberValidator.areSquareNumbersInSimilarRow(ShootingAI._firstShotSquareNumber, middleSquareNumber - 1)) {
            ShootingAI._roundShotDirection = Direction.left;
            ShootingAI._nextShotDirection = Direction.left;
            return middleSquareNumber - 1;
        }

        if (this.isSquareNumberOkToShoot(middleSquareNumber - 10, board)) {
            ShootingAI._roundShotDirection = Direction.top;
            ShootingAI._nextShotDirection = Direction.top;
            return middleSquareNumber - 10;
        }

        if (this.isSquareNumberOkToShoot(middleSquareNumber + 1, board)
            && squareNumberValidator.areSquareNumbersInSimilarRow(ShootingAI._firstShotSquareNumber, middleSquareNumber + 1)) {
            ShootingAI._roundShotDirection = Direction.right;
            ShootingAI._nextShotDirection = Direction.right;
            return middleSquareNumber + 1;
        }


        ShootingAI._roundShotDirection = Direction.bottom;
        ShootingAI._nextShotDirection = Direction.bottom;

        return middleSquareNumber + 10;
    }

    getHorizontalSquareNumber(board) {

        let currentSquareNumber;

        if (ShootingAI._nextShotDirection === Direction.left) {

            currentSquareNumber = ShootingAI._lastShotSquareNumber - 1;

            if (!this.isSquareNumberOkToShoot(currentSquareNumber, board)) {

                ShootingAI._lastShotSquareNumber = ShootingAI._firstShotSquareNumber;
                ShootingAI._nextShotDirection = Direction.right;
            }

        }

        if (ShootingAI._nextShotDirection === Direction.right) {

            currentSquareNumber = ShootingAI._lastShotSquareNumber + 1;
        }

        return currentSquareNumber;
    }

    getVerticalSquareNumber(board) {

        let currentSquareNumber;

        if (ShootingAI._nextShotDirection === Direction.top) {

            currentSquareNumber = ShootingAI._lastShotSquareNumber - 10;

            if (!this.isSquareNumberOkToShoot(currentSquareNumber, board)) {

                ShootingAI._lastShotSquareNumber = ShootingAI._firstShotSquareNumber;
                ShootingAI._nextShotDirection = Direction.bottom;
            }
        }

        if (ShootingAI._nextShotDirection === Direction.bottom) {

            currentSquareNumber = ShootingAI._lastShotSquareNumber + 10;
        }

        return currentSquareNumber;
    }

    isSquareNumberOkToShoot(squareNumber, board) {

        let squareNumberValidator = new SquareNumberValidator();

        if (squareNumberValidator.isSquareNumberValidToShoot(squareNumber, board)) {

            if (ShootingAI._shipPosition === Direction.horizontal) {

                return squareNumberValidator.areSquareNumbersInSimilarRow(ShootingAI._firstShotSquareNumber, squareNumber)
            }

            return true;
        }

        return false;
    }

    resetMemory() {

        ShootingAI._lastShotSquareNumber = -1;
        ShootingAI._firstShotSquareNumber = -1;
        ShootingAI._shipPosition = -1;
        ShootingAI._roundShotDirection = -1;
        ShootingAI._nextShotDirection = -1;
    }
}