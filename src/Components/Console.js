import React from 'react';
import "../css/console.css"
import Square from "./Square";

export default class Console extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (

            <div className='console'>
                <textarea value={this.props.data}>

                </textarea>
            </div>
        )
    }
}