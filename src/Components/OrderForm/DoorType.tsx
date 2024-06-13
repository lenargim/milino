import React, {FC} from 'react';
import {RadioInput} from "../../common/Form";
import s from './OrderForm.module.sass'
import {doorType} from "../../helpers/materialsTypes";
import {getImg} from "../../helpers/helpers";


export const DoorType: FC<{ doors: doorType[], value: string, name:string }> = ({doors, value, name}) => {
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {doors.map((doorTypeEl) => {
                    return (
                        <RadioInput value={doorTypeEl.name} name={name} img={getImg('materials', doorTypeEl.img)}
                                    className={s.typeItem} key={doorTypeEl.name}/>
                    )
                })}
            </div>
        </div>
    )
};