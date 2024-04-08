import React, {FC} from 'react';
import sizes from './../../api/sizes.json'
import {getAttributes} from "../../helpers/helpers";
import {
    CabinetType,
    sizeLimitsType
} from "../../helpers/productTypes";
import {
    getBlindArr, getPriceData, getProductRange
} from "../../helpers/calculatePrice";
import CabinetForm from "./CabinetForm";

const Cabinet: FC<CabinetType> = ({
                                          product,
                                          basePriceType,
                                          premiumCoef,
                                          boxMaterialCoefs,
                                          drawer,
                                          doorPriceMultiplier, doorType, doorFinish
                                      }) => {
    const {
        id,
        type,
        attributes,
        options,
        category,
        isBlind,
        isAngle,
        customHeight,
        customDepth,
    } = product;

    const priceData = getPriceData(id, basePriceType);
    const productRange = getProductRange(priceData, category, customHeight, customDepth);
    const sizeLimit: sizeLimitsType | undefined = sizes.find(size => size.productIds.includes(product.id))?.limits;
    const attrArr = getAttributes(attributes, type);
    const doorValues = attributes.find(el => el.name === 'Door')?.values;

    const drawersQty = attrArr.reduce((acc, current) => {
        const qty = current.name.includes('Drawer') ? current.value : 0
        return acc + qty;
    }, 0);
    const rolloutsQty = attrArr.reduce((acc, current) => {
        const qty = current.name.includes('Rollout') ? current.value : 0
        return acc + qty;
    }, 0);
    if (!productRange.width[0]) return <div>Cannot find initial width</div>;
    if (!sizeLimit) return <div>Cannot find size limit</div>;
    if (!priceData) return <div>No price table data</div>

    const blindArr = isBlind ? getBlindArr(category, isAngle) : undefined;

    const filteredOptions = options.filter(option => (option !== 'PTO for drawers' || drawer.drawerBrand !== 'Milino'));
    const isAcrylic = doorFinish === 'Ultrapan Acrylic';
    return (
        <CabinetForm product={product}
                     basePriceType={basePriceType}
                     premiumCoef={premiumCoef}
                     boxMaterialCoefs={boxMaterialCoefs}
                     drawer={drawer}
                     doorPriceMultiplier={doorPriceMultiplier}
                     doorType={doorType}
                     doorFinish={doorFinish}
                     drawersQty={drawersQty}
                     rolloutsQty={rolloutsQty}
                     doorValues={doorValues}
                     blindArr={blindArr}
                     filteredOptions={filteredOptions}
                     isAcrylic={isAcrylic}
                     priceData={priceData}
                     productRange={productRange}
                     sizeLimit={sizeLimit}



        />
    );
};

export default Cabinet;