import Field from "./Field"
import React from 'react';
import Ship from './Ship'
import "./index.css"

class Board extends React.Component {

    constructor(props) {
        super(props);

        var board = new Array(10);
        for (var i=0; i < 10; i++){
            board[i] = new Array(10);
            for (var j = 0; j < 10; j++){
                board[i][j] = <Field />;
            }
        }

        this.state = {
            board: board,
            shipCount : 0,
        }
    }

    render() {

        if (this.state.shipCount === 0){
            this.setShip();
        }

        return (
            <div className="board">
                {
                    this.state.board.map(field => {
                        return <div>{field}</div>
                    })
                }
            </div>
        )
    }

    setShip(){
        var board = this.state.board;
        board[1][1] = <Field condition = {"ship"}/>;
        this.setState({
            board : board
        });
        this.state.shipCount++;
    }

}


export default Board;