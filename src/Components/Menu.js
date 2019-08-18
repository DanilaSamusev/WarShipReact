import React from "react"
import {BrowserRouter, Route, Link} from "react-router-dom";
import Game from "./Game";


const Info = () => (
    <div>
        <h2>Coming soon...</h2>
    </div>
);

const SinglePlayer = () => (
    <Game className='singlePlayer'/>
);

const MultiPlayer = () => (
    <Game className='multiPlayer'/>
);

export default class Menu extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <div>
                    <nav>
                        <a><Link to={"/"}>Rates</Link></a>
                        <a><Link to={"/singlePlayer"}>Single player</Link></a>
                        <a><Link to={"/multiPlayer"}>Multi player</Link></a>
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

