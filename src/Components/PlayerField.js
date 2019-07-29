import React from 'react';
import Square from "./Square";
import "../css/index.css"
import "../css/playerField.css"
import {SquarePainterManager} from "../SquarePainterManager.js"
import {ShootingAI} from "../ShootingAI";
import {SquareNumberValidator} from "../SquareNumberValidator";
import {GameDataManager} from "../GameDataManager";
import {Direction} from "../Direction";

class PlayerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playerField: [],
            direction: 0,
            shipsOnField: 0,
        };

        this.updatePlayerField = this.updatePlayerField.bind(this);
        this.makeComputerShot = this.makeComputerShot.bind(this);
        this.shoot = this.shoot.bind(this);
    }

    componentWillMount() {

        if (this.props.playerField !== null) {
            this.setState(
                () => {
                    return {
                        playerField: this.props.playerField,
                        shipsOnField: this.props.shipsOnField,
                    };
                });
        }
    }

    handleClick(event, squareNumber) {

        if (event.shiftKey) {
            this.changeShipDirection(squareNumber)
        } else {
            this.plantShip(squareNumber);
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

    plantShip(squareNumber) {

        if (this.state.shipsOnField < 10) {

            let squarePainterManager = new SquarePainterManager();
            let gameDataManager = new GameDataManager();
            let squareNumberValidator = new SquareNumberValidator();
            let gameData = gameDataManager.getGameData();

            let pointsToPlantShip = squarePainterManager.getSquareNumbersToPaint(this.state.direction, this.state.shipsOnField, squareNumber);

            if (squareNumberValidator.areSquareNumbersValid(pointsToPlantShip, this.state.direction, this.state.playerField)) {

                this.setSquaresHasShip(pointsToPlantShip, gameData.playerFleet.ships[this.state.shipsOnField].id);
                gameDataManager.setShipDeckPosition(pointsToPlantShip, this.state.shipsOnField);

                this.setState(
                    () => {
                        return {
                            shipsOnField: this.state.shipsOnField + 1,
                        };
                    }, () => gameDataManager.setValueShipsOnField(this.state.shipsOnField));
            }
        }
    }

    handleMouseOver(squareNumber) {

        if (this.state.shipsOnField < 10) {

            let squarePainterManager = new SquarePainterManager();
            let squareNumberValidator = new SquareNumberValidator();
            let squareNumbers = squarePainterManager.getSquareNumbersToPaint(this.state.direction, this.state.shipsOnField, squareNumber);

            this.cleanFieldFromIsChecked();

            if (squareNumberValidator.areSquareNumbersValid(squareNumbers, this.state.direction, this.state.playerField)) {

                this.paintSquares(squareNumbers);
            }
        }
    }

    paintSquares(squareNumbers) {

        const field = this.state.playerField;

        for (var i = 0; i < squareNumbers.length; i++) {

            var square = this.state.playerField[squareNumbers[i]];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                isChecked: true,
                shipNumber: square.shipNumber,
            };
        }

        this.setField(field);
    }

    cleanFieldFromIsChecked() {

        const field = this.state.playerField;

        for (var j = 0; j < field.length; j++) {

            var square = this.state.playerField[j];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                isChecked: false,
                shipNumber: square.shipNumber,
            };
        }

        this.setField(field);
    }


    shoot() {

        let gameDataManager = new GameDataManager();

        if (gameDataManager.getGameData().isPlayerTurn) {
            return;
        }

        setTimeout(() => {
            this.props.makeComputerShot();
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

    updatePlayerField(squares) {

        if (squares === null) {
            return;
        }

        const field = this.state.playerField;

        for (let i = 0; i < squares.length; i++) {
            let square = squares[i];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                isChecked: square.isChecked,
                shipNumber: square.shipNumber,
            };
        }

        this.setField(field);
    }

    setSquaresHasShip(squareNumbers, shipNumber) {

        const field = this.state.playerField;

        for (var i = 0; i < squareNumbers.length; i++) {

            var square = field[squareNumbers[i]];

            field[squareNumbers[i]] = {
                id: square.id,
                isClicked: square.isClicked,
                isChecked: square.isChecked,
                shipNumber: shipNumber,
            };
        }

        this.setField(field);
    }

    setField(field) {

        this.setState(
            () => {
                return {
                    playerField: field,
                };
            }, () => {
                let gameData = JSON
                    .parse(sessionStorage.getItem('gameData'));

                gameData.playerField.squares = this.state.playerField;
                sessionStorage.setItem("gameData", JSON.stringify(gameData));
            });
    }

    render() {

        return (
            <div className="playerField">
                {
                    this.state.playerField.map((square) => {
                        return (
                            <Square
                                key={square.id}
                                id={square.id}
                                isClicked={square.isClicked}
                                isChecked={square.isChecked}
                                shipNumber={square.shipNumber}
                                className="playerSquare"
                                onMouseOver={() => this.handleMouseOver(square.id)}
                                onClick={(event) => this.handleClick(event, square.id)}
                            />
                        )
                    })}
            </div>
        )
    }
}

export default PlayerField;