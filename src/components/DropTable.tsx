import React from 'react';
import { BossDrop } from '../types'
import DropRow from './DropRow';

type DropTableProps = { loot: BossDrop[], hideReceived: boolean };
const DropTable = ({ loot, hideReceived }: DropTableProps) => (
    <div>
        {loot.map((drop, index) => (
            <DropRow
                key={drop.item.name}
                drop={drop}
                even={index % 2 === 1}
                hideReceived={hideReceived}
            />
        ))}
    </div>
);

export default DropTable;
