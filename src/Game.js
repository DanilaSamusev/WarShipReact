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

        const point = this.state.playerField[id];

        if (this.state.playerDecks < 4){
            point.isChecked = !point.isChecked;
            this.updatePlayerField(id, point.isClicked, point.isChecked, point.hasShip)
        }

        /*fetch('http://localhost:5000/api/playerField',
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
            .then((json) => this.updatePlayerField(json.id, json.isClicked, json.isChecked, json.hasShip))*/
    }

    updatePlayerField(id, isClicked, isChecked, hasShip) {
        const field = this.state.playerField;

        field[id] = {
            id: id,
            isClicked: isClicked,
            isChecked: isChecked,
            hasShip: hasShip,
        };

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
                />
                <ComputerField computerField={this.state.computerField}
                               handlePlayerShot={this.handlePlayerShot.bind(this)}/>
            </div>
        )
    }
}

export default Game;