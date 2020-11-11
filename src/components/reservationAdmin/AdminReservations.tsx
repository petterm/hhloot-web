import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPlayer } from '../../api';
import { AdminReservationsEntry, getReservations } from '../../api/reservations';
import { Instance, Player } from '../../types';
import AdminReservationsList from './AdminReservationsList';
import AdminReservationsPlayer from './AdminReservationsPlayer';

type AdminReservationsProps = {
    instance: Instance,
}

type AdminReservationsParams = {
    playerName?: string,
}

const AdminReservations: React.FunctionComponent<AdminReservationsProps> = ({ instance }) => {
    const [isFetching, setIsFetching] = useState(true);
    const [error, setError] = useState<Error>();
    const [reservations, setReservations] = useState<AdminReservationsEntry[]>([]);

    const { playerName } = useParams<AdminReservationsParams>();
    const player: Player | undefined = playerName ? getPlayer(formatName(playerName)) : undefined;

    useEffect(() => {
        setIsFetching(true);
        getReservations(false, instance, player)
            .then(entries => {
                setReservations(entries);
                setIsFetching(false);
            })
            .catch(error => {
                setError(error);
                setIsFetching(false);
            })
    }, [instance, player]);

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

    return (
        <div>
            {player ? (
                <AdminReservationsPlayer player={player} entries={reservations} />
            ) : (
                <AdminReservationsList entries={reservations} />
            )}
        </div>
    );
}

export const formatName = (name: string) => name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();

export default AdminReservations;
