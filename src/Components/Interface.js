import React from 'react';
import "../css/index.css"
import "../css/game.css"
import {GameDataManager} from "../GameDataManager";

const gameDataManager = new GameDataManager();

export default class Interface extends React.Component {

    constructor(props) {
        super(props);

        this.resetShips = this.resetShips.bind(this);
        this.setIsPlayerReady = this.setIsPlayerReady.bind(this);
    }

    resetShips(){

        let gameData = gameDataManager.getGameData();

        gameDataManager.resetShipsOnField(gameData);

        this.props.setGameData(gameData);
    }

    setIsPlayerReady(){

        let gameData = gameDataManager.getGameData();

        gameData.boards[gameData.playerBoardId].isPlayerReady = true;

        this.props.setGameData(gameData);
    }

    render() {

        let readyButton;
        let resetShipsButton;

        if (!this.props.isPlayerReady) {

            if (this.props.shipsOnField === 10) {

                readyButton = <button onClick={() => this.setIsPlayerReady()}>Ready!</button>
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