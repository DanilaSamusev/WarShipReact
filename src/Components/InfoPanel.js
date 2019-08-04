import React from 'react';
import "../css/infoPanel.css"

class InfoPanel extends React.Component {

    render() {

        var style;

        if (sessionStorage.getItem('isPlayerTurn')){
            style = {display : 'none'};
        }

        return(
            <div className="infoPanel">
                <input className="info" value={this.props.shotInfo}/>
                <button style={style} className="nextButton" onClick={this.props.onClick}>Next</button>
            </div>
        )
    }

}

export default InfoPanel