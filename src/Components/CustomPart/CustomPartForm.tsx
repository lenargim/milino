import {Form, Formik, FormikValues} from 'formik';
import React, {FC} from 'react';
import {addToCartCustomPart, getCustomPartInitialValues, useAppDispatch} from "../../helpers/helpers";
import {customPartDataType} from "../../helpers/productTypes";
import {getCustomPartSchema} from "./CustomPartSchema";
import s from "../Product/product.module.sass";
import {ProductInputCustom, ProductRadioInput, TextInput} from "../../common/Form";
import {getCustomPartPrice} from "../../helpers/calculatePrice";
import {OrderFormType} from "../../helpers/types";
import {addToCart, setCustomPart} from "../../store/reducers/generalSlice";

type CustomPartFormType = {
    customPart: customPartDataType,
    materials: OrderFormType
}

const CustomPartForm: FC<CustomPartFormType> = ({customPart, materials}) => {
    const dispatch = useAppDispatch();
    const {
        name,
        image,
        id,
        price,
        materials: materialsRange,
        limits,
        depth: depthConst,
        width: widthConst,
        category,
    } = customPart;


    const {"Door Finish Material": doorFinish, "Door Type": doorType} = materials;
    const sizeLimit = materialsRange?.find(el => el.name === doorFinish)?.limits || limits
    if (!sizeLimit) return <div>Cannot find size limit</div>;

    return (
        <Formik
            initialValues={getCustomPartInitialValues(customPart, sizeLimit, doorFinish)}
            validationSchema={getCustomPartSchema(materialsRange, limits)}
            onSubmit={(values: FormikValues, {resetForm}) => {
                const cartData = addToCartCustomPart(values, id, price, image, name, category)
                dispatch(addToCart(cartData))
                resetForm();
            }}
        >
            {({values, errors}) => {
                const {
                    ['Width']: width,
                    ['Height']: height,
                    ['Depth']: depth,
                    ['Material']: material
                } = values;

                const priceCoef = +(getCustomPartPrice(name, width, height, depth, material, doorType)).toFixed(2);

                setTimeout(() => {
                    if (price !== priceCoef) dispatch(setCustomPart({...customPart, price: priceCoef}));
                }, 0)

                return (
                    <Form>
                        {!widthConst ?
                            <div className={s.block}>
                                <h3>Width</h3>
                                <div className={s.options}>
                                    <ProductInputCustom value={null} name={'Width'}/>
                                </div>
                            </div> : null}
                        <div className={s.block}>
                            <h3>Height</h3>
                            <div className={s.options}>
                                <ProductInputCustom value={null} name={'Height'}/>
                            </div>
                        </div>

                        {!depthConst ?
                            <div className={s.block}>
                                <h3>Depth</h3>
                                <div className={s.options}>
                                    <ProductInputCustom value={null} name={'Depth'}/>
                                </div>
                            </div> : null
                        }

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

export default CustomPartForm;