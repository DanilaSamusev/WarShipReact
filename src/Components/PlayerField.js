import React from 'react';
import Square from "./Square";
import "../css/index.css"
import "../css/playerField.css"
import {SquarePainterManager} from "../SquarePainterManager.js"
import {SquareNumberValidator} from "../SquareNumberValidator";
import {GameDataManager} from "../GameDataManager";
import Interface from "./Interface";

class PlayerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playerField: [],
            direction: 0,
            shipsOnField: 0,
        };

        this.shoot = this.shoot.bind(this);
        this.resetShips = this.resetShips.bind(this);
        this.updatePlayerField = this.updatePlayerField.bind(this);
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

            let gameDataManager = new GameDataManager();
            let gameData = gameDataManager.getGameData();
            let squarePainterManager = new SquarePainterManager();
            let squareNumberValidator = new SquareNumberValidator();

            let pointsToPlantShip = squarePainterManager.getSquareNumbersToPaint(this.state.direction,
                this.state.shipsOnField, squareNumber);

            if (squareNumberValidator.areSquareNumbersValid(pointsToPlantShip, this.state.direction,
                this.state.playerField)) {

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
            let squareNumbers = squarePainterManager.getSquareNumbersToPaint(this.state.direction,
                this.state.shipsOnField, squareNumber);

            this.cleanFieldFromIsChecked();

            if (squareNumberValidator.areSquareNumbersValid(squareNumbers, this.state.direction,
                this.state.playerField)) {

                this.paintSquares(squareNumbers);
            }
        }
    }

    paintSquares(squareNumbers) {

        const field = this.state.playerField;

        for (let i = 0; i < squareNumbers.length; i++) {

            let square = this.state.playerField[squareNumbers[i]];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                isChecked: true,
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

    resetShips() {

        let gameDataManager = new GameDataManager();

        this.resetShipsOnField();
        this.state.shipsOnField = 0;
        gameDataManager.resetShipsOnFleet();
        gameDataManager.setValueShipsOnField(this.state.shipsOnField);
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

    resetShipsOnField() {

        const field = this.state.playerField;

        for (let i = 0; i < field.length; i++) {
            let square = field[i];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                isChecked: square.isChecked,
                shipNumber: -1,
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

        let gameDataManager = new GameDataManager();

        this.setState(
            () => {
                return {
                    playerField: field,
                };
            }, () => {
                let gameData = gameDataManager.getGameData();

                gameData.playerField.squares = this.state.playerField;
                gameDataManager.setGameData(gameData);
            });
    }

    render() {

        return (
            <div className="playerField">
                {
                    this.state.playerField.map((square) => {
                        return (
                            <Square
                                id={square.id}
                                key={square.id}
                                isClicked={square.isClicked}
                                isChecked={square.isChecked}
                                shipNumber={square.shipNumber}
                                className="playerSquare"
                                onMouseOver={() => this.handleMouseOver(square.id)}
                                onClick={(event) => this.handleClick(event, square.id)}
                            />
                        )
                    })}
                <Interface shipsOnField={this.state.shipsOnField}
                           resetShips={this.resetShips}
                />
            </div>
        )
    }
}

export default PlayerField;