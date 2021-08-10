import { faCheck, faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getInstanceData } from '../../api';
import { AdminReservationsEntry, approveReservation } from '../../api/reservations';
import { Instance, InstanceData, Item, ItemScore, Player } from '../../types';
import Button from '../Button';
import ItemLink from '../ItemLink';
import PlayerName from '../PlayerName';
import style from './AdminReservationsPlayer.module.css';

type AdminReservationsPlayerProps = {
    approverPlayer: Player,
    entries: AdminReservationsEntry[],
    instance: Instance,
    playerName: string,
    player?: Player,
    entryId?: number,
}

const scoreRowClass = (instanceData: InstanceData, score: ItemScore) => instanceData.scoreGroupEdges.includes(score) ? style.scoreRowEdge : '';

const playerCurrentEntry = (index: number, player?: Player) => {
    if (!player) return null;
    const entry = player.scoreSlots[index];
    return (
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
    )
} 

const AdminReservationsPlayer: React.FunctionComponent<AdminReservationsPlayerProps> = ({
    approverPlayer, player, playerName, entryId, entries, instance
}) => {
    const [approved, setApproved] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState<Error>();
    const instanceData = getInstanceData(instance);

    const onApprove = () => {
        if (!fetching && !approved && approverPlayer) {
            setFetching(true);
            setError(undefined);
            approveReservation(currentEntry.id, approverPlayer)
                .then(() => {
                    setFetching(false);
                    setApproved(true);
                })
                .catch(e => {
                    setFetching(false);
                    setError(e);
                });
        }
    }

    const allSubmissions: AdminReservationsEntry[] = entries.slice(0);
    allSubmissions.reverse(); // Show new entries first

    let currentEntry: AdminReservationsEntry = entries.slice(-1)[0];
    if (entryId) {
        currentEntry = entries.find(entry => entry.id === entryId) || currentEntry;
    }

    const showPlayerCurrentList: boolean = !!player;
    const enableSubmissionApprove: boolean = !!(
        player && (!entryId || entryId === allSubmissions[0].id) && !currentEntry.approved
    );
    // const enableSubmissionApprove: boolean = !!(
    //     !player ||
    //     (!entryId && !currentEntry.approved) ||
    //     (entryId && (entryId !== allSubmissions[0].id || !currentEntry.approved))
    // );

    return (
        <div className={style.wrap}>
            <h1>
                {player ? (
                    <PlayerName player={player} />
                ) : (
                    <span className={style.oldPlayerTitle}>
                        {playerName}
                    </span>
                )}
            </h1>
            <table className={style.mainTable}>
                <thead>
                    <tr>
                        <th className={style.headerCell}>
                            Score
                        </th>
                        {showPlayerCurrentList && (
                            <th className={style.headerCell}>
                                Current list
                            </th>
                        )}
                        {showPlayerCurrentList && (
                            <th className={style.headerCell}></th>
                        )}
                        {(
                            <th className={style.headerCell}>
                                Submission {currentEntry.id} ({currentEntry.submitted})
                            </th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {instanceData.itemScores.map((score: ItemScore, index: number) => (
                        <tr key={score} className={[
                            style.row,
                            scoreRowClass(instanceData, score),
                            showPlayerCurrentList && player?.scoreSlots[index].item === currentEntry.slots[index] ?
                                style.rowUnchanged : '',
                        ].join(' ')}>
                            <td className={player && player.scoreSlots[index].received ? style.cellReceived : style.cell}>
                                {score}
                            </td>
                            {showPlayerCurrentList && playerCurrentEntry(index, player)}
                            {showPlayerCurrentList && (
                                <td className={style.cell}>
                                    <FontAwesomeIcon icon={faLongArrowAltRight} />
                                </td>
                            )}
                            {(
                                <td className={style.cellItem}>
                                    {currentEntry.slots[index] ? (
                                        <ItemLink item={currentEntry.slots[index] as Item} size='small' />
                                    ) : (
                                        <div className={style.cellItemEmpty}>
                                            <span className={style.cellItemEmptyIcon}></span>
                                            <span className={style.cellItemEmptyText}>(Empty)</span>
                                        </div>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className={style.approveWrap}>
                <div className={style.selectApprover}>
                    Approving as <PlayerName player={approverPlayer} />
                </div>
                {approverPlayer && (
                    <>
                    {fetching ? (
                        <div className={style.approving}>Approving..</div>
                    ) : approved ? (
                        <div className={style.approved}>
                            <FontAwesomeIcon icon={faCheck} /> Approved!
                        </div>
                    ) : (
                        <>
                            <Button onClick={onApprove} disabled={!(showPlayerCurrentList && enableSubmissionApprove)}>
                                Approve list
                            </Button>
                            {!!error && (
                                <div className={style.errorWrap}>
                                    <p className={style.errorTitle}>Error approving:</p>
                                    <pre className={style.errorMessage}>{error.message}</pre>
                                </div>
                            )}
                        </>
                    )}
                    </>
                )}
            </div>

            {allSubmissions.length > 0 && (
                <>
                    <h3 className={style.historicHeader}>
                        Historic submissions
                    </h3>
                    <table className={[style.table, style.historicTable].join(' ')}>
                        <thead>
                            <tr>
                                <th>
                                    ID
                                </th>
                                <th>
                                    Submitted
                                </th>
                                <th>
                                    Instance
                                </th>
                                <th>
                                    Approved by
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {allSubmissions.map((entry, index) => (
                                <tr key={entry.id} className={
                                    (entryId && entry.id === entryId) ||
                                    (!entryId && !index)
                                    ? style.selectedEntry : ''
                                }>
                                    <td>
                                        <Link to={`/reservations/admin/${playerName}/${entry.id}`} >{entry.id}</Link>
                                    </td>
                                    <td>
                                        {entry.submitted}
                                    </td>
                                    <td>
                                        {entry.instance}
                                    </td>
                                    {entry.approvedBy ? (
                                        <td>
                                            {entry.approvedBy}
                                        </td>
                                    ) : (
                                        <td></td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default AdminReservationsPlayer;
