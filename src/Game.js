import React from 'react';
import "./index.css"
import ComputerField from "./ComputerField";
import PlayerField from "./PlayerField";

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playerField: [],
            computerField: [],
            isPlayersTurn: true,
            isShootingAvailable: true,
        };

        this.updatePlayerField = this.updatePlayerField.bind(this);
        this.updateComputerField = this.updateComputerField.bind(this);
        this.startShooting = this.startShooting.bind(this);
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
            })
    }

    updatePlayerField(squares) {

        const field = this.state.playerField;

        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                isChecked: square.isChecked,
                hasShip: square.hasShip,
            };
                console.log(1);
        }

        this.setState(
            () => {
                return {
                    playerField: field,
                };
            });

    }

    updateComputerField(square) {

        const field = this.state.computerField;

        field[square.id] = {
            id: square.id,
            isClicked: square.isClicked,
            hasShip: square.hasShip,
        };

        this.setState(
            () => {
                return {
                    computerField: field,
                };
            });
    }

    makePlayerShot(id) {

        const query = '?id=' + id;

        fetch('http://localhost:5000/api/computerField/makePlayerShot' + query,
            {
                method: 'put',
                headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
            })
            .then(response => response.text())
            .then(text => {
                try {
                    const json = JSON.parse(text);
                    this.updateComputerField(json);
                } catch (ex) {
                    alert(ex.toString());
                }
            });

        return Promise.resolve();
    };

    makeComputerShot() {

        fetch('http://localhost:5000/api/playerField/makeShot',
            {
                method: 'put',
                headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
            })
            .then(response => response.text())
            .then(text => {
                try {
                    const json = JSON.parse(text);
                    this.updatePlayerField(json);
                } catch (ex) {
                    alert(ex.toString());
                }
            });


    };

    didPlayerKillDeck = new Promise(
        function (resolve, reject) {
            setTimeout(() => resolve(15), 2000);
        }
    );

    comp = function(prevPromise){
        return Promise.resolve(prevPromise + 1);
    };

    startShooting(id) {
        this.makePlayerShot(id).then(() => this.makeComputerShot());
    }

    render() {
        return (
            <div className="game">
                <ComputerField computerField={this.state.computerField} updateComputerField={this.updateComputerField}
                               onClick={this.startShooting}/>
                <PlayerField playerField={this.state.playerField} updatePlayerField={this.updatePlayerField}/>
            </div>
        )
    }
}

export default Game;