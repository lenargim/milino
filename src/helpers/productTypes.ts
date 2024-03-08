export type productTypings = 1 | 2
export type pricesTypings = 1 | 2 | 3

export type productDataType = {
    id: number,
    name: string,
    room: string,
    category: string,
    images: itemImg[],
    attributes: attrItem[],
    options: string[],
}

export interface productType extends productDataType{
    type: productTypings,
    height: number,
    depth: number,
    doorSquare?: number,
    widthDivider?: number,
    heightRange?: number,
    price?: number,
}


export interface attrItem {
    name: string,
    values: widthItemType[],
}

export type pricePart = {
    width: number,
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