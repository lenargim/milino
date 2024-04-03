import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {OrderFormType} from "../../helpers/types";
import { productType, productTypings} from "../../helpers/productTypes";


interface GeneralState {
    materials: OrderFormType | null,
    product: productType | null,
    cart: CartItemType[]
}

export interface CartItemType {
    id: number, // product id
    uuid: string, // unique cart id
    name: string,
    img?: string,
    amount: number,
    width: number,
    blindWidth?: number,
    height: number,
    depth: number,
    price: number,
    // doors: number,
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
    },
    note: string
}

const initialState: GeneralState = {
    materials: null,
    product: null,
    cart: []
}

type updateProductType = {
    type: productTypings,
    price: number
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
        addToCart: (state, action: PayloadAction<CartItemType>) => {
            state.cart = [...state.cart, action.payload]
        },
        deleteItemFromCart: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter(item => item.uuid !== action.payload)
        },
        removeCart: (state) => {
          state.cart = []
        },
        updateProduct: (state, action: PayloadAction<updateProductType>) => {
            if (state.product ) {
                state.product.price = action.payload.price;
                state.product.type = action.payload.type;
            }
        },
    }
})

export const {setMaterials, setProduct, addToCart, deleteItemFromCart, updateProduct,removeCart} = generalSlice.actions

export default generalSlice.reducer