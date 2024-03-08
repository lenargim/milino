import React from 'react';
import {useAppSelector} from "../../helpers/helpers";
import s from './checkout.module.sass'
import CheckoutFilled from "./CheckoutFilled";
import CartEmpty from "./CartEmpty";

const Checkout = () => {
    const cart = useAppSelector(state => state.general.cart);
    const isCart = cart.length;
    return (
        <div className={s.checkout}>
            {isCart
                ? <CheckoutFilled cart={cart}/>
                : <CartEmpty />
            }
        </div>
    );
};

export default Checkout;