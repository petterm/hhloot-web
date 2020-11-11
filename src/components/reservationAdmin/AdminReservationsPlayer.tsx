import React from 'react';
import { AdminReservationsEntry } from '../../api/reservations';
import { scoreGroupEdges } from '../../constants';
import { Item, Player, PlayerItemEntry } from '../../types';
import ItemLink from '../ItemLink';
import PlayerName from '../PlayerName';
import style from './AdminReservationsPlayer.module.css';

type AdminReservationsPlayerProps = {
    player: Player,
    entries: AdminReservationsEntry[],
}

const scoreRowClass = (row: PlayerItemEntry) => scoreGroupEdges.includes(row.score) ? style.scoreRowEdge : '';

const AdminReservationsPlayer: React.FunctionComponent<AdminReservationsPlayerProps> = ({ player, entries }) => {
    const lastSubmission: AdminReservationsEntry = entries.slice(-1)[0];
    const historicSubmissions: AdminReservationsEntry[] = entries.slice(0, -1);
    const onApprove = () => {
        console.log('Approve entry with id:', lastSubmission.id);
    }

    return (
        <div className={style.wrap}>
            <h1>
                <PlayerName player={player} />
            </h1>
            <table className={style.mainTable}>
                <thead>
                    <tr>
                        <th className={style.headerCell}>
                            Score
                        </th>
                        <th className={style.headerCell}>
                            Current list
                        </th>
                        {!lastSubmission.approved && (
                            <>
                                <th className={style.headerCell}></th>
                                <th className={style.headerCell}>
                                    New submission
                                </th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {player.scoreSlots.map((entry: PlayerItemEntry, index: number) => (
                        <tr key={entry.score} className={[
                            style.row,
                            scoreRowClass(entry),
                            !lastSubmission.approved && entry.item === lastSubmission.slots[index] ?
                                style.rowUnchanged : '',
                        ].join(' ')}>
                            <td className={entry.received ? style.cellReceived : style.cell}>
                                {entry.score}
                            </td>
                            <td className={style.cellItem}>
                                {entry.item ? (
                                    <>
                                        <ItemLink item={entry.item} size='small' />
                                        {entry.received && (
                                            <span className={style.receivedDate}>({entry.received})</span>
                                        )}
                                    </>
                                ) : (
                                    <span>--</span>
                                )}
                            </td>
                            {!lastSubmission.approved && (
                            <>
                                <td className={style.cell}>
                                    {'>'}
                                </td>
                                <td className={style.cellItem}>
                                    {lastSubmission.slots[index] ? (
                                        <ItemLink item={lastSubmission.slots[index] as Item} size='small' />
                                    ) : (
                                        <span>--</span>
                                    )}
                                </td>
                            </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            {!lastSubmission.approved && (
                <div className={style.approveWrap}>
                    <button className={style.approve} onClick={onApprove}>
                        Approve new list
                    </button>
                </div>
            )}

            {historicSubmissions.length > 0 && (
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th className={style.headerCell}>
                                Historic submissions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {historicSubmissions.map((entry) => (
                            <tr key={entry.id} className={style.row}>
                                <td className={style.cell}>
                                    {entry.instance}
                                </td>
                                <td className={style.cell}>
                                    {entry.submitted}
                                </td>
                                <td className={style.cell}>
                                    {entry.slots.length}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default AdminReservationsPlayer;
