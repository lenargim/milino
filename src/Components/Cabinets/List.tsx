import React, {FC} from 'react';
import s from './cabinets.module.sass'
import {NavLink} from "react-router-dom";
import {
    getAttributes, getcustomParts,
    getImg, getImgSize,
    getProductImage,
    getProductsByCategory
} from "../../helpers/helpers";
import {
    attrItem,
    customPartDataType,
    productCategory,
    productDataType,
    productTypings
} from "../../helpers/productTypes";

const List: FC<{ category: productCategory }> = ({category}) => {
    switch (category) {
        case "Custom Parts":
            const customParts = getcustomParts();
            return (
                customParts.length ?
                    <div className={s.list}>
                        {customParts.map((el, index) => <Part key={index} product={el}/>)}
                    </div> : <div>Sorry, there are no custom parts yet</div>
            );
        default:
            const products = getProductsByCategory(category);
            return (
                products.length ?
                    <div className={s.list}>
                        {products.map((el, index) => <Item key={index} product={el}/>)}
                    </div> : <div>Sorry, there are no products yet</div>
            );

    }
};

export default List;


const Item: FC<{ product: productDataType }> = ({product}) => {
    const {name, attributes, images, id, category} = product;
    const initialType: productTypings = 1;
    const img = getProductImage(images, initialType);
    const imgSize = getImgSize(category);

    return (
        <NavLink to={`/product/${category}/${id}`} className={s.item}
        >
            <div className={[s.itemImg, s[imgSize]].join(' ')}><img src={getImg('products', img)} alt={name}/></div>
            <div className={s.itemData}>
                <div className={s.name}>{name}</div>
                <AtrrsList attributes={attributes} type={initialType}/>
            </div>
        </NavLink>
    )
}

const Part: FC<{ product: customPartDataType }> = ({product}) => {
    const {name, image, id} = product;
    return (
        <NavLink to={`/custom_part/${id}`} className={s.item}
        >
            <div className={s.itemImg}><img src={getImg('products/custom', image)} alt={name}/></div>
            <div className={s.itemData}>
                <div className={s.name}>{name}</div>
            </div>
        </NavLink>
    )
}


export const AtrrsList: FC<{ attributes: attrItem[], type: productTypings}> = ({attributes, type}) => {
    const attrs = getAttributes(attributes, type);
    return (
        <div className={s.attrs}>
            {attrs.map((attr, index) => {
                let hasValue = !!attr.value;
                const isMultiple = attr.value > 1;
                const oneOf = ['Door', 'Drawer', 'Rollout', 'Shelf', 'Front'];
                let name = attr.name;
                if (name === 'Adjustable Shelf' && attr.value === 0) return;
                if (isMultiple) {
                    const isNameExist = name.split(' ').find(el => oneOf.includes(el));
                    if (isNameExist) name = name + 's';
                }
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

