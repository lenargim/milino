import React, {FC} from 'react';
import {OrderFormType} from "../../helpers/types";
import s from './product.module.sass'
import BaseCabinetForm from "./BaseCabinetForm";
import {getAttributes, getImg, getProductImage, useAppSelector} from "../../helpers/helpers";
import {Navigate} from 'react-router-dom';
import {productType} from "../../helpers/productTypes";

export type basePriceTypes = 1 | 2 | 3

export type getBoxMaterialCoefsType = {
    boxMaterialCoef: number,
    boxMaterialPTOCoef: number
}

const getBasePriceType = (doorType: string,doorFinish: string): basePriceTypes => {
    if (doorType === 'Painted' || doorType === 'Slatted' || doorType === 'Micro Shaker') return 3
    if (doorFinish.includes('Milino') || doorFinish.includes('No Doors')) return 1;
    if (doorFinish.includes('Syncron') || doorFinish === 'Cleaf') return 2
    return 3
}

const getPremiumCoef = (doorType: string,doorFinish: string): number => {
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
        boxMaterialPTOCoef: doorFinish === 'Cleaf' || doorFinish === 'Syncron' ? 1.845 : 2.706
    }
}

const ProductMain: FC<{ materials: OrderFormType }> = ({materials}) => {
    const product = useAppSelector<productType | null>(state => state.general.product);
    const doorSquare = useAppSelector<number | undefined>(state => state.general.product?.doorSquare);
    if (!product) return <Navigate to={{pathname: '/cabinets'}}/>;
    const {room, ...data} = Object.assign({}, materials);
    const dataMaterialsArr = Object.entries(data);
    const {type, attributes, name, category, images} = product;
    const img = getProductImage(images, type)
    const attrArr = getAttributes(attributes, type);
    const {
        ['Door Type']: doorType,
        ['Door Finish Material']: doorFinish,
        ['Door Grain']: doorGrain,
        ['Box Material']: boxMaterial,
        ['Drawer']: drawer

    } = materials

    const basePriceType: basePriceTypes = getBasePriceType(doorType, doorFinish);
    const baseCoef = basePriceType === 3 ? getPremiumCoef(doorType,doorFinish) : 1;
    const grainCoef = doorGrain ? getGrainCoef(doorGrain) : 1;
    const premiumCoef = baseCoef*grainCoef
    const boxMaterialCoefs = getBoxMaterialCoefs(boxMaterial, doorFinish)
    const doorsQty = attrArr.find(el => el.name === 'Door')?.value || 0;
    const isAcrylic = doorFinish === 'Ultrapan Acrylic';

    return (
        product ?
            <div className={s.productWrap}>
                <div className={s.left}>
                    <h2>{name}</h2>
                    <div className={s.img}><img src={getImg('products', img)} alt={product.name}/></div>
                    <div className={s.attributes}>
                        {attrArr.map((attr, index) => {
                            const isMultiple = attr.value > 1;
                            return (
                                <div key={index}>
                                    <span>{attr.name}{isMultiple ? 's': ''}: </span>
                                    <span>{attr.value}</span>
                                </div>
                            )
                        })}
                        {doorSquare ? <div>
                            <span>Door Square: </span><span>{(doorSquare/144).toFixed(2)}ft</span>
                        </div> : null}
                    </div>
                    <div className={s.materials}>
                        {dataMaterialsArr.map((material, index) => <div key={index}>
                            <span>{material[0]}: </span>
                            <span>{material[1]}</span>
                        </div>)}
                        {}
                    </div>

                </div>
                <div className={s.right}>
                    {category === 'Base Cabinets' && <BaseCabinetForm
                      product={product}
                      basePriceType={basePriceType}
                      premiumCoef={premiumCoef}
                      boxMaterialCoefs={boxMaterialCoefs}
                      doorsQty={doorsQty}
                      isAcrylic={isAcrylic}
                      drawer={drawer}
                    />}
                </div>
            </div>
            : <div>Product unavailable</div>
    );
};

export default ProductMain;