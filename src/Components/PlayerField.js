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
        };
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

        let gameData = gameDataManager.getGameData();

        if (gameData.playerField.shipsOnField < 10) {

            let squarePainterManager = new SquareNumberManager();
            let squareNumberValidator = new SquareNumberValidator();

            let pointsToPlantShip = squarePainterManager.getSquareNumbersToPaint(this.state.direction,
                gameData.playerField.shipsOnField, squareNumber);

            if (squareNumberValidator.areSquareNumbersValid(pointsToPlantShip, this.state.direction,
                gameData.playerField.squares)) {

                this.setSquaresHasShip(gameData, pointsToPlantShip, gameData.playerFleet.ships[gameData.playerField.shipsOnField].id);
                gameDataManager.setShipDeckPosition(pointsToPlantShip, gameData.playerField.shipsOnField);
                gameData.playerField.shipsOnField++;
            }
        }

        this.props.setGameData(gameData);
    }

    handleMouseOver(squareNumber) {

        let gameData = gameDataManager.getGameData();

        if (gameData.playerField.shipsOnField < 10) {

            let squarePainterManager = new SquareNumberManager();
            let squareNumberValidator = new SquareNumberValidator();
            let squareNumbers = squarePainterManager.getSquareNumbersToPaint(this.state.direction,
                gameData.playerField.shipsOnField, squareNumber);

            this.cleanFieldFromIsChecked();

            if (squareNumberValidator.areSquareNumbersValid(squareNumbers, this.state.direction,
                gameDataManager.getGameData().playerField.squares)) {

                this.paintSquaresToPlantShip(squareNumbers);
            }
        }
    }

    paintSquaresToPlantShip(squareNumbers) {

        let gameData = gameDataManager.getGameData();

        for (let i = 0; i < squareNumbers.length; i++) {

            gameData.playerField.squares[squareNumbers[i]].isChecked = true;
        }

        this.props.setGameData(gameData);
    }

    cleanFieldFromIsChecked() {

        let gameData = gameDataManager.getGameData();

        for (let i = 0; i < 99; i++) {

            gameData.playerField.squares[i].isChecked = false;
        }

        this.props.setGameData(gameData);
    }

    setSquaresHasShip(gameData, squareNumbers, shipNumber) {

        for (let i = 0; i < squareNumbers.length; i++) {

           gameData.playerField.squares[squareNumbers[i]].shipNumber = shipNumber;
        }
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