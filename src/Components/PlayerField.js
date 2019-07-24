import React from 'react';
import Square from "./Square";
import "../css/index.css"
import "../css/playerField.css"
import {SquarePainterManager} from "../SquarePainterManager.js"
import {ShootingAI} from "../ShootingAI";
import {GameDataManager} from "../GameDataManager";
import "../test.js"

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

    handleClick(event, id) {

        if (event.shiftKey) {
            this.changeShipDirection(id)
        } else {
            this.plantShip(id);
        }
    }

    changeShipDirection(id) {
        if (this.state.direction === 0) {
            this.setState(
                () => {
                    return {
                        direction: 1
                    };
                },
                () => this.handleMouseOver(id))
        } else {
            this.setState(
                () => {
                    return {
                        direction: 0
                    };
                },
                () => this.handleMouseOver(id))
        }
    }

    plantShip(id) {

        if (this.state.shipsOnField !== 10) {

            let squarePainterManager = new SquarePainterManager();
            let gameDataManager = new GameDataManager();
            let gameData = gameDataManager.getGameData();

            var pointsToPlant = squarePainterManager.getSquareNumbersToPaint(this.state.direction, this.state.shipsOnField, id);

            if (squarePainterManager.areSquareNumbersValid(pointsToPlant, this.state.direction, this.state.playerField)) {

                this.setHasShip(pointsToPlant, gameData.playerFleet.ships[this.state.shipsOnField].id);
                gameDataManager.setShipDeckPosition(pointsToPlant, this.state.shipsOnField);

                this.setState(
                    () => {
                        return {
                            shipsOnField: this.state.shipsOnField + 1,
                        };
                    }, () => gameDataManager.setValueShipsOnField(this.state.shipsOnField));
            }
        }
    }

    handleMouseOver(id) {

        if (this.state.shipsOnField !== 10) {

            let squarePainterManager = new SquarePainterManager();

            var squareNumbers = squarePainterManager.getSquareNumbersToPaint(this.state.direction, this.state.shipsOnField, id);

            if (squarePainterManager.areSquareNumbersValid(squareNumbers, this.state.direction, this.state.playerField)) {

                this.paintSquares(squareNumbers);
            }
        }
    }

    paintSquares(squareNumbers) {

        const field = this.state.playerField;

        for (var j = 0; j < field.length; j++) {

            var square1 = this.state.playerField[j];

            field[square1.id] = {
                id: square1.id,
                isClicked: square1.isClicked,
                isChecked: false,
                shipNumber: square1.shipNumber,
            };
        }

        for (var i = 0; i < squareNumbers.length; i++) {

            var square2 = this.state.playerField[squareNumbers[i]];

            field[square2.id] = {
                id: square2.id,
                isClicked: square2.isClicked,
                isChecked: true,
                shipNumber: square2.shipNumber,
            };
        }

        this.setState(
            () => {
                return {
                    playerField: field,
                };
            }, () => sessionStorage.setItem("playerField", JSON.stringify(field)))
    }

    makeComputerShot() {

        let shootingAI = new ShootingAI();
        let gameDataManager = new GameDataManager();
        let squareNumber = shootingAI.getSquareNumberToShoot();

        this.shootFieldSquare(gameDataManager.getGameData(), squareNumber);
        gameDataManager.shootDeck(gameDataManager.getGameData());

        if (gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber !== -1){

            let shipNumber = gameDataManager.getGameData().playerField.squares[squareNumber].shipNumber;

            if (!gameDataManager.getGameData().playerFleet.ships[shipNumber].isAlive){
                shootingAI.resetMemory();
            }
            else{
                ShootingAI._firstShotSquareNumber = squareNumber;
            }
        }
        else{
            this.props.setIsPlayerTurn(true);
        }

    }

    shootFieldSquare(gameData, squareNumber){

        gameData.playerField.squares[squareNumber].isClicked = true;
        this.updatePlayerField(new Array(gameData.playerField.squares[squareNumber]));

    }

    updatePlayerField(squares) {

        if (squares === null) {
            return;
        }

        const field = this.state.playerField;

        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                isChecked: square.isChecked,
                shipNumber: square.shipNumber,
            };
        }

        this.setState(
            () => {
                return {
                    playerField: field,
                };
            }, () => sessionStorage.setItem("playerField", JSON.stringify(field)))
    }

    setHasShip(squareNumbers, shipNumber) {

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

        this.setState(
            () => {
                return {
                    playerField: field,
                };
            }, () => {
                let gameData = JSON
                    .parse(sessionStorage.getItem('gameData'));
                gameData.playerField.squares = this.state.playerField;

                console.log(this.state.playerField);

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

                <button onClick={this.makeComputerShot}>Next</button>
            </div>
        )
    }
}

export default PlayerField;