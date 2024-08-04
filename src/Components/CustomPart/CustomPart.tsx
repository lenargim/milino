import React, {FC} from 'react';
import Header from "../../common/Header/Header";
import s from '../Product/product.module.sass'
import Cart from "../Product/Cart";
import {Navigate, useParams} from "react-router-dom";
import {OrderFormType} from "../../helpers/types";
import {getcustomParts, useAppDispatch} from "../../helpers/helpers";
import {setCustomPart} from "../../store/reducers/generalSlice";
import CustomPartMain from "./CustomPartMain";

const CustomPart: FC = () => {
    const dispatch = useAppDispatch()
    const materialsString = localStorage.getItem('materials');
    const materials: OrderFormType = materialsString ? JSON.parse(materialsString) : <Navigate to={{pathname: '/'}}/>;
    const {Category} = materials;
    let {productId} = useParams();
    const customParts = Category && productId ? getcustomParts() : [];
    const customPart = customParts.find(part => (part.id).toString() === productId);
    if (!customPart ) return <Navigate to={{pathname: '/cabinets'}}/>;
    localStorage.setItem('category', 'Custom Parts');
    dispatch(setCustomPart(customPart))
    return (
        <div className={s.wrap}>
            <div className={s.main}>
                <Header/>
                <CustomPartMain materials={materials}/>
            </div>
            <Cart/>
        </div>
    );
};

export default CustomPart;