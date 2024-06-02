import {Form, Formik} from 'formik';
import React, {FC} from 'react';
import {
    addToCartCustomPart,
    getLimit,
    getSelectValfromVal,
    getSelectValfromValCustomPart,
    useAppDispatch
} from "../../helpers/helpers";
import {customPartDataType} from "../../helpers/productTypes";
import {getCustomPartSchema} from "./CustomPartSchema";
import s from "../Product/product.module.sass";
import {ProductInputCustom, ProductRadioInput, TextInput} from "../../common/Form";
import {getCustomPartPrice} from "../../helpers/calculatePrice";
import {OrderFormType} from "../../helpers/types";
import {addToCart, setCustomPart} from "../../store/reducers/generalSlice";
import SelectField from "../../common/SelectField";

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
    Profile?: number
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
        doorProfiles
    } = customPart;

    const {
        "Door Finish Material": doorFinish,
        "Door Type": doorType
    } = materials;

    const sizeLimitInitial = materialsRange?.find(el => doorFinish.includes(el.name))?.limits ?? materialsRange?.find(el => doorType === el.name)?.limits ?? limits ?? {};
    const materialArr = materialsRange ? Object.values(materialsRange).map(el => el.name) : [];
    const curMaterial = materialArr.find(el => doorFinish.includes(el)) ?? doorType;

    const initialValues: CustomPartFormValuesType = {
        'Width': widthConst ?? getLimit(sizeLimitInitial.width),
        'Height':getLimit(sizeLimitInitial.height),
        'Depth': depthConst ?? getLimit(sizeLimitInitial.depth),
        'Material': curMaterial ??  materialArr[0],
        'Note': ''
    }

    if (doorProfiles) {
        initialValues.Profile = doorProfiles[0].value
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
            {({values, errors}) => {
                const {
                    ['Width']: width,
                    ['Height']: height,
                    ['Depth']: depth,
                    ['Material']: material,
                    ['Note']: note,
                    ['Profile']: profile
                } = values;
                const priceCoef = +(getCustomPartPrice(name, width, height, depth, material, doorType, profile)).toFixed(2);

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
                        {doorProfiles && profile &&
                          <div className={s.block}>
                            <h3>Door Profile</h3>
                            <SelectField name="Profile" val={getSelectValfromValCustomPart(profile, doorProfiles)}
                                         options={doorProfiles}/>
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