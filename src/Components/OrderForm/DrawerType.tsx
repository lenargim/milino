import React from 'react';
import s from "./OrderForm.module.sass"
import {RadioInput} from "../../common/Form";
import {FC} from "react";
import {getImg} from "../../helpers/helpers";
import {drawerType} from "../../helpers/materialsTypes";


export const DrawerType: FC<{ drawerTypesArr: drawerType[], name: string, value: string }> = ({drawerTypesArr, value, name}) => {
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {drawerTypesArr.map((el, key) => <RadioInput
                    value={el.value}
                    img={getImg('drawers', el.img)}
                    name={name}
                    className={s.typeItem}
                    key={key}
                />)}
            </div>
        </div>
    )
};


