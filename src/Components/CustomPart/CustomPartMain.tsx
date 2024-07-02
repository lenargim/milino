import React, {FC} from 'react';
import {OrderFormType} from "../../helpers/types";
import s from '../Product/product.module.sass'
import {getImg, useAppSelector} from "../../helpers/helpers";
import {Navigate} from "react-router-dom";
import CustomPartCabinet from "./CustomPartCabinet";

const CustomPartMain: FC<{ materials: OrderFormType }> = ({materials}) => {
    const {room, ...data} = Object.assign({}, materials);
    const dataMaterialsArr = Object.entries(data);
    const customPart = useAppSelector(state => state.general.customPart);
    if (!customPart) return <Navigate to={{pathname: '/cabinets'}}/>;
    const {name, image} = customPart;
    return (
        <div className={s.productWrap}>
            <div className={s.left}>
                <h2>{name}</h2>
                <div className={s.img}><img src={getImg('products/custom', image)} alt={name}/></div>
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
                <CustomPartCabinet
                    customPart={customPart}
                    materials={materials}
                />
            </div>
        </div>
    );
};

export default CustomPartMain;