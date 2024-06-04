import React, {FC} from 'react';
import s from "../Product/product.module.sass";
import {changeAmountType} from "../Product/Cart";
import {useField} from "formik";

const NumberPart: FC<{ name: string, qty: number }> = ({name, qty}) => {
    const [field, , helpers] = useField(name)
    const changeAmount = (type: changeAmountType) => {
        const newQty = type === 'minus' ? field.value - 1 : field.value + 1;
        helpers.setValue(newQty)
    }

    return (
        <div className={s.block}>
            <div className={s.number}>
                <h3>{name}</h3>
                <div className={s.buttons}>
                    <button value="minus" disabled={qty <= 0} onClick={() => changeAmount('minus')}
                            type={"button"}>-
                    </button>
                    {qty}
                    <button value="plus" onClick={() => changeAmount('plus')} type={"button"}>+</button>
                </div>
            </div>
        </div>
    );
};

export default NumberPart;