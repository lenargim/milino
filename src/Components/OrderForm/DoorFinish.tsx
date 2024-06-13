import React from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {FC} from "react";
import {finishType} from "../../helpers/materialsTypes";
import {getImg} from "../../helpers/helpers";


export const DoorFinish: FC<{ finishArr: finishType[], value: string, name:string}> = ({finishArr, value, name}) => {
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {finishArr.map((el, key) => <RadioInput
                    value={el.name}
                    img={getImg('materials', el.img)}
                    name={name}
                    className={s.typeItem}
                    key={key}/>)}
            </div>
        </div>
    )
};
