import React, {FC} from 'react';
import {StandartCabinetType} from "../../helpers/productTypes";
import {getStandartProductPriceData} from "../../helpers/calculatePrice";
import StandartCabinetForm from "./StandartCabinetForm";

const StandartCabinet:FC<StandartCabinetType> = ({product, materialData}) => {
    const standartProductPriceData = getStandartProductPriceData({product, materialData})
    return <StandartCabinetForm standartProductPriceData={standartProductPriceData} product={product} materialData={materialData} />;
};

export default StandartCabinet;