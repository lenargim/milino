import {optionType} from "../common/SelectField";

export type productTypings = 1 | 2 | 3 | 4
export type pricesTypings = 1 | 2 | 3


export type productCategory = 'Base Cabinets' | 'Wall Cabinets' | 'Tall Cabinets' | 'Regular Vanities' | 'Floating Vanities' | 'Handleless Vanities' | 'Handleless Floating Vanities' | 'Custom Parts'
export type productDataType = {
    id: number,
    name: string,
    room: string,
    category: productCategory,
    images: itemImg[],
    attributes: attrItem[],
    options: string[],
    legsHeight: number,
    isBlind: boolean,
    isAngle: boolean,
    customHeight?: number,
    customDepth?: number,
    hasSolidWidth?: true,
    hasMiddleSection?: true
}

export type customPartDataType = {
    id: number,
    name: string,
    room: string,
    type: 'custom' | 'pvc' | 'led-accessories' | 'door-accessories'
    category: productCategory,
    width?:number,
    depth?: number,
    image: string,
    price?: number,
    materials?: materialsCustomPart[],
    limits?: materialsLimitsType,
    doorProfiles?: doorProfilesType[]
}

export type doorProfilesType = {
    value: number,
    label: string
}

export type materialsCustomPart = {
    name: string,
    limits: materialsLimitsType,
    depth?: number
}

export type materialsLimitsType = {
    width?: number[],
    height?: number[],
    depth?: number[]
}

export interface productType extends productDataType {
    type: productTypings,
    height: number,
    depth: number,
    doorSquare?: number,
    widthDivider?: number,
    heightRange?: number,
    price?: number,
}

export type materialDataType = {
    basePriceType: pricesTypings,
    baseCoef: number,
    grainCoef: number,
    premiumCoef: number,
    boxMaterialCoefs: getBoxMaterialCoefsType,
    doorPriceMultiplier: number,
    isAcrylic: boolean,
    doorType: string,
    doorFinish: string,
    drawer: drawerInterface
}


export interface attrItem {
    name: string,
    values: widthItemType[],
}

export interface customAttrItem {
    name: string,
    values: customItemType[],
}

export type pricePart = {
    width: number,
    height?: number,
    price: number
}

export type priceItem = {
    type: pricesTypings,
    data: pricePart[]
}

export type prices = priceItem[]

export type widthItemType = {
    type: productTypings,
    value: number,
    minWidth?: number,
    maxWidth?: number
}

export type customItemType = {
    type: productTypings,
    value: number | string,
    minWidth?: number,
    maxWidth?: number
}

export type heightItemType = {
    type: productTypings,
    value: number,
    minHeight?: number,
    maxHeight?: number,
    minWidth?: number,
    maxWidth?: number
}

export type itemImg = {
    type: productTypings,
    value: string
}


export type settingItemType = {
    id: number,
    minPrice: number,
    multiplier: number
}


export type profileItem = { value: string, label: string, glassDoorType: number }


export type settingSizesType = {
    [key: string]: {
        width: number[],
        height: number[],
        depth: number[]
    }
}

export type sizeLimitsType = {
    width: number[],
    height: number[],
    depth: number[]
}

export type getBoxMaterialCoefsType = {
    boxMaterialCoef: number,
    boxMaterialFinishCoef: number
}

export interface drawerInterface {
    drawerBrand: string,
    drawerType: string,
    drawerColor: string
}


export type CabinetType = {
    product: productType,
    materialData: materialDataType

}

export interface CabinetFormType extends CabinetType {
    productPriceData: productDataToCalculatePriceType
}

export type DepthRangeType = {
    [key: string]: number,
}

export interface extraPricesType {
    width?: number,
    height?: number,
    depth?: number,
    ptoDoors: number,
    ptoDrawers: number,
    ptoTrashBins: number,
    glassShelf: number,
    glassDoor: number,
    pvcPrice: number,
    doorPrice: number,
    drawerPrice: number,
    ledPrice: number,
    doorSquare: number,
    premiumCoef: number,
    boxMaterialCoef: number,
}

export type productRangeType = {
    width: number[],
    height: number[],
    depth: number[]
}

export type productDataToCalculatePriceType = {
    priceData?:  pricePart[],
    productRange: productRangeType,
    sizeLimit?:sizeLimitsType,
    attrArr: {name: string, value: number}[],
    doorValues?: widthItemType[],
    drawersQty: number,
    rolloutsQty: number,
    blindArr?: number[],
    filteredOptions: string[]
}

export type customPartDataToCalculatePriceType = {
    priceData?:  pricePart[],
    productRange: productRangeType,
    sizeLimit?:sizeLimitsType,
    // attrArr: {name: string, value: number}[],
}

export type productSizesType = {
    width: number,
    height: number,
    depth: number,
    maxWidth: number,
    maxHeight: number
}