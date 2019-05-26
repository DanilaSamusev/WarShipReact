import React from 'react';

class Square extends React.Component{
    constructor(props){
        super(props);

        this.state ={
            style: {backgroundColor: 'white'},
        }


    }

    componentDidMount(){
        if (this.props.isClicked === true)
        {
            this.setState({style : {backgroundColor: 'blue'}})
        }
    }

    render(){
        return(
            <div style={this.state.style}>0</div>
        )
    }
}

export default Square