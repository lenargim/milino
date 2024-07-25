import React, {FC} from 'react';
import {Form, Formik, FormikValues} from "formik";
import settings from './../../api/settings.json'
import {
    ProductOptionsInput,
    ProductRadioInput,
    ProductInputCustom,
    ProductRadioInputCustom,
    TextInput
} from "../../common/Form";
import s from './product.module.sass'
import SelectField from '../../common/SelectField';
import {
    addToCartData, checkDoors, checkHingeOpening, checkProduct,
    getInitialStandartProductValues,
    getSelectValfromVal, isHasLedBlock,
    useAppDispatch
} from "../../helpers/helpers";
import {
    addToCart,
} from "../../store/reducers/generalSlice";
import {
    extraStandartPricesType, StandartCabinetFormType,
} from "../../helpers/productTypes";
import {
    addGlassDoorPrice,
    addGlassShelfPrice,
    addPTODoorsPrice,
    addPTODrawerPrice,
    addPTOTrashBinsPrice,
    calculateStandartData,
    getDoorMinMaxValuesArr,
    getDoorSquare,
    getDoorWidth,
    getHingeArr,
    getInitialPrice,
    getLedPrice,
    getStandartStartPrice, getStandartTablePrice,
    getType, getValidHeightRange
} from "../../helpers/calculatePrice";
import LedBlock from "./LED";
import {getStandartProductSchema} from "./ProductSchema";
import Test from "./Test";
import TestStandart from "./TestStandart";

