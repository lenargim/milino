import {
    attrItem, heightItemType,
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
import {extraPricesType} from "../Components/Product/CabinetForm";
import {array} from "yup";
import {borderType} from "../Components/Product/LED";

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

export const getInitialPrice = (priceData: pricePart[], minWidth: number, minHeight: number, category: string): number | undefined => {
    switch (category) {
        case 'Base Cabinets':
            return priceData.find(el => el.width === minWidth)?.price;
        case 'Wall Cabinets':
        case 'Tall Cabinets':
            return priceData.find(el => el.width === minWidth && el.height === minHeight)?.price;
        default:
            return undefined;
    }
}

export function calculatePrice(width: number, height: number, depth: number, options: string[], profileVal: string, attributes: attrItem[], prodType: productTypings, initialPrice: number, priceData: pricePart[], extraPrices: extraPricesType, widthRangeData: number[], heightRangeData: number[], depthRangeData: number[], sizeLimit: sizeLimitsType, drawersQty: number, category: string, ledPrice: number): calculatePriceType {
    const maxWidth = widthRangeData[widthRangeData.length - 2];
    const maxHeight = heightRangeData[heightRangeData.length - 2];
    const allCoefs = extraPrices.boxMaterialCoef * extraPrices.premiumCoef;
    const coef: coefType = {
        width: 0,
        height: 0,
        depth: 0
    }

    const getTablePrice = (width: number, height: number, priceData: pricePart[], category: string): number | undefined => {
        const maxData = priceData[priceData.length - 1];
        switch (category) {
            case 'Base Cabinets':
                const widthTablePrice: number | undefined = priceData.find(el => el.width >= width)?.price;
                if (widthTablePrice) return widthTablePrice;
                if (width > maxData.width) return maxData.price;
                return undefined
            case 'Wall Cabinets':
            case 'Tall Cabinets':
                const widthAndHeightTablePrice: number | undefined = priceData.find(el => (el.width >= width) && (el.height && el.height >= height))?.price;
                if (widthAndHeightTablePrice) return widthAndHeightTablePrice;
                if (width > maxData.width && maxData.height && height > maxData.height) {
                    return maxData.price
                }
                if (width > maxData.width) {
                    return priceData.find(el => (el.width === maxData.width) && (el.height && el.height >= height))?.price;
                }
                if (maxData.height && height > maxData.height) {
                    return priceData.find(el => (el.height === maxData.width) && (el.width && el.width >= width))?.price;
                }
                return undefined
            default:
                return undefined;
        }
    }
    const tablePrice = getTablePrice(width, height, priceData, category);
    extraPrices.tablePrice = tablePrice;
    const startPrice: number = tablePrice ? getStartPrice(width, height, depth, allCoefs, sizeLimit, tablePrice) : 0;


    if (maxWidth < width) coef.width = addWidthPriceCoef(width, maxWidth);
    if (maxHeight < height) coef.height = addHeightPriceCoef(height, maxHeight);
    if (depthRangeData[0] !== depth) coef.depth = addDepthPriceCoef(depth, depthRangeData)

    if (options.includes('PTO for doors')) extraPrices.ptoDoors = addPTODoorsPrice(attributes, prodType)
    if (options.includes('PTO for drawers')) extraPrices.ptoDrawers = addPTODrawerPrice(prodType, drawersQty)
    if (options.includes('PTO for Trash Bins')) extraPrices.ptoTrashBins = addPTOTrashBinsPrice()
    if (options.includes('Glass Shelf')) extraPrices.glassShelf = addGlassShelfPrice()
    if (options.includes('Glass Door') && profileVal) extraPrices.glassDoor = addGlassDoorPrice(extraPrices.doorSquare, profileVal);

    const coefExtra = 1 + (coef.width + coef.height + coef.depth);

    const initialPriceWithCoef = +(initialPrice * allCoefs).toFixed(2);

    const totalDepthPrice = +(initialPriceWithCoef * (coef.depth + 1)).toFixed(2)

    const getPriceForExtraWidth = (initialPriceWithCoef: number, priceData: pricePart[], width: number, widthCoef: number, allCoefs: number): number => {
        const maxData = priceData[priceData.length - 1];
        let maxWidth: number = 0;
        const widthTablePrice: number | undefined = priceData.find(el => el.width >= width)?.price;
        if (widthTablePrice) maxWidth = widthTablePrice;
        if (width > maxData.width) maxWidth = maxData.price * (widthCoef + 1);
        if (maxWidth) {
            return +(maxWidth * allCoefs - initialPriceWithCoef).toFixed(2)
        }
        return 0
    }

    const getPriceForExtraHeight = (priceData: pricePart[], initialPriceWithCoef: number, width: number, height: number): number => {
        const maxData = priceData[priceData.length - 1];
        if (!maxData.height) {
            return +(initialPriceWithCoef * (coef.height + 1) - initialPriceWithCoef).toFixed(2);
        }
        const checkedWidth = priceData.filter(el => maxData.width >= width ? el.width === width : el.width === maxData.width);
        const initialPrice = checkedWidth.length && checkedWidth[0].price * allCoefs;
        if (initialPrice) {
            const currentHeightPrice = checkedWidth.find(el => el.height && el.height >= height)?.price;
            return currentHeightPrice ? +(currentHeightPrice * allCoefs - initialPrice).toFixed(2) : 0
        }
        return 0
    }


    extraPrices.width = getPriceForExtraWidth(initialPriceWithCoef, priceData, width, coef.width, allCoefs)
    extraPrices.height = getPriceForExtraHeight(priceData, initialPriceWithCoef, width, height)
    extraPrices.depth = +(totalDepthPrice - initialPriceWithCoef).toFixed(2);


    const totalPrice = startPrice ? +(startPrice * coefExtra + extraPrices.ptoDoors + extraPrices.ptoDrawers + extraPrices.glassShelf + extraPrices.glassDoor + extraPrices.ptoTrashBins + extraPrices.pvcPrice + extraPrices.doorPrice + extraPrices.drawerPrice + extraPrices.ledPrice).toFixed(2) : 0

    return {
        totalPrice: totalPrice,
        addition: extraPrices,
        coef: coef
    };
}

function getStartPrice(customWidth: number, customHeight: number, customDepth: number, allCoefs: number, sizeLimit: sizeLimitsType, tablePrice: number): number {
    const settingMinWidth = sizeLimit.width[0];
    const settingMaxWidth = sizeLimit.width[1];
    const settingMinHeight = sizeLimit.height[0];
    const settingMaxHeight = sizeLimit.height[1];
    const settingMinDepth = sizeLimit.depth[0];
    const settingMaxDepth = sizeLimit.depth[1];

    const isFitMinMaxWidth = (customWidth >= settingMinWidth) && (customWidth <= settingMaxWidth);
    const isFitMinMaxHeight = (customHeight >= settingMinHeight) && (customHeight <= settingMaxHeight);
    const isFitMinMaxDepth = (customDepth >= settingMinDepth) && (customDepth <= settingMaxDepth);

    if (!isFitMinMaxWidth || !isFitMinMaxHeight || !isFitMinMaxDepth) {
        return 0;
    }
    return +(tablePrice * allCoefs).toFixed(2)
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
    const glassDoor = settings["Glass"];
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

export function getDoorSquare(width: number, height: number): number {
    if (width > 0 && height > 0) return +(width * height).toFixed(2);
    return 0;
}

export function getType(width: number, height: number, divider: number | undefined, doorValues: widthItemType[] = [], shelfValues: heightItemType[] | undefined, doors: number, category: string): productTypings {
    switch (category) {
        case 'Base Cabinets':
            if (divider) return width <= divider ? 1 : 2;
            let res: productTypings = 1;
            const currentTypeArr = doorValues.filter(val => {
                if (val?.maxWidth && val.maxWidth >= width) return val.value;
                if (val?.minWidth && val.minWidth <= width) return val.value;
            })
            if (currentTypeArr.length === 1) return currentTypeArr[0].type;
            const doorsVal = currentTypeArr.find(el => el.value === doors);

            return doorsVal ? doorsVal.type : res;
        case 'Wall Cabinets':
        case 'Tall Cabinets':
            if (!shelfValues) return 1;
            const doorsArr = doorValues.length === 1 ? doorValues : doorValues.filter(val => {
                const maxWidth = val.maxWidth;
                const minWidth = val.minWidth;
                if (maxWidth && maxWidth < width) return false;
                if (minWidth && minWidth > width) return false;
                if (val.value !== doors) return false;
                return true;
            })

            const shelfsArr = shelfValues.filter(val => {
                const isMaxHeight = val.maxHeight
                const isMinHeight = val.minHeight
                const isMaxWidth = val.maxWidth
                const isMinWidth = val.minWidth

                if (isMaxHeight && isMaxHeight <= height) return false;
                if (isMinHeight && isMinHeight > height) return false;
                if (isMaxWidth && isMaxWidth <= width) return false;
                if (isMinWidth && isMinWidth > width) return false;
                return true
            })

            let doorTypes = doorsArr.map(el => el.type);
            const currentType = shelfsArr.find(el => doorTypes.includes(el.type));
            return currentType ? currentType.type : 1

        default:
            return 1
    }
}

export function getPvcPrice(width: number, height: number, isAcrylic = false, doorType: string, doorFinish: string): number {
    if (doorType === 'No Doors' || doorFinish === 'Milino') return 0;
    const pvcPrice = width && height ? +((width * 2 + height * 2) / 12 * 2.5).toFixed(2) : 0
    return isAcrylic ? pvcPrice * 1.1 : pvcPrice
}


export function getDoorPrice(doorSquare: number, doorPriceMultiplier: number): number {
    return +(doorSquare / 144 * doorPriceMultiplier).toFixed(2);
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
    return [...new Set<number>(filter.map(el => el.value))]
}


export function getWidthRange(priceData: pricePart[] | undefined): number[] {
    const arr: number[] = priceData && priceData.map(el => el.width) || [];
    const filter = [...new Set<number>(arr)];
    return filter.concat([0]);

}

export function getHeightRange(priceData: pricePart[] | undefined, category: string, customHeight: number | undefined): number[] {
    if (customHeight) return [customHeight, 0];
    const isHeightData = priceData && priceData.find((el) => el.height)
    if (isHeightData) {
        let arr: number[] = []
        priceData && priceData.forEach((el) => {
            if (el.height) arr.push(el.height)
        })
        return [...new Set<number>(arr)].concat([0]);
    }
    switch (category) {
        case 'Base Cabinets':
            return [34.5, 0];
        default:
            return [0]
    }
}

export function getDepthRange(customDepth: number | undefined, category: string): number[] {
    if (customDepth) return [customDepth, 0];
    const settingsRange: rangeType = settings.depthRange;
    if (settingsRange[category]) return [settingsRange[category], 0];
    return [0]
}

type rangeType = {
    [key: string]: number
}

export function getBlindArr(category: string, isAngle: boolean): number[] {
    const range: rangeType = settings.blindRange;
    return range[category] ? [range[category], 0] : [0];

}

export function getDoorWidth(realWidth: number, realBlindWidth: number, isBlind: boolean, isAngle: boolean): number {
    if (isBlind && isAngle) {
        const leg = realWidth - realBlindWidth;
        return +(Math.sqrt(Math.pow(leg, 2) * 2)).toFixed(2)
    }
    if (isBlind) return realWidth - realBlindWidth;
    return realWidth
}


export function getHingeArr(doorArr: number[], category: string): string[] {
    const cases = settings["Hinge opening"];
    const [left, right, double, singleDoor] = cases;
    let arr = []
    switch (category) {
        case 'Tall Cabinets':
            return [left, right, singleDoor];
        default:
            if (doorArr.includes(1)) arr.push(left, right);
            if ([1, 2].every(i => doorArr.includes(i))) arr.push(double);
            return arr
    }
}

export function getLedPrice(realWidth: number, realHeight: number, ledBorders: borderType[]): number {
    if (!ledBorders.length) return 0;
    let sum:number = 0;
    if (ledBorders.includes('Sides')) sum = realHeight*2*2.55
    if (ledBorders.includes('Top')) sum += (realWidth - 1.5)*2.55
    if (ledBorders.includes('Bottom')) sum += (realWidth - 1.5)*2.55
    return Math.round(sum)
}