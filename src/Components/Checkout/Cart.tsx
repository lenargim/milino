import React, {FC} from 'react';
import s from './../OrderForm/Sidebar/sidebar.module.sass'
import {NavLink} from "react-router-dom";
import {CartItemType} from "../../store/reducers/generalSlice";
import CartItem from "../Product/CartItem";

const Cart: FC<{ cart: CartItemType[], cartTotal: number }> = ({cart, cartTotal}) => {
    return (
        <div className={[s.sidebar, s.checkout].join(' ')}>
            <div className={s.sidebarContent}>
                <div>
                    <h3>Cart</h3>
                    {cart.map((el, index) => <CartItem isCheckout={true} key={index} item={el}/>)}
                </div>
            </div>
        </div>

    );
};

export default Cart;
