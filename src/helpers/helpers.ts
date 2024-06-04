import {AppDispatch, RootState} from "../store/store";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import noImg from './../assets/img/noPhoto.png'
import {
    attrItem, customPartDataType, doorProfilesType,
    itemImg, materialsLimitsType,
    productCategory,
    productDataType,
    productRangeType,
    productTypings,
    widthItemType
} from "./productTypes";
import {optionType} from "../common/SelectField";
import {CartItemType, productExtraType} from "../store/reducers/generalSlice";
import baseCabinetProducts from "../api/products.json";
import wallCabinetProducts from "../api/productsWall.json";
import tallCabinetProducts from "../api/productsTall.json";
import vanitiesRegular from "../api/vanitiesRegular.json";
import vanitiesFloating from '../api/vanitiesFloating.json'
import vanitiesHandleLess from '../api/vanitiesHandleless.json'
import vanitiesHandleLessFloating from '../api/vanitiesHandlelessFloating.json'
import customParts from '../api/customPart.json'
import settings from "../api/settings.json";
import {v4 as uuidv4} from "uuid";
import {FormikValues} from "formik";
import {room} from './categoriesTypes'
import {LEDAccessoriesType, LEDFormValuesType} from "../Components/CustomPart/LEDForm";
import alumProfile from "../Components/CustomPart/AlumProfile";


export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const getImg = (folder: string, img: string = ''): string => {
    if (!folder || !img) return noImg;
    try {
        return require(`./../assets/img/${folder}/${img}`)
    } catch (e) {
        return noImg
    }
}


export const getAttributes = (attributes: attrItem[], type: productTypings = 1) => {
    return attributes.map(attribute => {
        const val: widthItemType = attribute.values.find(v => v.type === type) || attribute.values[0]
        return {
            name: attribute.name,
            value: val.value
        }
    })
}

export const getProductImage = (images: itemImg[], type: productTypings = 1): string => {
    const img = images.find(img => img.type === type)
    return img ? img.value.toString() : ''
}

export function getSelectValfromVal(val: string, options: optionType[]): optionType | null {
    const option = options.find(el => el.value === val)
    return option || null
}

export function getSelectValfromValCustomPart(val: number, options: doorProfilesType[]): doorProfilesType | null {
    const option = options.find(el => el.value === val)
    return option || null
}

export const getCartTotal = (cart: CartItemType[]): number => {
    return +(cart.reduce(
        (acc, currentVal) => acc + (currentVal.price * currentVal.amount), 0
    )).toFixed(2)
}


export const getFraction = (number: number): string => {
    if (Number.isInteger(number)) return number.toString();
    const floor = Math.floor(number);
    const reminder = (number - floor);
    const quarters = {
        0.125: '⅛',
        0.25: '¼',
        0.375: '⅜',
        0.5: '½',
        0.625: '⅝',
        0.75: '¾',
        0.875: '⅞'
    };
    const currQ = Object.entries(quarters).find((el) => el[0] === reminder.toString());
    return currQ ? `${floor > 0 ? floor : ''} ${currQ[1]}` : number.toString()
}


export const getProductsByCategory = (category: productCategory): productDataType[]  => {
    let products;
    switch (category) {
        case 'Base Cabinets':
            products = baseCabinetProducts as productDataType[];
            break;
        case 'Wall Cabinets':
            products = wallCabinetProducts as productDataType[];
            break;
        case 'Tall Cabinets':
            products = tallCabinetProducts as productDataType[];
            break;
        case "Regular Vanities":
            products = vanitiesRegular as productDataType[]
            break;
        case "Floating Vanities":
            products = vanitiesFloating as productDataType[]
            break;
        case "Handleless Vanities":
            products = vanitiesHandleLess as productDataType[]
            break
        case "Handleless Floating Vanities":
            products = vanitiesHandleLessFloating as productDataType[]
            break;
        default:
            products = [] as productDataType[]
    }
    return products.filter(product => product.category === category);
}

export const getcustomPartsByRoom = (room: room): customPartDataType[] => {
    const customPartns = customParts as customPartDataType[];
    return customPartns.filter(panel => panel.room === room);
}

