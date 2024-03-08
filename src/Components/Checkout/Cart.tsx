import React, {FC} from 'react';
import {CartItemType} from "../../store/reducers/generalSlice";
import s from './../Product/product.module.sass'
import {NavLink} from "react-router-dom";
import {CartItem} from "../Product/Cart";

const Cart: FC<{ cart: CartItemType[] }> = ({cart}) => {
    const cartTotal = cart.reduce(
        (acc, currentVal) => acc + (currentVal.price * currentVal.amount), 0
    )
    return (
        <div className={s.cart}>
            <div className={[s.cartList, s.checkout].join(' ')}>
                {cart.map((el, index) => <CartItem isCheckout={true} key={index} item={el}/>)}
            </div>
            <div className={[s.cartBottom, s.low].join(' ')}>
                <div className={s.cartTotal}>
                    <span>Total: </span>
                    <span>{cartTotal.toFixed(2)}$</span>
                </div>
                <NavLink to={'/cabinets'} className={['button yellow'].join(' ')}>← Back to cabinets</NavLink>
            </div>
        </div>

    );
};

export default Cart;
