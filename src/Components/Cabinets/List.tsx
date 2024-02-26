import React, {FC} from 'react';
import s from './cabinets.module.sass'
import products from './../../api/products.json'
import {NavLink} from "react-router-dom";
import {getAttributes, getImg, getProductImage, useAppDispatch} from "../../helpers/helpers";
import {setProduct} from "../../store/reducers/generalSlice";
import {productType} from "../../helpers/productTypes";

const List: FC<{ room: string, category: string }> = ({room, category}) => {
    const categorizedProduct: productType[] = products.filter(product => product.category === category) as productType[];

    return (
        categorizedProduct.length ?
            <div className={s.list}>
                {categorizedProduct.map((el, index) => <Item key={index} product={el}/>)}
            </div> : null
    );
};

export default List;


const Item: FC<{ product: productType }> = ({product}) => {
    const {name, type, attributes, images} = product;
    const img = getProductImage(images, type)
    const dispatch = useAppDispatch()
    return (
        <NavLink to={`/product/${name}`} className={s.item} onClick={() => dispatch(setProduct(product))}>
            <div className={s.itemImg}><img src={getImg('products', img || '')} alt={name}/></div>
            <div className={s.itemData}>
                <div className={s.name}>{name}</div>
                <div className={s.attrs}>
                    {getAttributes(attributes, type).map((attr, index) => {
                        const isMultiple = typeof attr.value === 'number' && attr.value > 1;
                        return (
                            <div key={index}>
                                <span>{attr.name}{isMultiple ? 's' : ''}: </span>
                                <span>{attr.value}</span>
                            </div>
                        )
                    })}
                </div>
            </div>
        </NavLink>
    )
}


