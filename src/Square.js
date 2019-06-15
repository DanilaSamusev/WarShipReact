import React from 'react';

class Square extends React.Component {

    render() {
        var style = {backgroundColor: 'white'};

        if (this.props.isChecked === true) {
            style = {backgroundColor: 'grey'};
        }

        if (this.props.hasShip === true) {
            style = {backgroundColor: 'yellow'}
        }

        if (this.props.isClicked === true) {

            if (this.props.hasShip === true) {
                style = {backgroundColor: 'red'}
            }
            else {
                style = {backgroundColor: 'blue'}
            }
        }

        return (
            <div
                className={this.props.className}
                style={style}
                onDoubleClick={this.props.onDoubleClick}
                onClick={this.props.onClick}
                onMouseOver={this.props.onMouseOver}
            />
        )
    }
}

export default Square