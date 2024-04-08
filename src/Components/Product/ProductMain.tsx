import React, {FC} from 'react';
import {OrderFormType} from "../../helpers/types";
import s from './product.module.sass'
import {getImg, getProductImage, useAppSelector} from "../../helpers/helpers";
import {drawerInterface, pricesTypings} from "../../helpers/productTypes";
import {AtrrsList} from "../Cabinets/List";
import {Navigate} from "react-router-dom";
import {
    getBasePriceType,
    getBoxMaterialCoefs,
    getDoorPriceMultiplier,
    getGrainCoef,
    getPremiumCoef
} from "../../helpers/calculatePrice";
import Cabinet from "./Cabinet";


const ProductMain: FC<{ materials: OrderFormType }> = ({materials}) => {
    const {room, ...data} = Object.assign({}, materials);
    const product = useAppSelector(state => state.general.product);
    if (!product) return <Navigate to={{pathname: '/cabinets'}}/>;
    const dataMaterialsArr = Object.entries(data);
    const {type, attributes, name, images} = product;
    const img = getProductImage(images, type);
    const {
        ['Door Type']: doorType,
        ['Door Finish Material']: doorFinish,
        ['Door Grain']: doorGrain,
        ['Box Material']: boxMaterial,
        ['Drawer']: drawerBrand,
        ['Drawer Type']: drawerType,
        ['Drawer Color']: drawerColor
    } = materials;

    const drawer: drawerInterface = {
        drawerBrand,
        drawerType,
        drawerColor
    }
    const basePriceType: pricesTypings = getBasePriceType(doorType, doorFinish);
    const baseCoef = basePriceType === 3 ? getPremiumCoef(doorType, doorFinish) : 1;
    const grainCoef = doorGrain ? getGrainCoef(doorGrain) : 1;
    const premiumCoef = +(baseCoef * grainCoef).toFixed(3)
    const boxMaterialCoefs = getBoxMaterialCoefs(boxMaterial, doorFinish)
    const doorPriceMultiplier = getDoorPriceMultiplier(doorType, doorFinish)
    return (
        <div className={s.productWrap}>
            <div className={s.left}>
                <h2>{name}</h2>
                <div className={s.img}><img src={getImg('products', img)} alt={product.name}/></div>
                <AtrrsList attributes={attributes} type={type}/>
                <div className={s.materials}>
                    {dataMaterialsArr.map((material, index) => {
                        if (!material[1]) return null;
                        return (
                            <div key={index}>
                                <span>{material[0]}: </span>
                                <span>{material[1]}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className={s.right}>
                <Cabinet
                    product={product}
                    basePriceType={basePriceType}
                    premiumCoef={premiumCoef}
                    boxMaterialCoefs={boxMaterialCoefs}
                    drawer={drawer}
                    doorPriceMultiplier={doorPriceMultiplier}
                    doorType={doorType}
                    doorFinish={doorFinish}
                />
            </div>
        </div>
    );
};

export default ProductMain;