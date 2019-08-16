import React from 'react';
import "../css/game.css"
import "../css/index.css"
import "../css/playerPanel.css"
import {Direction} from "../Direction";
import {ShootingAI} from "../ShootingAI";
import {GameDataManager} from "../GameDataManager";
import {SquareNumberValidator} from "../SquareNumberValidator";
import Interface from "./Interface";
import PlayerField from "./PlayerField";
import ComputerField from "../Components/ComputerField";
import Field from "./Field";

const gameDataManager = new GameDataManager();

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameData: null,
        };

        this.shoot = this.shoot.bind(this);
        this.setGameData = this.setGameData.bind(this);
        this.makeComputerShot = this.makeComputerShot.bind(this);
    }

    componentDidMount() {

        let gameData = gameDataManager.getGameData();
        let url;

        if (this.props.className === 'singlePlayer'){
            url = 'http://localhost:5000/api/game/single';
        }
        else{
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
                    this.setGameData(json);
                })
        } else {
            this.setGameData(gameData);
        }
    }

    shoot() {

        let gameData = gameDataManager.getGameData();
        let playerBoard = gameData.boards[gameData.playerBoardId];
        let currentBoard = gameData.boards[gameData.enemyBoardId];

        if (gameData.isPlayerTurn || !playerBoard.isPlayerReady ||
            !currentBoard.isPlayerReady) {

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
        let playerBoard = gameData.boards[gameData.playerBoardId];
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
                gameDataManager.setIsPlayerTurn(gameData, true);
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

                    gameDataManager.setIsPlayerTurn(gameData, true);
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
                    gameDataManager.setIsPlayerTurn(gameData, true);
                }
            }
        }

        if (playerFleet.deadShipsCount === 10) {

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

    render() {

        if (this.state.gameData === null) {
            return null;
        }


        let playerBoardId = this.state.gameData.playerBoardId;
        let enemyBoardId = this.state.gameData.enemyBoardId;
        let playerBoard = this.state.gameData.boards[playerBoardId];
        let enemyBoard = this.state.gameData.boards[enemyBoardId];

        return (
            <div className="game">

                <Field
                    className='computerField'
                    id={enemyBoardId}
                    setGameData={this.setGameData}
                    squares={enemyBoard.field.squares}
                    makeComputerShot={this.shoot}
                />

                <Field
                    className='playerField'
                    id={playerBoardId}
                    squares={playerBoard.field.squares}
                    setGameData={this.setGameData}
                />

                <Interface
                    isPlayerReady={playerBoard.isPlayerReady}
                    shipsOnField={playerBoard.field.shipsOnField}
                    setGameData={this.setGameData}
                />

                <h1>{this.state.gameData.winnerName}</h1>

            </div>
        )
    }
}

export default Game;