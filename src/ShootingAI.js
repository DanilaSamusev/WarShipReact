import {Direction} from "./Direction";
import {GameDataManager} from "./GameDataManager";
import {SquareNumberValidator} from "./SquareNumberValidator";

export class ShootingAI{

    static _lastShotSquareNumber = -1;
    static _firstShotSquareNumber = -1;
    static _shipPosition = -1;
    static _roundShotDirection = -1;
    static _nextShotDirection = -1;

    getSquareNumberToShoot(){

        if (ShootingAI._firstShotSquareNumber === -1){

            return this.getRandomSquareNumber();
        }
        else{
            if (ShootingAI._shipPosition !== -1){

                if (ShootingAI._shipPosition === Direction.horizontal){
                    return this.getHorizontalSquareNumber();
                }
                else{
                    return this.getVerticalSquareNumber();
                }
            }
            else{
                return this.getRoundPoint();
            }
        }
    }

    getRandomSquareNumber(){

        let randomSquareNumber;
        let gameData = this.getGameData();

        do{
            randomSquareNumber = Math.floor(Math.random() * (100) + 100);
        }while(gameData.playerField.squares[randomSquareNumber].isClicked);

        return randomSquareNumber;
    }

    getRoundPoiunt(){
        
    }

    getHorizontalSquareNumber(){

        let currentSquareNumber;

        if (ShootingAI._nextShotDirection === Direction.left){

            currentSquareNumber = ShootingAI._lastShotSquareNumber - 1;

            if (!this.isSquareNumberOkToShoot(currentSquareNumber)){

                ShootingAI._lastShotSquareNumber = ShootingAI._firstShotSquareNumber;
                ShootingAI._nextShotDirection = Direction.rigth;
            }

        }

        if (ShootingAI._nextShotDirection === Direction.rigth){

            currentSquareNumber = ShootingAI._lastShotSquareNumber + 1;
        }

        return currentSquareNumber;
    }

    getVerticalSquareNumber(){

        let currentSquareNumber;

        if (ShootingAI._nextShotDirection === Direction.top){

            currentSquareNumber = ShootingAI._lastShotSquareNumber - 10;

            if (!this.isSquareNumberOkToShoot(currentSquareNumber)){

                ShootingAI._lastShotSquareNumber = ShootingAI._firstShotSquareNumber;
                ShootingAI._nextShotDirection = Direction.bottom;
            }
        }

        if (ShootingAI._nextShotDirection === Direction.bottom){

            currentSquareNumber = ShootingAI._lastShotSquareNumber + 10;
        }

        return currentSquareNumber;
    }

    isSquareNumberOkToShoot(squareNumber){

        let squareNumberValidator = new SquareNumberValidator();

        if (squareNumberValidator.areSquareNumbersValidForBounds(new Array(squareNumber)) ||
            squareNumberValidator.isSquareNumberAlreadyClicked(squareNumber)){
            if (ShootingAI._shipPosition === Direction.horizontal){
                return squareNumberValidator.areSquareNumbersValidForRows(ShootingAI._firstShotSquareNumber, new Array(squareNumber))
            }
        }

        return false;
    }

    resetMemory(){

        ShootingAI._lastShotSquareNumber = -1;
        ShootingAI._firstShotSquareNumber = -1;
        ShootingAI._shipPosition = -1;
        ShootingAI._roundShotDirection = -1;
        ShootingAI._nextShotDirection = -1;
    }


}