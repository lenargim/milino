import React, {FC, useState} from 'react';
import Slider from "./Slider";
import List from "./List";
import {room} from '../../helpers/categoriesTypes';
import {kitchenCategories, productCategory} from "../../helpers/productTypes";

type roomType = {
    room: room
}

const Room: FC<roomType> = ({room}) => {
    const storageCat = localStorage.getItem('category') ? localStorage.getItem('category') as productCategory : '';
    let initialCat: productCategory | '';
    const kichenCat = ['Base Cabinets', 'Wall Cabinets', 'Tall Cabinets', 'Gola Base Cabinets', 'Gola Wall Cabinets', 'Gola Tall Cabinets','Custom Parts'];
    const vanityCat = ['Regular Vanities', 'Gola Vanities','Custom Parts'];
    if (!storageCat) {
        initialCat = ''
    } else {
        switch (room) {
            case "Kitchen":
                initialCat = kichenCat.includes(storageCat) ? storageCat : '';
                break
            case "Vanity":
                initialCat = vanityCat.includes(storageCat) ? storageCat : '';
                break
            case "Closet":
                initialCat = ['Build In', 'Leather', 'Custom Parts'].includes(storageCat)? storageCat : ''
                break
            default:
                initialCat = 'Custom Parts'
        }
    }
    const [category, setCategory] = useState<productCategory | ''>(initialCat)
    return (
        <>
            <Slider room={room} category={category} setCategory={setCategory}/>
            {category && <List category={category} room={room}/>}
        </>
    )
};

export default Room;