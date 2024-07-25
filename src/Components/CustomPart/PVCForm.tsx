import {Form, Formik} from 'formik';
import React, {FC} from 'react';
import {
    addToCartPVC, getCustomPartPVCPrice, getInitialMaterialInPVCForm,
    getLimit,
    useAppDispatch
} from "../../helpers/helpers";
import {customPartDataType} from "../../helpers/productTypes";
import s from "../Product/product.module.sass";
import {ProductInputCustom, ProductRadioInput, TextInput} from "../../common/Form";
import {OrderFormType} from "../../helpers/types";
import {addToCart} from "../../store/reducers/generalSlice";
import {getPVCSchema} from "./PVCSchema";

type PVCFormType = {
    customPart: customPartDataType,
    materials: OrderFormType
}
export type PVCValuesType = {
    Width: number,
    Material: string,
}

export interface PVCFormValuesType extends PVCValuesType {
    price: number,
    Note: string,
}

const PVCForm: FC<PVCFormType> = ({customPart, materials}) => {
    const dispatch = useAppDispatch();
    const {
        name,
        image,
        id,
        materials: materialsRange,
        limits,
        category,
    } = customPart;

    const {
        "Door Finish Material": doorFinish,
        "Door Type": doorType
    } = materials;

    const materialArr = materialsRange ? Object.values(materialsRange).map(el => el.name) : [];
    const initialMaterial = getInitialMaterialInPVCForm(materialArr, doorFinish, doorType)
    const sizeLimitInitial = materialsRange?.find(el => doorFinish.includes(el.name))?.limits || {};

    const initialValues: PVCFormValuesType = {
        Width: getLimit(sizeLimitInitial.width),
        Material: initialMaterial,
        price: 0,
        Note: ''
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={getPVCSchema(materialsRange, limits)}
            onSubmit={(values: PVCFormValuesType, {resetForm}) => {
                if (values.price) {
                    const cartData = addToCartPVC(values, id, image, name, category)
                    dispatch(addToCart(cartData))
                    resetForm();
                }
            }}
        >
            {({values, setFieldValue}) => {
                const {
                    ['Width']: width,
                    ['Material']: material,
                    ['Note']: note,
                    price: price
                } = values;

                const priceNew = getCustomPartPVCPrice(width, material);

                setTimeout(() => {
                    if (price !== priceNew) setFieldValue('price', priceNew);
                }, 0);

                return (
                    <Form>
                        <div className={s.block}>
                            <h3>PVC Width(ft)</h3>
                            <div className={s.options}>
                                <ProductInputCustom value={null} name={'Width'}/>
                            </div>
                        </div>
                        {materialsRange &&
                          <div className={s.block}>
                            <h3>Material</h3>
                            <div className={s.options}>
                                {materialsRange.map((m, index) => <ProductRadioInput key={index}
                                                                                     name={'Material'}
                                                                                     value={m.name}/>)}
                            </div>
                          </div>
                        }
                        <div className={s.block}>
                            <TextInput type={"text"} label={'Note'} name="Note"/>
                        </div>
                        <div className={s.total}>
                            <span>Total: </span>
                            <span>{price}$</span>
                        </div>
                        <button type="submit" className={['button yellow'].join(' ')}>Add to cart</button>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default PVCForm;