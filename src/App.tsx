import React from 'react';
import OrderForm from "./Components/OrderForm/OrderForm";
import {Route, Routes} from "react-router-dom";
import Cabinets from "./Components/Cabinets/Cabinets";
import Product from "./Components/Product/Product";
import WithChosenMaterials from "./common/WithChosenMaterials";

function App() {
    return (
        <div className="app">
            <Routes>
                <Route path="/" element={<OrderForm/>}/>
                <Route path="/cabinets" element={<WithChosenMaterials  outlet={<Cabinets />}/>}/>
                <Route path="/product/*" element={<WithChosenMaterials  outlet={<Product />}/>}/>
            </Routes>
        </div>
    );
}

export default App;
