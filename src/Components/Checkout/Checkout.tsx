import React from 'react';
import {useAppSelector} from "../../helpers/helpers";
import s from './checkout.module.sass'
import CheckoutFilled from "./CheckoutFilled";
import CartEmpty from "./CartEmpty";

const Checkout = () => {
    const cart = useAppSelector(state => state.general.cart);
    const cartTotal = useAppSelector(state => state.general.cartTotal);
    const isCart = cart.length;
    return (
        <div className={s.checkout}>
            {isCart
                ? <CheckoutFilled cart={cart} cartTotal={cartTotal}/>
                : <CartEmpty />
            }
        </div>
    );
};

export default Checkout;