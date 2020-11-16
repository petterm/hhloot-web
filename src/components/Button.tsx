import React from 'react';
import style from './Button.module.css';

type ButtonProps = {
    onClick: () => void,
    disabled?: boolean,
}

const Button: React.FunctionComponent<ButtonProps> = ({ disabled, onClick, children }) => (
    <button className={style.button} onClick={onClick} disabled={disabled}>
        { children }
    </button>
);

export default Button;
