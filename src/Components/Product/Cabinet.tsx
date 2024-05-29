import React, {FC} from 'react';
import {
    CabinetType,
} from "../../helpers/productTypes";
import {getProductDataToCalculatePrice} from "../../helpers/calculatePrice";
import CabinetForm from "./CabinetForm";

const Cabinet: FC<CabinetType> = ({product, materialData}) => {
    const productPriceData = getProductDataToCalculatePrice(product, materialData.basePriceType, materialData.drawer.drawerBrand);
    return (
        <CabinetForm product={product}
                     materialData={materialData}
                     productPriceData={productPriceData}
        />
    );
};

export default Cabinet;