import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Link, Switch, Route } from 'react-router-dom';
import { fetchData, getPlayers } from './api/async';
import { getBosses, prepareData } from './api';
import PlayerList from './components/PlayerList';
import PlayerDetails from './components/PlayerDetails';
import BossList from './components/BossList';
import ReservationsStart from './components/reservation/ReservationsStart';
import './App.css';

function App() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        fetchData()
            .then(prepareData)
            .then(
                () => setIsLoaded(true),
                (error: Error) => {
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
                                <ReservationsStart />
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
