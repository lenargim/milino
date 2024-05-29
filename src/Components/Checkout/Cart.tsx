import React, {FC} from 'react';
import s from './../OrderForm/Sidebar/sidebar.module.sass'
import {NavLink} from "react-router-dom";
import {CartItem} from "../Product/Cart";
import {CartItemType} from "../../store/reducers/generalSlice";

const Cart: FC<{ cart: CartItemType[], cartTotal: number }> = ({cart, cartTotal}) => {
    return (
        <div className={[s.sidebar, s.checkout].join(' ')}>
            <div className={s.sidebarContent}>
                <div>
                    <h3>Cart</h3>
                    {cart.map((el, index) => <CartItem isCheckout={true} key={index} item={el}/>)}
                </div>
                <div className={[s.sidebarBottom].join(' ')}>
                    <div className={s.cartTotal}>
                        <span>Total: </span>
                        <span>{cartTotal}$</span>
                    </div>
                    <div className={s.sidebarButtons}>
                        <NavLink to={'/'} className={['button yellow'].join(' ')}>← Change materials</NavLink>
                        <NavLink to={'/cabinets'} className={['button yellow'].join(' ')}>← Back to cabinets</NavLink>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Cart;
