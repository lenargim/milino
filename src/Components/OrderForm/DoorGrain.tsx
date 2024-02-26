import React, {FC, useEffect} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {useField} from "formik";
import {doorType, grainType} from "../../helpers/materialsTypes";


export const DoorGrain: FC<{ doors: doorType[] }> = ({doors}) => {
    const [field] = useField('Door Type');
    const [fieldFinish] = useField('Door Finish Material');
    const [fieldColor] = useField('Door Color');
    const [fieldGrain, , helpersGrain] = useField('Door Grain');
    const finishArr = doors.find(el => el.name === field.value)?.finish;
    const colorArr = finishArr && finishArr.find(el => el.name === fieldFinish.value)?.colors;
    const isGrain = colorArr && colorArr.find(el => el.name === fieldColor.value)?.isGrain
    const grainArr: grainType[] = [
        {
            name: "Gorizontal"
        },
        {
            name: "Vertical"
        }
    ]

    if (isGrain && !fieldGrain.value) {
        setTimeout(() => helpersGrain.setValue('Gorizontal'), 0)
    }

    return (
        isGrain ? <div className={s.orderBlock}>
            <h2>Door Grain</h2>
            <div className={s.type} role="group">
                {grainArr.map((doorColorEl, key) => <RadioInput value={doorColorEl.name} name="Door Grain"
                                                                className={s.typeItem} key={key}/>)}
            </div>
        </div> : null
    )
};