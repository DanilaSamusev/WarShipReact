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
            direction: 0,
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
            .then(response => response.text())
            .then(text => {
                try {
                    const json = JSON.parse(text);
                    this.setState({
                        playerField: json,
                    })
                } catch (ex) {
                    alert("ошибка получения поля игрока!")
                }
            })
    }

    handleClick(event, id) {

        if (event.shiftKey) {
            this.changeDirection(id)
        } else {
            this.plantShip(id);
        }
    }

    changeDirection(id) {
        if (this.state.direction === 0) {
            this.setState(
                (state) => {
                    return {
                        direction: 1
                    };
                },
                () => this.handleMouseOver(id))
        } else {
            this.setState(
                (state) => {
                    return {
                        direction: 0
                    };

                },
                () => this.handleMouseOver(id))
        }
    }

    plantShip(id) {

        if (this.state.shipsCount === 10) {
            return;
        }

        const query = '?id=' + id + '&direction=' + this.state.direction;

        fetch('http://localhost:5000/api/playerField/plantShip' + query,
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
                    this.setState({
                        shipsCount: this.state.shipsCount + 1,
                    })
                } catch (ex) {
                    console.log("plantShipError")
                }
            });
    }

    handleMouseOver(id) {

        if (this.state.shipsCount === 10) {
            return;
        }

        const query = '?id=' + id + '&direction=' + this.state.direction;

        fetch('http://localhost:5000/api/playerField/checkPoints' + query,
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

                }
            });
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
                                onMouseOver={() => this.handleMouseOver(square.id)}
                                onClick={(event) => this.handleClick(event, square.id)}
                            />
                        )
                    })}
            </div>
        )
    }
}

export default PlayerField;