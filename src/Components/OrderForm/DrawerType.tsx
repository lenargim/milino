import React from 'react';
import s from "./OrderForm.module.sass"
import {RadioInput} from "../../common/Form";
import {FC} from "react";
import {getImg} from "../../helpers/helpers";
import {drawerType} from "../../helpers/materialsTypes";


export const DrawerType: FC<{ drawerTypesArr: drawerType[] }> = ({drawerTypesArr}) => {
    return (
        <div className={s.orderBlock}>
            <h2>Drawer Type</h2>
            <div className={s.type} role="group">
                {drawerTypesArr.map((el, key) => <RadioInput
                    value={el.value}
                    img={getImg('drawers', el.img)}
                    name="Drawer Type"
                    className={s.typeItem}
                    key={key}
                />)}
            </div>
        </div>
    )
};


