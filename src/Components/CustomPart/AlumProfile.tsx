import React, {FC} from "react";
import {useField} from "formik";
import {changeAmountType} from "../Product/Cart";
import s from "../Product/product.module.sass";
import {ProductInputCustom} from "../../common/Form";

export type alProfileType = {
    uuid: string,
    length: number,
    qty: number
}

const AlumProfile: FC<{ profile: alProfileType, index: number }> = ({profile, index}) => {
    const [{value}, , {setValue}] = useField<alProfileType[]>('LED Aluminum Profiles')
    const {qty, uuid} = profile;

    const deleteAlItem = (uuid: string) => {
        const newArr = value.filter(profile => profile.uuid !== uuid)
        setValue(newArr)
    };

    const changeAmount = (type: changeAmountType) => {
        const profile = value[index];
        profile.qty = type === 'minus' ? profile.qty - 1 : profile.qty + 1;
        value.splice(index, 1, profile)
        setValue(value)
    }
    return (
        <div className={s.row}>
            <button onClick={() => deleteAlItem(uuid)} className={s.close} type={"button"}>×</button>
            <ProductInputCustom label="Length" value={null}
                                name={`[LED Aluminum Profiles].${index}.length`}/>
            <div className={s.row}>×
                <div className={s.buttons}>
                    <button value="minus" disabled={qty <= 1} onClick={() => changeAmount('minus')}
                            type={"button"}>-
                    </button>
                    {qty}
                    <button value="plus" onClick={() => changeAmount('plus')} type={"button"}>+</button>
                </div>
            </div>
        </div>
    )
}

export default AlumProfile