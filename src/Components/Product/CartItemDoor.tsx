import React, {FC} from 'react';
import s from "../OrderForm/Sidebar/sidebar.module.sass";
import {DoorType} from "../CustomPart/StandartDoorForm";


const CartItemShelfExtra: FC<{ productExtra: DoorType }> = ({productExtra}) => {
    const {Color: color, Doors: doorArr} = productExtra
    return (
        <>
           <span className={s.itemOption}>
            <span>Door Color: {color}</span>
        </span>
            {doorArr.map((el, index) => {
                return (
                    <span className={s.itemOption} key={index}>
                        <span>Size: {el.name}. Amount: {el.qty}</span>
                    </span>
                )
            })}
        </>
    );
};

export default CartItemShelfExtra