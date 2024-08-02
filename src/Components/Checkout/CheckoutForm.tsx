import {Form, Formik} from 'formik';
import React, {FC} from 'react';
import {PhoneInput, TextInput} from "../../common/Form";
import {getCartTotal, useAppDispatch} from "../../helpers/helpers";
import s from './checkout.module.sass'
import {CheckoutSchema} from "./CheckoutSchema";
import {CheckoutType} from "../../helpers/types";
import Loader from "../../common/Loader";
import {CartItemType, removeCart, setMaterials} from "../../store/reducers/generalSlice";
import CheckoutCart from "./CheckoutCart";
import ReactPDF, {PDFDownloadLink, Document, Page} from '@react-pdf/renderer';
import PDF from "./PDF";


const CheckoutForm: FC<{ cart: CartItemType[] }> = ({cart}) => {
    const date = new Date().toLocaleString('en-US', {dateStyle: "short"});
    const initialValues: CheckoutType = {
        company: '',
        project: '',
        email: '',
        phone: ''
    };
    return (
        <Formik initialValues={initialValues}
            // onSubmit={(values, {resetForm, setSubmitting, setStatus}) => {
            //     const cartTotal = getCartTotal(cart);
            //     const materialsString = localStorage.getItem('materials');
            //     const materials = materialsString ? JSON.parse(materialsString) : null
            //     const serviceId: string = process.env.REACT_APP_EMAIL_SERVICE_ID || '';
            //     const templateId: string = process.env.REACT_APP_EMAIL_TEMPLATE_ID || '';
            //     const publicKey: string = process.env.REACT_APP_EMAIL_PUBLIC_KEY || '';
            //     setSubmitting(true);
            //     const data = {
            //         ...values,
            //         materials,
            //         cart: cart,
            //         cartTotal: cartTotal
            //     }
            //     try {
            //         emailjs.send(serviceId, templateId, data, publicKey)
            //             .then(() => {
            //                 resetForm();
            //                 setStatus('Order was sent.')
            //             });
            //     } catch (e) {
            //         alert('error')
            //         setSubmitting(false);
            //     }
            // }}
                validationSchema={CheckoutSchema}
                onSubmit={() => {
                    console.log('submitted');
                    ReactPDF.render(<PDF />, `Milino Order ${date}.pdf`);
                }}
        >
            {({isSubmitting, status}) => {
                return (
                    <Form className={[s.form].join(' ')}>
                        {isSubmitting ? <Loader/> : null}
                        <h1>Checkout</h1>
                        <div className={s.block}>
                            <TextInput type="text" name="company" label="Company name"/>
                            <TextInput type="text" name="project" label="Project name"/>
                            <TextInput type="email" name="email" label="E-mail"/>
                            <PhoneInput type="text" name="phone" label="Phone number"/>
                        </div>
                        <CheckoutCart cart={cart}/>
                        {/*<PDFDownloadLink document={<PDF />} fileName={`Milino Order ${date}.pdf`}>*/}
                        {/*    {({ blob, url, loading, error }) =>*/}
                        {/*        loading ? 'Loading document...' : 'Download now!'*/}
                        {/*    }*/}
                        {/*</PDFDownloadLink>*/}
                        <button type="submit"
                                className={['button submit', isSubmitting ? 'disabled' : ''].join(' ')}
                                disabled={isSubmitting}>Render PDF
                        </button>
                        {/*{status && <EmailWasSended status={status}/>}*/}
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