export type productTypings = 1 | 2

export type productType = {
    id: number,
    name: string,
    type: productTypings,
    room: "Kitchen" | "Vanity" | "Closet",
    category: string,
    images: itemImg[],
    height: {
        "label": string,
        "values": number[]
    },
    depth: {
        "label": string,
        "values": number[]
    },
    attributes: attrItem[]
    options: string[]
    doorSquare: number,
    widthRange: number,
}


export interface attrItem {
    name: string,
    values: item[],
}

export type pricePart = {
    "width": number,
    "price": number
}

export type priceItem = {
    type: number,
    data: pricePart[]
}

export type prices = priceItem[]

export type item = {
    type: number,
    value: number
}

export type itemImg = {
    type: number,
    value: string
}


export type settingItemType = {
    id: number,
    minPrice: number,
    multiplier: number
}


export type profileItem = { value: string, label: string, glassDoorType: number }


export type widthTypes = {
    "type": number,
    "divider": number,
    "values": number[]
}