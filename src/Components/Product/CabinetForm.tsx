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
import {getProductSchema} from "./ProductSchema";
import {
    addToCartData, getInitialDepth,
    getInitialProductValues,
    getSelectValfromVal, isHasLeaterBlock, isHasLedBlock,
    useAppDispatch
} from "../../helpers/helpers";
import {
    addToCart, updateProduct,
} from "../../store/reducers/generalSlice";
import {
    CabinetFormType, extraPricesType, productSizesType,
} from "../../helpers/productTypes";
import {
    addGlassDoorPrice,
    addGlassShelfPrice,
    addPTODoorsPrice,
    addPTODrawerPrice,
    addPTOTrashBinsPrice,
    calculatePrice,
    getDoorMinMaxValuesArr,
    getDoorPrice,
    getDoorSquare,
    getDoorWidth,
    getDrawerPrice,
    getHingeArr,
    getInitialPrice,
    getLedPrice,
    getPriceForExtraHeight,
    getPriceForExtraWidth,
    getPvcPrice,
    getStartPrice,
    getTablePrice,
    getType
} from "../../helpers/calculatePrice";
import LedBlock from "./LED";
import Leather from "./Leather";

const CabinetForm: FC<CabinetFormType> = ({product, materialData, productPriceData}) => {
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
        hasSolidWidth,
        hasMiddleSection,
        isCornerChoose
    } = product;
    const {premiumCoef, boxMaterialCoefs, doorPriceMultiplier, isAcrylic, doorType, doorFinish, drawer} = materialData
    const {
        productRange,
        blindArr,
        doorValues,
        sizeLimit,
        priceData,
        drawersQty,
        shelfsQty,
        rolloutsQty,
        filteredOptions
    } = productPriceData
    if (!productRange.width[0]) return <div>Cannot find initial width</div>;
    if (!sizeLimit) return <div>Cannot find size limit</div>;
    if (!priceData) return <div>No price table data</div>

    const hasLedBlock = isHasLedBlock(category)
    const hasLeatherBlock = isHasLeaterBlock(category);
    const initialDepth = getInitialDepth(productRange, isAngle, depth)
    return (
        <Formik initialValues={getInitialProductValues(productRange, isBlind, blindArr, doorValues,initialDepth, isCornerChoose)}
                validationSchema={getProductSchema(sizeLimit, isAngle, hasMiddleSection)}
                onSubmit={(values: FormikValues, {resetForm}) => {
                    const cartData = addToCartData(values, type, id, price, isBlind, images, name, hasMiddleSection, category)
                    dispatch(addToCart(cartData))
                    resetForm();
                }}
        >
            {({values, setFieldValue, errors}) => {
                const {
                    ['Width']: width,
                    ['Blind Width']: blindWidth,
                    ['Height']: height,
                    ['Depth']: depth,
                    ['Custom Width']: customWidth,
                    ['Custom Height']: customHeight,
                    ['Custom Depth']: customDepth,
                    ['Custom Blind Width']: customBlindWidth,
                    ['Doors']: doors,
                    Options: chosenOptions,
                    ['Door Profile']: doorProfile,
                    ['Door Glass Type']: doorGlassType,
                    ['Door Glass Color']: doorGlassColor,
                    ['Shelf Profile']: shelfProfile,
                    ['Shelf Glass Type']: shelfGlassType,
                    ['Shelf Glass Color']: shelfGlassColor,
                    ['Hinge opening']: hingeOpening,
                    'LED borders': ledBorders,
                    'LED alignment': ledAlignment,
                    'LED indent': ledIndent,
                } = values;


                const {
                    ['Glass']: glassSettings,
                } = settings;
                const {
                    ['Profile']: profileSettings,
                    ['Glass Type']: glassTypeSettings,
                    ['Glass Color']: glassColorSettings,
                } = glassSettings;

                const realWidth: number = +width || +customWidth || 0;
                const realBlindWidth: number = +blindWidth || +customBlindWidth || 0;
                const realHeight = +height || +customHeight || 0;
                const doorHeight: number = realHeight ? realHeight - legsHeight : 0;
                const realDepth: number = !isAngle ? (+depth || customDepth || 0) : realWidth;
                if (isAngle && realWidth !== depth) setFieldValue('Depth', realWidth);
                const doorArr = getDoorMinMaxValuesArr(realWidth, doorValues);

                const hingeArr = getHingeArr(doorArr || [], category);
                const cornerArr = settings.Corner
                if (doorArr) {
                    if (!doorValues) {
                        setFieldValue('Doors', 0);
                    } else {
                        if (doorArr.length === 1 && doors !== doorArr[0]) {
                            setFieldValue('Doors', doorArr[0])
                        }
                    }
                }

                if (!hingeArr.length) {
                    if (hingeOpening !== 'Double Door' && doors) setFieldValue('Hinge opening', "Double Door");
                } else if (!hingeArr.includes("Double Door") && hingeOpening === 'Double Door') {
                    setFieldValue('Hinge opening', hingeArr[0]);
                }
                const doorWidth = getDoorWidth(realWidth, realBlindWidth, isBlind, isAngle)
                const glassDoorColorFiltered = glassColorSettings.filter(el => el.type === doorGlassType);
                const glassShelfColorFiltered = glassColorSettings.filter(el => el.type === shelfGlassType);
                const doorSquare = getDoorSquare(doorWidth, doorHeight);
                const newType = getType(realWidth, realHeight, widthDivider, doorValues, doors, category, attributes);
                const initialPrice = getInitialPrice(priceData, productRange, category);
                if (!initialPrice) return <div>Cannot find initial price</div>

                const extraPrices: extraPricesType = {
                    ptoDoors: chosenOptions.includes('PTO for doors') ? addPTODoorsPrice(attributes, type) : 0,
                    ptoDrawers: chosenOptions.includes('PTO for drawers') ? addPTODrawerPrice(type, drawersQty) : 0,
                    ptoTrashBins: chosenOptions.includes('PTO for Trash Bins') ? addPTOTrashBinsPrice() : 0,
                    glassShelf: chosenOptions.includes('Glass Shelf') ? addGlassShelfPrice(shelfsQty) : 0,
                    glassDoor: chosenOptions.includes('Glass Door') ? addGlassDoorPrice(doorSquare, doorProfile) : 0,
                    pvcPrice: getPvcPrice(!isBlind ? realWidth : realWidth - realBlindWidth, doorHeight, isAcrylic, doorType, doorFinish),
                    doorPrice: getDoorPrice(doorSquare, doorPriceMultiplier,doorArr),
                    drawerPrice: getDrawerPrice(drawersQty + rolloutsQty, drawer, realWidth),
                    ledPrice: getLedPrice(realWidth, realHeight, ledBorders),
                    boxMaterialCoef: chosenOptions.includes("Box from finish material") ? boxMaterialCoefs.boxMaterialFinishCoef : boxMaterialCoefs.boxMaterialCoef,
                    premiumCoef: premiumCoef,
                    doorSquare: doorSquare,
                }
                const allCoefs = extraPrices.boxMaterialCoef * premiumCoef;
                const initialPriceWithCoef = +(initialPrice * allCoefs).toFixed(2);
                const tablePrice: number | undefined = getTablePrice(realWidth, realHeight, realDepth, priceData, category)
                const startPrice: number = getStartPrice(realWidth, realHeight, realDepth, allCoefs, sizeLimit, tablePrice);
                const sizes: productSizesType = {
                    width: realWidth,
                    height: realHeight,
                    depth: realDepth,
                    maxWidth: productRange.width[productRange.width.length - 2],
                    maxHeight: productRange.height[productRange.height.length - 2],
                }
                const calculatedData = calculatePrice(sizes, extraPrices, productRange, startPrice);
                const totalDepthPrice = +(initialPriceWithCoef * (calculatedData.coef.depth + 1)).toFixed(2)

                extraPrices.width = getPriceForExtraWidth(initialPriceWithCoef, priceData, width, calculatedData.coef.width, allCoefs)
                extraPrices.height = getPriceForExtraHeight(priceData, initialPriceWithCoef, width, height, allCoefs, calculatedData.coef.height)
                extraPrices.depth = +(totalDepthPrice - initialPriceWithCoef).toFixed(2);

                const {addition, totalPrice} = calculatedData;
                addition.doorSquare = +(addition.doorSquare / 144).toFixed(2);
                setTimeout(() => {
                    if (price !== totalPrice || type !== newType) dispatch(updateProduct({
                        type: newType,
                        price: totalPrice
                    }));
                }, 0)
                return (
                    <Form>
                        {!hasSolidWidth ?
                            <div className={s.block}>
                                <h3>Width {addition.width ? `+${addition.width}$` : null}</h3>
                                <div className={s.options}>
                                    {productRange.width.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                                   name={'Width'}
                                                                                                   value={w}/>)}
                                    {!width && <ProductInputCustom value={null} name={'Custom Width'}/>}
                                </div>
                            </div> : null}
                        {blindArr ?
                            <div className={s.block}>
                                <h3>Blind width</h3>
                                <div className={s.options}>
                                    {blindArr.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                         name={'Blind Width'}
                                                                                         value={w}/>)}
                                    {!blindWidth && <ProductInputCustom value={null} name={'Custom Blind Width'}/>}
                                </div>
                            </div> : null
                        }
                        <div className={s.block}>
                            <h3>Height {addition.height ? `+${addition.height}$` : null}</h3>
                            <div className={s.options}>
                                {productRange.height.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                                name={'Height'}
                                                                                                value={w}/>)}
                                {!height && <ProductInputCustom value={null} name={'Custom Height'}/>}
                            </div>
                        </div>

                        <div className={s.divider}>
                            {!isAngle ?
                                <div className={s.block}>
                                    <h3>Depth {addition.depth ? `+${addition.depth}$` : null}</h3>
                                    <div className={s.options}>
                                        {productRange.depth.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                                       name={'Depth'}
                                                                                                       value={w}/>)}
                                        {!depth && <ProductInputCustom value={null} name={'Custom Depth'}/>}
                                    </div>
                                </div>
                                : null}
                            {hasMiddleSection &&
                              <div className={s.block}>
                                <h3>Middle Section Height</h3>
                                <ProductInputCustom value={null} name={'Middle Section'}/>
                              </div>
                            }
                        </div>


                        {hingeArr.length ?
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

                        {hasLeatherBlock ? <Leather /> : null}

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
                        {/*<Test addition={addition} coef={coef}/>*/}
                    </Form>
                )
            }}
        </Formik>
    );
};

export default CabinetForm;