import React from 'react';
import Square from "./Square";
import "../css/index.css"
import "../css/playerField.css"

class PlayerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
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
                        shipsOnField: this.state.shipsOnField + 1,
                    })
                } catch (ex) {
                    alert("unable to plant a ship")
                }
            });
    }

    handleMouseOver(id) {

        const query = '?id=' + id + '&direction=' + this.state.direction;

        fetch('http://localhost:5000/api/playerField/squaresForShipPlanting' + query,
            {
                method: 'put',
                headers:
                    {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
            })
            .then(response => {

                if (response.status >= 200 && response.status < 400) {
                    return response;
                } else {
                    throw new Error("All ships have been planted")
                }

            })
            .then(response => response.text())
            .then(text => {
                try {
                    const json = JSON.parse(text);
                    this.props.updatePlayerField(json);
                } catch (ex) {

                }
            }).catch(function (error) {
            console.log('error : ' + error.message)
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