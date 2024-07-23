import {optionType} from "../common/SelectField";

export type productTypings = 1 | 2 | 3 | 4
export type pricesTypings = 1 | 2 | 3


export type kitchenCategories = 'Base Cabinets' | 'Wall Cabinets' | 'Tall Cabinets' | 'Gola Base Cabinets' | 'Gola Wall Cabinets' | 'Gola Tall Cabinets'
export type standartCategory = 'Standart Base Cabinets' | 'Standart Wall Cabinets' | 'Standart Tall Cabinets'
export type productCategory = kitchenCategories | standartCategory | 'Regular Vanities' | 'Gola Vanities' | 'Build In' | 'Leather' | 'Custom Parts'
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
    hasMiddleSection?: true,
    isCornerChoose?:boolean
}

export type customPartDataType = {
    id: number,
    name: string,
    room: string,
    type: 'custom' | 'pvc' | 'glass-door' | 'glass-shelf' | 'led-accessories' | 'door-accessories' | 'standart-door' | 'standart-glass-door' | 'backing'
    category: productCategory,
    width?:number,
    depth?: number,
    image: string,
    price?: number,
    materials?: materialsCustomPart[],
    limits?: materialsLimitsType,
    glassDoor?: glassDoorType,
    glassShelf?: optionType[]
}

export type glassDoorType = {
    ['Profile']?: optionType[],
    ['Glass Type']?: optionType[],
    ['Glass Color']?: optionType[]
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
    price: number,
    doorSquare?: number,
    widthDivider?: number,
    heightDivider?: number,
    heightRange?: number,
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
    depth?: number,
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

export type StandartCabinetType = {
    product: productType,
    materialData: {
        boxMaterialCoefs: getBoxMaterialCoefsType,
        drawer: drawerInterface
    }
}

export interface StandartCabinetFormType extends StandartCabinetType {
    standartProductPriceData: standartProductDataToCalculatePriceType
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

export interface extraStandartPricesType {
    depth?: number,
    ptoDoors: number,
    ptoDrawers: number,
    ptoTrashBins: number,
    glassShelf: number,
    glassDoor: number,
    ledPrice: number,
    doorSquare: number,
    boxMaterialCoef: number,
}

export type productRangeType = {
    widthRange: number[],
    heightRange: number[],
    depthRange: number[]
}

export type productDataToCalculatePriceType = {
    priceData?:  pricePart[],
    productRange: productRangeType,
    sizeLimit?:sizeLimitsType,
    attrArr: {name: string, value: number}[],
    doorValues?: widthItemType[],
    drawersQty: number,
    shelfsQty: number
    rolloutsQty: number,
    blindArr?: number[],
    filteredOptions: string[],
}

export type standartProductDataToCalculatePriceType = {
    baseProductPrice?: pricePart[],
    productRange: productRangeType,
    doorValues?: widthItemType[],
    blindArr?: number[],
    filteredOptions: string[],
    drawersQty: number,
    shelfsQty: number,
    rolloutsQty: number,
    sizeLimit?:sizeLimitsType,

}

export type customPartDataToCalculatePriceType = {
    priceData?:  pricePart[],
    productRange: productRangeType,
    sizeLimit?:sizeLimitsType,
}

export type productSizesType = {
    width: number,
    height: number,
    depth: number,
    maxWidth: number,
    maxHeight: number
}