import React, {FC} from 'react';
import {getCartTotal, useAppSelector} from "../../helpers/helpers";
import s from './../OrderForm/Sidebar/sidebar.module.sass'
import {NavLink} from "react-router-dom";
import SidebarCart from "../OrderForm/Sidebar/SidebarCart";

export type changeAmountType = 'plus' | 'minus'

const Cart:FC = () => {
    const {cart} = useAppSelector(state => state.general)
    const cartTotal = getCartTotal(cart);
    return (
        <div className={[s.sidebar, s.product].join(' ')}>
            <div className={s.sidebarContent}>
                {cartTotal
                    ? <SidebarCart cart={cart} total={cartTotal}/>
                    : <div className={s.cartEmpty}>
                        <span>Your cart is empty</span>
                    </div>
                }
            </div>
        </div>
    );
};

export default Cart;