const CabinetForm: FC<StandartCabinetFormType> = ({product, materialData, standartProductPriceData, productRange, sizeLimit, baseProductPrice}) => {
    const dispatch = useAppDispatch();
    const {
        id,
        name,
        images,
        type,
        attributes,
        price,
        widthDivider,
        depth,
        category,
        legsHeight,
        isBlind,
        isAngle,
        hasMiddleSection,
        isCornerChoose,
    } = product;
    const {boxMaterialCoefs} = materialData
    const {
        doorValues,
        blindArr, filteredOptions, shelfsQty, drawersQty
    } = standartProductPriceData
    const {widthRange, heightRange, depthRange} = productRange;


    const hasLedBlock = isHasLedBlock(category)
    const depthRangeWithCustom = depthRange.concat([0]);

    return (
        <Formik
            initialValues={getInitialStandartProductValues(productRange, doorValues, category, depth, isBlind, blindArr, isAngle,isCornerChoose)}
                validationSchema={getStandartProductSchema(sizeLimit, isAngle)}
            onSubmit={(values: FormikValues, {resetForm}) => {
                if (price) {
                    const cartData = addToCartData(values, type, id, isBlind, images, name, hasMiddleSection, category, price)
                    dispatch(addToCart(cartData))
                    resetForm();
                }
            }}
        >
            {({values, setFieldValue}) => {
                const {
                    ['Width']: width,
                    ['Height']: height,
                    ['Depth']: depth,
                    ['Custom Depth']: customDepth,
                    ['Doors']: doors,
                    ['Blind Width']: blindWidth,
                    ['Hinge opening']: hingeOpening,
                    ['Door Profile']: doorProfile,
                    ['Door Glass Type']: doorGlassType,
                    ['Door Glass Color']: doorGlassColor,
                    ['Shelf Profile']: shelfProfile,
                    ['Shelf Glass Type']: shelfGlassType,
                    ['Shelf Glass Color']: shelfGlassColor,
                    Options: chosenOptions,
                    'LED borders': ledBorders,
                    'LED alignment': ledAlignment,
                    'LED indent': ledIndent
                } = values;

                const {
                    ['Glass']: glassSettings,
                } = settings;
                const {
                    ['Profile']: profileSettings,
                    ['Glass Type']: glassTypeSettings,
                    ['Glass Color']: glassColorSettings,
                } = glassSettings;

                const realWidth: number = +width ?? 0;
                const realBlindWidth: number = +blindWidth ?? 0;
                const realHeight = +height ?? 0;
                const doorHeight: number = realHeight ? realHeight - legsHeight : 0;
                const realDepth: number = isAngle ? realWidth : (+depth || +customDepth || 0);
                if (isAngle && realWidth !== depth) setFieldValue('Depth', realWidth);

                const validHeightRange = getValidHeightRange(realWidth, heightRange,baseProductPrice);

                if (!validHeightRange.includes(realHeight)) {
                    setFieldValue('Height', validHeightRange[0]);
                }

                const doorArr = getDoorMinMaxValuesArr(width, doorValues, widthDivider);
                const hingeArr = getHingeArr(doorArr || [], category);

                const cornerArr = settings.Corner

                const doorWidth = getDoorWidth(realWidth, realBlindWidth, isBlind, isAngle)

                const glassDoorColorFiltered = glassColorSettings.filter(el => el.type === doorGlassType);
                const glassShelfColorFiltered = glassColorSettings.filter(el => el.type === shelfGlassType);
                const doorSquare = getDoorSquare(doorWidth, doorHeight);
                const newType = getType(realWidth, realHeight, widthDivider, doors, category, attributes);

                const extraPrices: extraStandartPricesType = {
                    ptoDoors: chosenOptions.includes('PTO for doors') ? addPTODoorsPrice(attributes, type) : 0,
                    ptoDrawers: chosenOptions.includes('PTO for drawers') ? addPTODrawerPrice(type, drawersQty) : 0,
                    ptoTrashBins: chosenOptions.includes('PTO for Trash Bins') ? addPTOTrashBinsPrice() : 0,
                    glassShelf: chosenOptions.includes('Glass Shelf') ? addGlassShelfPrice(shelfsQty) : 0,
                    glassDoor: chosenOptions.includes('Glass Door') ? addGlassDoorPrice(doorSquare, doorProfile) : 0,
                    ledPrice: getLedPrice(realWidth, realHeight, ledBorders),
                    doorSquare: doorSquare,
                }

                checkDoors(+doors, doorArr,hingeOpening,setFieldValue)
                checkHingeOpening(hingeOpening, hingeArr, +doors, setFieldValue)

                const initialPrice = getInitialPrice(baseProductPrice, productRange, category, 1);
                if (!initialPrice) return <div>Cannot find initial price</div>
                const tablePrice = getStandartTablePrice(realWidth, realHeight, realDepth, baseProductPrice);
                const startPrice: number = getStandartStartPrice(realDepth, 1, sizeLimit, tablePrice);

                const calculatedStandartData = calculateStandartData(startPrice,extraPrices,realDepth, depthRange, isAngle);
                const {totalPrice, coefDepth} = calculatedStandartData
                const totalDepthPrice = initialPrice * (coefDepth + 1);
                extraPrices.depth = +(totalDepthPrice - initialPrice).toFixed(1);
                extraPrices.tablePrice = tablePrice

                setTimeout(() => {
                    checkProduct(price, totalPrice, type, newType, dispatch)
                }, 0)

                return (
                    <Form>
                        <div className={s.block}>
                            <h3>Width</h3>
                            <div className={s.options}>
                                {widthRange.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                       name={'Width'}
                                                                                       value={w}/>)}
                            </div>
                        </div>

                        <div className={s.block}>
                            <h3>Height</h3>
                            <div className={s.options}>
                                {validHeightRange.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                        name={'Height'}
                                                                                        value={w}/>)}
                            </div>
                        </div>

                        <div className={s.divider}>
                            {!isAngle ?
                                <div className={s.block}>
                                    <h3>Depth {extraPrices.depth ? `+${extraPrices.depth}$` : null}</h3>
                                    <div className={s.options}>
                                        {depthRangeWithCustom.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                                         name={'Depth'}
                                                                                                         value={w}/>)}
                                        {!depth && <ProductInputCustom value={null} name={'Custom Depth'}/>}
                                    </div>
                                </div>
                                : null}
                        </div>

                        {hingeArr.length > 1 ?
                            <div className={s.block}>
                                <h3>Hinge opening</h3>
                                <div className={s.options}>
                                    {hingeArr.map((w, index) => <ProductRadioInput key={index}
                                                                                   name={'Hinge opening'}
                                                                                   value={w}/>)}
                                </div>
                            </div> : null}


                        {isCornerChoose ?
                            <div className={s.block}>
                                <h3>Corner</h3>
                                <div className={s.options}>
                                    {cornerArr.map((w, index) => <ProductRadioInput key={index}
                                                                                    name={'Corner'}
                                                                                    value={w}/>)}
                                </div>
                            </div> : null}


                        {hasLedBlock ?
                            <LedBlock borders={ledBorders} alignment={ledAlignment} indent={ledIndent}/>
                            : null}

                        {filteredOptions.length
                            ? <div className={s.block}>
                                <h3>Options</h3>
                                <div className={s.options} role="group">
                                    {filteredOptions.map((w, index) => <ProductOptionsInput key={index} name={`Options`}
                                                                                            value={w}/>)}
                                </div>
                            </div> : null
                        }

                        {chosenOptions.includes('Glass Door') &&
                          <>
                            <h3>Glass Door</h3>
                            <div className={s.blockWrap}>
                              <div className={s.block}>
                                <SelectField name="Door Profile" val={getSelectValfromVal(doorProfile, profileSettings)}
                                             options={profileSettings}/>
                              </div>
                              <div className={s.block}>
                                <SelectField name="Door Glass Type"
                                             val={getSelectValfromVal(doorGlassType, glassTypeSettings)}
                                             options={glassTypeSettings}/>
                              </div>
                              <div className={s.block}>
                                <SelectField name="Door Glass Color"
                                             val={getSelectValfromVal(doorGlassColor, glassDoorColorFiltered)}
                                             options={glassDoorColorFiltered}/>
                              </div>
                            </div>
                          </>}

                        {chosenOptions.includes('Glass Shelf') &&
                          <>
                            <h3>Glass Shelf</h3>
                            <div className={s.blockWrap}>
                              <div className={s.block}>
                                <SelectField name="Shelf Profile"
                                             val={getSelectValfromVal(shelfProfile, profileSettings)}
                                             options={profileSettings}/>
                              </div>
                              <div className={s.block}>
                                <SelectField name="Shelf Glass Type"
                                             val={getSelectValfromVal(shelfGlassType, glassTypeSettings)}
                                             options={glassTypeSettings}/>
                              </div>
                              <div className={s.block}>
                                <SelectField name="Shelf Glass Color"
                                             val={getSelectValfromVal(shelfGlassColor, glassShelfColorFiltered)}
                                             options={glassShelfColorFiltered}/>
                              </div>
                            </div>
                          </>}

                        <div className={s.block}>
                            <TextInput type={"text"} label={'Note'} name="Note"/>
                        </div>
                        <div className={s.total}>
                            <span>Total: </span>
                            <span>{totalPrice}$</span>
                        </div>
                        <button type="submit" className={['button yellow'].join(' ')}>Add to cart</button>
                        <TestStandart extraPrices={extraPrices}/>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default CabinetForm;