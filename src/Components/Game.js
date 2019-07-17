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
            computerField: [],
            playerField: [],
        };

    }

    componentWillMount() {
        this.setGameData();
    }

    setGameData() {

        var playerField = JSON.parse(sessionStorage.getItem('playerField'));
        var computerField = JSON.parse(sessionStorage.getItem('computerField'));

        if (playerField === null || computerField === null) {

            fetch('http://localhost:5000/api/game',
                {
                    method: 'get',
                    headers:
                        {
                            'Accept': 'application/json',
                        },
                })
                .then(response => response.text())
                .then(text => {
                    try {
                        const json = JSON.parse(text);

                        sessionStorage.setItem('playerField', JSON.stringify(json.playerSquares));
                        sessionStorage.setItem('computerField', JSON.stringify(json.computerSquares));

                        this.setState(
                            () => {
                                return {
                                    playerField: json.playerSquares,
                                    computerField: json.computerSquares,
                                };
                            });

                    } catch (ex) {

                    }
                });
        } else {

            this.setState(
                () => {
                    return {
                        playerField: playerField,
                        computerField: computerField,
                    };
                });
        }

    }

    render() {

        return (
            <div className="game">

                <ComputerField computerField={this.state.computerField}/>
                <PlayerField playerField={this.state.playerField}/>

            </div>
        )
    }
}

export default Game;