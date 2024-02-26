import {attrItem, pricePart, productTypings, profileItem} from "./productTypes";
import prices from './../api/prices.json';
import settings from './../api/settings.json'
import {getAttributes} from "./helpers";
import {basePriceTypes, getBoxMaterialCoefsType} from "../Components/Product/ProductMain";
import {extraPricesType} from "../Components/Product/BaseCabinetForm";

type coefType = {
    width: number,
    height: number,
    depth: number
}

type calculatePriceType = {
    totalPrice: number,
    addition: extraPricesType,
    coef: coefType
}

export const getPriceData = (basePriceType: basePriceTypes): pricePart[] | undefined => {
    return prices.find(el => el.type === basePriceType)?.data;
}

export const getInitialPrice = (priceData: pricePart[], widthRangeData: number[]): number | undefined => {
    const minWidth = widthRangeData[0];
    return priceData.find(el => el.width === minWidth)?.price
}

export function calculatePrice(width: number, height: number, depth: number, customWidth: number, customHeight: number, customDepth: number, options: string[], profileVal: string, attributes: attrItem[], prodType: productTypings, initialPrice: number, priceData: pricePart[], extraPrices: extraPricesType, widthRangeData: number[]): calculatePriceType {
    const minWidth = widthRangeData[0];
    const maxWidth = widthRangeData[widthRangeData.length - 2];
    const allCoefs = extraPrices.boxMaterialCoef*extraPrices.premiumCoef;
    const initialPriceWithCoef = +(initialPrice * allCoefs).toFixed(2);
    const coef: coefType = {
        width: 0,
        height: 0,
        depth: 0
    }

    // WIDTH
    const tableWidthPrice = priceData.find(el => el.width === width)?.price
    const widthPrice: number = tableWidthPrice
        ? +(tableWidthPrice * allCoefs).toFixed(2) || 0
        : getWidthPrice(customWidth, priceData, initialPriceWithCoef, minWidth, maxWidth, coef, allCoefs);

    if (!height) coef.height = addHeightPriceCoef(customHeight);
    if (!depth) coef.depth = addDepthPriceCoef(customDepth)

    if (options.includes('PTO for doors')) extraPrices.ptoDoors = addPTODoorsPrice(attributes, prodType)
    if (options.includes('PTO for drawers')) extraPrices.ptoDrawers = addPTODrawerPrice(attributes, prodType)
    if (options.includes('PTO for Trash Bins')) extraPrices.ptoTrashBins = addPTOTrashBinsPrice()
    if (options.includes('Glass Shelf')) extraPrices.glassShelf = addGlassShelfPrice()
    if (options.includes('Glass Door') && profileVal) extraPrices.glassDoor = addGlassDoorPrice(extraPrices.doorSquare, profileVal);

    const coefExtra = 1 + (coef.width + coef.height + coef.depth);

    const totalWidthPrice = +(widthPrice * (coef.width + 1)).toFixed(2)
    const totalHeightPrice = +(initialPriceWithCoef * (coef.height + 1)).toFixed(2)
    const totalDepthPrice = +(initialPriceWithCoef * (coef.depth + 1)).toFixed(2)

    extraPrices.width = totalWidthPrice ? +(totalWidthPrice - initialPriceWithCoef).toFixed(2) : 0;
    extraPrices.height = +(totalHeightPrice - initialPriceWithCoef).toFixed(2);
    extraPrices.depth = +(totalDepthPrice - initialPriceWithCoef).toFixed(2);

    return {
        totalPrice: +(widthPrice * coefExtra + extraPrices.ptoDoors + extraPrices.ptoDrawers + extraPrices.glassShelf + extraPrices.glassDoor + extraPrices.ptoTrashBins + extraPrices.pvcPrice + extraPrices.doorPrice).toFixed(2),
        addition: extraPrices,
        coef: coef
    };
}

