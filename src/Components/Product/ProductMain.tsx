import React, {FC} from 'react';
import {OrderFormType} from "../../helpers/types";
import s from './product.module.sass'
import {getImg, getProductImage, useAppSelector} from "../../helpers/helpers";
import {AtrrsList} from "../Cabinets/List";
import {Navigate} from "react-router-dom";
import {getMaterialData} from "../../helpers/calculatePrice";
import Cabinet from "./Cabinet";
import {productDataType, productType} from "../../helpers/productTypes";
type ProductMainType = {
    product: productType|null,
    materials: OrderFormType
}
const ProductMain: FC<ProductMainType> = ({product,materials}) => {
    const {room, ...data} = Object.assign({}, materials);
    if (!product) return <Navigate to={{pathname: '/cabinets'}}/>;
    const dataMaterialsArr = Object.entries(data);
    const {type, attributes, name, images} = product;
    const img = getProductImage(images, type);
    const materialData = getMaterialData(materials);
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
                    materialData={materialData}
                />
            </div>
        </div>
    );
};

export default ProductMain;