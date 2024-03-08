import React from 'react';
import s from './../Product/product.module.sass'
import {NavLink} from "react-router-dom";
import style from './checkout.module.sass'

const CartEmpty = () => {
    return (
        <div className={s.wrap}>
            <div className={s.main}>
                <div className={style.empty}>
                    <h1>Cart is empty</h1>
                    <NavLink to={'/cabinets'} className={'button submit'}>← Back</NavLink>
                </div>
            </div>
        </div>
    );
};

export default CartEmpty;