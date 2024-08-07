import {AppDispatch, RootState} from "../store/store";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import noImg from './../assets/img/noPhoto.png'
import {
    attrItem, customPartDataType,
    itemImg,
    productCategory,
    productDataType,
    productRangeType,
    productTypings, valueItemType
} from "./productTypes";
import {optionType, optionTypeDoor} from "../common/SelectField";
import {addToCart, CartItemType, fillCart, productExtraType, updateProduct} from "../store/reducers/generalSlice";
import baseCabinetProducts from "../api/products.json";
import wallCabinetProducts from "../api/productsWall.json";
import tallCabinetProducts from "../api/productsTall.json";
import vanitiesRegular from "../api/vanitiesRegular.json";
import vanitiesGola from "../api/vanitiesGola.json"
import customParts from '../api/customPart.json'
import golaCabinetProducts from '../api/golaProducts.json'
import closetProducts from '../api/closets.json'
import standartBaseProducts from '../api/standartProducts.json'
import settings from "../api/settings.json";
import {v4 as uuidv4} from "uuid";
import {FormikValues} from "formik";
import {LEDFormValuesType} from "../Components/CustomPart/LEDForm";
import {DoorAccessoiresValuesType} from "../Components/CustomPart/DoorAccessoiresForm";
import {GlassDoorFormValuesType} from "../Components/CustomPart/GlassDoorForm";
import {PVCFormValuesType} from "../Components/CustomPart/PVCForm";
import {GlassShelfFormValuesType} from "../Components/CustomPart/GlassShelfForm";
import {StandartDoorFormValuesType} from "../Components/CustomPart/StandartDoorForm";
import {RoomType} from "./categoriesTypes";
import {colorType, doorType, finishType, materialsData} from "./materialsTypes";
import {getDoorMinMaxValuesArr, getHingeArr} from "./calculatePrice";
import s from "../Components/Cabinets/cabinets.module.sass";
import {OrderFormType} from "./types";

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
        const val: valueItemType = attribute.values.find(v => v.type === type) || attribute.values[0]
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

export function getSelectValfromVal(val: string | undefined, options: optionType[]): optionType | null {
    const option = options.find(el => el.value === val)
    return option || null
}

export function getSelectDoorVal(val: string | undefined, options: optionTypeDoor[]): optionTypeDoor | null {
    const option = options.find(el => el.label === val)
    return option ?? null
}

export const getCartTotal = (cart: CartItemType[]): number => {
    return +(cart.reduce(
        (acc, currentVal) => acc + (currentVal.price * currentVal.amount), 0
    )).toFixed(1)
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
        case "Gola Vanities":
            products = vanitiesGola as productDataType[]
            break;
        case "Gola Base Cabinets":
        case "Gola Wall Cabinets":
        case "Gola Tall Cabinets":
            products = golaCabinetProducts as productDataType[];
            break;
        case "Build In":
        case "Leather":
            products = closetProducts as productDataType[];
            break;
        case "Standart Base Cabinets":
        case "Standart Wall Cabinets":
        case "Standart Tall Cabinets":
            products = standartBaseProducts as productDataType[];
            break
        default:
            products = [] as productDataType[]
    }
    return products.filter(product => product.category === category);
}

export const getcustomParts = (): customPartDataType[] => {
    return customParts as customPartDataType[];
}

