import React from 'react';
import Square from "./Square";
import "./index.css"
import "./playerField.css"

class PlayerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            shipsCount: 0,
            direction: 0,
        };
    }

    handleClick(event, id) {

        if (event.shiftKey) {
            this.changeShipDirection(id)
        } else {
            this.plantShip(id);
        }
    }

    changeShipDirection(id) {
        if (this.state.direction === 0) {
            this.setState(
                () => {
                    return {
                        direction: 1
                    };
                },
                () => this.handleMouseOver(id))
        } else {
            this.setState(
                () => {
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
                    this.props.updatePlayerField(json);
                    this.setState({
                        shipsCount: this.state.shipsCount + 1,
                    })
                } catch (ex) {
                    alert("unable to plant a ship")
                }
            });
    }

    handleMouseOver(id) {

        if (this.state.shipsCount === 10) {
            return;
        }

        const query = '?id=' + id + '&direction=' + this.state.direction;

        fetch('http://localhost:5000/api/playerField/markSquaresForShip' + query,
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
                    this.props.updatePlayerField(json);
                } catch (ex) {
                    alert(ex.toString())
                }
            });
    }

    render() {
        return (
            <div className="playerField">
                {
                    this.props.playerField.map((square) => {
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