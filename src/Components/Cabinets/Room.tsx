import React, {FC, useState} from 'react';
import Slider from "./Slider";
import List from "./List";
import {room} from '../../helpers/categoriesTypes';
import {productCategory} from "../../helpers/productTypes";

type roomType = {
    room: room
}

const Room: FC<roomType> = ({room}) => {
    const [category, setCategory] = useState<productCategory | ''>('')
    return (
        <>
            <Slider room={room} category={category} setCategory={setCategory}/>
            {category && <List category={category}/>}
        </>
    )
};

export default Room;