type initialStandartValues = {
    Width: number,
    isBlind: boolean,
    "Blind Width": number,
    Height: number,
    Depth: number,
    'Custom Depth': string,
    'Doors': number,
    'Hinge opening': string,
    Corner: string,
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

interface initialValuesType extends initialStandartValues {
    "Custom Width": string,
    'Custom Blind Width': string,
    'Custom Height': string,
}


export const getInitialProductValues = (productRange: productRangeType, isBlind: boolean, blindArr: number[] | undefined, doorValues: valueItemType[] | undefined,initialDepth:number,isCornerChoose?: boolean): initialValuesType => {
    const {widthRange, heightRange} = productRange
    return {
        ['Width']: widthRange[0],
        isBlind: isBlind,
        ['Blind Width']: blindArr ? blindArr[0] : 0,
        ['Height']: heightRange[0],
        ['Depth']: initialDepth,
        ['Custom Width']: '',
        ['Custom Blind Width']: '',
        ['Custom Height']: '',
        ['Custom Depth']: '',
        ['Doors']: doorValues && doorValues[0]?.value || 0,
        ['Hinge opening']: doorValues && settings["Hinge opening"][0] || '',
        ['Corner']: isCornerChoose ? 'Left' : '',
        ['Options']: [],
        ['Profile']: '',
        ['Glass Type']: '',
        ['Glass Color']: '',
        ['Glass Shelf']: '',
        ['Middle Section']: '',
        'LED borders': [],
        'LED alignment': 'Center',
        'LED indent': '',
        ['Note']: ''
    };
}

export const getInitialStandartProductValues = (productRange: productRangeType, doorValues: valueItemType[] | undefined, category:productCategory, depth:number,isBlind: boolean, blindArr: number[] | undefined, isAngle:boolean,isCornerChoose?:boolean): initialStandartValues => {
    const initialDepth = getInitialDepth(productRange, isAngle, depth);
    const {widthRange, heightRange} = productRange
    const doorArr = getDoorMinMaxValuesArr(widthRange[0], doorValues);
    const hingeArr = getHingeArr(doorArr || [], category);
    return {
        ['Width']: widthRange[0],
        isBlind: isBlind,
        ['Blind Width']: blindArr ? blindArr[0] : 0,
        ['Height']: heightRange[0],
        ['Depth']: initialDepth,
        ['Custom Depth']: '',
        ['Doors']: doorArr && doorArr[0] || 0,
        ['Hinge opening']: hingeArr[0] || '',
        ['Corner']: isCornerChoose ? 'Left' : '',
        ['Options']: [],
        ['Profile']: '',
        ['Glass Type']: '',
        ['Glass Color']: '',
        ['Glass Shelf']: '',
        ['Middle Section']: '',
        'LED borders': [],
        'LED alignment': 'Center',
        'LED indent': '',
        ['Note']: ''
    };
}

export const getInitialDepth = (productRange:productRangeType, isAngle:boolean, depth:number):number => {
    const tableDepth = productRange?.depthRange[0];
    if (tableDepth) return tableDepth;
    return !isAngle ? depth : productRange.widthRange[0]
}

export const getInitialHeight = (productRange:productRangeType, height:number):number => {
    const tableDepth = productRange?.heightRange[0];
    if (tableDepth) return tableDepth;
    return height
}

export const getLimit = (d: number[] | undefined): number => {
    return d ? d[0] : 0
}

export const addToCartData = (values: FormikValues, type: productTypings, id: number, isBlind: boolean, images: itemImg[], name: string, hasMiddleSection: true | undefined, category: productCategory,price:number) => {
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
        ['Corner']: corner,
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
        'LED indent': ledIndent
    } = values;

    const img = images[type - 1].value || ''
    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        category,
        name,
        img: img,
        amount: 1,
        price: price,
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

    if (corner) {extra.corner = corner}
    cartData.productExtra = extra;

    return cartData
}


export const addToCartCustomPart = (values: FormikValues, id: number, price: number | undefined, image: string, name: string, category: productCategory) => {
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
            width: width || 0,
            height: height || 0,
            depth: depth || 0,
        }
    }
    return cartData
}

export const addToCartGlassDoor = (values: GlassDoorFormValuesType, id: number, image: string, name: string, category: productCategory) => {
    const {
        ['Width']: width,
        ['Height']: height,
        ['Depth']: depth,
        ['Material']: material,
        Profile: doorProfile,
        Type: doorType,
        Color: doorColor,
        ['Note']: note,
        price
    } = values;


    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        category,
        name,
        img: image || '',
        amount: 1,
        price: price,
        note,
        customPartExtra: {
            width: width || 0,
            height: height || 0,
            depth: depth || 0,
        },
        glassDoorExtra: {
            material: material,
            Profile: doorProfile,
            Type: doorType,
            Color: doorColor
        }
    }

    return cartData
}


export const addToCartGlassShelf = (values: GlassShelfFormValuesType, id: number, image: string, name: string, category: productCategory) => {
    const {
        ['Width']: width,
        ['Height']: height,
        ['Depth']: depth,
        Color: shelfColor,
        ['Note']: note,
        price
    } = values;


    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        category,
        name,
        img: image || '',
        amount: 1,
        price: price,
        note,
        customPartExtra: {
            material: 'Glass 1/4"',
            width: width || 0,
            height: height || 0,
            depth: depth || 0,
        },
    }

    if (shelfColor) cartData.glassShelfExtra = shelfColor;

    return cartData
}

