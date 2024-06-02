import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {OrderFormType} from "../../helpers/types";
import {
    attrItem,
    customPartDataType,
    productCategory,
    productType,
    productTypings
} from "../../helpers/productTypes";
import {getCartTotal} from "../../helpers/helpers";


interface GeneralState {
    materials: OrderFormType | null,
    product: productType | null,
    customPart: customPartDataType | null,
    cart: CartItemType[]
    cartTotal: number
}


export type CartItemType = {
    id: number, // product id
    uuid: string, // unique cart id
    name: string,
    category: productCategory,
    img?: string,
    amount: number,
    width: number,
    height: number,
    depth: number,
    price: number,
    note: string,
    productExtra?: productExtraType,
    customPartExtra?: customPartExtraType
}


export type productExtraType = {
    type: productTypings,
    blindWidth?: number,
    hinge: 'Left' | 'Right' | 'Double Doors',
    options: string[],
    doorProfile?: string,
    doorGlassType?: string,
    doorGlassColor?: string,
    shelfProfile?: string,
    shelfGlassType?: string,
    shelfGlassColor?: string,
    middleSection?: number,
    led?: {
        border: string[],
        alignment: string,
        indent?: number
    }
}

export type customPartExtraType = {
    material?: string,
    pvcFeet?: number,
}

export interface productChangeMaterialType extends CartItemType {
    type: productTypings,
    attributes: attrItem[],
    options: string[],
    isBlind: boolean,
    isAngle: boolean,
    customHeight?: number,
    customDepth?: number,
}

const initialState: GeneralState = {
    materials: null,
    product: null,
    customPart: null,
    cart: [],
    cartTotal: 0
}

type updateProductType = {
    type: productTypings,
    price: number
}
type updateProductAmountType = {
    uuid: string,
    amount: number,
}

type updateProductPriceType = {
    uuid: string,
    price: number,
}

export const generalSlice = createSlice({
    name: 'general',
    initialState,
    reducers: {
        setMaterials: (state, action: PayloadAction<OrderFormType | null>) => {
            state.materials = action.payload
        },
        setProduct: (state, action: PayloadAction<productType | null>) => {
            state.product = action.payload
        },
        setCustomPart: (state, action: PayloadAction<customPartDataType | null>) => {
            state.customPart = action.payload
        },
        addToCart: (state, action: PayloadAction<CartItemType>) => {
            state.cart = [...state.cart, action.payload];
            state.cartTotal = getCartTotal(state.cart)
        },
        deleteItemFromCart: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter(item => item.uuid !== action.payload);
            state.cartTotal = getCartTotal(state.cart)
        },
        removeCart: (state) => {
            state.cart = [];
            state.cartTotal = 0;
        },
        updateProduct: (state, action: PayloadAction<updateProductType>) => {
            if (state.product) {
                state.product.price = action.payload.price;
                state.product.type = action.payload.type;
            }
        },
        updateProductAmount: (state, action: PayloadAction<updateProductAmountType>) => {
            const product = state.cart.find(el => el.uuid === action.payload.uuid);
            if (product) {
                product.amount = action.payload.amount
                state.cartTotal = getCartTotal(state.cart)
            }
        },
        updateProductPrice: (state, action: PayloadAction<updateProductPriceType>) => {
            const product = state.cart.find(el => el.uuid === action.payload.uuid);
            if (product) {
                product.price = action.payload.price;
                state.cartTotal = getCartTotal(state.cart)
            }
        }
    }
})

export const {
    setMaterials,
    setProduct,
    setCustomPart,
    addToCart,
    deleteItemFromCart,
    updateProduct,
    removeCart,
    updateProductAmount,
    updateProductPrice
} = generalSlice.actions

export default generalSlice.reducer