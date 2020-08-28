import React from 'react';
import { HashRouter as Router, Link, Switch, Route } from 'react-router-dom';
import './App.css';
import PlayerList from './components/PlayerList';
import { getPlayers, getBosses } from './api';
import PlayerDetails from './components/PlayerDetails';
import BossList from './components/BossList';

function App() {
    return (
        <Router>
            <div className="App">
                <Link to="/">Bosses</Link>
                {" - "}
                <Link to="/players">Players</Link>
                <Switch>
                    <Route exact path="/">
                        <BossList bosses={Object.values(getBosses())} />
                    </Route>
                    <Route exact path="/players">
                        <PlayerList players={Object.values(getPlayers())} />
                    </Route>
                    <Route path="/players/:playerName">
                        <PlayerDetails />
                    </Route>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
