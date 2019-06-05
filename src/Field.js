import React from 'react';
import Square from './Square'
import "./index.css"

class Field extends React.Component {

    render() {
        return (
            <div className="field">
                {
                    this.props.field.map((square) => {
                        return (
                            <Square key={square.id}
                                    onClick={() => this.props.handlePlayerClick(square.id, square.isClicked)}
                                    id={square.id}
                                    isClicked={square.isClicked}
                                    hasShip={square.hasShip}/>

                        )
                    })}
            </div>
        )
    }
}

export default Field;