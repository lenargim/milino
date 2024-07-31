import React from 'react';
import {Formik, Form} from "formik";
import {OrderFormSchema} from "./OrderFormSchems";
import Main from "./Main";
import Sidebar from "./Sidebar/Sidebar";
import s from './OrderForm.module.sass';
import { useNavigate } from "react-router-dom";
import {setMaterials} from "../../store/reducers/generalSlice";
import {getInitialMaterials, useAppDispatch} from "../../helpers/helpers";

const OrderForm = () => {
    const dispatch = useAppDispatch();
    const history = useNavigate();
    const initialValues = getInitialMaterials()

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={OrderFormSchema}
            onSubmit={((values, actions) => {
                localStorage.setItem('materials', JSON.stringify(values));
                dispatch(setMaterials(values))
                history('/cabinets');
            })}
        >
            {({values, isValid, isSubmitting, setFieldValue, resetForm}) => {
                return (
                    <Form className={s.orderForm}>
                        <Main values={values} isSubmitting={isSubmitting} isValid={isValid} setFieldValue={setFieldValue}/>
                        <Sidebar values={values} resetForm={resetForm} isValid={isValid}/>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default OrderForm;
