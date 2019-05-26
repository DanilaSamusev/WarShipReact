import React from 'react';

class Square extends React.Component{
    constructor(props){
        super(props);
    }

    componentDidMount(){
        if (this.props.isClicked === true)
        {
            this.setState({style : {backgroundColor: 'blue'}})
        }
    }

    render(){

        var style = {backgroundColor: 'white'};

        if (this.props.isClicked === true)
        {
            style = {backgroundColor: 'blue'}
        }

        return(
            <button onClick={this.props.onClick} className="square" style={style}></button>
        )
    }
}

export default Square