import React from 'react';
import "./index.css"

class Field extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            ship : null,
            condition: "default",
            style: '',
        }

    }

    render() {
        const style = {backgroundColor: this.state.style};

        if (this.state.condition === "default" || this.state.condition === "empty") {
            return (
                <button
                    className="field"
                    style={style}
                    onClick={() => this.handleClick()}
                >

                </button>
            )
        }

        if (this.state.condition === "ship") {
            return (
                <button
                    className="ship"
                    style={style}
                    onClick={() => this.handleClick()}
                >

                </button>
            )
        }


    }

    handleClick() {

        if (this.state.condition === "default") {
            this.setState({condition: "empty"});
            this.setState({style: 'blue'});
        }

        if (this.state.condition === "ship"){
            this.setState({condition: "KIA"});
            this.setState({style: 'red'});
        }
    }
}

export default Field;