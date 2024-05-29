import React, {FC} from 'react';
import s from "./OrderForm.module.sass";
import {RadioInput} from "../../common/Form";
import {getImg} from "../../helpers/helpers";
import {boxMaterialType} from "../../helpers/materialsTypes";


const BoxMaterial: FC<{ boxMaterial: boxMaterialType[] }> = ({boxMaterial}) => {
    return (
        <div className={s.orderBlock}>
            <h2>Box Material</h2>
            <div className={s.type} role="group">
                {boxMaterial.map((el, key) => <RadioInput
                    key={key}
                    img={getImg('boxMaterial', el.img)}
                    value={el.value}
                    name="Box Material"
                    className={s.typeItem}/>)}
            </div>
        </div>
    );
};

export default BoxMaterial;