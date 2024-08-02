import React from 'react';
import {useAppSelector} from "../../helpers/helpers";
import CartEmpty from "./CartEmpty";
import Header from "../../common/Header/Header";
import Sidebar from "../OrderForm/Sidebar/Sidebar";
import {Navigate} from "react-router-dom";
import CheckoutForm from "./CheckoutForm";

const Checkout = () => {
    const cart = useAppSelector(state => state.general.cart);
    const isCart = cart.length;
    const materialsString = localStorage.getItem('materials');
    if (!materialsString) return <Navigate to={{pathname: '/'}}/>;
    const materials = JSON.parse(materialsString)
    return (
        <div className="page">
            <div className="main">
                <div className="container">
                    <Header/>
                    {isCart ? <CheckoutForm cart={cart}/> : <CartEmpty/>}
                </div>
            </div>
            <Sidebar values={materials}/>
        </div>
    );
};

export default Checkout;