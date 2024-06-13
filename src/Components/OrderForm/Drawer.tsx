import React from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {FC} from "react";
import {getImg} from "../../helpers/helpers";
import {drawer} from "../../helpers/materialsTypes";


export const Drawer: FC<{ drawers: drawer[], name: string, value: string }> = ({drawers, name, value}) => {
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {drawers.map((drawerEl, key) => {
                    return (
                        <RadioInput value={drawerEl.value}
                                    img={getImg('drawers', drawerEl.img)}
                                    name={name}
                                    className={s.typeItem}
                                    key={key}
                        />
                    )
                })}
            </div>
        </div>
    )
};


