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
import {ProductInputCustom, ProductRadioInput, TextInput} from "../../common/Form";
import {getCustomPartPrice} from "../../helpers/calculatePrice";
import {OrderFormType} from "../../helpers/types";
import {addToCart, setCustomPart} from "../../store/reducers/generalSlice";

type CustomPartFormType = {
    customPart: customPartDataType,
    materials: OrderFormType
}
export type CustomPartFormValuesType = {
    Width: number,
    Height: number,
    Depth: number,
    Material: string,
    Note: string,
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
        width: widthConst,
        depth: depthConst,
        category,
    } = customPart;

    const {
        "Door Finish Material": doorFinish,
        "Door Type": doorType
    } = materials;

    if (!materialsRange?.length) return <div>No material Data</div>
    const currentMaterialData =
        materialsRange.find(el => doorFinish.includes(el.name))
        ?? materialsRange.find(el => doorType === el.name)
        ?? materialsRange[0];
    const sizeLimitInitial = currentMaterialData.limits ?? limits ?? {};
    const initialDepth = currentMaterialData?.depth ?? depthConst ?? getLimit(sizeLimitInitial.depth);
    const initialValues: CustomPartFormValuesType = {
        'Width': widthConst ?? getLimit(sizeLimitInitial.width),
        'Height': getLimit(sizeLimitInitial.height),
        'Depth': initialDepth,
        'Material': currentMaterialData.name,
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
            {({values, errors, setFieldValue, }) => {
                const {
                    ['Width']: width,
                    ['Height']: height,
                    ['Depth']: depth,
                    ['Material']: material,
                } = values;
                const priceCoef = +(getCustomPartPrice(name, width, height, depth, material)).toFixed(2);

                setTimeout(() => {
                    if (price !== priceCoef) dispatch(setCustomPart({...customPart, price: priceCoef}));
                }, 0);

                if (currentMaterialData && currentMaterialData.depth) {
                    const curMaterial = values.Material;
                    const newDepth = materialsRange?.find(el => el.name === curMaterial)?.depth;
                    if (depth !== newDepth) setFieldValue('Depth', newDepth);
                }
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

                        {!initialDepth ?
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