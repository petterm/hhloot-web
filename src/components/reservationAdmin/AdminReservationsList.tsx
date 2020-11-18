import moment from 'moment';
import React from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { AdminReservationsEntry } from '../../api/reservations';
import PlayerName from '../PlayerName';
import style from './AdminReservationsList.module.css';

type AdminReservationsListProps = {
    entries: AdminReservationsEntry[],
}

const age = (timestamp: string) =>
    moment.duration(moment(timestamp).diff(moment())).humanize(true);

const AdminReservationsList: React.FunctionComponent<AdminReservationsListProps> = ({ entries }) => {
    const match = useRouteMatch();
    const playerLists: { [player: string]: AdminReservationsEntry[] } = {};
    const approved: AdminReservationsEntry[] = [];
    const newSubmissions: AdminReservationsEntry[] = [];

    for (const row of entries) {
        if (!(row.player.name in playerLists)) playerLists[row.player.name] = [];
        playerLists[row.player.name].push(row);
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
            <div className={style.section}>
                <h3 className={style.sectionHeader}>
                    New submissions:
                </h3>
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Instance</th>
                            <th>Last updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {newSubmissions.map(entry => (
                            <tr key={entry.id} className={style.entry}>
                                <td>
                                    <Link to={`${match.url}/${entry.player.name}`} style={{ textDecoration: 'none' }}>
                                        <PlayerName player={entry.player} />
                                    </Link>
                                </td>
                                <td>
                                    {entry.instance}
                                </td>
                                <td title={entry.submitted}>
                                    {age(entry.submitted)}
                                </td>
                            </tr>
                        ))}
                        {newSubmissions.length === 0 && (
                            <tr className={[style.entry, style.entryEmpty].join(' ')}>
                                <td colSpan={3}>
                                    No new submissions! :)
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className={style.section}>
                <h3 className={style.sectionHeader}>
                    Approved:
                </h3>
                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Instance</th>
                            <th>Last updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {approved.map(entry => (
                            <tr key={entry.id} className={style.entry}>
                                <td>
                                    <Link to={`${match.url}/${entry.player.name}`} style={{ textDecoration: 'none' }}>
                                        <PlayerName player={entry.player} />
                                    </Link>
                                </td>
                                <td>
                                    {entry.instance}
                                </td>
                                <td title={entry.submitted}>
                                    {age(entry.submitted)}
                                </td>
                            </tr>
                        ))}
                        {approved.length === 0 && (
                            <tr className={[style.entry, style.entryEmpty].join(' ')}>
                                <td colSpan={3}>
                                    No approved submissions! :(
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminReservationsList;
