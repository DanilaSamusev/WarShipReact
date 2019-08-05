import React from 'react';
import "../css/computerField.css"
import "../css/index.css"
import {GameDataManager} from "../GameDataManager";
import Square from './Square'

const gameDataManager = new GameDataManager();

export default class ComputerField extends React.Component {

    constructor(props) {
        super(props);

        this.makeShot = this.makeShot.bind(this);
    }

    makeShot(squareId) {

        let gameData = gameDataManager.getGameData();
        let square = gameData.computerField.squares[squareId];

        // write method to check this
        if (square.isClicked === true || !gameData.isPlayerTurn ||
            gameData.gameState !== 'battle') {
            return;
        }

        this.shootSquare(squareId);

        if (square.shipNumber !== -1) {

            gameDataManager.shootDeck(square.shipNumber);

            let gameData = gameDataManager.getGameData();
            let ship = gameData.computerFleet.ships[square.shipNumber];

            if (!ship.isAlive) {
                this.props.paintAreaAroundShip(ship);

            }
        } else {
            this.props.setIsPlayerTurn(false);
            this.props.makeComputerShot();
        }

    }

    shootSquare(squareId) {

        let gameData = gameDataManager.getGameData();
        let squares = gameData.computerField.squares;

        squares[squareId].isClicked = true;
        this.props.setGameData(gameData);
    }



    render() {
        return (
            <div className="computerField">
                {
                    this.props.squares.map((square) => {
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