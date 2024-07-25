import React, {FC} from 'react';
import {extraPricesType} from "../../helpers/productTypes";
import {coefType} from "../../helpers/calculatePrice";

const Test:FC<{addition: extraPricesType, coef: coefType}> = ({addition, coef}) => {
    return (
        <div>
            <h3>Extra prices</h3>
            {
                Object.entries(addition).map((el, index) => <div key={index}>{el[0]}: {el[1]}</div>)

            }
            <h3>Additional coefs for custom sizes</h3>
            {
                Object.entries(coef).map((el, index) => <div key={index}>{el[0]}: {el[1]}</div>)

            }
        </div>
    );
};

export default Test;