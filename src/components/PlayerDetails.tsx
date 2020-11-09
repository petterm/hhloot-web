import React from 'react';
import { Player, PlayerItemEntry, Item, Instance } from '../types'
import { useParams } from 'react-router-dom';
import { getPlayer } from '../api';
import { getFinalScore, getPositionBonus, getItemBonus, getAttendanceBonus,
    getCombinedPlayerAttendanceList, CombinedPlayerAttendance } from '../api/points';
import ItemLink from './ItemLink';
import PlayerName, { formatName } from './PlayerName';
import style from './PlayerDetails.module.css';
import { scoreGroupEdges } from '../constants';
import { getBosses } from '../api/loot';

type PlayerDetailsProps = { instance: Instance };
type PlayerDetailsParams = { playerName: string };

const scoreRowClass = (row: PlayerItemEntry) => scoreGroupEdges.includes(row.score) ? style.scoreRowEdge : '';

const PlayerDetails: React.FunctionComponent<PlayerDetailsProps> = ({ instance }) => {
    const { playerName } = useParams<PlayerDetailsParams>();
    const player: Player = getPlayer(formatName(playerName));

    const freeLoot: Item[] = [];
    Object.values(getBosses(instance)).forEach(
        boss => boss.drops.forEach(
            drop => drop.freeLoot.forEach(name => {
                if (name === playerName) {
                    freeLoot.push(drop.item);
                }
            })
        )
    );

    const attendanceRaids = getCombinedPlayerAttendanceList(player);

    return (
        <div>
            <h1>
                <PlayerName player={player} />
            </h1>
            <table className={style.mainTable}>
                <thead>
                    <tr>
                        <th className={style.headerCell}>
                            Item
                        </th>
                        <th className={style.headerCell}>
                            Weight
                        </th>
                        <th className={style.headerCell}>
                            Item
                        </th>
                        <th className={style.headerCell}>
                            Total
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {player.scoreSlots.map((entry: PlayerItemEntry, index: number) => (
                        <tr key={entry.score} className={[style.row, scoreRowClass(entry)].join(' ')}>
                            <td className={style.cellItem}>
                                {entry.item ? (
                                    <>
                                        <ItemLink item={entry.item} size='small' />
                                        {entry.received && (
                                            <span className={style.receivedDate}>({entry.received})</span>
                                        )}
                                    </>
                                ) : '--'}
                            </td>
                            <td className={entry.received ? style.cellReceived : style.cell}>
                                {entry.score}
                            </td>
                            <td className={entry.received ? style.cellReceived : style.cell}>
                                {getItemBonus(entry, player)}
                            </td>
                            <td className={entry.received ? style.cellReceived : style.cell}>
                                {getFinalScore(entry, player)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {freeLoot.length > 0 && (
                <table className={style.table}>
                    <thead>
                        <tr>
                            <th className={style.headerCell}>
                                Free loot
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {freeLoot.map((item, index) => (
                            <tr key={item.name} className={style.row}>
                                <td className={style.cellItem}>
                                    <ItemLink item={item} size='small' />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <table className={style.table}>
                <thead>
                    <tr>
                        <th className={style.headerCell}>
                            Attendance
                        </th>
                        <th />
                        <th className={style.headerCell}>
                            Pos.<br />
                            bonus
                        </th>
                        <th className={style.headerCell}>
                            Att.<br />
                            bonus
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRaids.map(({ info, bonus, attendance }: CombinedPlayerAttendance) => (
                        <tr key={info.key} className={style.row}>
                            <td className={style.attendanceDate}>
                                {info.date || '-'}
                            </td>
                            <td className={style.attendanceRaid}>
                                {info.raid || '-'}
                            </td>
                            <td className={style.attendanceValue}>
                                {bonus || '-'}
                            </td>
                            <td className={style.attendanceValue}>
                                {attendance === undefined ? '' : `${attendance * 100} %`}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td />
                        <td />
                        <td className={style.attendanceValue}>
                            {getPositionBonus(player)}
                        </td>
                        <td className={style.attendanceValue}>
                            {getAttendanceBonus(player) * 10} %
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default PlayerDetails;
