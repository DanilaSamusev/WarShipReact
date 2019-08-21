import React from 'react';
import "../css/game.css"
import "../css/index.css"
import "../css/playerPanel.css"
import {Direction} from "../Direction";
import {ShootingAI} from "../ShootingAI";
import {GameDataManager} from "../GameDataManager";
import {SquareNumberValidator} from "../SquareNumberValidator";
import Interface from "./Interface";
import Field from "./Field";

import * as signalR from "@aspnet/signalr";
import {HubConnection} from "@aspnet/signalr/dist/esm/HubConnection";

const shootingAI = new ShootingAI();
const gameDataManager = new GameDataManager();
const squareNumberValidator = new SquareNumberValidator();

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameData: null,
            hubConnection: null,
        };

        this.shoot = this.shoot.bind(this);
        this.setGameData = this.setGameData.bind(this);
        this.makeComputerShot = this.makeComputerShot.bind(this);
    }

    componentDidMount() {

        let gameData = gameDataManager.getGameData();

        let url;

        if (this.props.gameType === 'single') {
            url = 'http://localhost:5000/api/game/single';
        } else {
            url = 'http://localhost:5000/api/game/multi'
        }

        if (gameData === null) {

            fetch(url,
                {
                    method: 'get',
                    headers:
                        {
                            'Accept': 'application/json',
                        },
                })
                .then(response => response.json())
                .then(json => {
                    this.setGameData(json, true);
                })
        } else {
            this.setGameData(gameData, true);
        }

        this.setHubConnection();
    }

    shoot() {

        let gameData = gameDataManager.getGameData();
        let players = gameData.players;

        if (!players[0].isPlayerReady || !players[1].isPlayerReady ||
            players[1].isPlayerTurn) {

            return;
        }

        setTimeout(() => {
            this.makeComputerShot();
            this.shoot();
        }, 1000);
    }

    makeComputerShot() {

        let gameData = gameDataManager.getGameData();
        let playerBoard = gameData.boards[gameData.playerId];
        let playerSquares = playerBoard.field.squares;
        let playerFleet = playerBoard.fleet;
        let squareId;

        if (ShootingAI._firstShotSquareNumber === -1) {

            do {

                squareId = shootingAI.getRandomSquareNumber();
            }
            while (!squareNumberValidator.isSquareNumberValidToShoot(squareId, playerBoard));

            playerSquares[squareId].isClicked = true;

            if (playerSquares[squareId].shipNumber !== -1) {

                let shipNumber = playerSquares[squareId].shipNumber;

                gameDataManager.shootDeck(playerFleet, shipNumber);

                if (!playerFleet.ships[shipNumber].isAlive) {
                    playerFleet.deadShipsCount++;
                    shootingAI.resetMemory();
                } else {
                    ShootingAI._firstShotSquareNumber = squareId;
                }
            } else {
                gameData.players[0].isPlayerTurn = !gameData.players[0].isPlayerTurn;
                gameData.players[1].isPlayerTurn = !gameData.players[1].isPlayerTurn;
            }
        } else {
            if (ShootingAI._shipPosition !== -1) {

                if (ShootingAI._shipPosition === Direction.horizontal) {
                    squareId = shootingAI.getHorizontalSquareNumber(playerBoard);
                } else {
                    squareId = shootingAI.getVerticalSquareNumber(playerBoard);
                }

                playerSquares[squareId].isClicked = true;

                if (playerSquares[squareId].shipNumber !== -1) {

                    let shipNumber = playerSquares[squareId].shipNumber;

                    gameDataManager.shootDeck(playerFleet, shipNumber);

                    if (!playerFleet.ships[shipNumber].isAlive) {
                        playerFleet.deadShipsCount++;
                        shootingAI.resetMemory();
                    } else {
                        ShootingAI._lastShotSquareNumber = squareId;
                    }
                } else {

                    gameData.players[0].isPlayerTurn = !gameData.players[0].isPlayerTurn;
                    gameData.players[1].isPlayerTurn = !gameData.players[1].isPlayerTurn;
                    ShootingAI._lastShotSquareNumber = ShootingAI._firstShotSquareNumber;

                    if (ShootingAI._shipPosition === Direction.horizontal) {
                        if (ShootingAI._nextShotDirection === Direction.left) {
                            ShootingAI._nextShotDirection = Direction.right;
                        } else {
                            ShootingAI._nextShotDirection = Direction.left;
                        }
                    } else {
                        if (ShootingAI._nextShotDirection === Direction.top) {
                            ShootingAI._nextShotDirection = Direction.bottom;
                        } else {
                            ShootingAI._nextShotDirection = Direction.top;
                        }
                    }
                }
            } else {

                squareId = shootingAI.getRoundSquareNumber(ShootingAI._firstShotSquareNumber, playerBoard);

                playerSquares[squareId].isClicked = true;

                if (playerSquares[squareId].shipNumber !== -1) {

                    let shipNumber = playerSquares[squareId].shipNumber;

                    gameDataManager.shootDeck(playerFleet, shipNumber);

                    if (!playerFleet.ships[shipNumber].isAlive) {
                        playerFleet.deadShipsCount++;
                        shootingAI.resetMemory();
                    } else {
                        ShootingAI._lastShotSquareNumber = squareId;

                        if (ShootingAI._roundShotDirection === Direction.left ||
                            ShootingAI._roundShotDirection === Direction.right) {
                            ShootingAI._shipPosition = Direction.horizontal;
                        } else {
                            ShootingAI._shipPosition = Direction.vertical;
                        }
                    }
                } else {
                    gameData.players[0].isPlayerTurn = !gameData.players[0].isPlayerTurn;
                    gameData.players[1].isPlayerTurn = !gameData.players[1].isPlayerTurn;
                }
            }
        }

        if (playerFleet.deadShipsCount === 10) {

            gameData.winnerName = 'Computer';
        }

        this.setGameData(gameData, true);
    }


    setGameData(gameData, shouldSaveData) {

        if (shouldSaveData) {

            gameDataManager.setGameData(gameData);
        }

        this.setState(
            () => {
                return {
                    gameData: gameData,
                };
            });
    }

    setHubConnection() {

        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5000/data')
            .configureLogging(signalR.LogLevel.Information)
            .build();

        hubConnection.on('Send', (data) => {

            let gameData = gameDataManager.setBoards(data);
            this.setGameData(gameData);
        });

        hubConnection.start();

        this.setState(
            () => {
                return {
                    hubConnection: hubConnection,
                }
            });
    }

    render() {

        if (this.state.gameData === null) {
            return null;
        }

        let gameData = this.state.gameData;
        let playerId = gameData.playerId;
        let enemyId = gameData.enemyId;
        let playerBoard = gameData.boards[playerId];
        let enemyBoard = gameData.boards[enemyId];

        return (
            <div className="game">

                <Field
                    className='field'
                    name='Enemy field'
                    id={enemyId}
                    makeComputerShot={this.shoot}
                    setGameData={this.setGameData}
                    hubConnection={this.state.hubConnection}
                    squares={enemyBoard.field.squares}
                />

                <Field
                    className='field'
                    name='Player field'
                    id={playerId}
                    squares={playerBoard.field.squares}
                    hubConnection={this.state.hubConnection}
                    setGameData={this.setGameData}
                />

                <Interface
                    isPlayerReady={gameData.players[gameData.playerId].isPlayerReady}
                    shipsOnField={playerBoard.field.shipsOnField}
                    hubConnection={this.state.hubConnection}
                    setGameData={this.setGameData}
                />

                <h1>{this.state.gameData.winnerName}</h1>

            </div>
        )
    }
}

export default Game;