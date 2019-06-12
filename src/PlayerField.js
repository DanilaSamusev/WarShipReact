import React from 'react';
import Square from "./Square";
import "./index.css"
import "./playerField.css"

class PlayerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playerField: [],
            shipsCount: 0,
        };
    }

    componentWillMount() {

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
                    playerField: data,
                })
            );
    }

    handleClick(id) {

        if (this.state.shipsCount === 10) {
            return;
        }

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
            .then((json) => this.updatePlayerField(json));

        this.setState({
            shipsCount: this.state.shipsCount + 1,
        })
    }

    handleMouseOver(id) {

        if (this.state.shipsCount === 10) {
            return;
        }

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
            .then((json) => this.updatePlayerField(json));


    }

    handleMouseOut(id) {

        if (this.state.shipsCount === 10) {
            return;
        }

        fetch('http://localhost:5000/api/playerField/mouseOut',
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

    render() {
        return (
            <div className="playerField">
                {
                    this.state.playerField.map((square) => {
                        return (
                            <Square
                                key={square.id}
                                id={square.id}
                                isClicked={square.isClicked}
                                isChecked={square.isChecked}
                                hasShip={square.hasShip}
                                className="playerSquare"
                                onMouseOut={() => this.handleMouseOut(square.id)}
                                onMouseOver={() => this.handleMouseOver(square.id)}
                                onClick={() => this.handleClick(square.id)}
                            />
                        )
                    })}
            </div>
        )
    }
}

export default PlayerField;