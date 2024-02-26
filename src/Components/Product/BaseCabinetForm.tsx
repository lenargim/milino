import React, {FC, useEffect} from 'react';
import {Form, Formik, FormikValues} from "formik";
import settings from './../../api/settings.json'
import {
    ProductOptionsInput,
    ProductRadioInput,
    ProductRadioInputCustom,
    ProductRadioInputDimentions,
    TextInput
} from "../../common/Form";
import s from './product.module.sass'
import SelectField, {optionType} from '../../common/SelectField';
import {BaseCabinetsSchema} from "./ProductSchema";
import {useAppDispatch} from "../../helpers/helpers";
import {addToCart, CartItemType, updateProduct} from "../../store/reducers/generalSlice";
import {v4 as uuidv4} from "uuid";
import {productType, widthTypes} from "../../helpers/productTypes";
import {
    calculatePrice,
    getCoefs,
    getDoorSquare,
    getInitialPrice, getPriceData, getPvcPrice,
    getType
} from "../../helpers/calculatePrice";
import {basePriceTypes, getBoxMaterialCoefsType} from "./ProductMain";

type BaseCabinetFormType = {
    product: productType,
    basePriceType: basePriceTypes,
    premiumCoef: number,
    boxMaterialCoefs: getBoxMaterialCoefsType,
    doorsQty: number,
    isAcrylic: boolean,
    drawer: string
}

export type extraPricesType = {
    width: number,
    height: number,
    depth: number,
    ptoDoors: number,
    boxFromFinish: number,
    ptoDrawers: number,
    ptoTrashBins: number,
    glassShelf: number,
    glassDoor: number
}

