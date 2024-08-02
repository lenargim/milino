import React, {FC, useEffect} from 'react';
import {OrderFormType} from "../../../helpers/types";
import s from './sidebar.module.sass'
import {useLocation} from "react-router-dom";
import {
    getProductsByCategory, getSquare,
    useAppDispatch,
    useAppSelector
} from "../../../helpers/helpers";
import {
    productChangeMaterialType,
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
import sizesArr from "../../../api/sizes.json";
import Materials from "../../../common/Materials";

type SideBarType = {
    values: OrderFormType
}
const Sidebar: FC<SideBarType> = ({values}) => {
    const location = useLocation();
    const path = location.pathname.slice(1);
    const {room} = Object.assign({}, values);
    const cart = useAppSelector(state => state.general.cart);
    // const cartTotal = useAppSelector(state => state.general.cartTotal);
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
    // const shouldShowSidebarCart = isValid && cartTotal;

    // useEffect(() => {
    //     if (shouldShowSidebarCart) {
    //         cart.forEach(cartProduct => {
    //             const {
    //                 uuid,
    //                 category,
    //                 id,
    //                 price,
    //                 productExtra
    //             } = cartProduct;
    //
    //
    //             let products = getProductsByCategory(category);
    //             const productData: productDataType | undefined = products.find(product => product.id === id);
    //             if (productData && productExtra) {
    //                 const {attributes, legsHeight, isAngle, isBlind, customHeight, customDepth, id} = productData;
    //                 const {width, height, depth, led, blindWidth, type, doorProfile, options} = productExtra
    //                 const defProduct: productChangeMaterialType = {
    //                     ...cartProduct,
    //                     width,
    //                     height,
    //                     depth,
    //                     type,
    //                     isBlind,
    //                     isAngle,
    //                     attributes,
    //                     options
    //                 }
    //                 const priceData = getPriceData(id, category, materialData.basePriceType);
    //                 const productRange = getProductRange(priceData, category, customHeight, customDepth);
    //                 const productPriceData = getProductDataToCalculatePrice(defProduct, drawer.drawerBrand, productRange);
    //                 const sizeLimit: sizeLimitsType | undefined = sizesArr.find(size => size.productIds.includes(id))?.limits;
    //                 const {
    //                     drawersQty,
    //                     rolloutsQty,
    //                     doorValues,
    //                     shelfsQty
    //                 } = productPriceData;
    //                 const {widthRange, heightRange} = productRange
    //
    //                 if (!sizeLimit || !priceData) return;
    //                 const sizes: productSizesType = {
    //                     width,
    //                     height,
    //                     depth,
    //                     maxWidth: widthRange[widthRange.length - 1],
    //                     maxHeight: heightRange[heightRange.length - 1],
    //                 }
    //                 const doorArr = getDoorMinMaxValuesArr(width, doorValues);
    //                 const ledBorder = led?.border
    //                 const realBlindWidth: number = blindWidth || 0;
    //                 const doorWidth = getDoorWidth(width, realBlindWidth, isBlind, isAngle)
    //                 const doorHeight: number = height ? height - legsHeight : 0;
    //                 const doorSquare = getDoorSquare(doorWidth, doorHeight)
    //                 const frontSquare = getSquare(width, doorHeight);
    //                 const extraPrices: extraPricesType = {
    //                     ptoDoors: options.includes('PTO for doors') ? addPTODoorsPrice(attributes, type) : 0,
    //                     ptoDrawers: options.includes('PTO for drawers') ? addPTODrawerPrice(type, drawersQty) : 0,
    //                     ptoTrashBins: options.includes('PTO for Trash Bins') ? addPTOTrashBinsPrice() : 0,
    //                     glassShelf: options.includes('Glass Shelf') ? addGlassShelfPrice(shelfsQty) : 0,
    //                     glassDoor: options.includes('Glass Door') ? addGlassDoorPrice(doorSquare, doorProfile) : 0,
    //                     pvcPrice: getPvcPrice(width, realBlindWidth, doorHeight, isAcrylic, doorType, doorFinish),
    //                     frontSquare: frontSquare,
    //                     doorPrice: getDoorPrice(doorSquare, doorPriceMultiplier),
    //                     drawerPrice: getDrawerPrice(drawersQty + rolloutsQty, drawer, width, room),
    //                     ledPrice: getLedPrice(width, height, ledBorder),
    //                     boxMaterialCoef: options.includes("Box from finish material") ? boxMaterialCoefs.boxMaterialFinishCoef : boxMaterialCoefs.boxMaterialCoef,
    //                     premiumCoef: premiumCoef,
    //                     doorSquare: doorSquare,
    //                 }
    //
    //                 const allCoefs = extraPrices.boxMaterialCoef * premiumCoef;
    //                 const tablePrice: number | undefined = getTablePrice(width, height, depth, priceData, category)
    //                 const startPrice: number = getStartPrice(width, height, depth, allCoefs, sizeLimit, tablePrice);
    //                 const productPrice = calculatePrice(sizes, extraPrices, productRange, startPrice, isAngle);
    //                 if (productPrice.totalPrice !== price) {
    //                     dispatch(updateProductPrice({uuid: uuid, price: productPrice.totalPrice}))
    //                 }
    //             }
    //         })
    //     }
    // }, [values]);

    return (
        <aside className={s.sidebar}>
            <div className={s.sidebarContent}>
                <Materials data={values}/>
                {/*{shouldShowSidebarCart ? <SidebarCart cart={cart} total={cartTotal}/> : null}*/}
            </div>
        </aside>
    );
};

export default Sidebar;


