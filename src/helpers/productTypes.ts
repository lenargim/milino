import {optionType} from "../common/SelectField";
import {OrderFormType} from "./types";

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
    heightRange?: number,
}

export type materialDataType = {
    category: string,
    basePriceType: pricesTypings,
    baseCoef: number,
    grainCoef: number,
    premiumCoef: number,
    boxMaterialCoefs: getBoxMaterialCoefsType,
    doorPriceMultiplier: number,
    isAcrylic: boolean,
    doorType: string,
    doorFinish: string,
    drawer: drawerInterface,
    leather?: string
}


export interface attrItem {
    name: string,
    values: valueItemType[],
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

export type customItemType = {
    type: productTypings,
    value: number | string,
    minWidth?: number,
    maxWidth?: number
}

export type valueItemType = {
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
    materials: OrderFormType
}

export type CabinetFormType = {
    product: productType,
    productPriceData: productDataToCalculatePriceType,
    sizeLimit: sizeLimitsType,
    priceData: pricePart[],
    productRange: productRangeType,
    materialData: materialDataType
}

export type StandartCabinetType = {
    product: productType,
    materials: OrderFormType,
}

export type standartMaterialDataType = {
    category: string
    boxMaterialCoef: number,
    drawer: drawerInterface,
}

export type StandartCabinetFormType = {
    product: productType,
    standartProductPriceData: standartProductDataToCalculatePriceType,
    sizeLimit: sizeLimitsType,
    baseProductPrice: pricePart[],
    productRange: productRangeType
    materialData: standartMaterialDataType
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
    frontSquare:number,
    premiumCoef: number,
    boxMaterialCoef: number,
    tablePrice?: number
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
    tablePrice?: number,
    doorPrice: number,
    drawerPrice: number,
    boxMaterialCoef: number

}

export type productRangeType = {
    widthRange: number[],
    heightRange: number[],
    depthRange: number[]
}

export type productDataToCalculatePriceType = {
    doorValues?: valueItemType[],
    drawersQty: number,
    shelfsQty: number
    rolloutsQty: number,
    blindArr?: number[],
    filteredOptions: string[],
    hasLedBlock: boolean,
    initialDepth: number
}

export type standartProductDataToCalculatePriceType = {
    doorValues?: valueItemType[],
    blindArr?: number[],
    filteredOptions: string[],
    drawersQty: number,
    shelfsQty: number,
    rolloutsQty: number
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