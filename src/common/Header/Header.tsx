import React, {FC} from 'react';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import s from './header.module.sass'
import {getCartData, useAppDispatch, useAppSelector} from "../../helpers/helpers";
import CartSVG from "../../assets/img/cart";
import logo from '../../assets/img/SiteLogo.jpg'
import {removeCart, setMaterials} from "../../store/reducers/generalSlice";
import {FormikState} from 'formik';
import {OrderFormType} from "../../helpers/types";

const Header: FC<{ resetForm?: (nextState?: Partial<FormikState<OrderFormType>>) => void }> = ({resetForm}) => {
        const navigate = useNavigate()
        const dispatch = useAppDispatch();
        const materials = localStorage.getItem('materials');
        const location = useLocation();
        const path = location.pathname.slice(1);
        const cartState = useAppSelector(state => state.general.cart)
        const {length} = getCartData(cartState,dispatch);
        const isCabinetsPageShown = !['cabinets', ''].includes(path);
        const isChangeMaterialsPageShown = materials && path !== '';
        const isResetMaterialsShown = materials && path !== 'checkout';
        const isCartShown = length && path !== 'checkout';
        const resetMaterials = () => {
            localStorage.removeItem('materials');
            resetForm ?
                resetForm({
                    values: {
                        'Category': '',
                        'Door Type': '',
                        'Door Finish Material': '',
                        'Door Frame Width': '',
                        'Door Color': '',
                        'Door Grain': '',
                        'Box Material': '',
                        'Drawer': '',
                        'Drawer Type': '',
                        'Drawer Color': '',
                        'Leather Type': '',
                        'Leather Color': ''
                    },
                    submitCount: 0
                }) : navigate('/')
            dispatch(setMaterials(null))
            dispatch(removeCart())
        }
        return (
            <header className={s.header}>
                <div className={s.left}>
                    <NavLink to={'/'} className={s.logo}><img src={logo} alt="Milino"/></NavLink>
                    {isCabinetsPageShown ? <NavLink to={"/cabinets"} className={s.link}>Back to cabinets</NavLink> : null}
                </div>
                <div className={s.right}>
                    {isResetMaterialsShown ? <button type="button" onClick={() => resetMaterials()}>Reset</button> : null}
                    {isChangeMaterialsPageShown ? <NavLink to={"/"} className={s.link}>Change materials</NavLink> : null}
                    {isCartShown ? <Cart length={length}/> : null}
                </div>
            </header>
        );
    }
;

export default Header;


const Cart: FC<{ length: number }> = ({length}) => {
    return (
        <NavLink to={'/checkout'} className={s.cart}>
            <CartSVG classes={s.cart}/>
            <span>{length}</span>
        </NavLink>
    )
}