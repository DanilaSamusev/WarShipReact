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
            playerField: [],
            computerField: [],
            isPlayerTurn: null,
            shotInfo: '',
        };

        this.updatePlayerField = this.updatePlayerField.bind(this);
        this.updateComputerField = this.updateComputerField.bind(this);
        this.makePlayerShot = this.makePlayerShot.bind(this);
        this.makeComputerShot = this.makeComputerShot.bind(this);
    }

    componentWillMount() {
        this.getGameData();
    }

    getGameData(){
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

                    console.log(json);

                    this.setState(
                        () => {
                            return {
                                playerField: json.playerSquares,
                                computerField: json.computerSquares,
                                isPlayerTurn: json.isPlayerTurn,
                            };
                        });

                } catch (ex) {

                }
            });
    }

    updatePlayerField(squares) {

        if (squares === null) {
            return;
        }

        const field = this.state.playerField;

        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                isChecked: square.isChecked,
                shipNumber: square.shipNumber,
            };
        }

        this.setState(
            () => {
                return {
                    playerField: field,
                };
            });
    }

    updateComputerField(squares) {

        if (squares === null) {
            return;
        }

        const field = this.state.computerField;

        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                shipNumber: square.shipNumber,
            };
        }

        this.setState(
            () => {
                return {
                    computerField: field,
                };
            });
    }

    myFetch(query) {
        return fetch('http://localhost:5000/api/' + query,
            {
                method: 'put',
                headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
            }).then(response => response.text())
    };

    makePlayerShot(id) {
        const query = '?id=' + id;
        var computerSquare;

        this.myFetch('computerField/playerShot' + query)
            .then(text => {
                try {
                    computerSquare = JSON.parse(text);
                    this.updateComputerField(new Array(computerSquare));
                    this.changeShotInfo(computerSquare, 'Player');

                    if (!computerSquare.hasShip){
                        this.setState(
                            () => {
                                return {
                                    isPlayerTurn: false,
                                };
                            });
                    }

                } catch (ex) {

                }
            });
    }

    makeComputerShot() {
        var playerSquare;

        console.log("1");

        this.myFetch('playerField/computerShot')
            .then(text => {
                try {
                    playerSquare = JSON.parse(text);
                    this.updatePlayerField(new Array(playerSquare));
                    this.changeShotInfo(playerSquare, 'Computer');

                    if (!playerSquare.hasShip){
                        this.setState(
                            () => {
                                return {
                                    isPlayerTurn: true,
                                };
                            });
                    }

                } catch (ex) {

                }
            });
    }

    changeShotInfo(square, playerName){

        if (square.hasShip){
            this.changeShotInfoState(playerName + ' has shot a ship!')
        }
        else{
            this.changeShotInfoState(playerName + ' has missed!')
        }
    }

    changeShotInfoState(info){
        this.setState(() => {
            return{
                shotInfo: info,
            }
        })
    }

    render() {
        return (
            <div className="game">
                <ComputerField computerField={this.state.computerField}
                               updateComputerField={this.updateComputerField}
                               onClick={this.makePlayerShot}/>
                <div className="playerPanel">
                    <PlayerField playerField={this.state.playerField}
                                 updatePlayerField={this.updatePlayerField}/>
                    <InfoPanel onClick={this.makeComputerShot} shotInfo={this.state.shotInfo} isPlayerTurn={this.state.isPlayerTurn}/>
                </div>
            </div>
        )
    }
}

export default Game;