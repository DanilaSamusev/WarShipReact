import React from 'react';
import {GameDataManager} from "../GameDataManager";

const gameDataManager = new GameDataManager();

export default class LoginPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playerName: '',
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {

        let value = e.target.value;
        this.setState({playerName: value});
    }

    onSubmit(){

        let gameData = gameDataManager.getGameData();
        let playerId = gameData.playerId;
        gameData.players[playerId].name = this.state.playerName;
        gameData.players[playerId].isLoggedIn = true;

        this.props.hubConnection.invoke("Send", gameData);
    }

    render() {

        return (

            <form onSubmit={this.onSubmit}>
                <input type='text' value={this.state.playerName} onChange={this.onChange}
                       placeholder='Inter your name'/>
                <input type='submit' value='Send'/>
            </form>
        )

    }
}