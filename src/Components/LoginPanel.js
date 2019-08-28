import React from 'react';

export default class LoginPanel extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            playerName: '',
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange(e) {

        let value = e.target.value;
        this.setState({playerName: value});
    }

    onSubmit(){

        this.props.setPlayerName(this.state.playerName);
    }

    render() {

        return (

            <form onSubmit={this.onSubmit}>
                <input type='text' value={this.state.playerName} onChange={this.onChange}
                       placeholder='Inter your name'/>
                <input type='submit' value='Send'/>
            </form>
        )

    }
}