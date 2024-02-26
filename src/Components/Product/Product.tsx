import React, {FC} from 'react';
import Header from "../../common/Header/Header";
import s from './product.module.sass'
import ProductMain from "./ProductMain";
import Cart from "./Cart";
import {Navigate} from "react-router-dom";
import {OrderFormType} from "../../helpers/types";



const Product: FC = () => {
    const materialsString = localStorage.getItem('materials');
    const materials:OrderFormType = materialsString ? JSON.parse(materialsString) : <Navigate to={{pathname: '/'}}/>;

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