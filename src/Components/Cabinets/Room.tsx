import React, {FC, useState} from 'react';
import Slider from "./Slider";
import List from "./List";
import {room} from '../../helpers/categoriesTypes';
import {productCategory} from "../../helpers/productTypes";

type roomType = {
    room: room
}

const Room: FC<roomType> = ({room}) => {
    const storageCat = localStorage.getItem('category') ? localStorage.getItem('category') as productCategory : '';
    const [category, setCategory] = useState<productCategory | ''>(storageCat)
    return (
        <>
            <Slider room={room} category={category} setCategory={setCategory}/>
            {category && <List category={category} room={room}/>}
        </>
    )
};

export default Room;