import React from 'react';
import "../css/computerField.css"
import "../css/index.css"
import {GameDataManager} from "../GameDataManager";
import Square from './Square'

export default class ComputerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            squares: [],
        };

        this.makeShot = this.makeShot.bind(this);
        this.updateComputerField = this.updateComputerField.bind(this);
    }

    componentWillMount() {

        if (this.props.squares !== null) {
            this.setState(
                () => {
                    return {
                        squares: this.props.squares,
                    };
                });
        }
    }

    makeShot(squareId) {

        let gameDataManager = new GameDataManager();
        let square = this.state.squares[squareId];
        let gameData = gameDataManager.getGameData();

        if (square.isClicked === true || !gameData.isPlayerTurn ||
            gameData.gameState !== 'battle') {
            return;
        }

        square.isClicked = true;

        if (square.shipNumber !== -1) {

            gameDataManager.shootDeck(square.shipNumber, 'computerFleet');

            let gameData = gameDataManager.getGameData();
            let ship = gameData.computerFleet.ships[square.shipNumber];

            if (!ship.isAlive) {
                this.props.paintAreaAroundShip(ship)
            }
        } else {
            this.props.setIsPlayerTurn(false);
            gameDataManager.setIsPlayerTurn(false);
            this.props.makeComputerShot();
        }


        this.updateComputerField(new Array(square));
    }

    updateComputerField(squares) {

        if (squares === null) {
            return;
        }

        const field = this.state.squares;

        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                shipNumber: square.shipNumber,
            };
        }

        this.setField(field);
    }

    setField(field) {

        let gameDataManager = new GameDataManager();

        this.setState(
            () => {
                return {
                    squares: field,
                };
            }, () => {
                let gameData = gameDataManager.getGameData();

                gameData.computerField.squares = this.state.squares;
                gameDataManager.setGameData(gameData);
            });
    }

    render() {
        return (
            <div className="computerField">
                {
                    this.state.squares.map((square) => {
                        return (
                            <Square
                                id={square.id}
                                key={square.id}
                                isClicked={square.isClicked}
                                shipNumber={square.shipNumber}
                                className="computerSquare"
                                onClick={() => this.makeShot(square.id)}
                            />
                        )
                    })}
            </div>
        )
    }
}