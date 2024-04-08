import {AppDispatch, RootState} from "../store/store";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import noImg from './../assets/img/noPhoto.png'
import {
    attrItem,
    itemImg,
    productCategory,
    productDataType,
    productRangeType,
    productTypings,
    widthItemType
} from "./productTypes";
import {optionType} from "../common/SelectField";
import {CartItemType} from "../store/reducers/generalSlice";
import baseCabinetProducts from "../api/products.json";
import wallCabinetProducts from "../api/productsWall.json";
import tallCabinetProducts from "../api/productsTall.json";
import vanitiesRegular from "../api/vanitiesRegular.json";
import vanitiesFloating from '../api/vanitiesFloating.json'
import vanitiesHandleLess from '../api/vanitiesHandleless.json'
import vanitiesHandleLessFloating from '../api/vanitiesHandlelessFloating.json'
import settings from "../api/settings.json";
import {v4 as uuidv4} from "uuid";
import {FormikValues} from "formik";


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

export const getCartTotal = (cart: CartItemType[]): number => {
    return cart.reduce(
        (acc, currentVal) => acc + (currentVal.price * currentVal.amount), 0
    )
}


export const getFraction = (number: number): string => {
    if (Number.isInteger(number)) return number.toString();
    const floor = Math.floor(number);
    const reminder = (number - floor);
    const quarters = {
        0.25: '¼',
        0.5: '½',
        0.75: '¾'
    };
    const currQ = Object.entries(quarters).find((el) => el[0] === reminder.toString());
    return currQ ? `${floor} ${currQ[1]}` : number.toString()
}


export const getProductsByCategory = (category: productCategory): productDataType[] => {
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
            break
        default:
            products = [] as productDataType[]
    }
    return products.filter(product => product.category === category);
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


export const addToCartData = (values:FormikValues, type:number, id:number, price:number|undefined, isBlind:boolean, images:itemImg[], name:string, hasMiddleSection:true|undefined) => {
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

    console.log(hinge)

    const realWidth = width || customWidth;
    const img = images[type - 1].value || ''
    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        name,
        img: img,
        width: realWidth,
        height: height || customHeight,
        depth: depth || customDepth,
        hinge,
        options: chosenOptions,
        amount: 1,
        price: price ? price : 0,
        note
    }

    if (isBlind) {
        cartData.blindWidth = blindWidth || customBlindWidth;
    }

    if (chosenOptions.includes('Glass Door')) {
        cartData.doorProfile = doorProfile;
        cartData.doorGlassType = doorGlassType;
        cartData.doorGlassColor = doorGlassColor;
    }

    if (chosenOptions.includes('Glass Shelf')) {
        cartData.shelfProfile = shelfProfile;
        cartData.shelfGlassType = shelfGlassType;
        cartData.shelfGlassColor = shelfGlassColor;
    }

    if (hasMiddleSection) {
        cartData.middleSection = middleSection
    }

    if (ledBorders.length) {
        cartData.led = {
            border: ledBorders,
            alignment: ledAlignment
        }
        if (ledIndent) cartData.led.indent = ledIndent;
    }

    return cartData
}