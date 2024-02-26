import materials from "../api/materials.json";

export type room = {
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
}

export type finishType = {
    name: string,
    colors?: colorType[]
}

export type colorType = {
    name: string,
    isGrain: boolean
}

export type grainType = {
    name: string
}

export type boxMaterialType = {
    value: string,
    img: string
}

export type MaterialsType = {
    rooms: room[],
    doors: typeof materials.doors,
    boxMaterial: typeof materials.boxMaterial,
    drawers: drawer[]
}