import React from 'react';
import "../css/index.css"
import "../css/playerField.css"
import {GameDataManager} from "../GameDataManager";
import {SquareNumberManager} from "../SquareNumberManager.js"
import {SquareNumberValidator} from "../SquareNumberValidator";
import Square from "./Square";

const gameDataManager = new GameDataManager();

class PlayerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            direction: this.props.direction,
            shipsOnField: this.props.shipsOnField,
        };

        this.resetShips = this.resetShips.bind(this);
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
            let squarePainterManager = new SquareNumberManager();
            let squareNumberValidator = new SquareNumberValidator();
            let gameData = gameDataManager.getGameData();

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

            let squarePainterManager = new SquareNumberManager();
            let squareNumberValidator = new SquareNumberValidator();
            let squareNumbers = squarePainterManager.getSquareNumbersToPaint(this.state.direction,
                this.state.shipsOnField, squareNumber);

            this.cleanFieldFromIsChecked();

            if (squareNumberValidator.areSquareNumbersValid(squareNumbers, this.state.direction,
                gameDataManager.getGameData().playerField.squares)) {

                this.paintSquaresToPlantShip(squareNumbers);
            }
        }
    }

    paintSquaresToPlantShip(squareNumbers) {

        let gameData = gameDataManager.getGameData();

        console.log(this.state.shipsOnField);

        if (this.state.shipsOnField === 10){
            return;
        }

        for (let i = 0; i < squareNumbers.length; i++) {

            gameData.playerField.squares[squareNumbers[i]].isChecked = true;
        }

        this.props.setGameData(gameData);
    }

    resetShips() {

        let gameDataManager = new GameDataManager();

        this.resetShipsOnField();
        this.state.shipsOnField = 0;
        gameDataManager.resetShipsOnFleet();
        gameDataManager.setValueShipsOnField(this.state.shipsOnField);
    }

    cleanFieldFromIsChecked() {

        let gameData = gameDataManager.getGameData();

        for (let i = 0; i < 99; i++) {

            gameData.playerField.squares[i].isChecked = false;
        }

        this.props.setGameData(gameData);
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

        this.props.setGameData(field);
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
                    this.props.squares.map((square) => {
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
            </div>
        )
    }
}

export default PlayerField;