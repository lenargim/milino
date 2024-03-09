import React, {FC} from 'react';
import {OrderFormType} from "../../helpers/types";
import s from './product.module.sass'
import BaseCabinetForm from "./BaseCabinetForm";
import {getImg, getProductImage, useAppSelector} from "../../helpers/helpers";
import {pricesTypings} from "../../helpers/productTypes";
import {AtrrsList} from "../Cabinets/List";
import {Navigate} from "react-router-dom";

export type getBoxMaterialCoefsType = {
    boxMaterialCoef: number,
    boxMaterialFinishCoef: number
}

export type drawerType = {
    drawerBrand: string,
    drawerType: string,
    drawerColor: string
}

const getBasePriceType = (doorType: string, doorFinish: string): pricesTypings => {
    if (doorType === 'Painted' || doorType === 'Slatted' || doorType === 'Micro Shaker') return 3
    if (doorFinish.includes('Milino') || doorFinish.includes('No Doors')) return 1;
    if (doorFinish.includes('Syncron') || doorFinish === 'Cleaf') return 2
    return 3
}

const getPremiumCoef = (doorType: string, doorFinish: string): number => {
    if (doorType === 'Painted' || doorType === 'Slatted' || doorType === 'Micro Shaker') return 1.05;
    if (doorFinish === 'Stone') return 1.69
    if (doorFinish === 'Zenit') return 1.03
    if (doorFinish === 'Ultrapan Acrylic') return 1.1
    return 1
}

const getGrainCoef = (doorGrain: string): number => {
    return doorGrain === 'Gorizontal' ? 1.1 : 1
}

const getBoxMaterialCoefs = (boxMaterial: string, doorFinish: string): getBoxMaterialCoefsType => {
    return {
        boxMaterialCoef: boxMaterial.includes('Plywood') ? 1.2 : 1,
        boxMaterialFinishCoef: doorFinish === 'Cleaf' || doorFinish === 'Syncron' ? 1.845 : 2.706
    }
}

const getDoorPriceMultiplier = (doorType: string, doorFinish: string): number => {
    if (doorType === 'Slab') return 0
    if (doorType === 'Painted' || doorType === 'Slatted') return 37.8
    if (doorType === 'Micro Shaker') return 36
    if (doorType === 'No Doors') return -8
    if (doorFinish === 'Syncron') return 30
    if (doorFinish === 'Luxe') return 36
    if (doorFinish === 'Zenit') return (36 * 1.03)
    return 0
}

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

    const drawer: drawerType = {
        drawerBrand,
        drawerType,
        drawerColor
    }
    const basePriceType: pricesTypings = getBasePriceType(doorType, doorFinish);
    const baseCoef = basePriceType === 3 ? getPremiumCoef(doorType, doorFinish) : 1;
    const grainCoef = doorGrain ? getGrainCoef(doorGrain) : 1;
    const premiumCoef = baseCoef * grainCoef
    const boxMaterialCoefs = getBoxMaterialCoefs(boxMaterial, doorFinish)
    const doorPriceMultiplier = getDoorPriceMultiplier(doorType, doorFinish)
    return (
        product ?
            <div className={s.productWrap}>
                <div className={s.left}>
                    <h2>{name}</h2>
                    <div className={s.img}><img src={getImg('products', img)} alt={product.name}/></div>
                    <AtrrsList attributes={attributes} type={type} />
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
                    {room === 'Kitchen' && <BaseCabinetForm
                      product={product}
                      basePriceType={basePriceType}
                      premiumCoef={premiumCoef}
                      boxMaterialCoefs={boxMaterialCoefs}
                      drawer={drawer}
                      doorPriceMultiplier={doorPriceMultiplier}
                      doorType={doorType}
                      doorFinish={doorFinish}
                    />}
                </div>
            </div>
            : <div>Product unavailable</div>
    );
};

export default ProductMain;