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
                        {categories.map(el => <CategoryItem name={el.name} key={el.name}
                                                            img={getImg('categories', el.img)}
                                                            setCategory={setCategory}
                        />)
                        }
                    </div>
                </div> : <div>Sorry, there are no products yet</div>}
        </form>

    );
};

export default Slider;


const CategoryItem: FC<{ name: productCategory, img: string, setCategory: setCategoryType }> = ({name, setCategory}) => {
    const handleChange = (name: productCategory) => {
        setCategory(name)
    }
    return (
        <div className={s.item}>
            <input name="category" type="radio" id={name} value={name} onInput={() => handleChange(name)}/>
            <label htmlFor={name} className="button submit">{name}</label>
        </div>
    )
}