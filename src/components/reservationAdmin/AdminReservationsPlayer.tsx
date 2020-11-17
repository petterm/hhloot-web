import React, { useState } from 'react';
import { getPlayer } from '../../api';
import { AdminReservationsEntry, approveReservation } from '../../api/reservations';
import { scoreGroupEdges } from '../../constants';
import { Item, Player, PlayerItemEntry } from '../../types';
import Button from '../Button';
import ItemLink from '../ItemLink';
import PlayerName from '../PlayerName';
import style from './AdminReservationsPlayer.module.css';

type AdminReservationsPlayerProps = {
    player: Player,
    entries: AdminReservationsEntry[],
}

const scoreRowClass = (row: PlayerItemEntry) => scoreGroupEdges.includes(row.score) ? style.scoreRowEdge : '';

const AdminReservationsPlayer: React.FunctionComponent<AdminReservationsPlayerProps> = ({ player, entries }) => {
    const [approved, setApproved] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<Error>();

    const onApprove = () => {
        if (!fetching && !approved) {
            setFetching(true);
            setError(undefined);
            approveReservation(lastSubmission.id, getPlayer('Meche'))
                .then(() => {
                    setFetching(false);
                    setApproved(true);
                }).catch(e => {
                    setFetching(false);
                    setError(e);
                });
        }
    }

    const lastSubmission: AdminReservationsEntry = entries.slice(-1)[0];
    const historicSubmissions: AdminReservationsEntry[] = entries.slice(0, -1);

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
                                    <div className={style.cellItemEmpty}>
                                        <span className={style.cellItemEmptyIcon}></span>
                                        <span className={style.cellItemEmptyText}>(Empty)</span>
                                    </div>
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
                                        <div className={style.cellItemEmpty}>
                                            <span className={style.cellItemEmptyIcon}></span>
                                            <span className={style.cellItemEmptyText}>(Empty)</span>
                                        </div>
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
                    {fetching ? (
                        <div className={style.approving}>Approving..</div>
                    ) : approved ? (
                        <div className={style.approved}>Approved!</div>
                    ) : (
                        <>
                            <Button onClick={onApprove}>
                                Approve new list
                            </Button>
                            {!!error && (
                                <div className={style.errorWrap}>
                                    <p className={style.errorTitle}>Error approving:</p>
                                    <pre className={style.errorMessage}>{error.message}</pre>
                                </div>
                            )}
                        </>
                    )}
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
