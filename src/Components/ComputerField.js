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

        if (square.isClicked === true || !gameData.isPlayerTurn ||
            gameData.gameState !== 'battle' || gameData.winnerName !== null) {
            return;
        }
        gameDataManager.shootSquare(gameData, squareId);

        if (square.shipNumber !== -1) {

            gameDataManager.shootDeck(gameData, square.shipNumber);

            let ship = gameData.computerFleet.ships[square.shipNumber];

            if (!ship.isAlive) {
                gameDataManager.paintAreaAroundShip(gameData, ship);
                gameDataManager.incrementDeadShipsCount(gameData);
            }

            if (gameData.computerFleet.deadShipsCount === 10){

                gameData.winnerName = 'You';
            }

            this.props.setGameData(gameData);
        }
        else {
            gameDataManager.setIsPlayerTurn(gameData,false);
            this.props.setGameData(gameData);
            this.props.makeComputerShot();
        }
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