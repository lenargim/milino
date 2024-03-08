import React, {FC, useState} from 'react';
import Header from "../../common/Header/Header";
import Slider from "./Slider";
import s from './cabinets.module.sass'
import List from "./List";
import {OrderFormType} from "../../helpers/types";
import categories from "../../api/categories.json"
import {Navigate} from "react-router-dom";


export type CabinetsMainType = {
    values: OrderFormType
}

const CabinetsMain: FC<CabinetsMainType> = ({values}) => {
    const [category, setCategory] = useState<string>('')
    const {room} = values;

    if (!room) return <Navigate to={{ pathname: '/' }} />;

    return (
        <div className={s.container}>
            <Header/>
            <h1>Cabinets</h1>
            <Slider categoriesData={categories} room={room} category={category} setCategory={setCategory}/>
            {category && <List category={category} />}
        </div>
    );

};

export default CabinetsMain;