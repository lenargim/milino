import React, {FC} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {drawerColor} from "../../helpers/materialsTypes";
import {getImg} from "../../helpers/helpers";


export const DrawerColor: FC<{ drawerColorsArr: drawerColor[], name: string, value: string }> = ({drawerColorsArr, value, name}) => {
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {drawerColorsArr.map((drawerEl, key) => <RadioInput
                    value={drawerEl.name}
                    img={getImg('drawers', drawerEl.img)}
                    name={name}
                    className={s.typeItem}
                    key={key}
                />)}
            </div>
        </div>
    )
};
