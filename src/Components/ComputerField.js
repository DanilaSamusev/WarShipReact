import React from 'react';
import Square from './Square'
import "../css/computerField.css"
import "../css/index.css"

class ComputerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            computerField: [],
        };

        this.updateComputerField = this.updateComputerField.bind(this);
        this.makePlayerShot = this.makePlayerShot.bind(this);
    }

    componentWillMount() {

        if (this.props.computerField !== null) {
            this.setState(
                () => {
                    return {
                        computerField: this.props.computerField,
                    };
                });
        }
    }

    makePlayerShot(id) {

        let square = this.state.computerField[id];

        square.isClicked = true;

        if (square.shipNumber !== -1) {
            this.shotDeck(square.shipNumber);
        }

        this.updateComputerField(new Array(square));
    }

    updateComputerField(squares) {

        if (squares === null) {
            return;
        }

        const field = this.state.computerField;

        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                shipNumber: square.shipNumber,
            };
        }

        this.setState(
            () => {
                return {
                    computerField: field,
                };
            }, () => {
                let gameData = JSON.parse(sessionStorage.getItem('gameData'));
                gameData.computerField.squares = this.state.computerField;
                sessionStorage.setItem('gameData', JSON.stringify(gameData))
            });
    }

    shotDeck(shipId) {

        let gameData = JSON.parse(sessionStorage.getItem('gameData'));

        gameData.computerFleet.ships[shipId].hitsNumber = gameData.computerFleet.ships[shipId].hitsNumber + 1;

        if (gameData.computerFleet.ships[shipId].hitsNumber === gameData.computerFleet.ships[shipId].decks.length) {
            gameData.computerFleet.ships[shipId].isAlive = false;
        }

        sessionStorage.setItem('gameData', JSON.stringify(gameData));
    }

    render() {
        return (
            <div className="computerField">
                {
                    this.state.computerField.map((square) => {
                        return (
                            <Square
                                id={square.id}
                                key={square.id}
                                className="computerSquare"
                                shipNumber={square.shipNumber}
                                isClicked={square.isClicked}
                                onClick={() => this.makePlayerShot(square.id)}
                            />
                        )
                    })}
            </div>
        )
    }
}

export default ComputerField;