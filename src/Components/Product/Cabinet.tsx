import React, {FC} from 'react';
import {
    CabinetType, sizeLimitsType,
} from "../../helpers/productTypes";
import {getPriceData, getProductDataToCalculatePrice, getProductRange} from "../../helpers/calculatePrice";
import CabinetForm from "./CabinetForm";
import sizes from "../../api/sizes.json";

const Cabinet: FC<CabinetType> = ({product, materialData}) => {
    const {id, category, customHeight, customDepth} = product
    const productPriceData = getProductDataToCalculatePrice(product, materialData.drawer.drawerBrand);
    const priceData = getPriceData(id, category, materialData.basePriceType);
    const productRange = getProductRange(priceData, category, customHeight, customDepth);
    const sizeLimit: sizeLimitsType | undefined = sizes.find(size => size.productIds.includes(product.id))?.limits;
    const {widthRange} = productRange;
    if (!widthRange.length) return <div>Cannot find initial width</div>;
    if (!sizeLimit) return <div>Cannot find size limit</div>;
    if (!priceData) return <div>No price table data</div>
    return (
        <CabinetForm product={product}
                     materialData={materialData}
                     productPriceData={productPriceData}
                     sizeLimit={sizeLimit}
                     priceData={priceData}
                     productRange={productRange}
        />
    );
};

export default Cabinet;