import React from 'react';
import "../css/index.css"
import "../css/field.css"
import {GameDataManager} from "../GameDataManager";
import {SquareNumberManager} from "../SquareNumberManager.js"
import {SquareNumberValidator} from "../SquareNumberValidator";
import Square from "./Square";
import * as signalR from "@aspnet/signalr";

const gameDataManager = new GameDataManager();
const squarePainterManager = new SquareNumberManager();
const squareNumberValidator = new SquareNumberValidator();

let hubUrl = 'http://localhost:5000/data';
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl)
    .configureLogging(signalR.LogLevel.Information)
    .build();

hubConnection.on("Send", function (gameData) {

    gameDataManager.setBoards(gameData);
});

hubConnection.start();

export default class Field extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            direction: 0,
        };
    }

    handleClick(event, squareId) {

        if (this.state.id === gameDataManager.getGameData().playerBoardId) {

            if (event.shiftKey) {
                this.changeShipDirection(squareId)
            } else {
                this.plantShip(squareId);
            }
        } else {

            if (gameDataManager.getGameData().isPlayerTurn) {

                this.shoot(squareId);
            }
        }
    }

    handleMouseOver(squareNumber) {

        let gameData = gameDataManager.getGameData();

        if (this.isPlayerField()) {

            if (gameData.boards[this.state.id].field.shipsOnField < 10) {

                let squareNumbers = squarePainterManager.getSquareNumbersToPaint(this.state.direction,
                    gameData.boards[this.state.id].field.shipsOnField, squareNumber);

                this.cleanFieldFromIsChecked();

                if (squareNumberValidator.areSquareNumbersValid(squareNumbers, this.state.direction,
                    gameData.boards[this.state.id].field.squares)) {

                    this.paintSquaresToPlantShip(squareNumbers);
                }
            }
        }
    }

    paintSquaresToPlantShip(squareNumbers) {

        let gameData = gameDataManager.getGameData();

        for (let i = 0; i < squareNumbers.length; i++) {

            gameData.boards[this.state.id].field.squares[squareNumbers[i]].isChecked = true;
        }

        this.props.setGameData(gameData);
    }

    plantShip(squareId) {

        let gameData = gameDataManager.getGameData();
        let playerField = gameData.boards[this.state.id].field;
        let playerFleet = gameData.boards[this.state.id].fleet;

        if (playerField.shipsOnField < 10) {

            let pointsToPlantShip = squarePainterManager.getSquareNumbersToPaint(this.state.direction,
                playerField.shipsOnField, squareId);

            if (squareNumberValidator.areSquareNumbersValid(pointsToPlantShip, this.state.direction,
                playerField.squares)) {

                gameDataManager.setSquaresHasShip(playerField.squares, pointsToPlantShip,
                    playerFleet.ships[playerField.shipsOnField].id);
                gameDataManager.setShipDeckPosition(playerFleet, pointsToPlantShip, playerField.shipsOnField);
                playerField.shipsOnField++;
            }
        }

        this.props.setGameData(gameData);

        hubConnection.invoke("Send", gameData);
    }

    shoot(squareId) {

        let gameData = gameDataManager.getGameData();
        let playerBoard = gameData.boards[gameData.playerBoardId];
        let currentBoard = gameData.boards[gameData.enemyBoardId];
        let square = currentBoard.field.squares[squareId];

        if (square.isClicked || !playerBoard.isPlayerReady ||
            !currentBoard.isPlayerReady) {

            return;
        }

        square.isClicked = true;

        if (square.shipNumber !== -1) {

            gameDataManager.shootDeck(currentBoard.fleet, square.shipNumber);

            let ship = currentBoard.fleet.ships[square.shipNumber];

            if (!ship.isAlive) {
                gameDataManager.paintAreaAroundShip(currentBoard.field.squares, ship);
                currentBoard.fleet.deadShipsCount++;
            }

            if (currentBoard.fleet.deadShipsCount === 10) {

                gameData.winnerName = 'Game over';
            }

            this.props.setGameData(gameData);
        } else {

            gameDataManager.setIsPlayerTurn(gameData, false);
            this.props.setGameData(gameData);

            console.log(1);
            this.props.makeComputerShot();
        }
    }

    changeShipDirection(squareNumber) {
        if (this.state.direction === 0) {
            this.setState(
                () => {
                    return {
                        direction: 1
                    };
                },
                () => this.handleMouseOver(squareNumber))
        } else {
            this.setState(
                () => {
                    return {
                        direction: 0
                    };
                },
                () => this.handleMouseOver(squareNumber))
        }
    }

    cleanFieldFromIsChecked() {

        let gameData = gameDataManager.getGameData();

        for (let i = 0; i < 99; i++) {

            gameData.boards[this.state.id].field.squares[i].isChecked = false;
        }

        this.props.setGameData(gameData);
    }

    isPlayerField() {

        return this.state.id === gameDataManager.getGameData().playerBoardId;
    }

    render() {

        return (

                <div className='field'>

                    {
                        this.props.squares.map((square) => {
                            return (
                                <Square
                                    className='square'
                                    id={square.id}
                                    key={square.id}
                                    isClicked={square.isClicked}
                                    isChecked={square.isChecked}
                                    shipNumber={square.shipNumber}
                                    onMouseOver={() => this.handleMouseOver(square.id)}
                                    onClick={(event) => this.handleClick(event, square.id)}
                                />
                            )
                        })}
                </div>

        )
    }
}