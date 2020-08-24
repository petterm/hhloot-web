import React from 'react';
import { BossDrop } from '../types'
import DropRow from './DropRow';

type DropTableProps = { loot: BossDrop[] };
const DropTable = ({ loot }: DropTableProps) => (
    <div>
        {loot.map((drop, index) => (
            <DropRow key={drop.item.name} drop={drop} even={index % 2 === 1} />
        ))}
    </div>
);

export default DropTable;
