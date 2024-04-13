import React, {FC} from 'react';
import Header from "../../common/Header/Header";
import s from './product.module.sass'
import ProductMain from "./ProductMain";
import Cart from "./Cart";
import {Navigate, useParams} from "react-router-dom";
import {OrderFormType} from "../../helpers/types";
import {getProductsByCategory, useAppDispatch} from "../../helpers/helpers";
import {productCategory, productDataType, productTypings} from "../../helpers/productTypes";
import {setProduct} from "../../store/reducers/generalSlice";
import {getDepthRange} from "../../helpers/calculatePrice";
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
    const trueCat = category as productCategory;
    let products = getProductsByCategory(trueCat);

    const product: productDataType | undefined = products.find(product => (product.id).toString() === productId)
    if (!product || !category) return <Navigate to={{pathname: '/cabinets'}}/>;
    const depthRange = getDepthRange(product.category,product.customDepth);
    const initialData: initialDataType = {type: 1, height: 0, depth: depthRange[0]}
    localStorage.setItem('category', category);
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