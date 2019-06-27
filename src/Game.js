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

        this.setState({
            computerField: field,
        });
    }

    handleClick(id) {

        const query = '?id=' + id; //

        fetch('http://localhost:5000/api/computerField' + query,
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
                    if (!json.hasShip) {
                        this.setState({
                            isPlayersTurn: false,
                        })
                    }
                } catch (ex) {
                    alert(ex.toString());
                }
            });
    }

    makePlayerShot(id) {
        
        const query = '?id=' + id;

        fetch('http://localhost:5000/api/computerField/makeShot' + query,
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
                    if (!json.hasShip) {
                        this.setState({
                            isPlayersTurn: false,
                        })
                    }
                } catch (ex) {
                    alert(ex.toString());
                }
            });
    }

    makeComputerShot(id) {


        this.setState({
            isShootingAvailable: false,
        });

        const query = '?id=' + id;

        fetch('http://localhost:5000/api/playerField/makeShot' + query,
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
                    if (!json.hasShip) {
                        this.setState(() => {
                            return {isPlayersTurn: true}
                        })
                    }
                } catch (ex) {
                    alert(ex.toString());
                }
            });

        this.setState({
            isShootingAvailable: true,
        });

    }

    startShooting(id) {


        if (this.state.isPlayersTurn) {

            this.makePlayerShot(id);


            if (this.state.isPlayersTurn) {
                return null;
            } else {

                this.makeComputerShot(id);


            }
        }
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