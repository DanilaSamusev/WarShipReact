import Field from "./Field"
import React from 'react';
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

        }
    }

    render() {
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
}

function CreateBoard(props) {


}


export default Board;