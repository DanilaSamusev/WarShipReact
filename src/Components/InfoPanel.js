import React from 'react';
import "../css/infoPanel.css"

class InfoPanel extends React.Component {

    render() {
        return(
            <div className="infoPanel">
                <input className="info" value={this.props.shotInfo}></input>
                <button className="nextButton" onClick={this.props.onClick}>Next</button>
            </div>
        )
    }

}

export default InfoPanel