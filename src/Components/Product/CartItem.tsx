import React, {FC} from 'react';
import {CartItemType, deleteItemFromCart, updateProductAmount} from "../../store/reducers/generalSlice";
import {getFraction, getImg, useAppDispatch} from "../../helpers/helpers";
import s from "../OrderForm/Sidebar/sidebar.module.sass";
import {changeAmountType} from "./Cart";
import CartItemOptions from "./CartItemOptions";

export const CartItem: FC<{ item: CartItemType, isCheckout?: boolean }> = ({item, isCheckout = false}) => {
    const {
        uuid,
        name,
        img,
        price,
        amount,
        note,
        category,
    } = item;
    const dispatch = useAppDispatch();

    function changeAmount(type: changeAmountType) {
        dispatch(updateProductAmount({uuid: uuid, amount: type === 'minus' ? amount - 1 : amount + 1}))
    }
    const image = getImg(category === 'Custom Parts' ? 'products/custom' : 'products', img);

    return (
        <div className={s.cartItem} data-uuid={uuid}>
            <div className={s.cartItemTop}>
                {isCheckout ? null : <button onClick={() => dispatch(deleteItemFromCart(uuid))} className={s.itemClose}
                                             type={"button"}>×</button>}
                <img className={s.itemimg} src={image} alt={name}/>
                <div className={s.itemName}>{name}</div>
            </div>

            <div className={s.itemOptions}>
                <CartItemOptions item={item} />
                {note &&
                  <div className={s.itemOption}>
                    <span>Note:</span>
                    <span>{note}</span>
                  </div>
                }
            </div>


            <div className={s.itemPriceBlock}>
                <div className={s.itemSubPrice}>
                    {`${price}$ x `}<span className={s.amount}>{amount}</span>
                </div>
                <div className={s.buttons}>
                    <button value="minus" disabled={amount <= 1} onClick={() => changeAmount('minus')}
                            type={"button"}>-
                    </button>
                    <button value="plus" onClick={() => changeAmount('plus')} type={"button"}>+</button>
                </div>
                <div className={s.itemTotalPrice}>{(price * amount).toFixed(1)}$</div>
            </div>
        </div>
    )
}

export default CartItem;

export const Dimentions:FC<{width?:number, height?:number, depth?:number}> = ({width, height, depth}) => {
    const widthPart = width ? `${getFraction(width)}"W x` : '';
    const heightPart = height ? `${getFraction(height)}"H` : '';
    const depthPart = depth ? `x ${getFraction(depth)}"D` : '';
    const dimentions = `${widthPart} ${heightPart} ${depthPart}`

    return (
        <>
            {widthPart || heightPart || depthPart ?
                <div className={s.itemOption}>
                    <span>Dimentions:</span>
                    <span>{dimentions}</span>
                </div> : null
            }
        </>
    )
}