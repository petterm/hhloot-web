import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Link, Switch, Route } from 'react-router-dom';
import './App.css';
import PlayerList from './components/PlayerList';
import { getBosses, prepareData } from './api';
import PlayerDetails from './components/PlayerDetails';
import BossList from './components/BossList';
import { fetchData, getPlayers } from './api/async';
import { Reservations } from './components/reservation/Reservations';

type AppState = {
    fetching: boolean,
    done: boolean,
};

function App() {
    // const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetchData()
            .then(() => {
                prepareData();
            })
            .then(() => {
                setIsLoaded(true);
            }, (error) => {
                // setError(error)
                console.error(error);
            })
    }, []);

    return (
        <Router>
            <div className="App">
                {isLoaded ? (
                    <>
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
                            <Route path="/reservations">
                                <Reservations />
                            </Route>
                        </Switch>
                    </>
                ) : (
                    <p>Loading..</p>
                )}
            </div>
        </Router>
    );
}

export default App;
