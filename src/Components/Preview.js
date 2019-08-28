import React from 'react';
import Game from "./Game";

export default class Preview extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playerName: '',
        };

        this.setPlayerName = this.setPlayerName.bind(this);
    }

    setPlayerName(playerName){

        this.setState(
            () => {
                return {
                    playerName: playerName,
                };
            });
    }

    render(){

        return (

            <Game
                gameType={this.props.getType}
                playerName={this.state.playerName}
            />
        )


    }
}