import React, {useEffect} from 'react';
import {OrderFormType} from "../../helpers/types";
import {Formik, Form} from "formik";
import {OrderFormSchema} from "./OrderFormSchems";
import Main from "./Main";
import Sidebar from "./Sidebar/Sidebar";
import s from './OrderForm.module.sass';
import { useNavigate } from "react-router-dom";
import {setMaterials, setProduct} from "../../store/reducers/generalSlice";
import {useAppDispatch} from "../../helpers/helpers";

const OrderForm = () => {
    const dispatch = useAppDispatch();
    const history = useNavigate();

    useEffect(() => {
        dispatch(setMaterials(null));
        dispatch(setProduct(null));
        localStorage.removeItem('materials');
    }, [])

    const initialValues: OrderFormType = {
        'room': '',
        'Door Type': '',
        'Door Finish Material': '',
        'Door Color': '',
        'Door Grain': '',
        'Box Material': '',
        'Drawer': '',
        'Drawer Type': '',
        'Drawer Color': ''
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={OrderFormSchema}
            onSubmit={((values, actions) => {
                const materials = JSON.stringify(values)
                localStorage.setItem('materials', materials);
                dispatch(setMaterials(values))
                history('/cabinets');

            })}
            validateOnMount={true}
        >
            {({values, isValid, isSubmitting}) => {
                return (
                    <Form className={s.orderForm}>
                        <Main values={values} isSubmitting={isSubmitting}  isValid={isValid}/>
                        <Sidebar values={values}/>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default OrderForm;
