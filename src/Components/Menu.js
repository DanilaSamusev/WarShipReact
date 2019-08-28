import React from "react"
import {BrowserRouter, Route, Link} from "react-router-dom";
import Preview from "./Preview";
import {Constant} from "../Constant";

const Info = () => (
    <div>
        <h2>Coming soon...</h2>
    </div>
);

const SinglePlayer = () => (
    <Preview gameType={Constant.single_player}/>
);

const MultiPlayer = () => (
    <Preview gameType={Constant.multi_player}/>
);

export default class Menu extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <div>
                    <nav>
                        <Link to={'/'}>Rates</Link>
                        <Link to={Constant.single_player}>Single player</Link>
                        <Link to={Constant.multi_player}>Multi player</Link>
                        <div className='line'/>
                    </nav>

                    <hr/>

                    <Route exact path='/' component={Info}/>
                    <Route exact path={'/' + Constant.single_player} component={SinglePlayer}/>
                    <Route exact path={'/' + Constant.multi_player} component={MultiPlayer}/>
                </div>
            </BrowserRouter>
        )
    }
}

