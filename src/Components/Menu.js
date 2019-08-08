import React from "react"
import {BrowserRouter, Route, Link} from "react-router-dom";
import Game from "./Game";


const Info = () => (
    <div>
        <h2>Coming soon...</h2>
    </div>
);

const SinglePlayer = () => (
    <Game/>
);

const Multiplayer = () => (
    <div>
        <h2>Coming soon...</h2>
    </div>
);

export default class Menu extends React.Component {

    render() {
        return(
            <BrowserRouter>
                <div>
                    <ul>
                        <li><Link to={"/"}>Rates</Link></li>
                        <li><Link to={"/singlePlayer"}>Single player</Link></li>
                        <li><Link to={"/multiplayer"}>Multiplayer</Link></li>
                    </ul>

                    <hr/>

                    <Route exact path="/" component={Info}/>
                    <Route exact path="/singlePlayer" component={SinglePlayer}/>
                    <Route exact path="/multiplayer" component={Multiplayer}/>
                </div>
            </BrowserRouter>
        )
    }
}

