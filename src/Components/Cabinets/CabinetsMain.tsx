import React, {FC} from 'react';
import Header from "../../common/Header/Header";
import s from './cabinets.module.sass'
import {OrderFormType} from "../../helpers/types";
import {Navigate} from "react-router-dom";
import Room from "./Room";


export type CabinetsMainType = {
    values: OrderFormType
}

const CabinetsMain: FC<CabinetsMainType> = ({values}) => {
    const {room} = values;
    if (!room) return <Navigate to={{pathname: '/'}}/>;

    return (
        <div className={s.container}>
            <Header/>
            <h1>{room}</h1>
            <Room room={room}  />
        </div>
    );

};

export default CabinetsMain;