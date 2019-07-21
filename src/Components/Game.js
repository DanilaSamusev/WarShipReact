import React from 'react';
import "../css/index.css"
import "../css/game.css"
import "../css/playerPanel.css"

import ComputerField from "../Components/ComputerField";
import PlayerField from "./PlayerField";

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameData: null,
        };
    }

    componentDidMount() {

        let gameData = JSON.parse(sessionStorage.getItem('gameData'));

        if (gameData === null) {

            fetch('http://localhost:5000/api/game',
                {
                    method: 'get',
                    headers:
                        {
                            'Accept': 'application/json',
                        },
                })
                .then(response => response.json())
                .then(json => {
                    sessionStorage.setItem('gameData', JSON.stringify(json));
                    return json;
                })
                .then((json => this.setGameData(json)));
        } else {
            this.setGameData(gameData);
        }

    }

    setGameData(gameData) {

        this.setState(
            () => {
                return {
                    gameData: gameData,
                };
            });

    }

    render() {

        if (this.state.gameData === null) {
            return null;
        }

        return (
            <div className="game">

                <ComputerField computerField={this.state.gameData.computerField.squares}/>
                <PlayerField playerField={this.state.gameData.playerField.squares}/>

            </div>
        )
    }
}

export default Game;