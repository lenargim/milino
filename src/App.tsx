import React from 'react';
import OrderForm from "./Components/OrderForm/OrderForm";
import {Route, Routes} from "react-router-dom";
import Cabinets from "./Components/Cabinets/Cabinets";
import Product from "./Components/Product/Product";
import WithChosenMaterials from "./common/WithChosenMaterials";
import Checkout from "./Components/Checkout/Checkout";

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<OrderForm/>}/>
                <Route path="/cabinets" element={<WithChosenMaterials outlet={<Cabinets/>}/>}/>
                <Route path="/product/:category/:productId" element={<WithChosenMaterials outlet={<Product/>}/>}/>
                <Route path="/checkout" element={<WithChosenMaterials outlet={<Checkout/>}/>}/>
            </Routes>
        </div>
    );
}

export default App;
