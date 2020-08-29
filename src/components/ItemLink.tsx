import React from 'react';
import { Item } from '../types'
import { getItemIcon } from '../api';

const wowheadIconUrl = 'https://wow.zamimg.com/images/wow/icons'
const iconExtension = (size: string) => size === 'tiny' ? '.gif' : '.jpg';
const padding = (size: string): number => {
    switch (size) {
        case 'tiny':
            return 15
        case 'small':
            return 18
        case 'medium':
            return 36
        default:
            return 56
    }
};

type ItemLinkProps = { item: Item, noText?: boolean, size: 'tiny' | 'small' | 'medium' | 'large' };
const ItemLink = ({ item, noText, size }: ItemLinkProps) => {
    const icon = getItemIcon(item.id);
    const style: React.CSSProperties = {
        paddingLeft:  padding(size) + (noText ? 0 : 3),
        background: `url("${wowheadIconUrl}/${size}/${icon}${iconExtension(size)}") left center no-repeat`,
        textDecoration: 'none',
        color: '#a335ee',
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    };

    return (
        <a href={`https://classic.wowhead.com/item=${item.id}`} target='_blank' style={style} rel="noopener noreferrer" >
            {noText ? null : item.name}
        </a>
    );
}

export default ItemLink;
