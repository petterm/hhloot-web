import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Link, Routes, Route, Navigate } from 'react-router-dom';
import { checkLogin, fetchData, getPlayers, getRaids } from './api/async';
import { getInstanceData, getPlayer, prepareData } from './api';
import PlayerList from './components/PlayerList';
import PlayerDetails from './components/PlayerDetails';
import BossList from './components/BossList';
import RaidList from './components/RaidList';
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

    let instance: Instance = 'wotlk4';

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
        let loginPlayerName: PlayerName | undefined = undefined;
        checkLogin()
            .then((playerName: PlayerName | undefined) => {
                loginPlayerName = playerName;
            })
            // TEMPORARY skip reservations unless logged in as admin until all members have made lists
            .then(() => fetchData(instance, false)) // instance === 'tbc3' && !!loginPlayerName))
            .then(() => prepareData())
            .then(() => setIsLoaded(true))
            .catch((error) => {
                setError(error);
                console.error(error);
            })
            .then(() => {
                try {
                    if (loginPlayerName) {
                        setLoginPlayer(getPlayer(loginPlayerName));
                    } else {
                        setLoginPlayer(undefined);
                    }
                } catch (error) {
                    setLoginPlayer(undefined);
                    console.error(error);
                }
            })
    }, [instance, instanceData]);

    return (
        <Router>
            <div className="App">
                {isLoaded ? (
                    <>
                        <header>
                            {instanceData.image && (
                                <img className="headerImage" src={`./${instanceData.image}`} alt={instanceData.name} />
                            )}
                            <h2 className="headerTitle">{instanceData.name}</h2>
                            <a href="/">Held Hostile</a>
                            {" - "}
                            <Link to="/">Bosses</Link>
                            {" - "}
                            <Link to="players">Players</Link>
                            {" - "}
                            <Link to="raids">Raids</Link>
                            {" - "}
                            <Link to="reservations">Update reservations</Link>
                            {loginPlayer === undefined ? (
                                <>
                                    <span style={{ color: '#555' }}>{" - "}</span>
                                    <a href={`/Identity/Account/Login?ReturnUrl=%2F${instance}`} style={{ color: '#555' }}>Login</a>
                                </>
                            ) : (
                                <>
                                    {" - "}
                                    <Link to="reservations/admin">Admin</Link>
                                </>
                            )}
                        </header>
                        <Routes>
                            <Route path="/" element={
                                <BossList bosses={Object.values(getBosses(instance))} instance={instance} />
                            }/>
                            <Route path="players" element={
                                <PlayerList instance={instance} players={Object.values(getPlayers())} />
                            }/>
                            <Route path="players/:playerName" element={
                                <InvalidPlayerHandler path="/players" >
                                    <PlayerDetails instance={instance} />
                                </InvalidPlayerHandler>
                            }/>
                            <Route path="raids" element={
                                <RaidList raids={getRaids()} />
                            } />
                            <Route path="reservations/admin/:playerName?/:entryId?" element={
                                loginPlayer ? (
                                    <AdminReservations instance={instance} loginPlayer={loginPlayer} />
                                ) : (
                                    <Navigate to={"/"} />
                                )}/>
                            <Route path="reservations/*" element={
                                <ReservationsStart instance={instance} loginPlayer={loginPlayer} />
                            }/>
                        </Routes>
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
