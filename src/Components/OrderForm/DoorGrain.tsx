import React, {FC} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {grainType} from "../../helpers/materialsTypes";


export const DoorGrain: FC<{ isGrain: boolean }> = ({isGrain}) => {
    const grainArr: grainType[] = [
        {
            name: "Gorizontal"
        },
        {
            name: "Vertical"
        }
    ]
    return (
        <div className={s.orderBlock}>
            <h2>Door Grain</h2>
            <div className={s.type} role="group">
                {grainArr.map((doorColorEl, key) => <RadioInput
                    value={doorColorEl.name}
                    name="Door Grain"
                    className={s.typeItem}
                    key={key}/>
                )}
            </div>
        </div>
    )
};