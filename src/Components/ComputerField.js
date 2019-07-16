import React from 'react';
import Square from './Square'
import "../css/computerField.css"
import "../css/index.css"

class ComputerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            computerField: [],
            direction: 0,
            shotInfo: '',
        };

        this.updateComputerField = this.updateComputerField.bind(this);
        this.makePlayerShot = this.makePlayerShot.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {

        if (nextProps.computerField !== this.state.computerField){
            this.setState(
                () => {
                    return {
                        computerField: this.props.computerField,
                    };
                });

            return true;
        }

        return false;

    }

    makePlayerShot(id) {
        const query = '?id=' + id;
        var computerSquare;

        this.myFetch('computerField/playerShot' + query)
            .then(text => {
                try {
                    computerSquare = JSON.parse(text);
                    this.updateComputerField(new Array(computerSquare));

                    if (computerSquare.shipNumber === -1){
                        this.setState(
                            () => {
                                return {
                                    isPlayerTurn: false,
                                };
                            });
                    }

                } catch (ex) {

                }
            });
    }

    updateComputerField(squares) {

        if (squares === null) {
            return;
        }

        const field = this.state.computerField;

        for (var i = 0; i < squares.length; i++) {
            var square = squares[i];

            field[square.id] = {
                id: square.id,
                isClicked: square.isClicked,
                shipNumber: square.shipNumber,
            };
        }

        this.setState(
            () => {
                return {
                    computerField: field,
                };
            }, () => sessionStorage.setItem('computerField', JSON.stringify(field)));
    }

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
            <div className="computerField">
                {
                    this.state.computerField.map((square) => {
                        return (
                            <Square
                                id={square.id}
                                key={square.id}
                                className="computerSquare"
                                shipNumber={square.shipNumber}
                                isClicked={square.isClicked}
                                onClick={() => this.makePlayerShot(square.id)}
                            />
                        )
                    })}
            </div>
        )
    }
}

export default ComputerField;