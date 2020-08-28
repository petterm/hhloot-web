import React from 'react';
import { Boss } from '../types'
import DropTable from './DropTable';

type BossEntryProps = { boss: Boss, hideReceived: boolean };
const BossEntry = ({ boss, hideReceived }: BossEntryProps) => (
    <div>
        <h3>
            {boss.name}
        </h3>
        <DropTable loot={boss.drops} hideReceived={hideReceived} />
    </div>
);

export default BossEntry;
