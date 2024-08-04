import React, {FC} from 'react';
import {customPartExtraType} from "../../store/reducers/generalSlice";
import s from "../OrderForm/Sidebar/sidebar.module.sass";
import {Dimentions} from "./CartItem";

const CartItemCustomExtra: FC<{ productExtra: customPartExtraType }> = ({productExtra}) => {
    const {material, width, height, depth} = productExtra;

    return (
        <>
            <Dimentions width={width} depth={depth} height={height} />
            {material &&
              <div className={s.itemOption}>
                <span>Material:</span>
                <span>{material}</span>
              </div>}
        </>
    )
}

export default CartItemCustomExtra;