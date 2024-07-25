import React, {FC, useEffect} from 'react';
import s from './cabinets.module.sass'
import CabinetsMain from "./CabinetsMain";
import {useAppDispatch} from "../../helpers/helpers";
import {setProduct} from "../../store/reducers/generalSlice";
import {Navigate} from "react-router-dom";
import Sidebar from "../OrderForm/Sidebar/Sidebar";

const Cabinets: FC = () => {
    const dispatch = useAppDispatch()
    useEffect(() => {
        dispatch(setProduct(null));
    }, [])
    const materialsString = localStorage.getItem('materials');
    if (!materialsString) return <Navigate to={{pathname: '/'}}/>;
    const materials = JSON.parse(materialsString)
    return (
        <div className={s.cabinets}>
            <CabinetsMain values={materials}/>
            <Sidebar values={materials} isValid={true} />
        </div>
    );
};

export default Cabinets;