import React from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {FC} from "react";
import {finishType} from "../../helpers/materialsTypes";
import {getImg} from "../../helpers/helpers";


export const DoorFinish: FC<{ finishArr: finishType[] }> = ({finishArr}) => {
    return (
        <div className={s.orderBlock}>
            <h2>Door Finish Material</h2>
            <div className={s.type} role="group">
                {finishArr.map((el, key) => <RadioInput
                    value={el.name}
                    img={getImg('materials', el.img)}
                    name="Door Finish Material"
                    className={s.typeItem}
                    key={key}/>)}
            </div>
        </div>
    )
};
