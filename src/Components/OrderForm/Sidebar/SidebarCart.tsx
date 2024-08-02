import React, {FC} from "react";
import {CartItemType} from "../../../store/reducers/generalSlice";
import CartItem from "../../Product/CartItem";

const SidebarCart: FC<{ cart: CartItemType[], total:number }> = ({cart, total}) => {
    return (
        <>
            <h3>Cart {total}$</h3>
            {cart.map((item, key) => {
                return (
                    <CartItem item={item} key={key}/>
                )
            })}
        </>
    )
}

export default SidebarCart