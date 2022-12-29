import moment from 'moment';
import React from 'react';
import { Link } from 'react-router-dom';
import { AdminReservationsEntry } from '../../api/reservations';
import PlayerName from '../PlayerName';
import style from './AdminReservationsList.module.css';

type AdminReservationsListProps = {
    entries: AdminReservationsEntry[],
    showAll: boolean,
    setShowAll: (value: boolean) => void,
}

const age = (timestamp: string) =>
    moment.duration(moment(timestamp).diff(moment())).humanize(true);

const playerName = (entry: AdminReservationsEntry) =>
    typeof(entry.player) === 'object' ? entry.player.name : entry.player;

const AdminReservationsList: React.FunctionComponent<AdminReservationsListProps> = ({ entries, showAll, setShowAll }) => {
    const playerLists: { [player: string]: AdminReservationsEntry[] } = {};
    const approved: AdminReservationsEntry[] = [];
    const newSubmissions: AdminReservationsEntry[] = [];

    for (const row of entries) {
        const name = playerName(row);
        if (!(name in playerLists)) playerLists[name] = [];
        playerLists[name].push(row);
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
            <label style={{ cursor: "pointer" }}>
                    <input
                        type='checkbox'
                        style={{ marginRight: 5, cursor: "pointer" }}
                        checked={showAll}
                        onChange={() => setShowAll(!showAll)}
                    />
                    Show non-members
                </label>
            </div>
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
                                    <Link to={playerName(entry)} style={{ textDecoration: 'none' }}>
                                        {typeof(entry.player) === 'object' ? (
                                            <PlayerName player={entry.player} />
                                        ) : (
                                            <span className={style.oldPlayer}>{entry.player}</span>
                                        )}
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
                                    <Link to={playerName(entry)} style={{ textDecoration: 'none' }}>
                                        {typeof(entry.player) === 'object' ? (
                                            <PlayerName player={entry.player} />
                                        ) : (
                                            <span className={style.oldPlayer}>{entry.player}</span>
                                        )}
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
