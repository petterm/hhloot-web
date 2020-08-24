import React from 'react';
import { Item } from '../types'
import { getItemIcon } from '../api';

const wowheadIconUrl = 'https://wow.zamimg.com/images/wow/icons/'

type ItemLinkProps = { item: Item, noText?: boolean, size: 'tiny' | 'small' | 'medium' | 'large' };
const ItemLink = ({ item, noText, size }: ItemLinkProps) => {
    const icon = getItemIcon(item.id);
    const style: React.CSSProperties = {
        paddingLeft: 18,
        background: `url("${wowheadIconUrl}/${size}/${icon}") left center no-repeat`,
        textDecoration: 'none',
        color: '#a335ee',
    };

    return (
        // @ts-ignore
        // eslint-disable-next-line
        <a href={`https://classic.wowhead.com/item=${item.id}`} target='_blank' style={style} >
            {noText ? '' : item.name}
        </a>
    );
}

export default ItemLink;
