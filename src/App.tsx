import React from 'react';
import { BrowserRouter as Router, Link, Switch, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import PlayerList from './components/PlayerList';
import { getPlayers } from './api';
import PlayerDetails from './components/PlayerDetails';

function App() {
    return (
        <Router>
            <div className="App">
                <Link to="/">Home</Link>
                {" - "}
                <Link to="/players">Players</Link>
                <Switch>
                    <Route exact path="/">
                        <header className="App-header">
                            <img src={logo} className="App-logo" alt="logo" />
                            <p>
                                Edit <code>src/App.tsx</code> and save to reload.
                            </p>
                            <a
                                className="App-link"
                                href="https://reactjs.org"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Learn React
                            </a>
                        </header>
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
