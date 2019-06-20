import React from 'react';
import Square from './Square'
import "./computerField.css"
import "./index.css"

class ComputerField extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            computerField: [],
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
                    computerField: data,
                })
            )
    }

    handleClick(id) {

        const query = '?id=' + id;

        fetch('http://localhost:5000/api/computerField' + query,
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
                    this.updateComputerField(json.id, json.isClicked, json.hasShip)
                } catch (ex) {

                }
            });
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
            <div className="computerField">
                {
                    this.state.computerField.map((square) => {
                        return (
                            <Square
                                id={square.id}
                                key={square.id}
                                className="computerSquare"
                                hasShip={square.hasShip}
                                isClicked={square.isClicked}
                                onClick={() => this.handleClick(square.id, square.isClicked)}
                            />
                        )
                    })}
            </div>
        )
    }
}

export default ComputerField;