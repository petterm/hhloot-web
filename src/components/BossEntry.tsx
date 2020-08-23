import React from 'react';
import { Boss } from '../types'
import DropTable from './DropTable';

type BossEntryProps = { boss: Boss };
const BossEntry = ({ boss }: BossEntryProps) => (
    <div>
        <h3>
            {boss.name}
        </h3>
        <DropTable loot={boss.drops} />
    </div>
);

export default BossEntry;
