import {
    attrItem,
    pricePart,
    pricesTypings,
    productTypings,
    profileItem,
    sizeLimitsType,
    widthItemType
} from "./productTypes";
import prices from './../api/prices.json';
import settings from './../api/settings.json'
import {getAttributes} from "./helpers";
import {drawerType} from "../Components/Product/ProductMain";
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

export const getPriceData = (id: number, basePriceType: pricesTypings): pricePart[] | undefined => {
    const productPrices = prices && prices.find(el => el.id === id)?.prices;
    return productPrices && productPrices.find(el => el.type === basePriceType)?.data;
}

export const getInitialPrice = (priceData: pricePart[], widthRangeData: number[]): number | undefined => {
    const minWidth = widthRangeData[0];
    return priceData.find(el => el.width === minWidth)?.price
}

export function calculatePrice(width: number, height: number, depth: number, options: string[], profileVal: string, attributes: attrItem[], prodType: productTypings, initialPrice: number, priceData: pricePart[], extraPrices: extraPricesType, widthRangeData: number[], heightRangeData: number[], depthRangeData: number[], sizeLimit: sizeLimitsType, drawersQty: number, category: string): calculatePriceType {
    const minWidth = widthRangeData[0];
    const maxWidth = widthRangeData[widthRangeData.length - 2];
    const maxHeight = heightRangeData[heightRangeData.length - 2];
    const allCoefs = extraPrices.boxMaterialCoef * extraPrices.premiumCoef;
    const initialPriceWithCoef = +(initialPrice * allCoefs).toFixed(2);
    const coef: coefType = {
        width: 0,
        height: 0,
        depth: 0
    }

    const getTablePrice = (width: number, height: number, priceData: pricePart[], category: string): number | undefined => {
        switch (category) {
            case 'Base Cabinets':
                return priceData.find(el => el.width === width)?.price;
            case 'Wall Cabinets':
                return priceData.find(el => el.width === width && el.height === height)?.price;
            default:
                return undefined;
        }
    }

    const tablePrice = getTablePrice(width, height, priceData, category);
    const widthPrice: number = tablePrice
        ? +(tablePrice * allCoefs).toFixed(2) || 0
        : getWidthPrice(width, height, priceData, initialPriceWithCoef, minWidth, maxWidth, coef, allCoefs, sizeLimit, category);


    if (maxWidth < width) coef.width = addWidthPriceCoef(width, maxWidth);
    if (maxHeight < height) coef.height = addHeightPriceCoef(height, maxHeight);
    if (settings.depthRange[0] !== depth) coef.depth = addDepthPriceCoef(depth, depthRangeData)

    if (options.includes('PTO for doors')) extraPrices.ptoDoors = addPTODoorsPrice(attributes, prodType)
    if (options.includes('PTO for drawers')) extraPrices.ptoDrawers = addPTODrawerPrice(prodType, drawersQty)
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
        totalPrice: +(widthPrice * coefExtra + extraPrices.ptoDoors + extraPrices.ptoDrawers + extraPrices.glassShelf + extraPrices.glassDoor + extraPrices.ptoTrashBins + extraPrices.pvcPrice + extraPrices.doorPrice + extraPrices.drawerPrice).toFixed(2),
        addition: extraPrices,
        coef: coef
    };
}

function getWidthPrice(customWidth: number, customHeight: number, priceData: pricePart[], initialPriceWithCoef: number, minWidth: number, maxWidth: number, coef: { width: number }, allCoefs: number, sizeLimit: sizeLimitsType, category: string): number {
    const settingMinWidth = sizeLimit.width[0];
    const settingMaxWidth = sizeLimit.width[1];
    const settingMinHeight = sizeLimit.height[0];
    const settingMaxHeight = sizeLimit.height[1];
    const maxWidthPrice = priceData.find(el => el.width === maxWidth)?.price;
    switch (category) {
        case 'Base Cabinets':
            if (customWidth < settingMinWidth || customWidth > settingMaxWidth ) {
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
                return +(maxWidthPrice * allCoefs).toFixed(2)
            }
            break;
        case 'Wall Cabinets':
            if (customWidth && customWidth < settingMinWidth || customWidth && customWidth > settingMaxWidth || customHeight && customHeight < settingMinHeight || customHeight && customHeight > settingMaxHeight) {
                return 0;
            }
            console.log('wall cabinets price logic')
    }
    return 0
}

