import React from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {FC} from "react";
import {getImg} from "../../helpers/helpers";
import {drawer} from "../../helpers/materialsTypes";


export const Drawer: FC<{ drawers: drawer[] }> = ({drawers}) => {
    return (
        <div className={s.orderBlock}>
            <h2>Drawer</h2>
            <div className={s.type} role="group">
                {drawers.map((drawerEl, key) => {
                    return (
                        <RadioInput value={drawerEl.value}
                                    img={getImg('drawers', drawerEl.img)}
                                    name="Drawer"
                                    className={s.typeItem}
                                    key={key}
                        />
                    )
                })}
            </div>
        </div>
    )
};