type initialValuetType = {
    Width: number,
    isBlind: boolean,
    "Blind Width": number,
    Height: number,
    Depth: number,
    "Custom Width": string,
    'Custom Blind Width': string,
    'Custom Height': string,
    'Custom Depth': string,
    'Doors': number,
    'Hinge opening':string,
    Options: string[],
    'Profile': string,
    'Glass Type': string,
    'Glass Color': string,
    'Glass Shelf': string,
    'Middle Section': string,
    'LED borders': string[],
    'LED alignment': string,
    'LED indent': string,
    'Note': string,

}
export const getInitialProductValues = (productRange: productRangeType, isBlind: boolean, blindArr: number[] | undefined, isAngle: boolean, depth: number, doorValues: widthItemType[] | undefined): initialValuetType => {
    return {
        ['Width']: productRange.width[0],
        isBlind: isBlind,
        ['Blind Width']: blindArr ? blindArr[0] : 0,
        ['Height']: productRange.height[0],
        ['Depth']: !isAngle ? depth : productRange.width[0],
        ['Custom Width']: '',
        ['Custom Blind Width']: '',
        ['Custom Height']: '',
        ['Custom Depth']: '',
        ['Doors']: doorValues && doorValues[0]?.value || 0,
        ['Hinge opening']: doorValues && settings["Hinge opening"][0] || '',
        ['Options']: [],
        ['Profile']: '',
        ['Glass Type']: '',
        ['Glass Color']: '',
        ['Glass Shelf']: '',
        ['Middle Section']: '',
        'LED borders': [],
        'LED alignment': 'Center',
        'LED indent': '',
        ['Note']: '',
    };
}

export const getLimit = (d: number[] | undefined): number => {
    if (!d) return 0;
    return d[0];
}

export const addToCartData = (values:FormikValues, type:productTypings, id:number, price:number|undefined, isBlind:boolean, images:itemImg[], name:string, hasMiddleSection:true|undefined, category: productCategory) => {
    const {
        ['Width']: width,
        ['Blind Width']: blindWidth,
        ['Height']: height,
        ['Depth']: depth,
        ['Custom Width']: customWidth,
        ['Custom Blind Width']: customBlindWidth,
        ['Custom Height']: customHeight,
        ['Custom Depth']: customDepth,
        ['Hinge opening']: hinge,
        Options: chosenOptions,
        ['Door Profile']: doorProfile,
        ['Door Glass Type']: doorGlassType,
        ['Door Glass Color']: doorGlassColor,
        ['Shelf Profile']: shelfProfile,
        ['Shelf Glass Type']: shelfGlassType,
        ['Shelf Glass Color']: shelfGlassColor,
        ['Middle Section']: middleSection,
        ['Note']: note,
        'LED borders': ledBorders,
        'LED alignment': ledAlignment,
        'LED indent': ledIndent,
    } = values;

    const img = images[type - 1].value || ''
    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        category,
        name,
        img: img,
        amount: 1,
        price: price ? price : 0,
        note,
    }

    let extra: productExtraType = {
        width: width || customWidth,
        height: height || customHeight,
        depth: depth || customDepth,
        type: type,
        hinge: hinge,
        options: chosenOptions
    };

    if (isBlind) {
        extra.blindWidth = blindWidth || customBlindWidth;
    }

    if (chosenOptions.includes('Glass Door')) {
        extra.doorProfile = doorProfile;
        extra.doorGlassType = doorGlassType;
        extra.doorGlassColor = doorGlassColor;
    }

    if (chosenOptions.includes('Glass Shelf')) {
        extra.shelfProfile = shelfProfile;
        extra.shelfGlassType = shelfGlassType;
        extra.shelfGlassColor = shelfGlassColor;
    }

    if (hasMiddleSection) {
        extra.middleSection = middleSection
    }

    if (ledBorders.length) {
        extra.led = {
            border: ledBorders,
            alignment: ledAlignment
        }
        if (ledIndent) extra.led.indent = ledIndent;
    }
    cartData.productExtra = extra;

    return cartData
}


export const addToCartCustomPart = (values:FormikValues, id:number, price:number|undefined, image: string, name:string, category: productCategory) => {
    const {
        ['Width']: width,
        ['Height']: height,
        ['Depth']: depth,
        ['Material']: material,
        ['Note']: note,
    } = values;


    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        category,
        name,
        img: image || '',
        amount: 1,
        price: price ? price : 0,
        note,
        customPartExtra: {
            material,
            width:  width || 0,
            height: height || 0,
            depth: depth || 0,
        }
    }
    return cartData
}

export const addToCartPVC = (values:FormikValues, id:number, price:number|undefined, image: string, name:string, category: productCategory) => {
    const {
        ['Width']: pvcFeet,
        ['Material']: material,
        ['Note']: note,
    } = values;


    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        category,
        name,
        img: image || '',
        amount: 1,
        price: price ? price : 0,
        note,
        PVCExtra: {pvcFeet, material}
    }
    return cartData
}

export const addToCartLed = (values:LEDFormValuesType, id:number, image: string, name:string, category: productCategory) => {
    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        category,
        name,
        img: image ?? '',
        price: values.price,
        amount: 1,
        note: values.Note,
        LEDAccessories: {
            "Aluminum Profiles": values["Aluminum Profiles"],
            "Gola Profiles": values["Gola Profiles"],
            "Door Sensor": values["Door Sensor"],
            "Dimmable Remote": values["Dimmable Remote"],
            Transformer: values["Transformer"]
        }
    }
    return cartData
}