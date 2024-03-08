import {Form, Formik} from 'formik';
import React, {FC, useEffect, useState} from 'react';
import {PhoneInput, TextInput} from "../../common/Form";
import {getCartTotal, useAppDispatch, useAppSelector} from "../../helpers/helpers";
import s from './checkout.module.sass'
import {CheckoutSchema} from "./CheckoutSchema";
import {CheckoutType} from "../../helpers/types";
import emailjs from "@emailjs/browser"
import Loader from "../../common/Loader";
import {Navigate} from "react-router-dom";
import {removeCart, setMaterials} from "../../store/reducers/generalSlice";


type NominalSetState = React.Dispatch<React.SetStateAction<boolean>> &
    { readonly __brand_setState__: unique symbol }

const CheckoutForm: FC = () => {
    const initialValues: CheckoutType = {
        company: '',
        project: '',
        email: '',
        phone: ''
    };
    const cart = useAppSelector(state => state.general.cart);
    return (
        <Formik initialValues={initialValues}
                onSubmit={(values, {resetForm, setSubmitting, setStatus}) => {
                    const cartTotal = getCartTotal(cart);
                    const materialsString = localStorage.getItem('materials');
                    const materials = materialsString ? JSON.parse(materialsString) : null
                    const serviceId: string = process.env.REACT_APP_EMAIL_SERVICE_ID || '';
                    const templateId: string = process.env.REACT_APP_EMAIL_TEMPLATE_ID || '';
                    const publicKey: string = process.env.REACT_APP_EMAIL_PUBLIC_KEY || '';
                    setSubmitting(true);
                    const data = {
                        ...values,
                        materials,
                        cart: cart,
                        cartTotal: cartTotal
                    }
                    try {
                        emailjs.send(serviceId, templateId, data, publicKey)
                            .then(() => {
                                resetForm();
                                setStatus('Order was sent.')
                            });
                    } catch (e) {
                        alert('error')
                        setSubmitting(false);
                    }
                }}
                validationSchema={CheckoutSchema}
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
                        <button type="submit" className={['button submit', isSubmitting ? 'disabled' : ''].join(' ')}
                                disabled={isSubmitting}>Submit
                        </button>
                        {status && <EmailWasSended status={status}/>}
                    </Form>
                )
            }}
        </Formik>
    );
};

export default CheckoutForm;


const EmailWasSended: FC<{ status: string }> = ({status}) => {
    const dispatch = useAppDispatch();

    setTimeout(() => {
        console.log('timeout');
        localStorage.removeItem('materials')
        dispatch(setMaterials(null));
        dispatch(removeCart())
    }, 2000)


    return (
        <div className={s.notification}>
            {status}
        </div>
    )
}