import React from 'react';
import "../css/game.css"
import "../css/index.css"
import "../css/playerPanel.css"
import {Direction} from "../Direction";
import {ShootingAI} from "../ShootingAI";
import {GameDataManager} from "../GameDataManager";
import {SquareNumberManager} from "../SquareNumberManager";
import {SquareNumberValidator} from "../SquareNumberValidator";
import PlayerField from "./PlayerField";
import ComputerField from "../Components/ComputerField";
import Interface from "./Interface";

const gameDataManager = new GameDataManager();

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameData: null,
        };

        this.shoot = this.shoot.bind(this);
        this.setGameData = this.setGameData.bind(this);
        this.setIsPlayerTurn = this.setIsPlayerTurn.bind(this);
        this.makeComputerShot = this.makeComputerShot.bind(this);
    }

    componentDidMount() {

        let gameData = gameDataManager.getGameData();

        if (gameData === null) {

            fetch('http://localhost:5000/api/game',
                {
                    method: 'get',
                    headers:
                        {
                            'Accept': 'application/json',
                        },
                })
                .then(response => response.json())
                .then(json => {
                    this.setGameData(json);
                })
        } else {
            this.setGameData(gameData);
        }
    }

    shoot() {

        let gameDataManager = new GameDataManager();

        if (gameDataManager.getGameData().isPlayerTurn || gameDataManager.getGameData().winnerName !== null) {
            return;
        }

        setTimeout(() => {
            this.makeComputerShot();
            this.shoot();
        }, 1000);
    }

    makeComputerShot() {

        let shootingAI = new ShootingAI();
        let squareNumberValidator = new SquareNumberValidator();
        let gameData = gameDataManager.getGameData();
        let squareId;

        if (ShootingAI._firstShotSquareNumber === -1) {

            do {

                squareId = shootingAI.getRandomSquareNumber();
            }
            while (!squareNumberValidator.isSquareNumberValidToShoot(squareId));

            gameDataManager.shootSquare(gameData, squareId);

            if (gameData.playerField.squares[squareId].shipNumber !== -1) {

                let shipNumber = gameDataManager.getGameData().playerField.squares[squareId].shipNumber;

                gameDataManager.shootDeck(gameData, shipNumber);

                if (!gameData.playerFleet.ships[shipNumber].isAlive) {
                    gameDataManager.incrementDeadShipsCount(gameData);
                    shootingAI.resetMemory();
                } else {
                    ShootingAI._firstShotSquareNumber = squareId;
                }
            } else {
                gameDataManager.setIsPlayerTurn(gameData, true);
            }
        } else {
            if (ShootingAI._shipPosition !== -1) {

                if (ShootingAI._shipPosition === Direction.horizontal) {
                    squareId = shootingAI.getHorizontalSquareNumber();
                } else {
                    squareId = shootingAI.getVerticalSquareNumber();
                }

                gameDataManager.shootSquare(gameData, squareId);

                if (gameData.playerField.squares[squareId].shipNumber !== -1) {

                    let shipNumber = gameDataManager.getGameData().playerField.squares[squareId].shipNumber;

                    gameDataManager.shootDeck(gameData, shipNumber);

                    if (!gameData.playerFleet.ships[shipNumber].isAlive) {
                        gameDataManager.incrementDeadShipsCount(gameData);
                        shootingAI.resetMemory();
                    } else {
                        ShootingAI._lastShotSquareNumber = squareId;
                    }
                } else {

                    gameDataManager.setIsPlayerTurn(gameData,true);
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

                squareId = shootingAI.getRoundSquareNumber(ShootingAI._firstShotSquareNumber);

                gameDataManager.shootSquare(gameData, squareId);

                if (gameData.playerField.squares[squareId].shipNumber !== -1) {

                    let shipNumber = gameDataManager.getGameData().playerField.squares[squareId].shipNumber;

                    gameDataManager.shootDeck(gameData, shipNumber);

                    if (!gameData.playerFleet.ships[shipNumber].isAlive) {
                        gameDataManager.incrementDeadShipsCount(gameData);
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
                    gameDataManager.setIsPlayerTurn(gameData,true);
                }
            }
        }

        if (gameData.playerFleet.deadShipsCount === 10){

            gameData.winnerName = 'Computer';
        }

        this.setGameData(gameData);
    }


    setGameData(gameData) {

        gameDataManager.setGameData(gameData);

        this.setState(
            () => {
                return {
                    gameData: gameData,
                };
            });
    }

    setIsPlayerTurn(state) {

        gameDataManager.setIsPlayerTurn(state);

        this.setState(
            () => {
                return {
                    isPlayerTurn: state,
                };
            });
    }

    render() {

        if (this.state.gameData === null) {
            return null;
        }

        return (
            <div className="game">

                <ComputerField
                    squares={this.state.gameData.computerField.squares}
                    makeComputerShot={this.shoot}
                    setGameData={this.setGameData}
                    setIsPlayerTurn={this.setIsPlayerTurn}
                    paintAreaAroundShip={this.paintAreaAroundShip}
                />
                <PlayerField
                    squares={this.state.gameData.playerField.squares}
                    shipsOnField={this.state.gameData.playerField.shipsOnField}
                    setGameData={this.setGameData}
                    setIsPlayerTurn={this.setIsPlayerTurn}
                />

                <Interface
                    gameState={this.state.gameData.gameState}
                    shipsOnField={this.state.gameData.playerField.shipsOnField}
                    setGameData={this.setGameData}
                />

                <h1>{this.state.gameData.winnerName} win!</h1>

            </div>
        )
    }
}

export default Game;