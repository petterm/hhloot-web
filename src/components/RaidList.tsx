import React from "react";
import "chart.js/auto";
import { Chart, ChartData } from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { Raid } from "../api/async";
import style from './RaidList.module.css';

type RaidListProps = { raids: Raid[] };
const RaidList = ({ raids }: RaidListProps) => {
    const totals: {x: string, y: number}[] = [];
    const reserved: {x: string, y: number}[] = [];
    const free: {x: string, y: number}[] = [];
    const shards: {x: string, y: number}[] = [];
    raids.forEach(raid => {
        totals.push({ x: raid.date, y: raid.stats.total })
        reserved.push({ x: raid.date, y: raid.stats.reserved })
        free.push({ x: raid.date, y: raid.stats.free })
        shards.push({ x: raid.date, y: raid.stats.total - raid.stats.reserved - raid.stats.free })
    })
    
    // const barData: ChartData<"bar"> = { datasets: [{ data: totals }], labels: ['Total'] };
    return (
        <div>
            <h1>Raid loot stats</h1>
{/* 
            <Bar
                data={barData}
            /> */}

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