import React, {FC} from 'react';
import {getCartTotal, useAppSelector} from "../../helpers/helpers";
import s from './../OrderForm/Sidebar/sidebar.module.sass'
import {NavLink} from "react-router-dom";
import {SidebarCart} from "../OrderForm/Sidebar/Sidebar";

export type changeAmountType = 'plus' | 'minus'

const Cart = () => {
    const cart = useAppSelector(state => state.general.cart)
    const cartTotal = getCartTotal(cart);
    return (
        <div className={[s.sidebar, s.product].join(' ')}>
            <div className={s.sidebarContent}>
                {cartTotal
                    ? <SidebarCart cart={cart}/>
                    : <div className={s.cartEmpty}>
                        <span>Your cart is empty</span>
                    </div>
                }
                <div className={s.sidebarBottom}>
                    {cartTotal ?
                        <div className={s.cartTotal}>
                            <span>Total: </span>
                            <span>{cartTotal}$</span>
                        </div> : null}
                    <div className={s.sidebarButtons}>
                        <NavLink to={'/'} className={['button yellow'].join(' ')}>← Change materials</NavLink>
                        <NavLink to={'/cabinets'} className={['button yellow'].join(' ')}>← Back to
                            cabinets</NavLink>
                        {cartTotal ? <NavLink to={'/checkout'} className={['button yellow'].join(' ')}>Checkout
                            →</NavLink> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
