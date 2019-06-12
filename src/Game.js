import React from 'react';
import "./index.css"
import ComputerField from "./ComputerField";
import PlayerField from "./PlayerField";

class Game extends React.Component {

    render() {
        return (
            <div className="game">
                <ComputerField />
                <PlayerField />
            </div>
        )
    }
}

export default Game;