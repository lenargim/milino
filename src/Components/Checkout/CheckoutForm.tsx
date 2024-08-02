import {Form, Formik} from 'formik';
import React, {FC} from 'react';
import {PhoneInput, TextInput} from "../../common/Form";
import {getDoorStr, getDrawerStr, getSingleStr, useAppDispatch} from "../../helpers/helpers";
import s from './checkout.module.sass'
import {CheckoutSchema} from "./CheckoutSchema";
import {CheckoutType, OrderFormType} from "../../helpers/types";
import {CartItemType, removeCart, setMaterials} from "../../store/reducers/generalSlice";
import CheckoutCart from "./CheckoutCart";
import {pdf, PDFViewer} from '@react-pdf/renderer';
import PDF from "./PDF";
import {saveAs} from "file-saver";

const CheckoutForm: FC<{ cart: CartItemType[], total:number, materials:OrderFormType }> = ({cart, total, materials}) => {
    const initialValues: CheckoutType = {
        company: '',
        project: '',
        email: '',
        phone: ''
    };
    const choosenMaterials = Object.entries(materials).filter(el => !!el[1]);
    const roomStr = getSingleStr(choosenMaterials, 'room')
    const doorStr = getDoorStr(choosenMaterials)
    const boxMaterialStr = getSingleStr(choosenMaterials, 'Box Material')
    const drawerStr = getDrawerStr(choosenMaterials);
    const leatherStr = getSingleStr(choosenMaterials, 'Leather');
    const str = {roomStr, doorStr, boxMaterialStr,drawerStr,leatherStr};
    const jpgCart = cart.map(el => ({...el, img: el.img.replace('webp', 'jpg')}))

    return (
        <Formik initialValues={initialValues}
                validationSchema={CheckoutSchema}
                onSubmit={async (values) => {
                    const date = new Date().toLocaleString('en-US', {dateStyle: "short"});
                    const fileName = `Milino order ${date}`;

                    const blob = await pdf(<PDF values={values} cart={jpgCart} str={str} />).toBlob();
                    saveAs(blob, fileName);
                }}
        >
            {({isSubmitting, status, values}) => {
                return (
                    <Form className={[s.form].join(' ')}>
                        <h1>Checkout</h1>
                        <div className={s.block}>
                            <TextInput type="text" name="company" label="Company name"/>
                            <TextInput type="text" name="project" label="Project name"/>
                            <TextInput type="email" name="email" label="E-mail"/>
                            <PhoneInput type="text" name="phone" label="Phone number"/>
                        </div>
                        <CheckoutCart cart={cart} total={total}/>
                        <button type="submit"
                                className={['button yellow', s.submit].join(' ')}
                                disabled={isSubmitting}>PDF
                        </button>
                        <PDFViewer className={s.viewer}>
                            <PDF values={values} cart={jpgCart} str={str} />
                        </PDFViewer>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default CheckoutForm;


const EmailWasSended: FC<{ status: string }> = ({status}) => {
    const dispatch = useAppDispatch();
    localStorage.removeItem('materials')
    localStorage.removeItem('category')
    setTimeout(() => {
        dispatch(setMaterials(null));
        dispatch(removeCart())
    }, 2000)


    return (
        <div className={s.notification}>
            {status}
        </div>
    )
}