import * as Yup from 'yup'
import {OrderFormSchema} from "../Components/OrderForm/OrderFormSchems";
import {BaseCabinetsSchema} from "../Components/Product/ProductSchema";

export type OrderFormType = Yup.InferType<typeof OrderFormSchema>
export type BaseCabinetsType = Yup.InferType<typeof BaseCabinetsSchema>


