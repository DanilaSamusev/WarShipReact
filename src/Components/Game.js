import React from 'react';
import "../css/game.css"
import "../css/index.css"
import "../css/playerPanel.css"
import {Direction} from "../Direction";
import {ShootingAI} from "../ShootingAI";
import {GameDataManager} from "../GameDataManager";
import {SquareNumberManager} from "../SquareNumberManager";
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
        console.log(1);

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
            this.shootSquare(squareNumber);

            if (gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber !== -1) {

                let shipNumber = gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber;

                gameDataManager.shootDeck(shipNumber, 'playerFleet');

                if (!gameDataManager.getGameData().playerFleet.ships[shipNumber].isAlive) {
                    this.paintAreaAroundShip(gameDataManager.getGameData().playerFleet.ships[shipNumber]);
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

                this.shootSquare(squareNumber);

                if (gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber !== -1) {

                    let shipNumber = gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber;

                    gameDataManager.shootDeck(shipNumber, 'playerFleet');

                    if (!gameDataManager.getGameData().playerFleet.ships[shipNumber].isAlive) {
                        this.paintAreaAroundShip(gameDataManager.getGameData().playerFleet.ships[shipNumber]);
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

                this.shootSquare(squareNumber);

                if (gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber !== -1) {

                    let shipNumber = gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber;

                    gameDataManager.shootDeck(shipNumber, 'playerFleet');

                    if (!gameDataManager.getGameData().playerFleet.ships[shipNumber].isAlive) {
                        this.paintAreaAroundShip(gameDataManager.getGameData().playerFleet.ships[shipNumber]);
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

    shootSquare(squareNumber) {

        let gameDataManager = new GameDataManager();

        gameDataManager.shootSquare(squareNumber);
        this.updatePlayerFieldSquares(new Array(gameDataManager.getGameData().playerField.squares[squareNumber]));
    }

    paintAreaAroundShip(ship) {

        let gameDataManager = new GameDataManager();
        let squarePainterManager = new SquareNumberManager();
        let field;

        if (gameDataManager.getGameData().isPlayerTurn) {

            field = this.state.gameData.computerField.squares;
        }
        else{

            field = this.state.gameData.playerField.squares;
        }

        for (let i = 0; i < ship.decks.length; i++) {

            let squareNumber = ship.decks[i].position;
            let nearestSquareNumber = squarePainterManager.getNearestSquareNumbers(squareNumber);

            for (let i = 0; i < nearestSquareNumber.length; i++) {

                if (nearestSquareNumber[i] >= 0 && nearestSquareNumber[i] < 100) {

                    field[nearestSquareNumber[i]].isClicked = true;
                }
            }
        }
    }

    updatePlayerFieldSquares(squares) {

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

        this.setGameData(gameData)
    }

    setGameData(gameData) {

        console.log(gameData);
        console.log(this.state.gameData);

        this.setState(
            () => {
                return {
                    gameData: gameData,
                };
            });
    }

    setIsPlayerTurn(state) {

        let gameDataManager = new GameDataManager();

        this.setState(
            () => {
                return {
                    isPlayerTurn: state,
                };
            }, () => gameDataManager.setIsPlayerTurn(state));
    }

    render() {

        if (this.state.gameData === null) {
            return null;
        }

        return (
            <div className="game">

                <ComputerField squares={this.state.gameData.computerField.squares}
                               setIsPlayerTurn={this.setIsPlayerTurn}
                               makeComputerShot={this.shoot}
                               paintAreaAroundShip={this.paintAreaAroundShip}
                />
                <PlayerField playerField={this.state.gameData.playerField.squares}
                             shipsOnField={this.state.gameData.playerField.shipsOnField}
                             setIsPlayerTurn={this.setIsPlayerTurn}

                />
                <a href='/war-ship-react/public/test.html'>test</a>
            </div>
        )
    }
}

export default Game;