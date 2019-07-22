import React from 'react';
import Square from "./Square";
import "../css/index.css"
import "../css/playerField.css"
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

    shouldComponentUpdate(nextProps, nextState, nextContext) {

        if (nextProps.playerField !== this.state.playerField) {
            this.setState(
                () => {
                    return {
                        playerField: this.props.playerField,
                    };
                });
        }

        return true;
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

            let gameData = JSON.parse(sessionStorage.getItem('gameData'));

            var pointsToPlant = this.getSquareNumbersToPaint(this.state.direction, this.state.shipsOnField, id);

            if (this.areSquareNumbersValid(pointsToPlant, this.state.direction)) {

                this.setHasShip(pointsToPlant, gameData.playerFleet.ships[this.state.shipsOnField].id);

                this.setState(
                    () => {
                        return {
                            shipsOnField: this.state.shipsOnField + 1,
                        };
                    }, () => this.saveShipsOnFieldValue(this.state.shipsOnField));
            }
        }
    }

    handleMouseOver(id) {

        if (this.state.shipsOnField !== 10) {

            var squareNumbers = this.getSquareNumbersToPaint(this.state.direction, this.state.shipsOnField, id);

            if (this.areSquareNumbersValid(squareNumbers, this.state.direction)) {

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


////////////////////////////////////////////////////////////

    getSquareNumbersToPaint(direction, shipsOnField, firstSquareNumber) {

        var squareNumbers;

        if (shipsOnField >= 0 && shipsOnField < 4) {
            squareNumbers = new Array(1);
        }

        if (shipsOnField >= 4 && shipsOnField < 7) {
            squareNumbers = new Array(2);
        }

        if (shipsOnField >= 7 && shipsOnField < 9) {
            squareNumbers = new Array(3);
        }

        if (shipsOnField >= 9 && shipsOnField < 10) {
            squareNumbers = new Array(4);
        }

        squareNumbers[0] = firstSquareNumber;

        if (direction === 0) {
            for (let i = 1; i < squareNumbers.length; i++) {
                squareNumbers[i] = squareNumbers[i - 1] + 1;
            }
        } else {
            for (let i = 1; i < squareNumbers.length; i++) {
                squareNumbers[i] = squareNumbers[i - 1] - 10;
            }
        }

        return squareNumbers;
    }

    areSquareNumbersValid(squareNumbers, direction) {

        if (!this.areSquareNumbersValidForBounds(squareNumbers, direction)) {

            return false;
        }


        for (let i = 0; i < squareNumbers.length; i++) {

            if (!this.isPointNumberValid(squareNumbers[i], direction)) {
                return false;
            }
        }

        return true;
    }

    areSquareNumbersValidForBounds(squareNumbers, direction) {

        for (let i = 0; i < squareNumbers.length; i++) {

            if (squareNumbers[i] < 0 ||
                squareNumbers[i] > 99) {
                return false;
            }
        }

        if (direction === 0) {
            for (let i = 0; i < squareNumbers.length; i++) {

                if (Math.trunc(squareNumbers[0] / 10) !==
                    Math.trunc(squareNumbers[i] / 10)) {
                    return false;
                }
            }
        }

        return true;
    }

    isPointNumberValid(squareNumber) {

        var nearestSquareNumbers = [
            squareNumber - 11, squareNumber - 10, squareNumber - 9,
            squareNumber - 1, squareNumber, squareNumber + 1,
            squareNumber + 9, squareNumber + 10, squareNumber + 11
        ];

        if (squareNumber % 10 === 9) {
            nearestSquareNumbers = [
                squareNumber - 11, squareNumber - 10,
                squareNumber - 1, squareNumber,
                squareNumber + 9, squareNumber + 10
            ];
        }

        if (squareNumber % 10 === 0) {
            nearestSquareNumbers = [
                squareNumber - 10, squareNumber - 9,
                squareNumber + 1, squareNumber,
                squareNumber + 10, squareNumber + 11
            ];
        }


        for (var i = 0; i < nearestSquareNumbers.length; i++) {

            if (nearestSquareNumbers[i] >= 0 &&
                nearestSquareNumbers[i] <= 99) {

                if (this.state.playerField[nearestSquareNumbers[i]].shipNumber !== -1) {

                    return false;
                }

            }
        }

        return true;

    };

/////////////////////////////////////////////////////////////////////////////
    makeComputerShot() {
        var playerSquare;
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

    saveShipsOnFieldValue(shipsOnField){

        let gameData = JSON.parse(sessionStorage.getItem('gameData'));

        gameData.playerField.shipsOnField = shipsOnField;
        sessionStorage.setItem('gameData', JSON.stringify(gameData));
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
            </div>
        )
    }
}

export default PlayerField;