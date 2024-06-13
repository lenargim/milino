import React, {FC} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {grainType} from "../../helpers/materialsTypes";


export const DoorGrain: FC<{ value?: string, name: string }> = ({name, value}) => {
    const grainArr: grainType[] = [
        {
            name: "Gorizontal"
        },
        {
            name: "Vertical"
        }
    ]
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {grainArr.map((doorColorEl, key) => <RadioInput
                    value={doorColorEl.name}
                    name={name}
                    className={s.typeItem}
                    key={key}/>
                )}
            </div>
        </div>
    )
};