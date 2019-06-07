import React from 'react';
import "./index.css"
import Square from "./Square";

class PlayerField extends React.Component{

    constructor(props){
        super(props);

        this.state={
            decksOnBoard: 0,
        }
    }



    render(){
        return(
            <div className="playerField">
                {
                    this.props.playerField.map((square) => {
                        return (
                            <Square key={square.id}
                                    id={square.id}
                                    isClicked={square.isClicked}
                                    hasShip={square.hasShip}/>
                        )
                    })}
            </div>
        )
    }
}

export default PlayerField;