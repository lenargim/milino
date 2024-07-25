import React, {FC, useEffect} from 'react';
import {OrderFormType} from "../../../helpers/types";
import s from './sidebar.module.sass'
import {NavLink, useLocation} from "react-router-dom";
import {getProductsByCategory, useAppDispatch, useAppSelector} from "../../../helpers/helpers";
import {
    productChangeMaterialType, removeCart, setMaterials,
    updateProductPrice
} from "../../../store/reducers/generalSlice";
import {
    addGlassDoorPrice,
    addGlassShelfPrice,
    addPTODoorsPrice, addPTODrawerPrice, addPTOTrashBinsPrice,
    calculatePrice, getDoorMinMaxValuesArr, getDoorPrice, getDoorSquare, getDoorWidth, getDrawerPrice, getLedPrice,
    getMaterialData, getPriceData,
    getProductDataToCalculatePrice, getProductRange, getPvcPrice, getStartPrice, getTablePrice
} from "../../../helpers/calculatePrice";
import {extraPricesType, productDataType, productSizesType, sizeLimitsType} from "../../../helpers/productTypes";
import {FormikState} from "formik";
import sizesArr from "../../../api/sizes.json";
import SidebarCart from "./SidebarCart";

type SideBarType = {
    values: OrderFormType,
    resetForm?: (nextState?: Partial<FormikState<OrderFormType>>) => void,
    isValid: boolean
}
const Sidebar: FC<SideBarType> = ({values, resetForm, isValid}) => {
    const location = useLocation();
    const path = location.pathname.slice(1);
    const {room, ...data} = Object.assign({}, values);
    const cart = useAppSelector(state => state.general.cart);
    const cartTotal = useAppSelector(state => state.general.cartTotal);
    const materialData = getMaterialData(values);
    const dispatch = useAppDispatch();
    const {
        isAcrylic,
        drawer,
        doorType,
        doorFinish,
        doorPriceMultiplier,
        boxMaterialCoefs,
        premiumCoef
    } = materialData;
    const shouldShowSidebarCart = isValid && cartTotal;

    useEffect(() => {
        if (shouldShowSidebarCart) {
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
                    const {attributes, legsHeight, isAngle, isBlind, customHeight, customDepth, id} = productData;
                    const {width, height, depth, led, blindWidth, type, doorProfile, options} = productExtra
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
                    const productPriceData = getProductDataToCalculatePrice(defProduct, drawer.drawerBrand);
                    const priceData = getPriceData(id, category, materialData.basePriceType);
                    const productRange = getProductRange(priceData, category, customHeight, customDepth);
                    const sizeLimit: sizeLimitsType | undefined = sizesArr.find(size => size.productIds.includes(id))?.limits;
                    const {
                        drawersQty,
                        rolloutsQty,
                        doorValues,
                        shelfsQty
                    } = productPriceData;
                    const {widthRange, heightRange} = productRange

                    if (!sizeLimit || !priceData) return;
                    const sizes: productSizesType = {
                        width,
                        height,
                        depth,
                        maxWidth: widthRange[widthRange.length - 1],
                        maxHeight: heightRange[heightRange.length - 1],
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
                        doorPrice: getDoorPrice(doorSquare, doorPriceMultiplier, doorArr),
                        drawerPrice: getDrawerPrice(drawersQty + rolloutsQty, drawer, width),
                        ledPrice: getLedPrice(width, height, ledBorder),
                        boxMaterialCoef: options.includes("Box from finish material") ? boxMaterialCoefs.boxMaterialFinishCoef : boxMaterialCoefs.boxMaterialCoef,
                        premiumCoef: premiumCoef,
                        doorSquare: doorSquare,
                    }

                    const allCoefs = extraPrices.boxMaterialCoef * premiumCoef;
                    const tablePrice: number | undefined = getTablePrice(width, height, depth, priceData, category)
                    const startPrice: number = getStartPrice(width, height, depth, allCoefs, sizeLimit, tablePrice);
                    const productPrice = calculatePrice(sizes, extraPrices, productRange, startPrice, isAngle);
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
                room: '',
                'Door Type': '',
                'Door Finish Material': '',
                'Door Color': '',
                'Door Grain': '',
                'Box Material': '',
                'Drawer': '',
                'Drawer Type': '',
                'Drawer Color': '',
                'Leather': ''
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
                {Object.entries(data).filter(el => !!el[1]).map((el, index) => {
                    return (
                        <div key={index} className={s.chooseItem}>
                            <span>{el[0]}:</span>
                            <span>{el[1]}</span>
                        </div>
                    )
                })}
                {shouldShowSidebarCart ? <SidebarCart cart={cart}/> : null}
            </div>
            <div className={[s.sidebarBottom].join(' ')}>
                {cartTotal ?
                    <div className={s.cartTotal}>
                        <span>Total: </span>
                        <span>{cartTotal}$</span>
                    </div> : null}
                <div className={s.sidebarButtons}>
                    {path && <NavLink to={'/'} className={['button yellow'].join(' ')}>← Choose Materials</NavLink>}
                    {shouldShowSidebarCart ?
                        <NavLink to={'/checkout'} className={['button yellow'].join(' ')}>Checkout →</NavLink> : null}
                    {!path &&
                      <button type={"button"} onClick={resetMaterials} className={['button yellow'].join(' ')}>Reset
                        materials</button>}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;


