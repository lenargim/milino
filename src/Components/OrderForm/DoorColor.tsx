import React, {FC} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {colorType} from "../../helpers/materialsTypes";
import {getImg} from "../../helpers/helpers";

export const DoorColor: FC<{ colorArr: colorType[] }> = ({colorArr}) => {
    return (
        <div className={s.orderBlock}>
            <h2>Door Color</h2>
            <div className={s.type} role="group">
                {colorArr.map((el, key) => <RadioInput
                    img={getImg('colors', el.img)}
                    value={el.name} name="Door Color"
                    className={[s.typeItem, s.color].join(' ')}
                    key={key}/>)}
            </div>
        </div>
    )
};