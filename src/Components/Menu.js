import React from "react"
import {BrowserRouter, Route, Link} from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory"
import Game from "./Game";

const history = createBrowserHistory();

const Home = () => (
    <div>
        <h2>Coming soon...</h2>
    </div>
);

const About = () => (
    <Game/>
);

const Contacts = () => (
    <div>
        <h2>Coming soon...</h2>
    </div>
);

export default class Menu extends React.Component {

    render() {
        return(
            <BrowserRouter history={history}>
                <div>
                    <ul>
                        <li><Link to={"/"}>Rates</Link></li>
                        <li><Link to={"/about"}>Single player</Link></li>
                        <li><Link to={"/contacts"}>Multiplayer</Link></li>
                    </ul>

                    <hr/>

                    <Route exact path="/" component={Home}/>
                    <Route exact path="/about" component={About}/>
                    <Route exact path="/contacts" component={Contacts}/>
                </div>
            </BrowserRouter>
        )
    }
}

