import React from 'react';
import Square from './Square'
import "./index.css"

class Game extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            field: [],
        };
    }

    componentWillMount() {

        this.setState({
            field: []
        });

        fetch('https://localhost:5001/api/game',
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

    handleClick(id, isClicked) {

        fetch('https://localhost:5001/api/game',
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
            .then((json) => this.updateField(json.id, json.isClicked))
    }

    updateField(id, isClicked){

        var field = this.state.field;

        field[id] = {
            id: id,
            isClicked : isClicked
        };

        this.setState({
            field: field,
        });
    }

    render() {
        return (
            <div className="game">
                <div className="field">
                    {
                        this.state.field.map((square) => {
                            return (
                                <button className="square" key={square.id} onClick={() => this.handleClick(square.id, square.isClicked)}>
                                    <Square id={square.id} isClicked={square.isClicked}/>
                                </button>
                            )
                        })}

                </div>
            </div>
        )
    }
}

export default Game;