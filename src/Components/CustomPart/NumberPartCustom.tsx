import React, {FC} from 'react';
import {hingeHoleCustomType} from "./DoorAccessoiresForm";
import {ErrorMessage, Field, useField} from "formik";
import s from "../Product/product.module.sass";
import {changeAmountType} from "../Product/Cart";
import styles from "../../common/Form.module.sass";
import {handleBlur, handleFocus} from "../../common/Form";

const NumberPartCustom: FC<{ name: string }> = ({name}) => {
    const [field, meta , {setValue, setTouched}] = useField<hingeHoleCustomType>(name)
    const {error, touched} = meta;
    const length = field.value.title.length ?? 0;
    const {value: valueEl} = field

    const changeAmount = (type: changeAmountType) => {
        const newQty = type === 'minus' ? valueEl.qty - 1 : valueEl.qty + 1;
        setValue({...valueEl, qty: newQty})
    }


    return (
        <div className={s.number}>
            <Field
                className={[styles.input, length ? `${styles.focused}` : null, error && touched ? styles.inputError : null,].join(' ')}
                type="text"
                name={`${name}.title`}
                id={name}
                onFocus={(e: any) => handleFocus(e.target)}
                onBlur={(e: any) => handleBlur(e.target, setTouched)}
            />
            <label className={styles.label} htmlFor={name}>Custom</label>
            <ErrorMessage name={`${name}.title`} component="div" className={styles.error}/>
            <div className={s.buttons}>
                <button value="minus" disabled={valueEl.qty <= 0} onClick={() => changeAmount('minus')}
                        type={"button"}>-
                </button>
                {valueEl.qty}
                <button value="plus" onClick={() => changeAmount('plus')} type={"button"}>+</button>
            </div>
        </div>
    );
};

export default NumberPartCustom;