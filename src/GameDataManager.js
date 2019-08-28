import {SquareNumberManager} from "./SquareNumberManager";
import * as signalR from "@aspnet/signalr";

export class GameDataManager {

    setShipDeckPosition(fleet, pointsToPlant, shipNumber) {

        for (let i = 0; i < pointsToPlant.length; i++) {

            fleet.ships[shipNumber].decks[i].position = pointsToPlant[i];
        }

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

    resetShipsOnField(board) {

        for (let i = 0; i < board.field.squares.length; i++) {

            board.field.squares[i].shipNumber = -1;
        }

        let ships = board.fleet.ships;

        for (let i = 0; i < ships.length; i++) {

            for (let j = 0; j < ships[i].decks.length; j++) {

                ships[i].decks[j].position = -1;
            }
        }

        board.field.shipsOnField = 0;
    }

    addEvent(gameData, performerName, event) {

        gameData.events += performerName + ': ' + event + '\n';
    }

    getGameData() {

        

        return JSON.parse(sessionStorage.getItem('gameData'));

    }

    setGameData(gameData) {

        sessionStorage.setItem('gameData', JSON.stringify(gameData));

    }

    setBoards(data) {

        let playerData = this.getGameData();

        playerData.boards = data.boards;
        playerData.players = data.players;

        return playerData;
    }
}