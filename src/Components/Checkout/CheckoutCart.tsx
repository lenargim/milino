import React, {FC} from 'react';
import {CartItemType} from "../../store/reducers/generalSlice";
import CheckoutCartItem from "./CheckoutCartItem";
import s from './checkout.module.sass'

const CheckoutCart: FC<{ cart: CartItemType[], total:number }> = ({cart, total}) => {
    return (
        <div className={s.cart}>
            <h2 className={s.cartTitle}>Cart</h2>
            <div className={s.table}>
                <div className={s.header}>
                    <span>Image</span><span>Description</span><span>Price</span><span>Qty</span><span>Product total</span>
                </div>
                {cart.map(el => <CheckoutCartItem key={el.uuid} el={el}/>)}
            </div>
            <div className={s.total}>Total price:{total}$</div>
        </div>
    );
};

export default CheckoutCart;

