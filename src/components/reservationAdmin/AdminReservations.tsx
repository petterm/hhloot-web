import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayer } from '../../api';
import { AdminReservationsEntry, getReservations } from '../../api/reservations';
import { Instance, Player } from '../../types';
import AdminReservationsList from './AdminReservationsList';
import AdminReservationsPlayer from './AdminReservationsPlayer';

type AdminReservationsProps = {
    instance: Instance,
    loginPlayer: Player,
}

type AdminReservationsParams = {
    playerName?: string,
    entryId?: string,
}

const localStorageSet = (key: string, value: boolean) => {
    if (value) {
        localStorage.setItem(key, "true");
    } else {
        localStorage.removeItem(key);
    }
}

const AdminReservations: React.FunctionComponent<AdminReservationsProps> = ({ instance, loginPlayer }) => {
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<Error>();
    const [reservations, setReservations] = useState<AdminReservationsEntry[]>([]);

    
    const [showAll, setShowAllInner] = useState(localStorage.getItem('reservationsShowAll') ? true : false);
    const setShowAll = (value: boolean) => {
        setShowAllInner(value);
        localStorageSet('reservationsShowAll', value);
    }

    const { playerName, entryId: entryIdRaw } = useParams<AdminReservationsParams>();
    const entryId: number | undefined = entryIdRaw ? parseInt(entryIdRaw) : undefined;
    let player: Player | undefined;
    if (playerName) {
        try {
            player = getPlayer(formatName(playerName));
        } catch (error) {
            console.warn('Admin reservations for unknown player', playerName);
        }
    }

    useEffect(() => {
        setIsFetching(true);
        getReservations(false, instance, player, showAll)
            .then(entries => {
                setReservations(entries);
                setIsFetching(false);
            })
            .catch(error => {
                setError(error);
                setIsFetching(false);
            })
    }, [instance, player, showAll]);

    if (isFetching) {
        return (<p>Loading..</p>);
    }

    if (error) {
        return (
            <div>
                <p>Error fetching</p>
                <pre>{error.message}</pre>
            </div>
        )
    }

    if (playerName) {
        return (
            <div>
                <AdminReservationsPlayer
                    approverPlayer={loginPlayer}
                    player={player}
                    playerName={playerName}
                    entryId={entryId}
                    entries={reservations}
                    instance={instance}
                />
            </div>
        );
    }

    return (
        <div>
            <AdminReservationsList entries={reservations} showAll={showAll} setShowAll={setShowAll} />
        </div>
    );
}

export const formatName = (name: string) => name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();

export default AdminReservations;
