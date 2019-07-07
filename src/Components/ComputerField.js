import React from 'react';
import Square from './Square'
import "../css/computerField.css"
import "../css/index.css"

class ComputerField extends React.Component {

    render() {
        return (
            <div className="computerField">
                {
                    this.props.computerField.map((square) => {
                        return (
                            <Square
                                id={square.id}
                                key={square.id}
                                className="computerSquare"
                                shipNumber={square.shipNumber}
                                isClicked={square.isClicked}
                                onClick={() => this.props.onClick(square.id)}
                            />
                        )
                    })}
            </div>
        )
    }
}

export default ComputerField;