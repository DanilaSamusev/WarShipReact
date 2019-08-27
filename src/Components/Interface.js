import React from 'react';
import "../css/index.css"
import "../css/game.css"
import "../css/interface.css"
import {GameDataManager} from "../GameDataManager";
import * as signalR from "@aspnet/signalr";
import Console from "./Console";

const gameDataManager = new GameDataManager();

export default class Interface extends React.Component {

    constructor(props) {
        super(props);

        this.resetShips = this.resetShips.bind(this);
        this.setIsPlayerReady = this.setIsPlayerReady.bind(this);
    }

    resetShips(){

        let gameData = gameDataManager.getGameData();

        gameDataManager.resetShipsOnField(gameData.boards[gameData.playerId]);

        this.props.setGameData(gameData, true);
    }

    setIsPlayerReady(){

        let gameData = gameDataManager.getGameData();

        gameData.players[gameData.playerId].isPlayerReady = true;

        this.props.setGameData(gameData, true);
    }

    render() {

        let readyButton;
        let resetShipsButton;
        let gameData = gameDataManager.getGameData();

        if (!this.props.isPlayerReady) {

            if (this.props.shipsOnField === 10) {

                readyButton = <button onClick={() => this.setIsPlayerReady()}>Ready!</button>
            }

            resetShipsButton = <button onClick={this.resetShips}>Reset ships</button>
        }

        return (
            <div className='interface'>
                {resetShipsButton}
                {readyButton}

                <Console
                    events={gameData.events}
                />
            </div>
        )


    }
}