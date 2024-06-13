import React, {FC} from 'react';
import {glassDoorExtraType} from "../../store/reducers/generalSlice";
import s from "../OrderForm/Sidebar/sidebar.module.sass";

const CartItemGlassDoorExtra: FC<{ glassDoorExtra: glassDoorExtraType }> = ({glassDoorExtra}) => {
    const {Type, Profile, Color, material} = glassDoorExtra;

    return (
        <>
            {material &&
              <div className={s.itemOption}>
                <span>Material:</span>
                <span>{material}</span>
              </div>}
            {Profile &&
              <div className={s.itemOption}>
                <span>Door Profile:</span>
                <span>{Profile}</span>
              </div>}
            {Type &&
              <div className={s.itemOption}>
                <span>Door Type:</span>
                <span>{Type}</span>
              </div>}
            {Color &&
              <div className={s.itemOption}>
                <span>Door Color:</span>
                <span>{Color}</span>
              </div>}
        </>

    )
}

export default CartItemGlassDoorExtra;