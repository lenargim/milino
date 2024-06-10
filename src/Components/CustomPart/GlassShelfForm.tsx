import {Form, Formik} from 'formik';
import React, {FC} from 'react';
import {addToCartGlassShelf,
    getLimit, getSelectValfromVal,
    useAppDispatch
} from "../../helpers/helpers";
import {customPartDataType} from "../../helpers/productTypes";
import {getCustomPartSchema} from "./CustomPartSchema";
import s from "../Product/product.module.sass";
import {ProductInputCustom, TextInput} from "../../common/Form";
import {OrderFormType} from "../../helpers/types";
import {addToCart} from "../../store/reducers/generalSlice";
import SelectField from "../../common/SelectField";

type CustomPartFormType = {
    customPart: customPartDataType,
    materials: OrderFormType
}
export type GlassShelfValuesType = {
    Width: number,
    Height: number,
    Depth: number,

    Note: string,
    Color?: string
}

export interface GlassShelfFormValuesType extends GlassShelfValuesType {
    price: number,
    Note: string,
}

const GlassShelfForm: FC<CustomPartFormType> = ({customPart, materials}) => {
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
        glassShelf
    } = customPart;

    const {
        "Door Finish Material": doorFinish,
        "Door Type": doorType
    } = materials;


    const sizeLimitInitial = materialsRange?.find(el => doorFinish.includes(el.name))?.limits ?? materialsRange?.find(el => doorType === el.name)?.limits ?? limits ?? {};

    const initialValues: GlassShelfFormValuesType = {
        'Width': widthConst ?? getLimit(sizeLimitInitial.width),
        'Height': getLimit(sizeLimitInitial.height),
        'Depth': depthConst ?? getLimit(sizeLimitInitial.depth),
        price: 170,
        'Note': ''
    }
    return (
        <Formik
            initialValues={initialValues}
            validationSchema={getCustomPartSchema(materialsRange, limits)}
            onSubmit={(values: GlassShelfFormValuesType, {resetForm}) => {
                if (values.price) {
                    const cartData = addToCartGlassShelf(values, id, image, name, category)
                    dispatch(addToCart(cartData))
                    resetForm();
                }
            }}
        >
            {({values, errors, setFieldValue}) => {
                const {
                    ['Color']: doorColor,
                    price
                } = values;


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


                        <div className={s.blockWrap}>
                            {glassShelf?.length ?
                                <div className={s.block}>
                                    <h3>Glass Color</h3>
                                    <SelectField name="Color"
                                                 val={getSelectValfromVal(doorColor, glassShelf)}
                                                 options={glassShelf}/>
                                </div> : null}

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

export default GlassShelfForm;