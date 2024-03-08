import React, {FC} from 'react';
import s from './cabinets.module.sass'
import products from './../../api/products.json'
import {NavLink} from "react-router-dom";
import {getAttributes, getImg, getProductImage} from "../../helpers/helpers";
import {attrItem, productDataType, productTypings} from "../../helpers/productTypes";

const List: FC<{ category: string }> = ({category}) => {
    const categorizedProduct: productDataType[] = products.filter(product => product.category === category) as productDataType[];

    return (
        categorizedProduct.length ?
            <div className={s.list}>
                {categorizedProduct.map((el, index) => <Item key={index} product={el}/>)}
            </div> : <div>Sorry, there are no products yet</div>
    );
};

export default List;


const Item: FC<{ product: productDataType }> = ({product}) => {
    const {name, attributes, images, id} = product;
    const initialType: productTypings = 1;
    const img = getProductImage(images, initialType)
    return (
        <NavLink to={`/product/${id}`} className={s.item}
        >
            <div className={s.itemImg}><img src={getImg('products', img)} alt={name}/></div>
            <div className={s.itemData}>
                <div className={s.name}>{name}</div>
                <AtrrsList attributes={attributes} type={initialType}/>
            </div>
        </NavLink>
    )
}


export const AtrrsList: FC<{ attributes: attrItem[], type: productTypings }> = ({attributes, type}) => {
    const attrs = getAttributes(attributes, type);
    return (
        <div className={s.attrs}>
            {attrs.map((attr, index) => {
                const hasValue = !!attr.value;
                const isMultiple = attr.value > 1;
                const oneOf = ['Door', 'Drawer', 'Rollout', 'Shelf'];
                let name = attr.name;
                if (isMultiple) name = name.split(' ').find(el => oneOf.includes(el)) + 's' || name;
                return (
                    <div key={index}>
                        {hasValue ? <>
                            <span>{name}: </span>
                            <span>{attr.value}</span>
                        </> : <span>{name}</span>
                        }
                    </div>
                )
            })}
        </div>
    )
}

