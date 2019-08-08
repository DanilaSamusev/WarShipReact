import {SquareNumberManager} from "./SquareNumberManager";

export class GameDataManager{

    setShipDeckPosition(pointsToPlant, shipNumber){

        let gameData = this.getGameData();

        for (let i = 0; i < pointsToPlant.length; i++){

            gameData.playerFleet.ships[shipNumber].decks[i].position = pointsToPlant[i];
        }

        this.setGameData(gameData);
    }

    setIsPlayerTurn(gameData, isPlayerTurn){

        gameData.isPlayerTurn = isPlayerTurn;
    }

    shootDeck(gameData, shipId) {

        let fleet;

        if (gameData.isPlayerTurn){

            fleet = gameData.computerFleet;
        }
        else{
            fleet = gameData.playerFleet;
        }

        fleet.ships[shipId].hitsNumber = fleet.ships[shipId].hitsNumber + 1;

        if (fleet.ships[shipId].hitsNumber === fleet.ships[shipId].decks.length) {
            fleet.ships[shipId].isAlive = false;
        }
    }

    shootSquare(gameData, squareNumber) {

        let a = this.getGameData();

        let field;

        if (gameData.isPlayerTurn){

            field = gameData.computerField;
        }
        else{

            field = gameData.playerField;
        }

        field.squares[squareNumber].isClicked = true;
    }

    incrementDeadShipsCount(gameData){

        let fleet;

        if (gameData.isPlayerTurn){
            fleet = gameData.computerFleet
        }
        else{
            fleet = gameData.playerFleet
        }

        fleet.deadShipsCount++;
    }

    paintAreaAroundShip(gameData, ship) {

        let squarePainterManager = new SquareNumberManager();

        for (let i = 0; i < ship.decks.length; i++) {

            let squareNumber = ship.decks[i].position;
            let nearestSquareNumber = squarePainterManager.getNearestSquareNumbers(squareNumber);

            for (let i = 0; i < nearestSquareNumber.length; i++) {

                if (nearestSquareNumber[i] >= 0 && nearestSquareNumber[i] < 100) {

                    gameData.computerField.squares[nearestSquareNumber[i]].isClicked = true;
                }
            }
        }
    }

    resetShipsOnField(gameData) {

        for (let i = 0; i < gameData.playerField.squares.length; i++) {

            gameData.playerField.squares[i].shipNumber = -1;
        }

        let ships = gameData.playerFleet.ships;

        for (let i = 0; i < ships.length; i++){

            for (let j = 0; j < ships[i].decks.length; j++){

                ships[i].decks[j].position = -1;
            }
        }

        gameData.playerField.shipsOnField = 0;
    }

    getGameData(){

        return JSON.parse(sessionStorage.getItem('gameData'));

    }

    setGameData(gameData){

        sessionStorage.setItem('gameData', JSON.stringify(gameData));

    }

}