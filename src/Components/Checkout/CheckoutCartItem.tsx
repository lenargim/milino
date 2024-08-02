import React, {FC} from 'react';
import s from './checkout.module.sass'
import {CartItemType, updateProductAmount} from "../../store/reducers/generalSlice";
import CartItemOptions from "../Product/CartItemOptions";
import {getImg, useAppDispatch} from "../../helpers/helpers";
import {changeAmountType} from "../Product/Cart";

const CheckoutCartItem:FC<{el: CartItemType}> = ({el}) => {
    const dispatch = useAppDispatch()
    const {
        uuid,
        name,
        img,
        price,
        amount,
        note,
        category
    } = el;
    const image = getImg(category === 'Custom Parts' ? 'products/custom' : 'products', img);
    function changeAmount(type: changeAmountType) {
        dispatch(updateProductAmount({uuid: uuid, amount: type === 'minus' ? amount - 1 : amount + 1}))
    }
    return (
        <div className={s.cartItem}>
            <img className={s.img} src={image} alt={name}/>
            <div className={s.itemData}>
                <div className={s.itemName}>{name} <span className={s.category}>{category}</span></div>
                <div className={s.attrs}>
                    <CartItemOptions item={el} />
                </div>
                {note ? <div className={s.note}>*{note}</div> : null}
            </div>
            <div className={s.itemPrice}>{price}$</div>
            <div className={s.buttons}>
                <button value="minus" disabled={amount <= 1} onClick={() => changeAmount('minus')}
                        type={"button"}>-
                </button>
                <span>{amount}</span>
                <button value="plus" onClick={() => changeAmount('plus')} type={"button"}>+</button>
            </div>
            <div className={s.sum}>{(price * amount).toFixed(1)}$</div>
        </div>
    );
};

export default CheckoutCartItem;