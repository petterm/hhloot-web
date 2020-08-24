import React from 'react';
import { Boss } from '../types'
import BossEntry from './BossEntry';

type BossListProps = { bosses: Boss[] };
const BossList = ({ bosses }: BossListProps) => {
    bosses.sort((a, b) => a.index - b.index)
    return (
        <div>
            {bosses.map(boss => (
                <BossEntry boss={boss} key={boss.name} />
            ))}
        </div>
    );
};

export default BossList;
