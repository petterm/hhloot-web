import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Link, Switch, Route, Redirect } from 'react-router-dom';
import { checkLogin, fetchData, getPlayers } from './api/async';
import { getInstanceData, getPlayer, prepareData } from './api';
import PlayerList from './components/PlayerList';
import PlayerDetails from './components/PlayerDetails';
import BossList from './components/BossList';
import ReservationsStart from './components/reservation/ReservationsStart';
import { getBosses } from './api/loot';
import { Instance, Player, PlayerName } from './types';
import './App.css';
import AdminReservations from './components/reservationAdmin/AdminReservations';
import InvalidPlayerHandler from './components/InvalidPlayerHandler';
import { instances } from './constants';

function App() {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<Error>();
    const [loginPlayer, setLoginPlayer] = useState<Player | undefined>();

    let instance: Instance = 'tbc2';

    const pathParts = window.location.pathname.split('/');
    const path = pathParts[pathParts.length - 1];
    if (instances.includes(path as Instance)) {
        instance = path as Instance;
    } else {
        console.warn('Path is not a valid instance', path, instances);
    }

    const instanceData = getInstanceData(instance);

    useEffect(() => {
        document.title = `HH ${instanceData.name}`;
        fetchData(instance)
            .then(() => prepareData())
            .then(() => setIsLoaded(true))
            .catch((error) => {
                setError(error);
                console.error(error);
            })
            .then(() => checkLogin().then((playerName: PlayerName | undefined) => {
                try {
                    if (playerName) {
                        setLoginPlayer(getPlayer(playerName));
                    } else {
                        setLoginPlayer(undefined);
                    }
                } catch (error) {
                    setLoginPlayer(undefined);
                }
            }))
    }, [instance, instanceData]);

    return (
        <Router>
            <div className="App">
                {isLoaded ? (
                    <>
                        <header>
                            <img className="headerImage" src={`./${instanceData.image}`} alt={instanceData.name} />
                            <h2 className="headerTitle">{instanceData.name}</h2>
                            <a href="/">Held Hostile</a>
                            {" - "}
                            <Link to="/">Bosses</Link>
                            {" - "}
                            <Link to="/players">Players</Link>
                            {" - "}
                            <Link to="/reservations">Update reservations</Link>
                            {loginPlayer && (
                                <>
                                    {" - "}
                                    <Link to="/reservations/admin">Admin</Link>
                                </>
                            )}
                        </header>
                        <Switch>
                            <Route exact path="/">
                                <BossList bosses={Object.values(getBosses(instance))} instance={instance} />
                            </Route>
                            <Route exact path="/players">
                                <PlayerList instance={instance} players={Object.values(getPlayers())} />
                            </Route>
                            <Route path="/players/:playerName">
                                <InvalidPlayerHandler path="/players" >
                                    <PlayerDetails instance={instance} />
                                </InvalidPlayerHandler>
                            </Route>
                            <Route path={"/reservations/admin/:playerName?/:entryId?"}>
                                {loginPlayer ? (
                                    <AdminReservations instance={instance} loginPlayer={loginPlayer} />
                                ) : (
                                    <Redirect to={"/"} />
                                )}
                            </Route>
                            <Route path="/reservations">
                                <ReservationsStart instance={instance} loginPlayer={loginPlayer} />
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
