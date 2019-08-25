import React from 'react';
import "../css/console.css"

export default class Console extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (

            <div className='console'>
                <textarea value={this.props.events}>

                </textarea>
            </div>
        )
    }
}