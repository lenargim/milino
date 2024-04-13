import React, {useEffect} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {useField} from "formik";
import {FC} from "react";
import {doorType} from "../../helpers/materialsTypes";
import {getImg} from "../../helpers/helpers";


export const DoorFinish: FC<{ doors: doorType[] }> = ({doors}) => {
    const [field] = useField('Door Type');
    const [fieldMaterial, , helpersMaterial] = useField('Door Finish Material');
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
    }, [fieldMaterial.value]);


    if (field.value === 'No Doors') {
        setTimeout(() => helpersMaterial.setValue('No Doors No Hinges'), 0)
    } else if (fieldMaterial.value === 'No Doors No Hinges') {
        setTimeout(() => helpersMaterial.setValue(''), 0)
    }

    return (
        finishArr ? <div className={s.orderBlock}>
            <h2>Door Finish Material</h2>
            <div className={s.type} role="group">
                {finishArr.map((el, key) => <RadioInput value={el.name} img={getImg('materials',el.img)} name="Door Finish Material"
                                                        className={s.typeItem}
                                                        key={key}/>)}
            </div>
        </div> : null
    )
};
