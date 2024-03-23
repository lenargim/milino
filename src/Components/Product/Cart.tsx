import React, {FC} from 'react';
import {getCartTotal, getImg, useAppDispatch, useAppSelector} from "../../helpers/helpers";
import s from './product.module.sass'
import {CartItemType, deleteItemFromCart} from "../../store/reducers/generalSlice";
import {NavLink} from "react-router-dom";

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
        profile,
        glassType,
        glassColor,
        glassShelf,
        note,
        doors,
        blindWidth
    } = item;
    const dispatch = useAppDispatch();
    const doorsText = doors ? `(${doors} door${doors>1 ? 's':''})` : ''

    return (
        <div className={s.cartItem} data-uuid={uuid}>
            <div className={s.cartItemTop}>
                {isCheckout ? null :<button onClick={() => dispatch(deleteItemFromCart(uuid))} className={s.itemClose} type={"button"}>×</button>}
                <img className={s.itemimg} src={getImg('products', img)} alt={name}/>
                <div className={s.itemName}>{name}</div>
            </div>
            <div className={s.itemOptions}>
                <div className={s.itemOption}>
                    <span>Width {doorsText}:</span>
                    <span>{width}</span>
                </div>
                {blindWidth ?
                    <div className={s.itemOption}>
                        <span>Blind Width:</span>
                        <span>{blindWidth}</span>
                    </div>
                : null}
                <div className={s.itemOption}>
                    <span>Height:</span>
                    <span>{height}</span>
                </div>
                <div className={s.itemOption}>
                    <span>Depth:</span>
                    <span>{depth}</span>
                </div>
                {hinge ? <div className={s.itemOption}>
                    <span>Hinge opening:</span>
                    <span>{hinge}</span>
                </div> : null}
                {options.length ?
                    <>
                        <div className={s.optionsTitle}>Options:</div>
                        {profile &&
                          <div className={s.itemOption}>
                            <span>Profile:</span>
                            <span>{profile}</span>
                          </div>
                        }
                        {glassType &&
                          <div className={s.itemOption}>
                            <span>Glass Type:</span>
                            <span>{glassType}</span>
                          </div>
                        }
                        {glassColor &&
                          <div className={s.itemOption}>
                            <span>Glass Color:</span>
                            <span>{glassColor}</span>
                          </div>
                        }
                        {glassShelf &&
                          <div className={s.itemOption}>
                            <span>Glass Shelf:</span>
                            <span>{glassShelf}</span>
                          </div>
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
                <div className={s.itemTotalPrice}>{price * amount}$</div>
            </div>
        </div>
    )
}