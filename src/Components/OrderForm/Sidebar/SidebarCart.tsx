import React, {FC} from "react";
import {CartItemType} from "../../../store/reducers/generalSlice";
import CartItem from "../../Product/CartItem";

const SidebarCart: FC<{ cart: CartItemType[] }> = ({cart}) => {
    return (
        <>
            <h3>Cart</h3>
            {cart.map((item, key) => {
                return (
                    <CartItem item={item} key={key}/>
                )
            })}
        </>
    )
}

export default SidebarCart