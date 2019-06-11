import React from 'react';
import Square from './Square'
import "./index.css"

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
                                hasShip={square.hasShip}
                                isClicked={square.isClicked}
                                onClick={() => this.props.handlePlayerShot(square.id, square.isClicked)}
                            />
                        )
                    })}
            </div>
        )
    }
}

export default ComputerField;