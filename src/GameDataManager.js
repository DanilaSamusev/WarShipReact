import {SquareNumberManager} from "./SquareNumberManager";
import * as signalR from "@aspnet/signalr";

export class GameDataManager{

    setShipDeckPosition(fleet, pointsToPlant, shipNumber){

        for (let i = 0; i < pointsToPlant.length; i++){

            fleet.ships[shipNumber].decks[i].position = pointsToPlant[i];
        }

    }

    setIsPlayerTurn(gameData, isPlayerTurn){

        gameData.isPlayerTurn = isPlayerTurn;
    }

    shootDeck(fleet, shipId) {

        fleet.ships[shipId].hitsNumber = fleet.ships[shipId].hitsNumber + 1;

        if (fleet.ships[shipId].hitsNumber === fleet.ships[shipId].decks.length) {
            fleet.ships[shipId].isAlive = false;
        }
    }

    paintAreaAroundShip(squares, ship) {

        let squarePainterManager = new SquareNumberManager();

        for (let i = 0; i < ship.decks.length; i++) {

            let squareId = ship.decks[i].position;
            let nearestSquareNumber = squarePainterManager.getNearestSquareNumbers(squareId);

            for (let i = 0; i < nearestSquareNumber.length; i++) {

                if (nearestSquareNumber[i] >= 0 && nearestSquareNumber[i] < 100) {

                    squares[nearestSquareNumber[i]].isClicked = true;
                }
            }
        }
    }

    setSquaresHasShip(squares, squareNumbers, shipNumber) {

        for (let i = 0; i < squareNumbers.length; i++) {

            squares[squareNumbers[i]].shipNumber = shipNumber;
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

    setBoards(gameData){

        let data = this.getGameData();

        data.boards = gameData.boards;

        this.setGameData(data);
    }
}