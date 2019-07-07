import React from 'react';

class Square extends React.Component {

    render() {
        var style = {backgroundColor: 'white'};

        if (this.props.isChecked === true) {
            style = {backgroundColor: '#dfe0de'};
        }

        if (this.props.shipNumber > -1) {
            style = {backgroundColor: 'grey'};

        }

        if (this.props.isClicked === true) {

            if (this.props.shipNumber > -1) {
                style = {backgroundColor: 'red'}
            } else {
                style = {backgroundColor: 'blue'}
            }
        }

        return (
            <div
                style={style}
                className={this.props.className}
                onClick={this.props.onClick}
                onMouseOver={this.props.onMouseOver}
            />
        )
    }
}

export default Square