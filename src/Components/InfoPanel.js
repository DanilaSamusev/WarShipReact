import React from 'react';
import "../css/infoPanel.css"

class InfoPanel extends React.Component {

    render() {

        var style;

        if (this.props.isPlayerTurn){
            style = {display : 'none'};
        }

        return(
            <div className="infoPanel">
                <input className="info" value={this.props.shotInfo}></input>
                <button style={style} className="nextButton" onClick={this.props.onClick}>Next</button>
            </div>
        )
    }

}

export default InfoPanel