export const addToCartPVC = (values: PVCFormValuesType, id: number, image: string, name: string, category: productCategory) => {
    const {
        ['Width']: pvcFeet,
        ['Material']: material,
        ['Note']: note,
        price

    } = values;


    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        category,
        name,
        img: image || '',
        amount: 1,
        price: price,
        note,
        PVCExtra: {pvcFeet, material}
    }
    return cartData
}

export const addToCartLed = (values: LEDFormValuesType, id: number, image: string, name: string, category: productCategory) => {
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
            "LED Aluminum Profiles": values["LED Aluminum Profiles"],
            "LED Gola Profiles": values["LED Gola Profiles"],
            "Door Sensor": values["Door Sensor"],
            "Dimmable Remote": values["Dimmable Remote"],
            Transformer: values["Transformer"]
        }
    }
    return cartData
}

export const addToCartDoorAccessories = (values: DoorAccessoiresValuesType, id: number, image: string, name: string, category: productCategory) => {
    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        category,
        name,
        img: image ?? '',
        price: values.price,
        amount: 1,
        note: values.Note,
        DoorAccessories: {
            aventos: values.aventos,
            ["Door Hinge"]: values["Door Hinge"],
            "Hinge Holes": values["Hinge Holes"],
            PTO: values.PTO,
            servo: values.servo
        }
    }
    return cartData
}

export const isHasLedBlock = (category: productCategory):boolean => {
    const ledCategoryArr = ['Wall Cabinets','Gola Wall Cabinets'];
    return ledCategoryArr.includes(category)
}


export const addToCartDoor = (values: StandartDoorFormValuesType, id: number, image: string, name: string, category: productCategory) => {
    const cartData: CartItemType = {
        id: id,
        uuid: uuidv4(),
        category,
        name,
        img: image ?? '',
        price: values.price,
        amount: 1,
        note: values.Note,
        DoorExtra: {
            Doors: values['Doors'],
            Color: values['Color']
        }
    }
    return cartData
}

export const isDoorTypeShown = (room:RoomType | '' ):boolean => {
    return (!!room && room !== 'Standart Door')
}

export const isDoorFinishShown = (room:RoomType | '', doorType:string, finishArr?:finishType[] ):boolean => {
    if (!room || room === 'Standart Door') return false
    return !!(doorType && finishArr?.length)
}

export const isDoorColorShown = (room:RoomType | '', doorFinishMaterial:string, finishArr?:finishType[], colorArr?: colorType[] ):boolean => {
    if (room === 'Standart Door') return true;
    return !!(doorFinishMaterial && colorArr?.length)
}

export const isDoorFrameWidth = (doorType:string,doorFinishMaterial:string, frameArr:materialsData[]|undefined ):boolean => {
    if (!frameArr) return false
    if (doorType !== 'Micro Shaker') return false
    return !!doorFinishMaterial
}

export const isDoorGrain = (doorFinishMaterial:string, colorArr:colorType[], doorColor?:string):boolean => {
    if (!doorFinishMaterial) return false;
    return !!colorArr.find(el => el.value === doorColor)?.isGrain
}

export const isBoxMaterial = (doorFinishMaterial:string, doorColor:string|undefined, boxMaterialVal:string):boolean => {
    return !!(doorFinishMaterial === 'No Doors No Hinges' || doorColor || boxMaterialVal)
}
export const getDoorColorsArr = (doorFinishMaterial: string, room: RoomType|'',doors: doorType[],doorType:string): colorType[]|undefined => {
    const finishArr: finishType[] | undefined = doors.find(el => el.value === doorType)?.finish;
    if (!room) return undefined;
    if (room === 'Standart Door') {
        return doors.find(el => el.value === 'Painted')?.finish[0].colors;
    }
    return finishArr?.find(el => el.value === doorFinishMaterial)?.colors

}


export const isLeatherType = (drawerColor:string, isLeather:boolean, leatherTypeArr:materialsData[]):boolean => {
    if (!leatherTypeArr.length || !drawerColor ) return false
    return isLeather
}

export const isLeatherColor = (leatherType:string|undefined, isLeather:boolean, leatherColorArr:materialsData[]):boolean => {
    if (!leatherColorArr.length || !leatherType ) return false
    return isLeather
}


