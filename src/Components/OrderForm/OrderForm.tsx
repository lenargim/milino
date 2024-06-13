import React from 'react';
import {OrderFormType} from "../../helpers/types";
import {Formik, Form} from "formik";
import {OrderFormSchema} from "./OrderFormSchems";
import Main from "./Main";
import Sidebar from "./Sidebar/Sidebar";
import s from './OrderForm.module.sass';
import { useNavigate } from "react-router-dom";
import {setMaterials} from "../../store/reducers/generalSlice";
import {useAppDispatch} from "../../helpers/helpers";

const OrderForm = () => {
    const dispatch = useAppDispatch();
    const history = useNavigate();
    const storageMaterials = localStorage.getItem('materials');
    const parsedMaterials = storageMaterials && JSON.parse(storageMaterials) as OrderFormType;
    const emptyMaterials: OrderFormType = {
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
    const initialValues: OrderFormType = parsedMaterials ? parsedMaterials : emptyMaterials;

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
                        <Sidebar values={values} resetForm={resetForm}/>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default OrderForm;
