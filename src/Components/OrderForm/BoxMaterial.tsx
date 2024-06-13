import React, {FC} from 'react';
import s from "./OrderForm.module.sass";
import {RadioInput} from "../../common/Form";
import {getImg} from "../../helpers/helpers";
import {boxMaterialType} from "../../helpers/materialsTypes";


const BoxMaterial: FC<{ boxMaterial: boxMaterialType[], name: string, value?: string }> = ({boxMaterial, name, value}) => {
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {boxMaterial.map((el, key) => <RadioInput
                    key={key}
                    img={getImg('boxMaterial', el.img)}
                    value={el.value}
                    name={name}
                    className={s.typeItem}/>)}
            </div>
        </div>
    );
};

export default BoxMaterial;