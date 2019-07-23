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

        this.setIsPlayerTurn = this.setIsPlayerTurn.bind(this);
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
                    isPlayerTurn: gameData.isPlayerTurn,
                };
            });

    }

    setIsPlayerTurn(state){

        this.setState(
            () => {
                return {
                    isPlayerTurn: state,
                };
            });
    }

    render() {

        if (this.state.gameData === null) {
            return null;
        }

        if (this.state.isPlayerTurn === true){
            return (
                <div className="game">

                    <ComputerField computerField={this.state.gameData.computerField.squares}
                                   setIsPlayerTurn={this.setIsPlayerTurn}
                    />
                    <PlayerField playerField={this.state.gameData.playerField.squares}
                                 shipsOnField={this.state.gameData.playerField.shipsOnField}
                                 setIsPlayerTurn={this.setIsPlayerTurn}
                    />

                </div>
            )}
        else{

            return (
                <div className="game">

                    <ComputerField computerField={this.state.gameData.computerField.squares}
                                   setIsPlayerTurn={this.setIsPlayerTurn}
                    />
                    <PlayerField playerField={this.state.gameData.playerField.squares}
                                 shipsOnField={this.state.gameData.playerField.shipsOnField}
                                 setIsPlayerTurn={this.setIsPlayerTurn}
                    />
                </div>
            )

            }
        }

}

export default Game;