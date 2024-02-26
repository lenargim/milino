import React, {useEffect} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {useField} from "formik";
import {FC} from "react";
import {doorType} from "../../helpers/materialsTypes";


export const DoorFinish: FC<{ doors: doorType[] }> = ({doors}) => {
    const [field] = useField('Door Type');
    const [fieldMaterial] = useField('Door Finish Material');
    const [fieldColor, , helpersColor] = useField('Door Color');
    const [fieldGrain, , helpersGrain] = useField('Door Grain');
    const finishArr = doors.find(el => el.name === field.value)?.finish

    useEffect(() => {
        if (fieldColor.value) {
            helpersColor.setValue('')
        }
        if (fieldGrain.value) {
            helpersGrain.setValue('')
        }
    }, [fieldMaterial.value])

    return (
        finishArr ? <div className={s.orderBlock}>
            <h2>Door Finish Material</h2>
            <div className={s.type} role="group">
                {finishArr.map((el, key) => <RadioInput value={el.name} name="Door Finish Material"
                                                        className={s.typeItem}
                                                        key={key}/>)}
            </div>
        </div> : null
    )
};
