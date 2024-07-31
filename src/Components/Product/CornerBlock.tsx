import React, {FC} from 'react';
import s from "./product.module.sass";
import {ProductRadioInput} from "../../common/Form";
import settings from './../../api/settings.json'


type CornerBlockType = {
    isCornerChoose?: boolean
}

const cornerArr = settings['Corner']
const CornerBlock:FC<CornerBlockType> = ({isCornerChoose}) => {
    if (!isCornerChoose) return null
    return (
        <div className={s.block}>
            <h3>Corner</h3>
            <div className={s.options}>
                {cornerArr.map((w, index) => <ProductRadioInput key={index}
                                                                name={'Corner'}
                                                                value={w}/>)}
            </div>
        </div>
    );
};

export default CornerBlock;