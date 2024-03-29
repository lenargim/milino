import {AppDispatch, RootState} from "../store/store";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import noImg from './../assets/img/noPhoto.png'
import {attrItem, itemImg, productTypings, widthItemType} from "./productTypes";
import {optionType} from "../common/SelectField";
import {CartItemType} from "../store/reducers/generalSlice";


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
