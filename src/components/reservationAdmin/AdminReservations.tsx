import React, { useEffect, useState } from 'react';
import { AdminReservationsEntry, getReservations } from '../../api/reservations';
import { Instance, Player } from '../../types';

const AdminReservations: React.FunctionComponent = () => {
    const [isFetching, setIsFetching] = useState(true);
    const [reservations, setReservations] = useState<AdminReservationsEntry[]>([]);
    const [error, setError] = useState<Error>();
    const [approved, setApproved] = useState(false);
    const [instance, setInstance] = useState<Instance>('aq40');
    const [player, setPlayer] = useState<Player>();

    useEffect(() => {
        getReservations(approved, instance, player)
            .then(entries => {
                setReservations(entries);
                setIsFetching(false);
            })
            .catch(error => {
                setError(error);
                setIsFetching(false);
            })
    }, [approved, instance, player]);

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
            {reservations.map(entry => (
                <div>
                    {entry.name}, {entry.instance}, {entry.submitted}, {entry.slots.length}
                </div>
            ))}
        </div>
    );
}

export const formatName = (name: string) => name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();

export default AdminReservations;
