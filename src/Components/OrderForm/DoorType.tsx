import React, {FC} from 'react';
import {RadioInput} from "../../common/Form";
import s from './OrderForm.module.sass'
import {doorType} from "../../helpers/materialsTypes";
import {getImg} from "../../helpers/helpers";


export const DoorType: FC<{ doors: doorType[] }> = ({doors}) => {
    // const [type] = useField('Door Type');
    // const [finish, , helpersFinish] = useField('Door Finish Material');
    // const [color, , helpersColor] = useField('Door Color');
    // const [grain, , helpersGrain] = useField('Door Grain');
    // useEffect(() => {
    //   if (finish.value) {
    //     helpersFinish.setValue('');
    //   }
    //   if (color.value) {
    //     helpersColor.setValue('');
    //   }
    //   if (grain.value) {
    //     helpersGrain.setValue('');
    //   }
    // }, [type.value])

    return (
        <div className={s.orderBlock}>
            <h2>Door Type</h2>
            <div className={s.type} role="group">
                {doors.map((doorTypeEl) => {
                    return (
                        <RadioInput value={doorTypeEl.name} name="Door Type" img={getImg('materials', doorTypeEl.img)}
                                    className={s.typeItem} key={doorTypeEl.name}/>
                    )
                })}
            </div>
        </div>
    )
};