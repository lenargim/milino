import React, {FC} from 'react';
import Header from "../../common/Header/Header";
import {OrderFormType} from "../../helpers/types";
import {Navigate} from "react-router-dom";
import Room from "./Room";


export type CabinetsMainType = {
    values: OrderFormType
}

const CabinetsMain: FC<CabinetsMainType> = ({values}) => {
    const {Category} = values;
    if (!Category) return <Navigate to={{pathname: '/'}}/>;
    return (
        <div className="container">
            <Header/>
            <h1>{Category}</h1>
            <Room room={Category}  />
        </div>
    );

};

export default CabinetsMain;