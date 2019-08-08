import React from 'react';
import "../css/index.css"
import "../css/game.css"
import {GameDataManager} from "../GameDataManager";

const gameDataManager = new GameDataManager();

export default class Interface extends React.Component {

    constructor(props) {
        super(props);

        this.resetShips = this.resetShips.bind(this);
    }

    resetShips(){

        let gameData = gameDataManager.getGameData();

        gameDataManager.resetShipsOnField(gameData);

        this.props.setGameData(gameData);
    }

    render() {

        let readyButton;
        let resetShipsButton;
        let gameData = gameDataManager.getGameData();

        if (this.props.gameState === 'battle preparation') {

            if (this.props.shipsOnField === 10) {

                gameData.gameState = 'battle';
                readyButton = <button onClick={() => this.props.setGameData(gameData)}>Ready!</button>
            }

            resetShipsButton = <button onClick={this.resetShips}>Reset ships</button>
        }

        return (
            <div>
                {resetShipsButton}
                {readyButton}
            </div>
        )


    }
}