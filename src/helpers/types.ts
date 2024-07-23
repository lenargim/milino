import * as Yup from 'yup'
import {OrderFormSchema} from "../Components/OrderForm/OrderFormSchems";
import {CheckoutSchema} from "../Components/Checkout/CheckoutSchema";
import {RoomType} from "./categoriesTypes";
import {DoorType} from "../Components/CustomPart/StandartDoorForm";

export type OrderFormType = Yup.InferType<typeof OrderFormSchema>
export type BaseCabinetsType = Yup.InferType<any>
export type CheckoutType = Yup.InferType<typeof CheckoutSchema>
