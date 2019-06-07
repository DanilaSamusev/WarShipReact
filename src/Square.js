import React from 'react';

class Square extends React.Component {

    render() {
        var style = {backgroundColor: 'white'};

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

        if (this.props.isChecked === true){
            style = {backgroundColor: 'grey'};
        }

        return (
            <div onClick={this.props.onClick}
                 className="square"
                 style={style}
                 onMouseOver={this.props.onMouseOver}
                 onMouseOut={this.props.onMouseOver}
            ></div>
        )
    }
}

export default Square