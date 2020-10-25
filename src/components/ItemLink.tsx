import React from 'react';
import { Item } from '../types'
import { getItemIcon } from '../api';
import style from './ItemLink.module.css';

const wowheadIconUrl = 'https://wow.zamimg.com/images/wow/icons'
const iconExtension = (size: string) => size === 'tiny' ? '.gif' : '.jpg';

export const hideWowheadTooltip = () => {
    const element = document.getElementsByClassName('wowhead-tooltip').item(0) as HTMLDivElement;
    if (element) {
        element.style.display = 'none';
    }
}

type ItemLinkProps = { item: Item, noText?: boolean, size: 'tiny' | 'small' | 'medium' | 'large' };
const ItemLink = ({ item, noText, size }: ItemLinkProps) => {
    const icon = getItemIcon(item.id);
    const iconStyle: React.CSSProperties = {
        background: `url("${wowheadIconUrl}/${size}/${icon}${iconExtension(size)}") left center no-repeat`,
    };
    const iconClass = [style[`icon--${size}`]];
    if (item.restricted) {
        iconClass.push(style['icon--restricted'])
    }

    return (
        <a href={`https://classic.wowhead.com/item=${item.id}`} target='_blank' className={style.wrap} rel="noopener noreferrer" >
            <span className={iconClass.join(' ')} style={iconStyle} />
            {noText ? null : (
                <span className={style.text}>
                    {item.name}
                </span>
            )}
        </a>
    );
}

export default ItemLink;
