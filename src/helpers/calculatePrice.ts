import {
    attrItem,
    drawerInterface,
    extraPricesType,
    getBoxMaterialCoefsType,
    heightItemType,
    materialDataType, priceItem,
    pricePart,
    pricesTypings,
    productCategory, productDataToCalculatePriceType,
    productRangeType, productSizesType, productType,
    productTypings,
    profileItem,
    sizeLimitsType,
    widthItemType
} from "./productTypes";
import prices from './../api/prices.json';
import pricesGola from './../api/pricesGola.json'
import pricesCloset from './../api/pricesClosets.json'
import settings from './../api/settings.json'
import {getAttributes} from "./helpers";
import {OrderFormType} from "./types";
import sizes from "../api/sizes.json";
import {productChangeMaterialType} from "../store/reducers/generalSlice";

export type coefType = {
    width: number,
    height: number,
    depth: number
}

type calculatePriceType = {
    totalPrice: number,
    addition: extraPricesType,
    coef: coefType
}

export const getPriceData = (id: number, category:productCategory, basePriceType: pricesTypings): pricePart[] | undefined => {
    type apiPartType = {
        id: number,
        prices: priceItem[]
    }
    let api;
    switch (category) {
        case "Gola Base Cabinets":
        case "Gola Wall Cabinets":
        case "Gola Tall Cabinets":
            api = pricesGola as apiPartType[]
            break;
        case "Build In":
        case "Leather":
            api = pricesCloset as apiPartType[]
            break
        default:
            api = prices as apiPartType[];
    }
    const productPrices = api && api.find(el => el.id === id)?.prices;
    return productPrices && productPrices.find(el => el.type === basePriceType)?.data;
}

export const getInitialPrice = (priceData: pricePart[], productRange: productRangeType, category: productCategory): number | undefined => {
    switch (category) {
        case 'Base Cabinets':
        case "Regular Vanities":
        case "Gola Vanities":
        case "Custom Parts":
        case "Gola Base Cabinets":
        case "Leather":
            return priceData.find(el => el.width === productRange.width[0])?.price;
        case 'Wall Cabinets':
        case 'Tall Cabinets':
        case "Gola Wall Cabinets":
        case "Gola Tall Cabinets":
        case "Build In":
            return priceData.find(el => el.width === productRange.width[0] && el.height === productRange.height[0])?.price;
        default:
            return undefined;
    }
}

