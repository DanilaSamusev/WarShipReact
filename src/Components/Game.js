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
            shotInfo: '',
        };

        this.updatePlayerField = this.updatePlayerField.bind(this);
        this.updateComputerField = this.updateComputerField.bind(this);
        this.makePlayerShot = this.makePlayerShot.bind(this);
        this.makeComputerShot = this.makeComputerShot.bind(this);
    }

    componentWillMount() {

        this.getPlayerField();
        this.getComputerField();

    }

    getPlayerField() {

        fetch('http://localhost:5000/api/playerField',
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
                                playerField: json
                            };
                        });
                } catch (ex) {
                    alert("unable to receive playerField")
                }
            });
    }

    getComputerField() {

        fetch('http://localhost:5000/api/computerField',
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
                    this.setState({
                        computerField: json,
                    })
                } catch (ex) {
                    alert("unable to receive computerField")
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
                hasShip: square.hasShip,
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
                hasShip: square.hasShip,
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
                } catch (ex) {
                    console.log(ex.toString())
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
                    <InfoPanel onClick={this.makeComputerShot} shotInfo={this.state.shotInfo}/>
                </div>
            </div>
        )
    }
}

export default Game;