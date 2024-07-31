import React from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {FC} from "react";
import {getFraction, getImg} from "../../helpers/helpers";


export const DoorFrameWidth: FC<{ frameWidth: number[]|undefined, value: string|undefined, name:string}> = ({frameWidth = [], value, name}) => {
    if (!frameWidth) return null;
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {frameWidth.map((el, key) => <RadioInput
                    value={getFraction(el)}
                    img={getImg('materials', el.toString())}
                    name={name}
                    className={s.typeItem}
                    key={key}/>)}
            </div>
        </div>
    )
};