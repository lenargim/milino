import React, {FC} from 'react';
import CartItemProductExtra from "./CartItemProductExtra";
import CartItemCustomExtra from "./CartItemCustomExtra";
import CartItemGlassDoorExtra from "./CartItemGlassDoorExtra";
import CartItemPVCExtra from "./CartItemPVCExtra";
import CartItemLEDExtra from "./CartItemLEDExtra";
import CartItemDoorExtra from "./CartItemDoorExtra";
import CartItemShelfExtra from "./CartItemShelfExtra";
import CartItemDoor from "./CartItemDoor";
import {CartItemType} from "../../store/reducers/generalSlice";

const CartItemOptions:FC<{item: CartItemType}> = ({item}) => {
    const {
        productExtra,
        customPartExtra,
        PVCExtra,
        LEDAccessories,
        DoorAccessories,
        glassDoorExtra,
        glassShelfExtra,
        DoorExtra
    } = item;
    return (
        <>
            {productExtra && <CartItemProductExtra productExtra={productExtra}/>}
            {customPartExtra && <CartItemCustomExtra productExtra={customPartExtra}/>}
            {glassDoorExtra && <CartItemGlassDoorExtra glassDoorExtra={glassDoorExtra}/>}
            {PVCExtra && <CartItemPVCExtra productExtra={PVCExtra}/>}
            {LEDAccessories && <CartItemLEDExtra productExtra={LEDAccessories}/>}
            {DoorAccessories && <CartItemDoorExtra productExtra={DoorAccessories} />}
            {glassShelfExtra && <CartItemShelfExtra productExtra={glassShelfExtra} />}
            {DoorExtra && <CartItemDoor productExtra={DoorExtra?? ''} />}
        </>
    );
};

export default CartItemOptions;