function getWidthPrice(customWidth: number, priceData: pricePart[], initialPriceWithCoef: number, minWidth: number, maxWidth: number, coef: { width: number }, allCoefs: number): number {
    const maxWidthPrice = priceData.find(el => el.width === maxWidth)?.price;
    if (customWidth < settings.minWidth || customWidth > settings.maxWidth) {
        return 0;
    }
    if (customWidth <= minWidth) {
        return initialPriceWithCoef
    }
    if (customWidth > minWidth && customWidth <= maxWidth) {
        const dataPrice = priceData.find(el => el.width >= customWidth)?.price;
        return dataPrice ? +(dataPrice * allCoefs).toFixed(2) : 0
    }
    if (customWidth > maxWidth && maxWidthPrice) {
        coef.width = Math.ceil((customWidth - maxWidth) / 3) / 10;
        return +(maxWidthPrice * allCoefs).toFixed(2)
    }
    return 0
}

function addHeightPriceCoef(customHeight: number) {
    const maxHeight = settings.height.values[settings.height.values.length - 2];
    if (customHeight > maxHeight) {
        return Math.ceil((customHeight - maxHeight) / 3) / 10
    }
    return 0
}

function addDepthPriceCoef(customDepth: number) {
    const maxDepth = settings.depth.values[settings.depth.values.length - 2];
    if (customDepth > maxDepth) {
        return Math.ceil((customDepth - maxDepth) / 3) / 10
    }
    return 0
}

function addPTODoorsPrice(attributes: attrItem[], prodType: productTypings): number {
    const attrs = getAttributes(attributes, prodType);
    const doorQty = attrs.find(attr => attr.name === "Door")?.value
    if (doorQty && settings.fixPrices["PTO for doors"]) {
        return +doorQty * settings.fixPrices["PTO for doors"]
    }
    return 0
}

function addPTODrawerPrice(attributes: attrItem[], prodType: productTypings): number {
    const attrs = getAttributes(attributes, prodType);
    const drawerQty = attrs.find(attr => attr.name === "Drawer")?.value
    if (drawerQty && settings.fixPrices["PTO for drawers"]) {
        return +drawerQty * settings.fixPrices["PTO for drawers"]
    }
    return 0
}

function addPTOTrashBinsPrice(): number {
    return settings.fixPrices['PTO for trash bins'] || 0
}

function addGlassShelfPrice(): number {
    return settings.fixPrices["Glass Shelf"] || 0
}

function addGlassDoorPrice(square: number = 0, profileVal: string): number {
    const glassDoor = settings["Glass Door"];
    const {Profile, priceType} = glassDoor
    const profileData: profileItem | undefined = Profile.find(el => el.value === profileVal)
    const glassDoorType = profileData && profileData?.glassDoorType;
    const settingItem = glassDoorType && priceType.find(el => el.id === glassDoorType) || undefined
    const minPrice = settingItem?.minPrice
    const multiplier = settingItem?.multiplier
    if (minPrice && multiplier) {
        const price = square / 144 * multiplier;
        return +(price > minPrice ? price : minPrice).toFixed(2)
    }
    return 0
}

export function getDoorSquare(width: number, height: number, customWidth: number = 0, customHeight: number = 0): number {
    const trueWidth: number = (width || customWidth);
    const trueHeight: number = (height || customHeight) - 4.5
    if (trueWidth > 0 && trueHeight > 0) return +(trueWidth * trueHeight).toFixed(2);
    return 0;
}

export function getType(width: number, customWidth: number, divider: number): productTypings {
    if (width) {
        return width <= divider ? 1 : 2;
    }
    if (customWidth) {
        return customWidth <= divider ? 1 : 2
    }
    return 1
}

export function getPvcPrice(realWidth: number, realHeight: number, isAcrylic = false): number {
    const pvcPrice = realWidth && realHeight ? +((realWidth * 2 + (realHeight - 4.5) * 2) / 12 * 2.5).toFixed(2) : 0
    return isAcrylic ? pvcPrice * 1.1 : pvcPrice
}


export function getDoorPrice(realWidth: number, realHeight: number, doorPriceMultiplier: number): number {
    return +((realWidth*(realHeight-4.5)/144)*doorPriceMultiplier).toFixed(2);
}