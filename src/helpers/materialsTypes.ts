import materials from "../api/materials.json";

export type OrderFormSelectType = {
    data: materialsData[],
    value: string,
    name: string
}

export type materialsData = {
    value: string,
    img?: string
}

export interface drawer extends materialsData{
    types: drawerType[]
}

export interface drawerType extends materialsData{
    colors: materialsData[]
}

export interface doorType extends materialsData {
    finish: finishType[]
    frame?: materialsData[]
}

export interface finishType extends materialsData{
    colors?: colorType[],
}

export interface colorType extends materialsData{
    isGrain?: boolean,
}

export type boxMaterialType = {
    value: string,
    img: string
}

export type MaterialsType = {
    categories: materialsData[],
    doors: doorType[],
    boxMaterial: typeof materials.boxMaterial,
    drawers: drawer[],
    grain: materialsData[]
    leatherColor: materialsData[],
    leatherType: materialsData[]
}