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
                            <Square key={square.id}
                                    onClick={() => this.props.handlePlayerShot(square.id, square.isClicked)}
                                    id={square.id}
                                    isClicked={square.isClicked}
                                    hasShip={square.hasShip}/>
                        )
                    })}
            </div>
        )
    }
}

export default ComputerField;