import React from 'react';
import { BossDrop } from '../types'
import DropRow from './DropRow';

type DropTableProps = { loot: BossDrop[] };
const DropTable = ({ loot }: DropTableProps) => (
    <div>
        {loot.map(drop => (
            <DropRow key={drop.item.name} drop={drop} />
        ))}
    </div>
);

export default DropTable;
