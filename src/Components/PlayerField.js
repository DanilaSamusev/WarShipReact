import React from 'react';
import Square from "./Square";
import "../css/index.css"
import "../css/playerField.css"

class PlayerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playerField: [],
            direction: 0,
        };

        this.updatePlayerField = this.updatePlayerField.bind(this);
        this.makeComputerShot = this.makeComputerShot.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

        if (nextProps.playerField !== this.state.playerField){
            this.setState(
                () => {
                    return {
                        playerField: this.props.playerField,
                    };
                });
        }

        return true;
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
                    this.updatePlayerField(json);
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
                    this.updatePlayerField(json);
                } catch (ex) {

                }
            }).catch(function (error) {
            console.log('error : ' + error.message)
        });
    }

    makeComputerShot() {
        var playerSquare;

        console.log("1");

        this.myFetch('playerField/computerShot')
            .then(text => {
                try {
                    playerSquare = JSON.parse(text);
                    this.updatePlayerField(new Array(playerSquare));
                    this.changeShotInfo(playerSquare, 'Computer');

                    if (playerSquare.shipNumber === -1) {
                        this.setState(
                            () => {
                                return {
                                    isPlayerTurn: true,
                                };
                            });
                    }

                } catch (ex) {

                }
            });
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
                shipNumber: square.shipNumber,
            };
        }

        this.setState(
            () => {
                return {
                    playerField: field,
                };
            }, () => sessionStorage.setItem("playerField", JSON.stringify(field)))
    };


    myFetch(query) {
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
                                shipNumber={square.shipNumber}
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