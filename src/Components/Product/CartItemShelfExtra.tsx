import React, {FC} from 'react';
import s from "../OrderForm/Sidebar/sidebar.module.sass";
import {DoorAccessoiresType} from "../CustomPart/DoorAccessoiresForm";

const CartItemShelfExtra: FC<{ productExtra: string }> = ({productExtra}) => {
    return (
        <span className={s.itemOption}>
            <span>Glass Color: {productExtra}</span>
        </span>
    );
};

export default CartItemShelfExtra