export const checkDoors = (doors:number, doorArr:number[]|null,hingeOpening:string,setFieldValue:Function) => {
    if (!doorArr && doors) setFieldValue('Doors', 0);
    if (doorArr?.length === 1 && doors !== doorArr[0]) setFieldValue('Doors', doorArr[0]);
    if (doors === 1 && doorArr?.includes(2) && hingeOpening === 'Double Door') setFieldValue('Doors', 2)
    if (doors === 2 && doorArr?.includes(1) && ['Left', 'Right'].includes(hingeOpening)) setFieldValue('Doors', 1)
}

export const checkHingeOpening = (hingeOpening:string, hingeArr:string[], doors:number, setFieldValue:Function) => {
    if (doors && !hingeArr.includes(hingeOpening)) setFieldValue('Hinge opening', hingeArr[0]);
}


export const checkProduct = (price:number, totalPrice:number, type:productTypings, newType:productTypings, dispatch:Function) => {
    if (price !== totalPrice || type !== newType) {
        dispatch(updateProduct({
            type: newType,
            price: totalPrice
        }))
    }
}

export const getInitialMaterialInPVCForm = (materialArr:string[], doorFinish:string, doorType:string):string => {
    const curMaterial = materialArr.find(el => doorFinish.includes(el)) ?? doorType;
    return materialArr.includes(curMaterial) ? curMaterial : materialArr[0];
}

export const getCustomPartPVCPrice = (width:number, material:string):number => {
    return material === 'Ultrapan Acrilic' ? Math.ceil(width*1.1): Math.ceil(width);
}

export const getImgSize = (category:string):'s'|'m'|'l' => {
    let imgSize:'s'|'m'|'l';
    switch (category) {
        case "Tall Cabinets":
        case "Gola Tall Cabinets":
        case "Standart Tall Cabinets":
            imgSize = 'm';break;
        default:
            imgSize = 's';break;
    }
    return imgSize
}


export const getInitialMaterials = ():OrderFormType => {
    const storageMaterials = localStorage.getItem('materials');
    return storageMaterials ? JSON.parse(storageMaterials) : {
        'Category': '',
        'Door Type': '',
        'Door Finish Material': '',
        'Door Frame Width': '',
        'Door Color': '',
        'Door Grain': '',
        'Box Material': '',
        'Drawer': '',
        'Drawer Type': '',
        'Drawer Color': '',
        'Leather': ''
    };
}

export const getDoorStr = (choosenMaterials:[string,string][]):string|null => {
    const doorArr = choosenMaterials.filter(el => el[0].includes('Door'));
    if (!doorArr.length) return null;
    let str:string = '';
    doorArr.forEach(([key, val]) => {
        let part = `, ${val}`;
        if (key === 'Door Type') part = val;
        if (key === 'Door Frame Width') part = ` ${val}"`;
        str += part;
    })
    return str;
}

export const getSingleStr = (choosenMaterials:[string,string][], single:string):string|null => {
    const box = choosenMaterials.find(el => el[0].includes(single));
    if (!box) return null;
    return box[1];
}

export const getDrawerStr = (choosenMaterials:[string,string][]):string|null => {
    const drawerArr = choosenMaterials.filter(el => el[0].includes('Drawer'));
    if (!drawerArr.length) return null;
    let str:string = '';
    drawerArr.forEach(([key, val]) => {
        let part = `, ${val}`;
        if (key === 'Drawer') part = val;
        str += part;
    })
    return str;
}

export const getLeatherStr = (choosenMaterials:[string,string][]):string|null => {
    const leatherArr = choosenMaterials.filter(el => el[0].includes('Leather'));
    if (!leatherArr.length) return null;
    return leatherArr.map(el => el[1]).join(', ');
}

export const getSquare = (realWidth:number, realHeight:number):number => {
    return +(realWidth*realHeight/144).toFixed(2)
}

export const getCartData = (cartState:CartItemType[], dispatch:(a:any) => void):{cart: CartItemType[], total:number, length: number} => {
    if (cartState.length) return {cart:cartState, total:getCartTotal(cartState), length:cartState.length}
    const storCart = localStorage.getItem('cart');
    const cart = storCart ? JSON.parse(storCart) as CartItemType[] : [] as CartItemType[];
    if (cart.length) dispatch(fillCart(cart))
    const total = getCartTotal(cart);
    return {cart, total, length: cart.length}
}
