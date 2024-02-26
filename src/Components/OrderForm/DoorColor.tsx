import React, {FC, useEffect} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {useField} from "formik";
import {doorType} from "../../helpers/materialsTypes";



export const DoorColor: FC<{ doors: doorType[] }> = ({doors}) => {
    const [field] = useField('Door Type');
    const [fieldFinish] = useField('Door Finish Material');
    const [fieldColor] = useField('Door Color');
    const finishArr = doors.find(el => el.name === field.value)?.finish;
    const [fieldGrain, , helpersGrain] = useField('Door Grain');
    const colorArr = finishArr && finishArr.find(el => el.name === fieldFinish.value)?.colors;

    useEffect(() => {
        if (fieldGrain.value) {
            helpersGrain.setValue('')
        }
    }, [fieldColor.value])


    return (
        colorArr ? <div className={s.orderBlock}>
            <h2>Door Color</h2>
            <div className={s.type} role="group">
                {colorArr.map((doorColorEl, key) => <RadioInput value={doorColorEl.name} name="Door Color"
                                                                className={s.typeItem} key={key}/>)}
            </div>
        </div> : null
    )
};