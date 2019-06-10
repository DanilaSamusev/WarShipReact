import React from 'react';
import "./index.css"
import ComputerField from "./ComputerField";
import PlayerField from "./PlayerField";

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            computerField: [],
            playerField: [],
            playerDecks: 0,
        };
    }

    componentWillMount() {

        fetch('http://localhost:5000/api/computerField',
            {
                method: 'get',
                headers:
                    {
                        'Accept': 'application/json',
                    },
            })
            .then(function (response) {
                return response.json()
            })
            .then((data) => this.setState({
                    computerField: data.squares,
                })
            );

        fetch('http://localhost:5000/api/playerField',
            {
                method: 'get',
                headers:
                    {
                        'Accept': 'application/json',
                    },
            })
            .then(function (response) {
                return response.json()
            })
            .then((data) => this.setState({
                    playerField: data.squares,
                })
            )
    }

    handleMouseOver(id) {

        fetch('http://localhost:5000/api/playerField',
            {
                method: 'put',
                headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify(
                    {
                        id: id,
                    })
            })
            .then(function (response) {
                return response.json()
            })
            .then((json) => this.updatePlayerField(json))

    }

    handlePlayerFieldClick(id){

        fetch('http://localhost:5000/api/playerField/setShip',
            {
                method: 'put',
                headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify(
                    {
                        id: id,
                    })
            })
            .then(function (response) {
                return response.json()
            })
            .then((json) => this.updatePlayerField(json))

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

        this.setState({
            playerField: field,
        });
    }


    handlePlayerShot(id, isClicked) {

        fetch('http://localhost:5000/api/computerField',
            {
                method: 'put',
                headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                body: JSON.stringify(
                    {
                        id: id,
                        isClicked: isClicked,
                    })
            })
            .then(function (response) {
                return response.json()
            })
            .then((json) => this.updateComputerField(json.id, json.isClicked, json.hasShip))
    }

    updateComputerField(id, isClicked, hasShip) {

        const field = this.state.computerField;

        field[id] = {
            id: id,
            isClicked: isClicked,
            hasShip: hasShip,
        };

        this.setState({
            computerField: field,
        });
    }

    render() {
        return (
            <div className="game">
                <PlayerField playerField={this.state.playerField}
                             handleMouseOver={this.handleMouseOver.bind(this)}
                             handlePlayerFieldClick={this.handlePlayerFieldClick.bind(this)}
                />
                <ComputerField computerField={this.state.computerField}
                               handlePlayerShot={this.handlePlayerShot.bind(this)}/>
            </div>
        )
    }
}

export default Game;