function addWidthPriceCoef(width: number, maxWidth: number) {
    return Math.ceil((width - maxWidth) / 3) / 10;
}

function addHeightPriceCoef(customHeight: number, maxHeight: number) {
    return Math.ceil((customHeight - maxHeight) / 3) / 10
}

function addDepthPriceCoef(customDepth: number, depthRangeData: number[]) {
    const maxDepth = depthRangeData[depthRangeData.length - 2];
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

function addPTODrawerPrice(prodType: productTypings, drawersQty: number): number {
    if (drawersQty && settings.fixPrices["PTO for drawers"]) {
        return +drawersQty * settings.fixPrices["PTO for drawers"]
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
    const settingItem = (glassDoorType && priceType.find(el => el.id === glassDoorType)) || undefined
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

export function getType(width: number, divider: number | undefined, doorValues: widthItemType[] = [], doors: number): productTypings {
    if (divider) return width <= divider ? 1 : 2;
    let res: productTypings = 1;

    const currentTypeArr = doorValues.filter(val => {
        if (val?.maxWidth && val.maxWidth >= width) return val.value;
        if (val?.minWidth && val.minWidth <= width) return val.value;
    })
    if (currentTypeArr.length === 1) return currentTypeArr[0].type;
    const doorsVal = currentTypeArr.find(el => el.value === doors);

    return doorsVal ? doorsVal.type : res
}

export function getPvcPrice(realWidth: number, realHeight: number, isAcrylic = false, doorType: string, doorFinish: string): number {
    if (doorType === 'No Doors' || doorFinish === 'Milino') return 0;
    const pvcPrice = realWidth && realHeight ? +((realWidth * 2 + (realHeight - 4.5) * 2) / 12 * 2.5).toFixed(2) : 0
    return isAcrylic ? pvcPrice * 1.1 : pvcPrice
}


export function getDoorPrice(realWidth: number, realHeight: number, doorPriceMultiplier: number): number {
    return +((realWidth * (realHeight - 4.5) / 144) * doorPriceMultiplier).toFixed(2);
}

export function getDrawerPrice(qty: number, drawer: drawerType, width: number): number {
    const {drawerBrand, drawerType, drawerColor} = drawer
    if (!qty) return 0
    if (drawerBrand === 'Milino') {
        if (drawerType === 'Undermount') return qty * 20;
        if (drawerType === 'Legrabox') {
            if (drawerColor === 'LED') {
                return qty * 150;
            }
            return qty * 38;
        }
        if (drawerType === 'Dovetail') {
            if (drawerColor === 'Maple') return +(qty * (width * 2 + 25)).toFixed(2);
            if (drawerColor === 'Walnut') return +(qty * (width * 2 + 45)).toFixed(2);
        }
    }

    if (drawerBrand === 'BLUM') {
        if (drawerType === 'Undermount') return qty * 40 + 20;
        if (drawerType === 'Legrabox') {
            if (drawerColor === 'Orion Gray') return qty * 150;
            if (drawerColor === 'Stainless Steel') return qty * 200;
        }
        if (drawerType === 'Dovetail') {
            if (drawerColor === 'Maple') return +(qty * (width * 2 + 65)).toFixed(2);
            if (drawerColor === 'Walnut') return +(qty * (width * 2 + 85)).toFixed(2);
        }
    }
    return 0
}

export function getDoorMinMaxValuesArr(realWidth: number, doorValues: widthItemType[]): number[] {
    const filter = Object.values(doorValues).filter(el => {
        if (el?.minWidth && realWidth >= el.minWidth) return true;
        if (el?.maxWidth && realWidth <= el.maxWidth) return true;
        if (!el.minWidth && !el.maxWidth) return true;
    })
    return filter.map(el => el.value)
}


export function getWidthRange(priceData: pricePart[] | undefined): number[] {
    const arr: number[] = priceData && priceData.map(el => el.width) || [];
    const filter = [...new Set<number>(arr)];
    return filter.concat([0]);

}

export function getHeightRange(priceData: pricePart[] | undefined, category: string): number[] {
    switch (category) {
        case 'Base Cabinets':
            return [34.5, 0];
        case 'Wall Cabinets':
            let arr: number[] = []
            priceData && priceData.forEach((el) => {
                if (el.height) arr.push(el.height)
            })
            return [...new Set<number>(arr)].concat([0]);
        default:
            return [0]
    }
}







