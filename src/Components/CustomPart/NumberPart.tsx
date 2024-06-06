import React, {FC} from 'react';
import s from "../Product/product.module.sass";
import {changeAmountType} from "../Product/Cart";
import {useField} from "formik";

const NumberPart: FC<{ name?: string, el: string }> = ({name, el}) => {
    const fieldName = name ? `${name}.${el}` : el
    const [field, , helpers] = useField(fieldName)
    const changeAmount = (type: changeAmountType) => {
        const newQty = type === 'minus' ? field.value - 1 : field.value + 1;
        helpers.setValue(newQty)
    }

    return (
        <div className={s.part}>
            <div className={s.number}>
                <h4>{el}</h4>
                <div className={s.buttons}>
                    <button value="minus" disabled={field.value <= 0} onClick={() => changeAmount('minus')}
                            type={"button"}>-
                    </button>
                    {field.value}
                    <button value="plus" onClick={() => changeAmount('plus')} type={"button"}>+</button>
                </div>
            </div>
        </div>
    );
};

export default NumberPart;