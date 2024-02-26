import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {OrderFormType} from "../../helpers/types";
import {productType, productTypings} from "../../helpers/productTypes";


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
    height: number,
    depth: number,
    price: number,
    hinge?: 'Left' | 'Right',
    options: string[],
    profile?: string,
    glassType?: string,
    glassColor?: string,
    glassShelf?: string,
    note: string
}

const initialState: GeneralState = {
    materials: null,
    product: null,
    cart: []
}

type updateProductType = {
    type: productTypings,
    doorSquare: number,
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
        updateProduct: (state, action: PayloadAction<updateProductType>) => {
            const {type, doorSquare} = action.payload
            if (state.product) {
                state.product.type = type;
                state.product.doorSquare = doorSquare
            }
        }
    }
})

export const {setMaterials, setProduct, addToCart, deleteItemFromCart, updateProduct} = generalSlice.actions

export default generalSlice.reducer