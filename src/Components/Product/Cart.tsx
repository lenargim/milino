import React, {FC} from 'react';
import {getCartTotal, getFraction, getImg, useAppDispatch, useAppSelector} from "../../helpers/helpers";
import s from './product.module.sass'
import {CartItemType, deleteItemFromCart, updateProductAmount} from "../../store/reducers/generalSlice";
import {NavLink} from "react-router-dom";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;

const Cart = () => {
    const cart = useAppSelector(state => state.general.cart)
    const cartTotal = getCartTotal(cart);
    return (
        <div className={s.cart}>
            {cart.length
                ? <>
                    <div className={s.cartList}>
                        {cart.map((cartItem, index) => <CartItem key={index} item={cartItem}/>)}
                    </div>
                    <div className={s.cartBottom}>
                        <div className={s.cartTotal}>
                            <span>Total: </span>
                            <span>{cartTotal.toFixed(2)}$</span>
                        </div>
                        <NavLink to={'/cabinets'} className={['button yellow'].join(' ')}>← Back to cabinets</NavLink>
                        <NavLink to={'/checkout'} className={['button yellow'].join(' ')}>Proceed →</NavLink>
                    </div>
                </>
                : <div className={s.cartEmpty}>
                    <span>Your cart is empty</span>
                    <div className={[s.cartBottom, s.low].join(' ')}>
                        <NavLink to={'/cabinets'} className={['button yellow'].join(' ')}>← Back to cabinets</NavLink>
                    </div>
                </div>
            }
        </div>
    );
};

export default Cart;

type changeAmountType = 'plus' | 'minus'

export const CartItem: FC<{ item: CartItemType, isCheckout?: boolean }> = ({item, isCheckout= false}) => {
    const {
        uuid,
        name,
        img,
        price,
        depth,
        height,
        width,
        amount,
        hinge,
        options,
        doorProfile,
        doorGlassType,
        doorGlassColor,
        shelfProfile,
        shelfGlassType,
        shelfGlassColor,
        note,
        blindWidth,
        middleSection,
        led
    } = item;
    const dispatch = useAppDispatch();

    function changeAmount(type:changeAmountType) {
        if (type === 'minus' && amount>1) {
            dispatch(updateProductAmount({uuid: uuid, amount:amount -1}))
        } else if (type === 'plus') {
            dispatch(updateProductAmount({uuid: uuid, amount:amount +1}))
        }
    }


    return (
        <div className={s.cartItem} data-uuid={uuid}>
            <div className={s.cartItemTop}>
                {isCheckout ? null :<button onClick={() => dispatch(deleteItemFromCart(uuid))} className={s.itemClose} type={"button"}>×</button>}
                <img className={s.itemimg} src={getImg('products', img)} alt={name}/>
                <div className={s.itemName}>{name}</div>
            </div>
            <div className={s.itemOptions}>
                <div className={s.itemOption}>
                    <span>Width:</span>
                    <span>{getFraction(width)}</span>
                </div>
                {blindWidth ?
                    <div className={s.itemOption}>
                        <span>Blind Width:</span>
                        <span>{getFraction(blindWidth)}</span>
                    </div>
                : null}
                <div className={s.itemOption}>
                    <span>Height:</span>
                    <span>{getFraction(height)}</span>
                </div>
                {middleSection ?
                    <div className={s.itemOption}>
                        <span>Middle Section Height:</span>
                        <span>{getFraction(middleSection)}</span>
                    </div> : null
                }
                <div className={s.itemOption}>
                    <span>Depth:</span>
                    <span>{getFraction(depth)}</span>
                </div>
                {hinge ?
                <div className={s.itemOption}>
                    <span>Hinge opening:</span>
                    <span>{hinge}</span>
                </div> : null}
                {led ?
                    <div className={s.itemOption}>
                        <span>LED:</span>
                        <span>{`${led.border.map(el => el)}. ${led.alignment} ${led.indent ? led.indent + '"' : ''}`}</span>
                    </div> : null
                }

                {options.length ?
                    <>
                        <div className={s.optionsTitle}>Options:</div>
                        {options.includes('Glass Door') ?
                            <div className={s.itemOption}>
                                <span>Glass Door:</span>
                                <span>{`${doorProfile}|${doorGlassType}|${doorGlassColor}`}</span>
                            </div> : null
                        }

                        {options.includes('Glass Shelf') ?
                            <div className={s.itemOption}>
                                <span>Glass Door:</span>
                                <span>{`${shelfProfile}|${shelfGlassType}|${shelfGlassColor}`}</span>
                            </div> : null
                        }


                        {options.filter(option => option !== 'Glass Door' && option !== 'Glass Shelf').map((el, index) =>
                            <div className={s.itemOption} key={index}>
                                <span>{el}:</span>
                                <span>True</span>
                            </div>)}
                    </> : null
                }
                {note &&
                  <div className={s.itemOption}>
                    <span>Note:</span>
                    <span>{note}</span>
                  </div>
                }
            </div>
            <div className={s.itemPriceBlock}>
                <div className={s.itemSubPrice}>
                    {`${price}$ x ${amount}`}
                </div>
                <div className={s.buttons}>
                    <button value="minus" onClick={() =>changeAmount('minus')} type={"button"}>-</button>
                    <button value="plus" onClick={() =>changeAmount('plus')} type={"button"}>+</button>
                </div>
                <div className={s.itemTotalPrice}>{price * amount}$</div>
            </div>
        </div>
    )
}