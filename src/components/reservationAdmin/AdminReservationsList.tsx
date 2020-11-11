import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { getPlayer } from '../../api';
import { AdminReservationsEntry } from '../../api/reservations';
import PlayerName from '../PlayerName';
import style from './AdminReservationsList.module.css';

type AdminReservationsListProps = {
    entries: AdminReservationsEntry[],
}

const AdminReservationsList: React.FunctionComponent<AdminReservationsListProps> = ({ entries }) => {
    const match = useRouteMatch();
    const playerLists: { [player: string]: AdminReservationsEntry[] } = {};
    const approved: AdminReservationsEntry[] = [];
    const newSubmissions: AdminReservationsEntry[] = [];

    for (const row of entries) {
        if (!(row.name in playerLists)) playerLists[row.name] = [];
        playerLists[row.name].push(row);
    }

    const playerNames = Object.keys(playerLists);
    playerNames.sort((a: string, b:string) => a.localeCompare(b));

    for (const playerName of playerNames) {
        const lastRow = playerLists[playerName][playerLists[playerName].length - 1];
        if (lastRow.approved) {
            approved.push(lastRow);
        } else {
            newSubmissions.push(lastRow);
        }
    }

    return (
        <div className={style.wrap}>
            <div className={style.secton}>
                <h3 className={style.sectionHeader}>
                    New submissions:
                </h3>
                {newSubmissions.map(entry => (
                    <div key={entry.id} className={style.entry}>
                        <Link to={`${match.url}/${entry.name}`} style={{ textDecoration: 'none' }}>
                            <PlayerName player={getPlayer(entry.name)} />
                        </Link>
                        {', '}
                        {entry.instance}
                        {', '}
                        {entry.submitted}
                        {', '}
                        {entry.slots.length}
                    </div>
                ))}
                {newSubmissions.length === 0 && (
                    <div className={[style.entry, style.entryEmpty].join(' ')}>
                        No new submissions! :)
                    </div>
                )}
            </div>
            <div className={style.secton}>
                <h3 className={style.sectionHeader}>
                    Approved:
                </h3>
                {approved.map(entry => (
                    <div key={entry.id} className={style.entry}>
                        <Link to={`${match.url}/${entry.name}`} style={{ textDecoration: 'none' }}>
                            <PlayerName player={getPlayer(entry.name)} />
                        </Link>
                        {', '}
                        {entry.instance}
                        {', '}
                        {entry.submitted}
                        {', '}
                        {entry.slots.length}
                    </div>
                ))}
                {approved.length === 0 && (
                    <div className={[style.entry, style.entryEmpty].join(' ')}>
                        No approved submissions! :(
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminReservationsList;
