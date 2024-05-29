import React, {FC} from 'react';
import {getCartTotal, getFraction, getImg, useAppDispatch, useAppSelector} from "../../helpers/helpers";
import s from './../OrderForm/Sidebar/sidebar.module.sass'
import {
    CartItemType, customPartExtraType,
    deleteItemFromCart,
    productExtraType,
    updateProductAmount
} from "../../store/reducers/generalSlice";
import {NavLink} from "react-router-dom";
import {SidebarCart} from "../OrderForm/Sidebar/Sidebar";

const Cart = () => {
    const cart = useAppSelector(state => state.general.cart)
    const cartTotal = getCartTotal(cart);
    return (
        <div className={[s.sidebar, s.product].join(' ')}>
            <div className={s.sidebarContent}>
                {cartTotal
                    ? <SidebarCart cart={cart}/>
                    : <div className={s.cartEmpty}>
                        <span>Your cart is empty</span>
                    </div>
                }
                <div className={s.sidebarBottom}>
                    {cartTotal ?
                    <div className={s.cartTotal}>
                        <span>Total: </span>
                        <span>{cartTotal}$</span>
                    </div> : null }
                    <div className={s.sidebarButtons}>
                        <NavLink to={'/'} className={['button yellow'].join(' ')}>← Change materials</NavLink>
                        <NavLink to={'/cabinets'} className={['button yellow'].join(' ')}>← Back to
                            cabinets</NavLink>
                        {cartTotal ?<NavLink to={'/checkout'} className={['button yellow'].join(' ')}>Checkout →</NavLink> : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

type changeAmountType = 'plus' | 'minus'

export const CartItem: FC<{ item: CartItemType, isCheckout?: boolean }> = ({item, isCheckout = false}) => {
    const {
        uuid,
        name,
        img,
        price,
        depth,
        height,
        width,
        amount,
        note,
        category,
        productExtra,
        customPartExtra
    } = item;
    const dispatch = useAppDispatch();

    function changeAmount(type: changeAmountType) {
        dispatch(updateProductAmount({uuid: uuid, amount: type === 'minus' ? amount - 1 : amount + 1}))
    }

    const image = getImg(category === 'Custom Parts' ? 'panels' : 'products', img)

    return (
        <div className={s.cartItem} data-uuid={uuid}>
            <div className={s.cartItemTop}>
                {isCheckout ? null : <button onClick={() => dispatch(deleteItemFromCart(uuid))} className={s.itemClose}
                                             type={"button"}>×</button>}
                <img className={s.itemimg} src={image} alt={name}/>
                <div className={s.itemName}>{name}</div>
            </div>
            <div className={s.itemOptions}>
                <div className={s.itemOption}>
                    <span>Dimentions:</span>
                    <span>{getFraction(width)}"W x {getFraction(height)}"H x {getFraction(depth)}"D</span>
                </div>

                {productExtra && <CartItemExtra productExtra={productExtra}/>}
                {customPartExtra && <CartItemCustomExtra productExtra={customPartExtra}/>}

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
                <div className={s.itemTotalPrice}>{(price * amount).toFixed(2)}$</div>
            </div>
        </div>
    )
}

const CartItemExtra: FC<{ productExtra: productExtraType }> = ({productExtra}) => {
    const {
        led,
        blindWidth,
        middleSection,
        hinge,
        options,
        doorProfile,
        doorGlassType,
        doorGlassColor,
        shelfProfile,
        shelfGlassType,
        shelfGlassColor
    } = productExtra
    return (
        <>
            {blindWidth ?
                <div className={s.itemOption}>
                    <span>Blind Width:</span>
                    <span>{getFraction(blindWidth)}</span>
                </div>
                : null}

            {middleSection ?
                <div className={s.itemOption}>
                    <span>Middle Section Height:</span>
                    <span>{getFraction(middleSection)}</span>
                </div> : null
            }
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
        </>
    )
}

const CartItemCustomExtra: FC<{ productExtra: customPartExtraType }> = ({productExtra}) => {
    const {material} = productExtra;
    return (
        <>
            {material &&
              <div className={s.itemOption}>
                <span>Material:</span>
                <span>{material}</span>
              </div>}
        </>

    )
}