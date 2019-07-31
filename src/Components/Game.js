import React from 'react';
import "../css/game.css"
import "../css/index.css"
import "../css/playerPanel.css"
import {Direction} from "../Direction";
import {ShootingAI} from "../ShootingAI";
import {GameDataManager} from "../GameDataManager";
import {SquarePainterManager} from "../SquarePainterManager";
import PlayerField from "./PlayerField";
import ComputerField from "../Components/ComputerField";

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameData: null,
        };

        this.shoot = this.shoot.bind(this);
        this.setIsPlayerTurn = this.setIsPlayerTurn.bind(this);
        this.makeComputerShot = this.makeComputerShot.bind(this);
        this.paintAreaAroundShip = this.paintAreaAroundShip.bind(this);
    }

    componentDidMount() {

        let gameData = JSON.parse(sessionStorage.getItem('gameData'));

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
                    sessionStorage.setItem('gameData', JSON.stringify(json));
                    return json;
                })
                .then((json => this.setGameData(json)));
        } else {
            this.setGameData(gameData);
        }
    }

    shoot() {

        let gameDataManager = new GameDataManager();

        if (gameDataManager.getGameData().isPlayerTurn) {
            return;
        }

        setTimeout(() => {
            this.makeComputerShot();
            this.shoot();
        }, 1000);
    }

    makeComputerShot() {

        let shootingAI = new ShootingAI();
        let gameDataManager = new GameDataManager();
        let squareNumber;

        if (ShootingAI._firstShotSquareNumber === -1) {

            squareNumber = shootingAI.getRandomSquareNumber();
            this.shootFieldSquare(squareNumber);

            if (gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber !== -1) {

                let shipNumber = gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber;

                gameDataManager.shootDeck(shipNumber, 'playerFleet');

                if (!gameDataManager.getGameData().playerFleet.ships[shipNumber].isAlive) {
                    shootingAI.resetMemory();
                } else {
                    ShootingAI._firstShotSquareNumber = squareNumber;
                }
            } else {
                gameDataManager.setIsPlayerTurn(true);
            }
        } else {
            if (ShootingAI._shipPosition !== -1) {

                if (ShootingAI._shipPosition === Direction.horizontal) {
                    squareNumber = shootingAI.getHorizontalSquareNumber();
                } else {
                    squareNumber = shootingAI.getVerticalSquareNumber();
                }

                this.shootFieldSquare(squareNumber);

                if (gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber !== -1) {

                    let shipNumber = gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber;

                    gameDataManager.shootDeck(shipNumber, 'playerFleet');

                    if (!gameDataManager.getGameData().playerFleet.ships[shipNumber].isAlive) {
                        shootingAI.resetMemory();
                    } else {
                        ShootingAI._lastShotSquareNumber = squareNumber;
                    }
                } else {

                    gameDataManager.setIsPlayerTurn(true);
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

                squareNumber = shootingAI.getRoundSquareNumber(ShootingAI._firstShotSquareNumber);

                this.shootFieldSquare(squareNumber);


                if (gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber !== -1) {

                    let shipNumber = gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber;

                    gameDataManager.shootDeck(shipNumber, 'playerFleet');

                    if (!gameDataManager.getGameData().playerFleet.ships[shipNumber].isAlive) {
                        shootingAI.resetMemory();
                    } else {
                        ShootingAI._lastShotSquareNumber = squareNumber;

                        if (ShootingAI._roundShotDirection === Direction.left ||
                            ShootingAI._roundShotDirection === Direction.right) {
                            ShootingAI._shipPosition = Direction.horizontal;
                        } else {
                            ShootingAI._shipPosition = Direction.vertical;
                        }
                    }
                } else {
                    gameDataManager.setIsPlayerTurn(true);
                }
            }
        }
    }

    shootFieldSquare(squareNumber) {

        let gameDataManager = new GameDataManager();

        gameDataManager.shootSquare(squareNumber);
        this.updatePlayerField(new Array(gameDataManager.getGameData().playerField.squares[squareNumber]));
    }

    paintAreaAroundShip(ship) {

        let squarePainterManager = new SquarePainterManager();
        let gameDataManager = new GameDataManager();
        let field = this.state.gameData.computerField.squares;

        for (let i = 0; i < ship.decks.length; i++) {

            let squareNumber = ship.decks[i].position;
            let nearestSquareNumber = squarePainterManager.getNearestSquareNumbers(squareNumber);

            for (let i = 0; i < nearestSquareNumber.length; i++) {

                if (nearestSquareNumber[i] >= 0 && nearestSquareNumber[i] < 100) {

                    field[nearestSquareNumber[i]].isClicked = true;
                }
            }
        }

        let gameData = gameDataManager.getGameData();
        gameData.computerField.squares = field;

        this.setGameData(gameData);
    }

    updatePlayerField(squares) {

        if (squares === null) {
            return;
        }

        const field = this.state.gameData.playerField.squares;

        for (let i = 0; i < squares.length; i++) {
            let square = squares[i];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                isChecked: square.isChecked,
                shipNumber: square.shipNumber,
            };
        }

        let gameData = this.state.gameData;
        gameData.playerField.squares = field;

        this.setState(
            () => {
                return {
                    gameData: gameData,
                };
            })
    }

    setGameData(gameData) {

        this.setState(
            () => {
                return {
                    gameData: gameData,
                };
            });
    }

    setIsPlayerTurn(state) {

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

                <ComputerField computerField={this.state.gameData.computerField.squares}
                               setIsPlayerTurn={this.setIsPlayerTurn}
                               makeComputerShot={this.shoot}
                               paintAreaAroundShip={this.paintAreaAroundShip}
                />
                <PlayerField playerField={this.state.gameData.playerField.squares}
                             shipsOnField={this.state.gameData.playerField.shipsOnField}
                             setIsPlayerTurn={this.setIsPlayerTurn}

                />
            </div>
        )
    }
}

export default Game;