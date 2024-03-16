import React, {FC} from 'react';
import Header from "../../common/Header/Header";
import s from './product.module.sass'
import ProductMain from "./ProductMain";
import Cart from "./Cart";
import {Navigate, useParams} from "react-router-dom";
import {OrderFormType} from "../../helpers/types";
import {useAppDispatch} from "../../helpers/helpers";
import {productDataType, productType, productTypings} from "../../helpers/productTypes";
import {setProduct} from "../../store/reducers/generalSlice";
import settings from './../../api/settings.json'
import baseCabinetProducts from "../../api/products.json";
import wallCabinetProducts from "../../api/productsWall.json";
import {DepthRangeType} from "./BaseCabinetForm";
type initialDataType = {
    type: productTypings,
    height: number,
    depth: number

}
const Product: FC = () => {
    const dispatch = useAppDispatch()
    const materialsString = localStorage.getItem('materials');
    const materials: OrderFormType = materialsString ? JSON.parse(materialsString) : <Navigate to={{pathname: '/'}}/>;
    let {productId, category} = useParams();
    let products;
    switch (category) {
        case 'Base Cabinets':
            products = baseCabinetProducts as productDataType[];
            break;
        case 'Wall Cabinets':
            products= wallCabinetProducts as productDataType[];
            break
        default:
            products = [] as productDataType[]
    }
    const product: productDataType | undefined = products.find(product => (product.id).toString() === productId) as productType
    if (!product || !category) return <Navigate to={{pathname: '/cabinets'}}/>;
    const depthRange: DepthRangeType = settings.depthRange;
    const initialData: initialDataType = {type: 1, height: 0, depth: depthRange[category]}
    dispatch(setProduct({...product, ...initialData}))
    return (
        <div className={s.wrap}>
            <div className={s.main}>
                <Header/>
                <ProductMain materials={materials}/>
            </div>
            <Cart/>
        </div>
    );
};

export default Product;