const BaseCabinetForm: FC<BaseCabinetFormType> = ({product, basePriceType, premiumCoef, boxMaterialCoefs, doorsQty, isAcrylic, drawer}) => {
    const dispatch = useAppDispatch();
    const {id, name, images, type, widthRange, attributes, options} = product;
    const widthData: widthTypes | undefined = settings.width.types.find(el => el.type === widthRange);
    const widthRangeData = widthData && widthData?.values;
    const widthDivider = widthData?.divider || Infinity
    const initialWidth = widthRangeData && widthRangeData[0]
    if (!initialWidth && !widthRangeData) return <div>Cannot find initial width</div>;
    const initialValues = {
        ['Width']: initialWidth,
        ['Height']: settings.height.values[0],
        ['Depth']: settings.depth.values[0],
        ['Custom Width']: '',
        ['Custom Height']: '',
        ['Custom Depth']: '',
        ['Hinge opening']: doorsQty === 1 ? settings["Hinge opening"][0] : '',
        ['Options']: [],
        ['Profile']: '',
        ['Glass Type']: '',
        ['Glass Color']: '',
        ['Glass Shelf']: '',
        ['Note']: '',
        itemTotalPrice: 0
    };
    const filteredOptions = options.filter(option => (option !== 'PTO for drawers' || drawer !== 'Milino'));

    return (
        <Formik initialValues={initialValues}
                validationSchema={BaseCabinetsSchema}
                onSubmit={(values: FormikValues, {resetForm}) => {
                    const {
                        ['Width']: width,
                        ['Height']: height,
                        ['Depth']: depth,
                        ['Custom Width']: customWidth,
                        ['Custom Height']: customHeight,
                        ['Custom Depth']: customDepth,
                        ['Hinge opening']: hinge,
                        Options: chosenOptions,
                        Profile: profileVal,
                        ['Glass Type']: glassTypeVal,
                        ['Glass Color']: glassColorVal,
                        ['Glass Shelf']: glassShelfVal,
                        ['Note']: note,
                        itemTotalPrice,
                    } = values;

                    const realWidth = width || customWidth

                    const cartData: CartItemType = {
                        id: id,
                        uuid: uuidv4(),
                        name: name,
                        img: realWidth <= widthDivider ? images[0].value : images[1].value,
                        width: realWidth,
                        height: height || customHeight,
                        depth: depth || customDepth,
                        hinge: doorsQty === 1 ? hinge : '',
                        options: chosenOptions,
                        amount: 1,
                        price: itemTotalPrice,
                        note
                    }

                    if (chosenOptions.includes('Glass Door')) {
                        cartData.profile = profileVal;
                        cartData.glassType = glassTypeVal;
                        cartData.glassColor = glassColorVal;
                    }

                    if (chosenOptions.includes('Glass Shelf')) {
                        cartData.glassShelf = glassShelfVal;
                    }
                    dispatch(addToCart(cartData))

                    resetForm();
                }}
        >
            {({values, setFieldValue, errors}) => {
                const {
                    ['Width']: width,
                    ['Height']: height,
                    ['Depth']: depth,
                    ['Custom Width']: customWidth,
                    ['Custom Height']: customHeight,
                    ['Custom Depth']: customDepth,
                    Options: chosenOptions,
                    Profile: profileVal,
                    ['Glass Type']: glassTypeVal,
                    ['Glass Color']: glassColorVal,
                    ['Glass Shelf']: glassShelfVal,
                    itemTotalPrice
                } = values

                const {
                    ['Glass Door']: glassDoor,
                } = settings;
                const {
                    ['Profile']: profile,
                    ['Glass Type']: glassType,
                    ['Glass Color']: glassColor,
                } = glassDoor;

                function getSelectValfromVal(val: string, options: optionType[]): optionType | null {
                    const option = options.find(el => el.value === val)
                    return option || null
                }
                const realWidth: number = +width || customWidth || 0;
                const realHeight: number = +height || customHeight || 0;

                const glassColorFiltered = glassColor.filter(el => el.type === glassTypeVal);
                const doorSquare = getDoorSquare(+width, +height, +customWidth, +customHeight)
                const newType = getType(+width, +customWidth, widthDivider);
                const priceData = getPriceData(basePriceType);
                const initialPrice = priceData && getInitialPrice(priceData, widthRangeData) || 0;
                const allCoefs = initialPrice ? getCoefs(chosenOptions, boxMaterialCoefs, premiumCoef) : 1;
                const extraPrices: extraPricesType = {
                    width: 0,
                    height: 0,
                    depth: 0,
                    ptoDoors: 0,
                    ptoDrawers: 0,
                    ptoTrashBins: 0,
                    boxFromFinish: 0,
                    glassShelf: 0,
                    glassDoor: 0
                }
                const pvcPrice = getPvcPrice(realWidth, realHeight, isAcrylic)
                const calculatedData = priceData ?
                    calculatePrice(+width, +height, +depth, +customWidth, +customHeight, +customDepth, chosenOptions, profileVal, doorSquare, attributes, type, allCoefs, initialPrice, priceData, extraPrices, widthRangeData, pvcPrice)
                    : {
                        totalPrice: 0,
                        addition: extraPrices
                    }
                const {addition, totalPrice} = calculatedData
                const additionOptions = addition.glassShelf + addition.glassDoor + addition.ptoDoors + addition.ptoDrawers + addition.ptoTrashBins;

                setTimeout(() => {
                    dispatch(updateProduct({type: newType, doorSquare: doorSquare}))
                }, 0);
                if (itemTotalPrice !== totalPrice) setFieldValue('itemTotalPrice', totalPrice);
                return (
                    <Form>
                        <div className={s.block}>
                            <h3>Width {addition.width ? `+${addition.width}$` : null}</h3>
                            <div className={s.options}>
                                {widthRangeData.map((w, index) => <ProductRadioInputDimentions key={index}
                                                                                               name={'Width'}
                                                                                               value={w}/>)}
                                {!width && <ProductRadioInputCustom value={null} name={'Custom Width'}/>}
                            </div>
                        </div>
                        <div className={s.block}>
                            <h3>Height {addition.height ? `+${addition.height}$` : null}</h3>
                            <div className={s.options}>
                                {settings.height.values.map((w, index) => <ProductRadioInputDimentions key={index}
                                                                                                       name={'Height'}
                                                                                                       value={w}/>)}
                                {!height && <ProductRadioInputCustom value={null} name={'Custom Height'}/>}
                            </div>
                        </div>
                        <div className={s.block}>
                            <h3>Depth {addition.depth ? `+${addition.depth}$` : null}</h3>
                            <div className={s.options}>
                                {settings.depth.values.map((w, index) => <ProductRadioInputDimentions key={index}
                                                                                                      name={'Depth'}
                                                                                                      value={w}/>)}
                                {!depth && <ProductRadioInputCustom value={null} name={'Custom Depth'}/>}
                            </div>
                        </div>
                        {doorsQty === 1 ?
                            <div className={s.block}>
                                <h3>Hinge opening</h3>
                                <div className={s.options}>
                                    {settings['Hinge opening'].map((w, index) => <ProductRadioInput key={index}
                                                                                                    name={'Hinge opening'}
                                                                                                    value={w}/>)}
                                </div>
                            </div> : null
                        }
                        {filteredOptions.length
                            ? <div className={s.block}>
                                <h3>Options {additionOptions ? `+${additionOptions}$` : null}</h3>
                                <div className={s.options} role="group">
                                    {filteredOptions.map((w, index) => <ProductOptionsInput key={index} name={`Options`}
                                                                                    value={w}/>)}
                                </div>
                            </div> : null
                        }
                        {chosenOptions.includes('Glass Door') && <h3>Glass Door</h3>}
                        <div className={s.blockWrap}>
                            {
                                chosenOptions.includes('Glass Door') && <div className={s.block}>
                                <SelectField name="Profile" val={getSelectValfromVal(profileVal, profile)}
                                             options={profile}/>
                              </div>
                            }
                            {
                                chosenOptions.includes('Glass Door') && <div className={s.block}>
                                <SelectField name="Glass Type" val={getSelectValfromVal(glassTypeVal, glassType)}
                                             options={glassType}/>
                              </div>
                            }
                            {
                                chosenOptions.includes('Glass Door') && glassColorFiltered.length ?
                                    <div className={s.block}>
                                        <SelectField name="Glass Color"
                                                     val={getSelectValfromVal(glassColorVal, glassColorFiltered)}
                                                     options={glassColorFiltered}/>
                                    </div> : null
                            }
                        </div>
                        {chosenOptions.includes('Glass Shelf') && <h3>Glass Shelf</h3>}
                        <div className={s.blockWrap}>
                            {
                                chosenOptions.includes('Glass Shelf') && <div className={s.block}>
                                <SelectField name="Glass Shelf" val={getSelectValfromVal(glassShelfVal, profile)}
                                             options={profile}/>
                              </div>
                            }
                        </div>
                        <div className={s.block}>
                            <TextInput type={"text"} label={'Note'} name="Note"/>
                        </div>
                        <div className={s.total}>
                            <span>Total: </span>
                            <span>{totalPrice}$</span>
                            <input type="number" name="itemTotalPrice" readOnly={true}/>
                        </div>
                        <button type="submit" className={['button yellow'].join(' ')}>Add to cart</button>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default BaseCabinetForm;