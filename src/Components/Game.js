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

        this.state = {
            computerField: [],
            playerField: [],
        };

    }

    componentWillMount() {
        this.setGameData();
    }

    setGameData() {


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

                    this.setState(
                        () => {
                            return {
                                computerField: json.computerSquares,
                                playerField: json.playerSquares,
                            };
                        });

                } catch (ex) {

                }
            });
    }


    render() {

        return (
            <div className="game">

                <ComputerField computerField={this.state.computerField}/>
                <PlayerField playerField={this.state.playerField}/>
                <InfoPanel/>

            </div>
        )
    }
}

export default Game;