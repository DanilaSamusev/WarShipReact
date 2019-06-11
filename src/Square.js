import React from 'react';

class Square extends React.Component {

    render() {
        var style = {backgroundColor: 'white'};

        if (this.props.isClicked === true) {

            if (this.props.hasShip === true) {
                style = {backgroundColor: 'red'}
            }
            else {
                style = {backgroundColor: 'blue'}
            }
        }

        if (this.props.isChecked === true) {
            style = {backgroundColor: 'grey'};
        }

        if (this.props.hasShip === true) {
            style = {backgroundColor: 'yellow'}
        }

        return (
            <div
                className="square"
                style={style}
                onClick={this.props.onClick}
                onMouseOut={this.props.onMouseOut}
                onMouseOver={this.props.onMouseOver}
            ></div>
        )
    }
}

export default Square