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
        };
    }

    componentWillMount() {

        fetch('http://localhost:5000/api/game',
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
                    computerField: data.computerField.squares,
                    playerField: data.playerField.squares,
                })
            )
    }

    handlePlayerShot(id, isClicked) {

        fetch('http://localhost:5000/api/game',
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

    handlePlayerClick(id){

        const field = this.state.playerField;



    }

    render() {
        return (
            <div className="game">
                <ComputerField computerField={this.state.computerField} handlePlayerShot={this.handlePlayerShot.bind(this)}/>
                <PlayerField playerField={this.state.playerField}/>
            </div>
        )
    }
}

export default Game;