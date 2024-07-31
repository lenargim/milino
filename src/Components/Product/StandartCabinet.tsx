import React, {FC} from 'react';
import {sizeLimitsType, StandartCabinetType} from "../../helpers/productTypes";
import {
    getBaseProductPrice,
    getProductRange,
    getStandartMaterialData,
    getStandartProductPriceData
} from "../../helpers/calculatePrice";
import StandartCabinetForm from "./StandartCabinetForm";
import sizes from "../../api/sizes.json";

const StandartCabinet:FC<StandartCabinetType> = ({product, materials}) => {
    const {id, customHeight, customDepth, category} = product
    const materialData = getStandartMaterialData(materials)
    const standartProductPriceData = getStandartProductPriceData(product, materialData)
    const baseProductPrice = getBaseProductPrice(id);
    const productRange = getProductRange(baseProductPrice, category, customHeight, customDepth);
    const sizeLimit: sizeLimitsType | undefined = sizes.find(size => size.productIds.includes(product.id))?.limits;

    if (!baseProductPrice) return <div>No price table data</div>
    if (!sizeLimit) return <div>Cannot find size limit</div>;
    if (!productRange.widthRange[0]) return <div>Cannot find initial width</div>;

    return <StandartCabinetForm standartProductPriceData={standartProductPriceData}
                                baseProductPrice={baseProductPrice}
                                productRange={productRange}
                                sizeLimit={sizeLimit}
                                product={product}
                                materialData={materialData}
    />;
};

export default StandartCabinet;