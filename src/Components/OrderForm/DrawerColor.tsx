import React, {FC} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";


export const DrawerColor: FC<{ drawerColorsArr: string[] }> = ({drawerColorsArr}) => {
    return (
        <div className={s.orderBlock}>
            <h2>Drawer Color</h2>
            <div className={s.type} role="group">
                {drawerColorsArr.map((drawerEl, key) => <RadioInput
                    value={drawerEl}
                    name="Drawer Color"
                    className={s.typeItem}
                    key={key}
                />)}
            </div>
        </div>
    )
};
