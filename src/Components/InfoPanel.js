import React from 'react';
import "../css/infoPanel.css"

class InfoPanel extends React.Component {

    render() {
        return(
            <div className="infoPanel">
                <p>{this.props.shotInfo}</p>
                <button onClick={this.props.onClick}>Ok</button>
            </div>
        )
    }

}

export default InfoPanel