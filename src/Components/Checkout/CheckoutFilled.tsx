import React, {FC} from 'react';
import {CartItemType} from "../../store/reducers/generalSlice";
import s from './../Product/product.module.sass'
import Cart from "./Cart";
import CheckoutForm from "./CheckoutForm";

const CheckoutFilled: FC<{ cart: CartItemType[], cartTotal: number }> = ({cart, cartTotal}) => {
    return (
        <div className={s.wrap}>
            <div className={s.main}>
                <CheckoutForm/>
            </div>
            <Cart cart={cart} cartTotal={cartTotal}/>
        </div>
    );
};

export default CheckoutFilled;

