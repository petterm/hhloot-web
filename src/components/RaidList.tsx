import React from "react";
import "chart.js/auto";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { ChartData } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Raid } from "../api/async";
import style from './RaidList.module.css';

ChartJS.register(ArcElement, Tooltip, Legend);
ChartJS.defaults.color = '#ddd';
ChartJS.defaults.borderColor = '#333';

type RaidListProps = { raids: Raid[] };
const RaidList = ({ raids }: RaidListProps) => {
    const totalsData = {
        data: [] as number[],
        label: 'Total',
        backgroundColor: '#333',
    };
    const reservedData = {
        data: [] as number[],
        label: 'Reserved',
        backgroundColor: '#56b825',
    };
    const freeData = {
        data: [] as number[],
        label: 'Free',
        backgroundColor: '#127b94',
    };
    const shardData = {
        data: [] as number[],
        label: 'Sharded',
        backgroundColor: '#540b17',
    };
    const labels = [] as string[];

    raids.forEach(raid => {
        totalsData.data.push(raid.stats.total);
        reservedData.data.push(raid.stats.reserved);
        freeData.data.push(raid.stats.free);
        shardData.data.push(raid.stats.total - raid.stats.reserved - raid.stats.free);
        labels.push(raid.date);
    })
    
    const barData: ChartData<"bar"> = { datasets: [reservedData, freeData, shardData], labels };
    return (
        <div>
            <h1>Raid loot stats</h1>
            <div className={style.chartWrapper}>
                <Bar
                    data={barData}
                    options={{ scales: { x: { stacked: true }, y: { stacked: true }}}}
                />
            </div>

            <table className={style.mainTable}>
                <tr>
                    <th className={style.headerCell}>Date</th>
                    <th className={style.headerCell}>Reserved</th>
                    <th className={style.headerCell}>Free</th>
                    <th className={style.headerCell}>Shards</th>
                    <th className={style.headerCell}>Total</th>
                </tr>
                {raids.map((raid, index) => (
                    <tr key={raid.date} className={style.row}>
                        <td className={[style.cell, style.cellDate].join(' ')}>
                            {raid.date}
                        </td>
                        <td className={style.cell}>
                            {raid.stats.reserved}
                        </td>
                        <td className={style.cell}>
                            {raid.stats.free}
                        </td>
                        <td className={style.cell}>
                            {raid.stats.total - raid.stats.reserved - raid.stats.free}
                        </td>
                        <td className={style.cell}>
                            {raid.stats.total}
                        </td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default RaidList;