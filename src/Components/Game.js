import React from 'react';
import "../css/index.css"
import "../css/game.css"
import "../css/playerPanel.css"

import ComputerField from "../Components/ComputerField";
import PlayerField from "./PlayerField";
import InfoPanel from "../Components/InfoPanel"

class Game extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setGameData();
    }

    setGameData() {

        if (JSON.parse(sessionStorage.getItem('computerField')) === null ||
            JSON.parse(sessionStorage.getItem('playerField')) === null ||
            JSON.parse(sessionStorage.getItem('isPlayerTurn')) === null) {
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

                        sessionStorage.setItem("playerField", JSON.stringify(json.playerSquares));
                        sessionStorage.setItem("computerField", JSON.stringify(json.computerSquares));
                        sessionStorage.setItem("isPlayerTurn", JSON.stringify(json.isPlayerTurn));

                    } catch (ex) {

                    }
                });
        }
    }

    render() {

        


        return (
            <div className="game">

                <ComputerField/>
                <PlayerField/>
                <InfoPanel/>

            </div>
        )
    }
}

export default Game;