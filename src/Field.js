import React from 'react';
import "./index.css"

class Field extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            condition : "default",
            style: '',
        }

    }

    render() {
        const style = { backgroundColor: this.state.style };

        return (
            <button
                className="field"
                style={ style }
                onClick={() => this.handleClick()}
            >

            </button>
        )
    }

    handleClick() {

        if (this.state.condition == "default"){
            this.setState({condition : "empty"});
            this.setState({ style: 'blue' });
        }
    }
}

export default Field;