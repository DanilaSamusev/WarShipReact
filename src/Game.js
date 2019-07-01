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
        };

        this.updatePlayerField = this.updatePlayerField.bind(this);
        this.updateComputerField = this.updateComputerField.bind(this);
        this.makeShooting = this.makeShooting.bind(this);

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

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return true;
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

            this.setState(
                () => {
                    return {
                        playerField: field,
                    };
                })
        }
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

    myfeth(query) {
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

    makeShooting(id) {
        const query = '?id=' + id;
        var computerSquare;
        var playerSquares;

        this.myfeth('computerField/makePlayerShot' + query)
            .then(text => {
                try {
                    const json = JSON.parse(text);
                    computerSquare = json[0];
                    playerSquares = json[1];
                    console.log(json[0]);

                    this.updateComputerField(computerSquare);
                    this.updatePlayerField(playerSquares);
                } catch (ex) {

                }
            });

    }

    render() {
        return (
            <div className="game">
                <ComputerField computerField={this.state.computerField}
                               updateComputerField={this.updateComputerField}
                               onClick={this.makeShooting}/>
                <PlayerField playerField={this.state.playerField}
                             updatePlayerField={this.updatePlayerField}/>
            </div>
        )
    }
}

export default Game;