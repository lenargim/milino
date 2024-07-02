import React, {FC, useEffect} from 'react';
import {OrderFormType} from "../../../helpers/types";
import s from './sidebar.module.sass'
import {NavLink, useLocation} from "react-router-dom";
import {getProductsByCategory, useAppDispatch, useAppSelector} from "../../../helpers/helpers";
import {
    CartItemType,
    productChangeMaterialType, removeCart, setMaterials,
    updateProductPrice
} from "../../../store/reducers/generalSlice";
import {
    addGlassDoorPrice,
    addGlassShelfPrice,
    addPTODoorsPrice, addPTODrawerPrice, addPTOTrashBinsPrice,
    calculatePrice, getDoorMinMaxValuesArr, getDoorPrice, getDoorSquare, getDoorWidth, getDrawerPrice, getLedPrice,
    getMaterialData,
    getProductDataToCalculatePrice, getPvcPrice, getShelfsQty, getStartPrice, getTablePrice
} from "../../../helpers/calculatePrice";
import {extraPricesType, productDataType, productSizesType} from "../../../helpers/productTypes";
import CartItem from "../../Product/CartItem";
import {FormikState} from "formik";

type SideBarType = {
    values: OrderFormType,
    resetForm?: (nextState?: Partial<FormikState<OrderFormType>>) => void,
}
const Sidebar: FC<SideBarType> = ({values, resetForm}) => {
    const location = useLocation();
    const path = location.pathname.slice(1);
    const {room, ...data} = Object.assign({}, values);
    const cart = useAppSelector(state => state.general.cart);
    const cartTotal = useAppSelector(state => state.general.cartTotal);
    const materialData = getMaterialData(values);
    const dispatch = useAppDispatch();
    const {
        isAcrylic,
        basePriceType,
        drawer,
        doorType,
        doorFinish,
        doorPriceMultiplier,
        boxMaterialCoefs,
        premiumCoef
    } = materialData;

    const isCalcPrice = !!doorFinish && !!doorType;

    useEffect(() => {
        if (isCalcPrice) {
            cart.forEach(cartProduct => {
                const {
                    uuid,
                    category,
                    id,
                    price,
                    productExtra
                } = cartProduct;


                let products = getProductsByCategory(category);
                const productData: productDataType | undefined = products.find(product => product.id === id);
                if (productData && productExtra) {
                    const {attributes, legsHeight, isAngle, isBlind} = productData;
                    const {width, height, depth,led, blindWidth, type, doorProfile, options} = productExtra
                    const defProduct: productChangeMaterialType = {
                        ...cartProduct,
                        width,
                        height,
                        depth,
                        type,
                        isBlind,
                        isAngle,
                        attributes,
                        options
                    }
                    const productPriceData = getProductDataToCalculatePrice(defProduct, basePriceType, drawer.drawerBrand);
                    const {productRange, drawersQty, rolloutsQty, priceData, sizeLimit, doorValues, shelfsQty} = productPriceData;

                    if (!sizeLimit || !priceData) return;
                    const sizes: productSizesType = {
                        width,
                        height,
                        depth,
                        maxWidth: productRange.width[productRange.width.length - 2],
                        maxHeight: productRange.height[productRange.height.length - 2],
                    }
                    const doorArr = getDoorMinMaxValuesArr(width, doorValues);
                    const ledBorder = led?.border
                    const realBlindWidth: number = blindWidth || 0;
                    const doorWidth = getDoorWidth(width, realBlindWidth, isBlind, isAngle)
                    const doorHeight: number = height ? height - legsHeight : 0;
                    const doorSquare = getDoorSquare(doorWidth, doorHeight)
                    const extraPrices: extraPricesType = {
                        ptoDoors: options.includes('PTO for doors') ? addPTODoorsPrice(attributes, type) : 0,
                        ptoDrawers: options.includes('PTO for drawers') ? addPTODrawerPrice(type, drawersQty) : 0,
                        ptoTrashBins: options.includes('PTO for Trash Bins') ? addPTOTrashBinsPrice() : 0,
                        glassShelf: options.includes('Glass Shelf') ? addGlassShelfPrice(shelfsQty) : 0,
                        glassDoor: options.includes('Glass Door') ? addGlassDoorPrice(doorSquare, doorProfile) : 0,
                        pvcPrice: getPvcPrice(!isBlind ? width : width - realBlindWidth, doorHeight, isAcrylic, doorType, doorFinish),
                        doorPrice: getDoorPrice(doorSquare, doorPriceMultiplier,doorArr),
                        drawerPrice: getDrawerPrice(drawersQty + rolloutsQty, drawer, width),
                        ledPrice: getLedPrice(width, height, ledBorder),
                        boxMaterialCoef: options.includes("Box from finish material") ? boxMaterialCoefs.boxMaterialFinishCoef : boxMaterialCoefs.boxMaterialCoef,
                        premiumCoef: premiumCoef,
                        doorSquare: doorSquare,
                    }

                    const allCoefs = extraPrices.boxMaterialCoef * premiumCoef;
                    const tablePrice: number | undefined = getTablePrice(width, height, depth, priceData, category)
                    const startPrice: number = getStartPrice(width, height, depth, allCoefs, sizeLimit, tablePrice);
                    const productPrice = calculatePrice(sizes, extraPrices, productRange, startPrice);
                    if (productPrice.totalPrice !== price) {
                        dispatch(updateProductPrice({uuid: uuid, price: productPrice.totalPrice}))
                    }
                }
            })
        }
    }, [values]);

    const resetMaterials = () => {
        localStorage.removeItem('materials');
        if (resetForm) resetForm({
            values: {
                room: values.room,
                'Door Type': '',
                'Door Finish Material': '',
                'Door Color': '',
                'Door Grain': '',
                'Box Material': '',
                'Drawer': '',
                'Drawer Type': '',
                'Drawer Color': ''
            },
            submitCount: 0
        });
        dispatch(setMaterials(null))
        dispatch(removeCart())
    }


    return (
        <aside className={[s.sidebar, path === 'cabinets' ? s.cabinets : ''].join(' ')}>
            <div className={s.sidebarContent}>
                <span className={s.choose}>Materials you choose:</span>
                {Object.entries(data).map((el, index) => {
                    return (
                        <div key={index} className={s.chooseItem}>
                            <span>{el[0]}:</span>
                            <span>{el[1]}</span>
                        </div>
                    )
                })}
                {cartTotal && isCalcPrice ? <SidebarCart cart={cart}/> : null}
            </div>
            <div className={[s.sidebarBottom].join(' ')}>
                {cartTotal ?
                    <div className={s.cartTotal}>
                        <span>Total: </span>
                        <span>{cartTotal}$</span>
                    </div> : null}
                <div className={s.sidebarButtons}>
                    {path && <NavLink to={'/'} className={['button yellow'].join(' ')}>← Choose Materials</NavLink>}
                    {cartTotal && isCalcPrice ?
                        <NavLink to={'/checkout'} className={['button yellow'].join(' ')}>Checkout →</NavLink> : null}
                    {!path &&
                    <button type={"button"} onClick={resetMaterials} className={['button yellow'].join(' ')}>Reset materials</button>}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

export const SidebarCart: FC<{ cart: CartItemType[] }> = ({cart}) => {
    return (
        <>
            <h3>Cart</h3>
            {cart.map((item, key) => {
                return (
                    <CartItem item={item} key={key}/>
                )
            })}
        </>
    )
}

