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

export default class Field extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            direction: 0,
        };
    }

    handleClick(event, squareId) {

        if (this.state.id === gameDataManager.getGameData().playerId) {

            if (event.shiftKey) {
                this.changeShipDirection(squareId)
            } else {
                this.plantShip(squareId);
            }
        } else {

            this.shoot(squareId);
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

        this.props.setGameData(gameData, false);
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

        alert();
        this.props.hubConnection.invoke("Send", gameData);
    }

    shoot(squareId) {

        let gameData = gameDataManager.getGameData();
        let playerName = 'Player';
        let players = gameData.players;
        let currentBoard = gameData.boards[gameData.enemyId];
        let square = currentBoard.field.squares[squareId];

        if (square.isClicked || !players[0].isPlayerReady || !players[1].isPlayerReady ||
            !players[gameData.playerId].isPlayerTurn) {

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

            gameDataManager.addEvent(gameData, playerName, 'hit!');

            this.props.setGameData(gameData, true);
        } else {

            gameData.players[0].isPlayerTurn = !gameData.players[0].isPlayerTurn;
            gameData.players[1].isPlayerTurn = !gameData.players[1].isPlayerTurn;
            gameDataManager.addEvent(gameData, playerName, 'miss!');

            this.props.setGameData(gameData, true);

            if (gameData.gameType === 'Single player')
                this.props.makeComputerShot();
        }

        this.props.hubConnection.invoke("Send", gameData);
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

        for (let i = 0; i <= 99; i++) {

            gameData.boards[this.state.id].field.squares[i].isChecked = false;
        }

        this.props.setGameData(gameData, true);
    }

    isPlayerField() {

        return this.state.id === gameDataManager.getGameData().playerId;
    }

    render() {

        let gameData = gameDataManager.getGameData();
        let name = '';

        if (this.state.id === gameData.playerId) {
            name = 'player';
        } else {
            name = 'enemy'
        }

        return (

            <div className='board'>

                <div className='fieldOwnerName'>{gameData.players[this.state.id].name + '\'s field'}</div>

                <div className={'field ' + this.props.className}>
                    {
                        this.props.squares.map((square) => {
                            return (
                                <Square
                                    className='square'
                                    id={square.id}
                                    key={square.id}
                                    name={name}
                                    isClicked={square.isClicked}
                                    isChecked={square.isChecked}
                                    shipNumber={square.shipNumber}
                                    onMouseOver={() => this.handleMouseOver(square.id)}
                                    onClick={(event) => this.handleClick(event, square.id)}
                                />
                            )
                        })}
                </div>
            </div>

        )
    }
}