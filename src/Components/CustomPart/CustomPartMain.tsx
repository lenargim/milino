import React, {FC} from 'react';
import {OrderFormType} from "../../helpers/types";
import s from '../Product/product.module.sass'
import {getImg, useAppSelector} from "../../helpers/helpers";
import {Navigate} from "react-router-dom";
import CustomPartCabinet from "./CustomPartCabinet";
import Materials from "../../common/Materials";

const CustomPartMain: FC<{ materials: OrderFormType }> = ({materials}) => {
    const customPart = useAppSelector(state => state.general.customPart);
    if (!customPart) return <Navigate to={{pathname: '/cabinets'}}/>;
    const {name, image} = customPart;
    return (
        <div className={s.productWrap}>
            <div className={s.left}>
                <h2>{name}</h2>
                <div className={s.img}><img src={getImg('products/custom', image)} alt={name}/></div>
                <Materials data={materials}/>
            </div>
            <div className={s.right}>
                <CustomPartCabinet
                    customPart={customPart}
                    materials={materials}
                />
            </div>
        </div>
    );
};

export default CustomPartMain;