export const getTablePrice = (width: number, height: number, depth:number, priceData: pricePart[], category: productCategory): number | undefined => {
    const maxData = priceData[priceData.length - 1];
    switch (category) {
        case 'Base Cabinets':
        case "Regular Vanities":
        case "Gola Vanities":
        case "Gola Base Cabinets":
            const widthTablePrice: number | undefined = priceData.find(el => el.width >= width)?.price;
            if (widthTablePrice) return widthTablePrice;
            if (width > maxData.width) return maxData.price;
            return undefined
        case 'Wall Cabinets':
        case "Gola Wall Cabinets":
        case 'Tall Cabinets':
        case "Gola Tall Cabinets":
        case "Build In":
        case "Custom Parts":
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
        case "Leather":
            const widthAndDepthTablePrice: number | undefined = priceData.find(el => (el.width >= width) && (el.depth && el.depth >= depth))?.price;
            if (widthAndDepthTablePrice) return widthAndDepthTablePrice;
            if (width > maxData.width && maxData.depth && depth > maxData.depth) {
                return maxData.price
            }
            if (width > maxData.width) {
                return priceData.find(el => (el.width === maxData.width) && (el.depth && el.depth >= depth))?.price;
            }
            if (maxData.depth && depth > maxData.depth) {
                return priceData.find(el => (el.depth === maxData.width) && (el.width && el.width >= width))?.price;
            }
            if (!priceData[0]?.depth) {
                const widthTablePrice: number | undefined = priceData.find(el => el.width >= width)?.price;
                if (widthTablePrice) return widthTablePrice;
                if (width > maxData.width) return maxData.price;
            }
            return undefined
        default:
            return undefined;
    }
};
export const getPriceForExtraWidth = (initialPriceWithCoef: number, priceData: pricePart[], width: number, widthCoef: number, allCoefs: number): number => {
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

export const getPriceForExtraHeight = (priceData: pricePart[], initialPriceWithCoef: number, width: number, height: number, allCoefs: number, heightCoef: number): number => {
    const maxData = priceData[priceData.length - 1];
    if (!maxData.height) {
        return +(initialPriceWithCoef * (heightCoef + 1) - initialPriceWithCoef).toFixed(2);
    }
    const checkedWidth = priceData.filter(el => maxData.width >= width ? el.width === width : el.width === maxData.width);
    const initialPrice = checkedWidth.length && checkedWidth[0].price * allCoefs;
    if (initialPrice) {
        const currentHeightPrice = checkedWidth.find(el => el.height && el.height >= height)?.price;
        return currentHeightPrice ? +(currentHeightPrice * allCoefs - initialPrice).toFixed(2) : 0
    }
    return 0
}

export function calculatePrice(sizes: productSizesType, extraPrices: extraPricesType, productRange: productRangeType, startPrice: number): calculatePriceType {
    const {width, height, depth, maxWidth, maxHeight} = sizes
    const coef: coefType = {
        width: 0,
        height: 0,
        depth: 0
    }

    if (maxWidth < width) coef.width = addWidthPriceCoef(width, maxWidth);
    if (maxHeight < height) coef.height = addHeightPriceCoef(height, maxHeight);
    if (productRange.depth[0] !== depth) coef.depth = addDepthPriceCoef(depth, productRange.depth)
    const coefExtra = 1 + (coef.width + coef.height + coef.depth);
    const totalPrice = startPrice ? +(startPrice * coefExtra + extraPrices.ptoDoors + extraPrices.ptoDrawers + extraPrices.glassShelf + extraPrices.glassDoor + extraPrices.ptoTrashBins + extraPrices.pvcPrice + extraPrices.doorPrice + extraPrices.drawerPrice + extraPrices.ledPrice).toFixed(2) : 0
    return {
        totalPrice: totalPrice,
        addition: extraPrices,
        coef
    };
}

export function getStartPrice(customWidth: number, customHeight: number, customDepth: number, allCoefs: number, sizeLimit: sizeLimitsType, tablePrice: number | undefined): number {
    const settingMinWidth = sizeLimit.width[0];
    const settingMaxWidth = sizeLimit.width[1];
    const settingMinHeight = sizeLimit.height[0];
    const settingMaxHeight = sizeLimit.height[1];
    const settingMinDepth = sizeLimit.depth[0];
    const settingMaxDepth = sizeLimit.depth[1];

    const isFitMinMaxWidth = (customWidth >= settingMinWidth) && (customWidth <= settingMaxWidth);
    const isFitMinMaxHeight = (customHeight >= settingMinHeight) && (customHeight <= settingMaxHeight);
    const isFitMinMaxDepth = (customDepth >= settingMinDepth) && (customDepth <= settingMaxDepth);

    if (!isFitMinMaxWidth || !isFitMinMaxHeight || !isFitMinMaxDepth || !tablePrice) {
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

export function addPTODoorsPrice(attributes: attrItem[], prodType: productTypings): number {
    const attrs = getAttributes(attributes, prodType);
    const doorQty = attrs.find(attr => attr.name === "Door")?.value
    if (doorQty && settings.fixPrices["PTO for doors"]) {
        return +doorQty * settings.fixPrices["PTO for doors"]
    }
    return 0
}

export function addPTODrawerPrice(prodType: productTypings, drawersQty: number): number {
    if (drawersQty && settings.fixPrices["PTO for drawers"]) {
        return +drawersQty * settings.fixPrices["PTO for drawers"]
    }
    return 0
}

export function addPTOTrashBinsPrice(): number {
    return settings.fixPrices['PTO for trash bins'] || 0
}

export function addGlassShelfPrice(qty:number): number {
    return settings.fixPrices["Glass Shelf"] * qty || 0
}

export function addGlassDoorPrice(square: number = 0, profileVal: any): number {
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

export function getType(width: number, height: number, divider: number | undefined, doorValues: widthItemType[] = [], doors: number, category: productCategory, attributes: attrItem[]): productTypings {
    const shelfCategories = ['Wall Cabinets','Tall Cabinets','Gola Wall Cabinets','Gola Tall Cabinets', 'Build In'];
    const isShelfTypings = shelfCategories.includes(category)
    const shelfValues: heightItemType[] | undefined = isShelfTypings ? attributes.find(el => el.name === 'Adjustable Shelf')?.values : undefined;
    switch (category) {
        case 'Base Cabinets':
        case "Regular Vanities":
        case "Gola Vanities":
        case "Gola Base Cabinets":
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
        case "Gola Wall Cabinets":
        case "Gola Tall Cabinets":
        case "Build In":
        case "Leather":
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


export function getDoorPrice(doorSquare: number, doorPriceMultiplier: number, doorArr: number[]|null): number {
    if (!doorArr) return 0;
    return +(doorSquare / 144 * doorPriceMultiplier).toFixed(2);
}

export function getDrawerPrice(qty: number, drawer: drawerInterface, width: number): number {
    const {drawerBrand, drawerType, drawerColor} = drawer
    if (!qty) return 0
    if (drawerBrand === 'Milino') {
        if (drawerType === 'Undermount') return qty * 15;
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
        if (drawerType === 'Undermount') return qty * 40 + 15;
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

export function getDoorMinMaxValuesArr(realWidth: number, doorValues?: widthItemType[]): number[]|null {
    if (!doorValues) return null;
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

export function getHeightRange(priceData: pricePart[] | undefined, category: productCategory, customHeight: number | undefined): number[] {
    if (customHeight) return [customHeight, 0];
    const isHeightData = priceData && priceData.find((el) => el.height)
    if (isHeightData) {
        let arr: number[] = []
        priceData && priceData.forEach((el) => {
            if (el.height) arr.push(el.height);
            arr.sort((a, b) => a - b)
        })
        return [...new Set<number>(arr)].concat([0]);
    }
    switch (category) {
        case 'Base Cabinets':
        case "Regular Vanities":
        case "Gola Base Cabinets":
            return [34.5, 0];
        default:
            return [0]
    }
}

export function getDepthRange(priceData: pricePart[] | undefined,category: productCategory, customDepth: number | undefined): number[] {
    if (customDepth) return [customDepth, 0];
    const isDepthData = priceData && priceData.find((el) => el.depth);
    if (isDepthData) {
        let arr: number[] = []
        priceData && priceData.forEach((el) => {
            if (el.depth) arr.push(el.depth);
            arr.sort((a, b) => a - b)
        })
        return [...new Set<number>(arr)].concat([0]);
    }

    switch (category) {
        case "Base Cabinets":
        case "Tall Cabinets":
        case "Gola Base Cabinets":
        case "Gola Tall Cabinets":
            return [24,0];
        case "Wall Cabinets":
        case "Gola Wall Cabinets":
            return [13,0];
        case "Regular Vanities":
        case "Gola Vanities":
            return [21,0];
        case "Build In":
            return [23,0]
        case "Leather":
            return [15.5,0]
        default:
            return [0]
    }
}

type rangeType = {
    [key: string]: number
}

export function getBlindArr(category: string): number[] {
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
        case 'Gola Tall Cabinets':
            return [left, right, singleDoor];
        default:
            if (doorArr.includes(1)) arr.push(left, right);
            if ([1, 2].every(i => doorArr.includes(i))) arr.push(double);
            return arr
    }
}

export function getLedPrice(realWidth: number, realHeight: number, ledBorders: string[] | undefined): number {
    if (!ledBorders || !ledBorders.length) return 0;
    let sum: number = 0;
    if (ledBorders.includes('Sides')) sum = realHeight * 2 * 2.55
    if (ledBorders.includes('Top')) sum += (realWidth - 1.5) * 2.55
    if (ledBorders.includes('Bottom')) sum += (realWidth - 1.5) * 2.55
    return Math.round(sum)
}


export const getBasePriceType = (doorType: string, doorFinish: string): pricesTypings => {
    if (doorType === 'Painted' || doorType === 'Slatted' || doorType === 'Micro Shaker') return 3
    if (doorFinish.includes('Milino') || doorFinish.includes('No Doors')) return 1;
    if (doorFinish.includes('Syncron') || doorFinish === 'Cleaf') return 2
    return 3
}

export const getPremiumCoef = (doorType: string, doorFinish: string): number => {
    if (doorType === 'Painted' || doorType === 'Slatted' || doorType === 'Micro Shaker') return 1.05;
    if (doorFinish === 'Stone') return 1.69
    if (doorFinish === 'Zenit') return 1.03
    if (doorFinish === 'Ultrapan Acrylic') return 1.1
    return 1
}

export const getGrainCoef = (doorGrain: string): number => {
    return doorGrain === 'Gorizontal' ? 1.1 : 1
}

export const getBoxMaterialCoefs = (boxMaterial: string, doorFinish: string): getBoxMaterialCoefsType => {
    return {
        boxMaterialCoef: boxMaterial.includes('Plywood') ? 1.2 : 1,
        boxMaterialFinishCoef: doorFinish === 'Cleaf' || doorFinish === 'Syncron' ? 1.845 : 2.706
    }
}

export const getDoorPriceMultiplier = (doorType: string, doorFinish: string): number => {
    if (doorType === 'Slab') return 0
    if (doorType === 'Painted' || doorType === 'Slatted') return 37.8
    if (doorType === 'Micro Shaker') return 36
    if (doorType === 'No Doors') return -8
    if (doorFinish === 'Syncron') return 30
    if (doorFinish === 'Luxe') return 36
    if (doorFinish === 'Zenit') return (36 * 1.03)
    return 0
}

export const getProductRange = (priceData: pricePart[] | undefined, category: productCategory, customHeight: number | undefined, customDepth: number | undefined): productRangeType => {
    return {
        width: getWidthRange(priceData),
        height: getHeightRange(priceData, category, customHeight),
        depth: getDepthRange(priceData,category, customDepth)
    }
}


export const getMaterialData = (materials: OrderFormType): materialDataType => {
    const {
        ['Door Type']: doorType,
        ['Door Finish Material']: doorFinish,
        ['Door Grain']: doorGrain,
        ['Box Material']: boxMaterial,
        ['Drawer']: drawerBrand,
        ['Drawer Type']: drawerType,
        ['Drawer Color']: drawerColor
    } = materials;
    const basePriceType: pricesTypings = getBasePriceType(doorType, doorFinish);
    const baseCoef = basePriceType === 3 ? getPremiumCoef(doorType, doorFinish) : 1;
    const grainCoef = doorGrain ? getGrainCoef(doorGrain) : 1;
    const premiumCoef = +(baseCoef * grainCoef).toFixed(3)
    const boxMaterialCoefs = getBoxMaterialCoefs(boxMaterial, doorFinish)
    const doorPriceMultiplier = getDoorPriceMultiplier(doorType, doorFinish)
    const isAcrylic = doorFinish === 'Ultrapan Acrylic';
    const drawer: drawerInterface = {
        drawerBrand,
        drawerType,
        drawerColor
    };
    return {
        basePriceType,
        baseCoef,
        grainCoef,
        premiumCoef,
        boxMaterialCoefs,
        doorPriceMultiplier,
        isAcrylic,
        doorType,
        doorFinish,
        drawer
    }
}

export const getProductDataToCalculatePrice = (product: productType | productChangeMaterialType, basePriceType: pricesTypings, drawerBrand: string): productDataToCalculatePriceType => {
    const {
        id,
        type,
        attributes,
        options,
        category,
        isBlind,
        customHeight,
        customDepth,
    } = product;
    const priceData = getPriceData(id, category, basePriceType);

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
    const blindArr = isBlind ? getBlindArr(category) : undefined;
    const filteredOptions = options.filter(option => (option !== 'PTO for drawers' || drawerBrand !== 'Milino'));
    const shelfsQty = getShelfsQty(attrArr);

    return {
        priceData,
        productRange,
        sizeLimit,
        attrArr,
        doorValues,
        drawersQty,
        rolloutsQty,
        blindArr,
        filteredOptions,
        shelfsQty
    }
}


export const getCustomPartPrice = (name: string, width: number, height: number, depth: number, doorFinish: string ): number => {
    const area = width * height / 144;
    switch (name) {
        case "Open Cabinet":
            switch (doorFinish) {
                case "Milino":
                    return (width * height * depth / 100) + 120;
                case "Plywood":
                    return (width * height * depth / 80) + 120;
                case "Syncron":
                case "Cleaf":
                    return (width * height * depth / 50) + 120;
                case "Luxe":
                case "OneSkin":
                case "Ultrapan PET":
                    return (width * height * depth / 20) + 120;
                case "Ultrapan Acrilic":
                    return ((width * height * depth / 20) + 120) * 1.1;
                case "Zenit":
                    return ((width * height * depth / 20) + 120) * 1.03;
                case "Stone":
                    return ((width * height * depth / 20) + 120) * 1.3 * 2;
                case "Painted":
                    return ((width * height * depth / 20) + 120) * 1.3 * 1.05;
                default:
                    return 0;
            }
        case "Floating Shelf":
            const opetCabinetCoef = (width * height + width * depth + height * depth) / 144 * 2 * 2.3
            switch (doorFinish) {
                case "Milino":
                    return opetCabinetCoef * 20
                case "Syncron":
                case "Cleaf":
                    return opetCabinetCoef * 22
                case "Luxe":
                case "OneSkin":
                case "Ultrapan PET":
                    return opetCabinetCoef * 24
                case "Ultrapan Acrilic":
                    return opetCabinetCoef * 24 * 1.1
                case "Zenit":
                    return opetCabinetCoef * 24 * 1.03
                case "Stone":
                    return opetCabinetCoef * 31.2 * 2
                case "Painted":
                    return opetCabinetCoef * 31.2 * 1.05
                default:
                    return 0;
            }
        case "Filler":
        case "Panel":
        case "Wood Toe Kick":
        case "Wood Gola Trims":
            const k = area > 1 ? 1 : 1.8;
            switch (doorFinish) {
                case "Milino":
                    return area * k * 8;
                case "Plywood":
                    return area * k * 10;
                case "Syncron":
                case "Cleaf":
                    return area * k * 18;
                case "Luxe":
                case "OneSkin":
                case "Ultrapan PET":
                    return area * k * 24;
                case "Ultrapan Acrilic":
                    return area * k * 24 * 1.1;
                case "Zenit":
                    return area * k * 24 * 1.03;
                case "Stone":
                    return area * k * 31.2 * 2;
                case "Painted":
                    return area * k * 31.2 * 1.3;
                default:
                    return 0;
            }
        case "Double Panel":
            switch (doorFinish) {
                case "Milino":
                    return area * 36;
                case "Plywood":
                    return area * 40;
                case "Syncron":
                case "Cleaf":
                    return area * 48;
                case "Luxe":
                case "OneSkin":
                case "Ultrapan PET":
                    return area * 60;
                case "Ultrapan Acrilic":
                    return area * 60 * 1.1;
                case "Zenit":
                    return area * 60 * 1.03;
                case "Stone":
                    return area * 78 * 2;
                case "Painted":
                    return area * 78;
                default:
                    return 0;
            }
        case "L Shape":
            const lSHapeArea = (width + depth) * height / 144
            switch (doorFinish) {
                case "Milino":
                    return lSHapeArea * 19;
                case "Plywood":
                    return lSHapeArea * 21;
                case "Syncron":
                case "Cleaf":
                    return lSHapeArea * 39;
                case "Luxe":
                case "OneSkin":
                case "Ultrapan PET":
                    return lSHapeArea * 58;
                case "Ultrapan Acrilic":
                    return lSHapeArea * 58 * 1.1;
                case "Zenit":
                    return lSHapeArea * 58 * 1.03;
                case "Stone":
                    return lSHapeArea * 75.4 * 2;
                case "Painted":
                    return lSHapeArea * 74.4;
                default:
                    return 0;
            }
        case "Column":
            const columnArea = (width * height + width * depth + height * depth) / 144 * 2 * 2.3;
            switch (doorFinish) {
                case "Milino":
                    return columnArea * 15.2;
                case "Syncron":
                case "Cleaf":
                    return columnArea * 16.8;
                case "Luxe":
                case "OneSkin":
                case "Ultrapan PET":
                    return columnArea * 18.4;
                case "Ultrapan Acrilic":
                    return columnArea * 18.4 * 1.1;
                case "Zenit":
                    return columnArea * 18.4 * 1.03;
                case "Stone":
                    return columnArea * 23.92 * 2;
                case "Painted":
                    return columnArea * 23.92;
                default:
                    return 0;
            }
        case "Backing":
            return area * 4.6;
        case "Shaker Panel":
            switch (doorFinish) {
                case "Milino":
                    return area * 36;
                case "Syncron":
                case "Cleaf":
                    return area * 48;
                case "Luxe":
                case "OneSkin":
                case "Ultrapan PET":
                    return area * 60;
                case "Ultrapan Acrilic":
                    return area * 60 * 1.1;
                case "Zenit":
                    return area * 60 * 1.03;
                case "Stone":
                    return area * 78 * 2;
                case "Painted":
                    return area * 78;
                case "Micro Shaker":
                    return area * 60
                default:
                    return 0;
            }
        case "Slatted Panel":
            return area * 48;
        case "Decor Panel":
            let decorPrice = area > 4 ? area * 64 : 240;
            return doorFinish === 'Ultrapan Acrilic' ? decorPrice * 1.1 : decorPrice
        // case "Shaker Glass Door":
        //     let shakerDoorPrice = area * 80 > 240 ? area * 80 : 240;
        //     return doorFinish === 'Ultrapan Acrilic' ? shakerDoorPrice * 1.1 : shakerDoorPrice
        // case "Glass Aluminum Door":
        //     switch (profile) {
        //         case 1021:
        //         case 1040:
        //             return area * 100 > 300 ? area * 100 : 300
        //         case 1022:
        //         case 1042:
        //             return area * 120 > 300 ? area * 120 : 300
        //         default:
        //             return 0;
        //     }
        default:
            return 0
    }
}

export const getGlassDoorPrice = (name: string, width: number, height: number, doorFinish: string, profile?: number ): number => {
    const area = width * height / 144;
    switch (name) {
        case "Shaker Glass Door":
            let shakerDoorPrice = area * 80 > 240 ? area * 80 : 240;
            return doorFinish === 'Ultrapan Acrilic' ? shakerDoorPrice * 1.1 : shakerDoorPrice
        case "Glass Aluminum Door":
            switch (profile) {
                case 1021:
                case 1040:
                    return area * 100 > 300 ? area * 100 : 300
                case 1022:
                case 1042:
                    return area * 120 > 300 ? area * 120 : 300
                default:
                    return 0;
            }
        default:
            return 0
    }
}

export const getShelfsQty = (attrArr: {name: string, value:number}[]):number => {
    const val = attrArr.find(el => el.name ==='Adjustable Shelf')?.value;
    return val ?? 0;
}