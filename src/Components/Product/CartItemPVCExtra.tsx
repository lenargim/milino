import React, {FC} from 'react';
import s from "../OrderForm/Sidebar/sidebar.module.sass";
import {PVCExtraType} from "../../store/reducers/generalSlice";

const CartItemPvcExtra:FC<{productExtra: PVCExtraType}> = ({productExtra}) => {
    const {material, pvcFeet} = productExtra;

    return (
        <>
            {pvcFeet && <div className={s.itemOption}>
              <span>Width:</span>
              <span>{pvcFeet} ft.</span>
            </div>}
            {material &&
              <div className={s.itemOption}>
                <span>Material:</span>
                <span>{material}</span>
              </div>}
        </>

    )
};

export default CartItemPvcExtra;