import materials from "../api/materials.json";

export type roomData = {
    value: string,
    img: string
}

export type drawer = {
    value: string,
    img: string,
    types: drawerType[]
}

export type drawerType = {
    value: string,
    img: string,
    colors: string[]
}

export type doorType = {
    name: string,
    finish: finishType[]
    img?: string,
}

export type finishType = {
    name: string,
    colors?: colorType[],
    img?: string
}

export type colorType = {
    name: string,
    isGrain: boolean,
    img?: string
}

export type grainType = {
    name: string,
    img?: string
}

export type boxMaterialType = {
    value: string,
    img: string
}

export type MaterialsType = {
    rooms: roomData[],
    doors: doorType[],
    boxMaterial: typeof materials.boxMaterial,
    drawers: drawer[]
}