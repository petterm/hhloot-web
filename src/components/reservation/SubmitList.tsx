import React from 'react';
import style from './SubmitList.module.css';


interface SubmitListProps {
    validList: boolean,
    onSubmit: () => void,
};

const SubmitList: React.FunctionComponent<SubmitListProps> = ({ onSubmit, validList }) => (
    <div className={style.wrap} >
        <button className={style.button} disabled={!validList} onClick={onSubmit} >
            Submit
        </button>
    </div>
);

export default SubmitList;
