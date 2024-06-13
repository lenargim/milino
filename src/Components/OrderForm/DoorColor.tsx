import React, {FC} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {colorType} from "../../helpers/materialsTypes";
import {getImg} from "../../helpers/helpers";

export const DoorColor: FC<{ colorArr: colorType[], value?: string, name: string }> = ({colorArr, name, value}) => {
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {colorArr.map((el, key) => <RadioInput
                    img={getImg('colors', el.img)}
                    value={el.name} name={name}
                    className={[s.typeItem].join(' ')}
                    key={key}/>)}
            </div>
        </div>
    )
};