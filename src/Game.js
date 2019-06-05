import React from 'react';
import "./index.css"
import Field from "./Field";

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            field: [],
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
                    field: data.squares,
                })
            )
    }

    handlePlayerClick(id, isClicked) {

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
            .then((json) => this.updateField(json.id, json.isClicked, json.hasShip))
    }

    updateField(id, isClicked, hasShip) {

        const field = this.state.field;

        field[id] = {
            id: id,
            isClicked: isClicked,
            hasShip : hasShip,
        };

        this.setState({
            field: field,
        });
    }



    render() {
        return (
            <div className="game">
                <Field field={this.state.field} handlePlayerClick={this.handlePlayerClick.bind(this)} />

            </div>
        )
    }
}

export default Game;