import {Form, Formik} from 'formik';
import React, {FC} from 'react';
import {
    addToCartCustomPart,
    getLimit,
    useAppDispatch
} from "../../helpers/helpers";
import {customPartDataType} from "../../helpers/productTypes";
import {getCustomPartSchema} from "./CustomPartSchema";
import s from "../Product/product.module.sass";
import {ProductInputCustom, TextInput} from "../../common/Form";
import {addToCart, setCustomPart} from "../../store/reducers/generalSlice";

type CustomPartFormType = {
    customPart: customPartDataType,
}
export type CustomPartFormValuesType = {
    Width: number,
    Height: number,
    Depth: number,
    Note: string,
}

const CustomPartForm: FC<CustomPartFormType> = ({customPart}) => {
    const dispatch = useAppDispatch();
    const {
        name,
        image,
        id,
        price,
        materials: materialsRange,
        limits,
        width: widthConst,
        depth: depthConst,
        category,
    } = customPart;

    const sizeLimitInitial = limits ?? {};
    const initialDepth = depthConst ?? getLimit(sizeLimitInitial.depth);
    const initialValues: CustomPartFormValuesType = {
        'Width': widthConst ?? getLimit(sizeLimitInitial.width),
        'Height': getLimit(sizeLimitInitial.height),
        'Depth': initialDepth,
        'Note': ''
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={getCustomPartSchema(materialsRange, limits)}
            onSubmit={(values: CustomPartFormValuesType, {resetForm}) => {
                const cartData = addToCartCustomPart(values, id, price, image, name, category)
                dispatch(addToCart(cartData))
                resetForm();
            }}
        >
            {({values}) => {
                const {
                    ['Width']: width,
                    ['Height']: height
                } = values;
                const priceNew = +(width * height / 144 * 4.6).toFixed(1);

                setTimeout(() => {
                    if (price !== priceNew) dispatch(setCustomPart({...customPart, price: priceNew}));
                }, 0);

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