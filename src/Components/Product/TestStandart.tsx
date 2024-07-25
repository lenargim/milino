import React, {FC} from 'react';
import {extraStandartPricesType} from "../../helpers/productTypes";


const Test:FC<{extraPrices:extraStandartPricesType}> = ({extraPrices}) => {
    return (
        <div>
            <h3>Extra prices</h3>
            {
                Object.entries(extraPrices).map((el, index) => <div key={index}>{el[0]}: {el[1]}</div>)

            }
        </div>
    );
};

export default Test;