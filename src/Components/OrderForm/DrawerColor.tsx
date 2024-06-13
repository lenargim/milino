import React, {FC} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";


export const DrawerColor: FC<{ drawerColorsArr: string[], name: string, value: string }> = ({drawerColorsArr, value, name}) => {
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {drawerColorsArr.map((drawerEl, key) => <RadioInput
                    value={drawerEl}
                    name={name}
                    className={s.typeItem}
                    key={key}
                />)}
            </div>
        </div>
    )
};
