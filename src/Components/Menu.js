import React from "react"
import {BrowserRouter, Route, Link} from "react-router-dom";
import Game from "./Game";


const Info = () => (
    <div>
        <h2>Coming soon...</h2>
    </div>
);

const SinglePlayer = () => (
    <Game gameType='single'/>
);

const MultiPlayer = () => (
    <Game gameType='multi'/>
);

export default class Menu extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <div>
                    <nav>
                        <Link to={"/"}>Rates</Link>
                        <Link to={"/singlePlayer"}>Single player</Link>
                        <Link to={"/multiPlayer"}>Multi player</Link>
                        <div className='line'/>
                    </nav>

                    <hr/>

                    <Route exact path="/" component={Info}/>
                    <Route exact path="/singlePlayer" component={SinglePlayer}/>
                    <Route exact path="/multiPlayer" component={MultiPlayer}/>
                </div>
            </BrowserRouter>
        )
    }
}

