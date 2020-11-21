import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Link, Switch, Route } from 'react-router-dom';
import { fetchData, getPlayers } from './api/async';
import { prepareData } from './api';
import PlayerList from './components/PlayerList';
import PlayerDetails from './components/PlayerDetails';
import BossList from './components/BossList';
import ReservationsStart from './components/reservation/ReservationsStart';
import { getBosses } from './api/loot';
import { Instance } from './types';
import './App.css';
import AdminReservations from './components/reservationAdmin/AdminReservations';
import InvalidPlayerHandler from './components/InvalidPlayerHandler';

function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error>();
    const instance: Instance = 'aq40';

    useEffect(() => {
        fetchData()
            .then(() => prepareData())
            .then(() => setIsLoaded(true))
            .catch((error) => {
                setError(error);
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
                        {" - "}
                        <Link to="/reservations">Update reservations</Link>
                        {" - "}
                        <Link to="/reservations/admin">Admin</Link>
                        <Switch>
                            <Route exact path="/">
                                <BossList bosses={Object.values(getBosses(instance))} />
                            </Route>
                            <Route exact path="/players">
                                <PlayerList players={Object.values(getPlayers())} />
                            </Route>
                            <Route path="/players/:playerName">
                                <InvalidPlayerHandler path="/players" >
                                    <PlayerDetails instance={instance} />
                                </InvalidPlayerHandler>
                            </Route>
                            <Route path={"/reservations/admin/:playerName?"}>
                                <AdminReservations instance={instance} />
                            </Route>
                            <Route path="/reservations">
                                <ReservationsStart />
                            </Route>
                        </Switch>
                    </>
                ) : error ? (
                    <>
                        <p>Error fetching data!</p>
                        <pre>{error.message}</pre>
                    </>
                ) :(
                    <p>Loading..</p>
                )}
            </div>
        </Router>
    );
}

export default App;
