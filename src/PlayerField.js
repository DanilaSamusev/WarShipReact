import React from 'react';
import "./index.css"
import Square from "./Square";

class PlayerField extends React.Component{

    constructor(props){
        super(props);


    }

    render(){
        return(
            <div className="playerField">
                {
                    this.props.playerField.map((square) => {
                        return (
                            <Square key={square.id}
                                    id={square.id}
                                    onMouseOver={() => this.props.handleMouseOver(square.id)}
                                    onMouseOut={() => this.props.handleMouseOver(square.id)}
                                    onClick={() => this.props.handlePlayerFieldClick(square.id)}
                                    isClicked={square.isClicked}
                                    isChecked={square.isChecked}
                                    hasShip={square.hasShip}/>
                        )
                    })}
            </div>
        )
    }
}

export default PlayerField;