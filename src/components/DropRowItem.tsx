import React from 'react';
import { Item } from '../types'

type DropRowItemProps = { item: Item };
const DropRowItem = ({ item }: DropRowItemProps) => (
    <div >
        {item.name}
    </div>
);

export default DropRowItem;
