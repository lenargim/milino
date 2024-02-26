import React, {FC} from 'react';
import {getImg, useAppDispatch, useAppSelector} from "../../helpers/helpers";
import s from './product.module.sass'
import {CartItemType, deleteItemFromCart} from "../../store/reducers/generalSlice";

const Cart = () => {
    const cart = useAppSelector(state => state.general.cart)
    const cartTotal = cart.reduce(
        (acc, currentVal) => acc + (currentVal.price * currentVal.amount), 0
    )
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
                            <span>{cartTotal}$</span>
                        </div>
                    </div>
                </>
                : <div className={s.cartEmpty}>Your cart is empty</div>
            }
        </div>
    );
};

export default Cart;

const CartItem: FC<{ item: CartItemType }> = ({item}) => {
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
        note
    } = item;
const dispatch = useAppDispatch()

    return (
        <div className={s.cartItem} data-uuid={uuid}>
            <div className={s.cartItemTop}>
                <button onClick={() => dispatch(deleteItemFromCart(uuid))} className={s.itemClose} type={"button"}>×</button>
                <img className={s.itemimg} src={getImg('products', img)} alt={name}/>
                <div className={s.itemName}>{name}</div>
            </div>
            <div className={s.itemOptions}>
                <div className={s.itemOption}>
                    <span>Width:</span>
                    <span>{width}</span>
                </div>
                <div className={s.itemOption}>
                    <span>Height:</span>
                    <span>{height}</span>
                </div>
                <div className={s.itemOption}>
                    <span>Depth:</span>
                    <span>{depth}</span>
                </div>
                {hinge ?<div className={s.itemOption}>
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