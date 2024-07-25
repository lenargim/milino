import {Form, Formik} from 'formik';
import React, {FC} from 'react';
import {
    addToCartGlassDoor,
    getLimit, getSelectValfromVal,
    useAppDispatch
} from "../../helpers/helpers";
import {customPartDataType} from "../../helpers/productTypes";
import {getCustomPartSchema} from "./CustomPartSchema";
import s from "../Product/product.module.sass";
import {ProductInputCustom, ProductRadioInput, TextInput} from "../../common/Form";
import {getGlassDoorPrice} from "../../helpers/calculatePrice";
import {OrderFormType} from "../../helpers/types";
import {addToCart} from "../../store/reducers/generalSlice";
import SelectField from "../../common/SelectField";

type CustomPartFormType = {
    customPart: customPartDataType,
    materials: OrderFormType
}
export type GlassDoorValuesType = {
    Width: number,
    Height: number,
    Depth: number,
    Material?: string,
    Note: string,
    Profile?: string,
    Type?: string,
    Color?: string
}

export interface GlassDoorFormValuesType extends GlassDoorValuesType {
    price: number,
    Note: string,
}

const CustomPartForm: FC<CustomPartFormType> = ({customPart, materials}) => {
    const dispatch = useAppDispatch();
    const {
        name,
        image,
        id,
        materials: materialsRange,
        limits,
        width: widthConst,
        depth: depthConst,
        category,
        glassDoor
    } = customPart;

    const {
        "Door Finish Material": doorFinish,
        "Door Type": doorType
    } = materials;
    if (!glassDoor) return <div>No data</div>
    const {Profile: doorProfiles, 'Glass Type': doorTypes, 'Glass Color': doorColors} = glassDoor

    const currentMaterialData = materialsRange && (
        materialsRange.find(el => doorFinish.includes(el.name))
        ?? materialsRange.find(el => doorType === el.name)
        ?? materialsRange[0]);


    const sizeLimitInitial = currentMaterialData?.limits ?? limits ?? {};

    const initialValues: GlassDoorFormValuesType = {
        'Width': widthConst ?? getLimit(sizeLimitInitial.width),
        'Height': getLimit(sizeLimitInitial.height),
        'Depth': depthConst ?? getLimit(sizeLimitInitial.depth),
        'Material': currentMaterialData?.name,
        price: 0,
        'Note': ''
    }


    return (
        <Formik
            initialValues={initialValues}
            validationSchema={getCustomPartSchema(materialsRange, limits)}
            onSubmit={(values: GlassDoorFormValuesType, {resetForm}) => {
                if (values.price) {
                    const cartData = addToCartGlassDoor(values, id, image, name, category)
                    dispatch(addToCart(cartData))
                    resetForm();
                }
            }}
        >
            {({values, errors, setFieldValue}) => {
                const {
                    ['Width']: width,
                    ['Height']: height,
                    ['Depth']: depth,
                    ['Profile']: doorProfile,
                    ['Type']: doorType,
                    ['Color']: doorColor,
                    price
                } = values;
                const doorColorsFiltered = doorColors?.filter(el => {
                    return el.type === doorType
                });


                const colorVal = getSelectValfromVal(doorColor, doorColorsFiltered ?? []);

                const profileNumber: number | undefined = doorProfiles?.find(el => el.value === doorProfile)?.glassDoorType


                const priceNew = +(getGlassDoorPrice(name, width, height, doorFinish, profileNumber)).toFixed(1);


                setTimeout(() => {
                    if (price !== priceNew) setFieldValue('price', priceNew);
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

                        <div className={s.blockWrap}>
                            {doorProfiles?.length ?
                                <div className={s.block}>
                                    <h3>Door Profile</h3>
                                    <SelectField name="Profile"
                                                 val={getSelectValfromVal(doorProfile, doorProfiles)}
                                                 options={doorProfiles}/>
                                </div> : null}

                            {doorTypes?.length ?
                                <div className={s.block}>
                                    <h3>Door Type</h3>
                                    <SelectField name="Type" val={getSelectValfromVal(doorType, doorTypes)}
                                                 options={doorTypes}/>
                                </div> : null}

                            {doorColorsFiltered?.length && doorType ?
                                <div className={s.block}>
                                    <h3>Door Color</h3>
                                    <SelectField name="Color"
                                                 val={colorVal}
                                                 options={doorColorsFiltered}/>
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

export default CustomPartForm;