import React, {FC} from 'react';
import s from "../Product/product.module.sass";
import {changeAmountType} from "../Product/Cart";
import {useField} from "formik";
import {HingeType} from "./DoorAccessoiresForm";
import {ProductInputCustom} from "../../common/Form";


const NumberPartArrayItem: FC<{name: string, index: number}> = ({name, index}) => {
    const [{value}, , {setValue}] = useField<HingeType>(`${name}[${index}]`)
    const {title, qty, label} = value
    const changeAmount = (type: changeAmountType) => {
        const newQty = type === 'minus' ? qty - 1 : qty + 1;
        setValue({...value, qty: newQty})
    }

    return (
        <div className={s.part}>
            <div className={s.number}>
                <h4>{label ?? title}</h4>
                {label === 'Custom' ? <ProductInputCustom label="Custom" value={null}
                                                          name={`${name}.value`}/> : null}
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

export default NumberPartArrayItem;