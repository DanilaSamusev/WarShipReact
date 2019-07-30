import React from 'react';
import "../css/index.css"
import "../css/game.css"
import {GameDataManager} from "../GameDataManager";

export default class Interface extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            gameState: 'battle preparation'
        };
    }

    setGameState(gameState) {

        let gameDataManager = new GameDataManager();

        this.setState(
            () => {
                return {
                    gameState: gameState,
                };
            }, () => {
                let gameData = gameDataManager.getGameData();

                gameData.gameState = this.state.gameState;
                gameDataManager.setGameData(gameData);
            });
    }

    render() {

        let readyButton;
        let resetShipsButton;

        if (this.state.gameState === 'battle preparation') {

            if (this.props.shipsOnField === 10) {
                readyButton = <button onClick={() => this.setGameState('battle')}>Ready!</button>
            }

            resetShipsButton = <button onClick={this.props.resetShips}>Reset ships</button>
        }

        return (
            <div>
                {resetShipsButton}
                {readyButton}
            </div>
        )


    }
}