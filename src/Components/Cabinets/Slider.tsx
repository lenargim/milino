import React, {FC} from 'react';
import s from './cabinets.module.sass'
import {setCategoryType, SliderType} from "../../helpers/categoriesTypes";
import {getImg} from "../../helpers/helpers";
import categoriesData from './../../api/categories.json'
import {productCategory} from "../../helpers/productTypes";

type catItem = {
    name: productCategory,
    img: string
}
type catInfoType = {
    defaultImg: string,
    categories: catItem[]
}
const Slider: FC<SliderType> = ({setCategory, room, category}) => {
    const {categories, defaultImg} = categoriesData[room] as catInfoType;

    const currentCat = categories.find(cat => cat.name === category);
    return (
        <form>
            {categories.length
                ? <div className={s.slider}>
                    <div className={s.img}>
                        <img src={getImg('categories', currentCat ? currentCat.img : defaultImg)} alt={room}/>
                    </div>
                    <div className={s.category}>
                        {categories.map(el => <CategoryItem name={el.name}
                                                            current={currentCat?.name}
                                                            key={el.name}
                                                            setCategory={setCategory}
                        />)
                        }
                    </div>
                </div> : <div>Sorry, there are no products yet</div>}
        </form>

    );
};

export default Slider;

type CategoryItemType = {
    name: productCategory,
    current: string|undefined,
    setCategory: setCategoryType
}
const CategoryItem: FC<CategoryItemType> = ({name, setCategory, current}) => {
    const handleChange = (name: productCategory) => {
        setCategory(name)
    }
    return (
        <div className={[s.item, current === name ? s.itemChecked : ''].join(' ')}>
            <input name="category" type="radio" id={name} value={name} onInput={() => handleChange(name)}/>
            <label htmlFor={name} className="button yellow small">{name}</label>
        </div>
    )
}