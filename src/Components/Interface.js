import React from 'react';
import "../css/index.css"
import "../css/game.css"
import "../css/interface.css"
import {GameDataManager} from "../GameDataManager";
import * as signalR from "@aspnet/signalr";

const gameDataManager = new GameDataManager();

let hubUrl = 'http://localhost:5000/data';
const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl)
    .configureLogging(signalR.LogLevel.Information)
    .build();

hubConnection.on("Send", function (gameData) {

    gameDataManager.setBoards(gameData);
});

hubConnection.start();

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

        hubConnection.invoke("Send", gameData);
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
            <div className='interface'>
                {resetShipsButton}
                {readyButton}
            </div>
        )


    }
}