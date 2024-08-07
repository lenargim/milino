import React, {FC} from 'react';
import {Form, Formik, FormikValues} from "formik";
import {
    ProductInputCustom,
    ProductRadioInputCustom,
    TextInput
} from "../../common/Form";
import s from './product.module.sass'
import {getProductSchema} from "./ProductSchema";
import {
    addToCartData, checkDoors, checkHingeOpening, checkProduct,
    getInitialProductValues, getSquare,
    useAppDispatch
} from "../../helpers/helpers";
import {
    addToCart,
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
import Test from "./Test";
import OptionsBlock from "./OptionsBlock";
import HingeBlock from "./HingeBlock";
import CornerBlock from "./CornerBlock";

const CabinetForm: FC<CabinetFormType> = ({
                                              product,
                                              productPriceData,
                                              materialData,
                                              sizeLimit,
                                              priceData,
                                              productRange
                                          }) => {
    const dispatch = useAppDispatch();
    const {
        id,
        name,
        images,
        type,
        attributes,
        price,
        widthDivider,
        category,
        legsHeight,
        isBlind,
        isAngle,
        hasSolidWidth,
        hasMiddleSection,
        isCornerChoose,
    } = product;
    const {category: materialCat, premiumCoef, boxMaterialCoefs, doorPriceMultiplier, isAcrylic, doorType, doorFinish, drawer} = materialData
    const {
        blindArr,
        doorValues,
        drawersQty,
        shelfsQty,
        rolloutsQty,
        filteredOptions, hasLedBlock,
        initialDepth
    } = productPriceData;
    const {widthRange, heightRange, depthRange} = productRange;

    const widthRangeWithCustom = widthRange.concat([0]);
    const heightRangeWithCustom = heightRange.concat([0]);
    const depthRangeWithCustom = depthRange.concat([0]);


    return (
        <Formik
            initialValues={getInitialProductValues(productRange, isBlind, blindArr, doorValues, initialDepth, isCornerChoose)}
            validationSchema={getProductSchema(sizeLimit, isAngle, hasMiddleSection)}
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
                    'LED indent': ledIndent
                } = values;

                const realWidth: number = +width || +customWidth || 0;
                const realBlindWidth: number = +blindWidth || +customBlindWidth || 0;
                const realHeight = +height || +customHeight || 0;
                const doorHeight: number = realHeight ? realHeight - legsHeight : 0;
                const realDepth: number = !isAngle ? (+depth || customDepth || 0) : realWidth;
                if (isAngle && realWidth !== depth) setFieldValue('Depth', realWidth);
                const doorArr = getDoorMinMaxValuesArr(realWidth, doorValues);
                const hingeArr = getHingeArr(doorArr || [], category);
                checkDoors(+doors, doorArr, hingeOpening, setFieldValue)
                checkHingeOpening(hingeOpening, hingeArr, +doors, setFieldValue)

                const doorWidth = getDoorWidth(realWidth, realBlindWidth, isBlind, isAngle);
                const doorSquare = getDoorSquare(doorWidth, doorHeight);
                const frontSquare = getSquare(width, doorHeight);
                const newType = getType(realWidth, realHeight, widthDivider, doors, category, attributes);
                const extraPrices: extraPricesType = {
                    ptoDoors: chosenOptions.includes('PTO for doors') ? addPTODoorsPrice(attributes, type) : 0,
                    ptoDrawers: chosenOptions.includes('PTO for drawers') ? addPTODrawerPrice(type, drawersQty) : 0,
                    ptoTrashBins: chosenOptions.includes('PTO for Trash Bins') ? addPTOTrashBinsPrice() : 0,
                    glassShelf: chosenOptions.includes('Glass Shelf') ? addGlassShelfPrice(shelfsQty) : 0,
                    glassDoor: chosenOptions.includes('Glass Door') ? addGlassDoorPrice(doorSquare, doorProfile) : 0,
                    pvcPrice: getPvcPrice(realWidth,realBlindWidth, doorHeight, isAcrylic, doorType, doorFinish),
                    frontSquare:frontSquare,
                    doorPrice: getDoorPrice(frontSquare, doorPriceMultiplier),
                    drawerPrice: getDrawerPrice(drawersQty + rolloutsQty, drawer, realWidth, materialCat),
                    ledPrice: getLedPrice(realWidth, realHeight, ledBorders),
                    boxMaterialCoef: chosenOptions.includes("Box from finish material") ? boxMaterialCoefs.boxMaterialFinishCoef : boxMaterialCoefs.boxMaterialCoef,
                    premiumCoef: premiumCoef,
                    doorSquare: doorSquare
                }
                const allCoefs = extraPrices.boxMaterialCoef * premiumCoef;
                const initialPrice = getInitialPrice(priceData, productRange, category, allCoefs);
                if (!initialPrice) return <div>Cannot find initial price</div>

                const tablePrice = getTablePrice(realWidth, realHeight, realDepth, priceData, category);
                const startPrice = getStartPrice(realWidth, realHeight, realDepth, allCoefs, sizeLimit, tablePrice);
                const sizes: productSizesType = {
                    width: realWidth,
                    height: realHeight,
                    depth: realDepth,
                    maxWidth: widthRange[widthRange.length - 1],
                    maxHeight: heightRange[heightRange.length - 1],
                }
                const calculatedData = calculatePrice(sizes, extraPrices, productRange, startPrice, isAngle);
                const {totalPrice, coef} = calculatedData;
                const totalDepthPrice = initialPrice * (coef.depth + 1)

                extraPrices.width = getPriceForExtraWidth(initialPrice, priceData, width, coef.width, allCoefs)
                extraPrices.height = getPriceForExtraHeight(priceData, initialPrice, width, height, allCoefs, coef.height)
                extraPrices.depth = +(totalDepthPrice - initialPrice).toFixed(1);
                extraPrices.tablePrice = tablePrice

                setTimeout(() => {
                    checkProduct(price, totalPrice, type, newType, dispatch)
                }, 0)

                return (
                    <Form>
                        {!hasSolidWidth ?
                            <div className={s.block}>
                                <h3>Width {extraPrices.width ? `+${extraPrices.width}$` : null}</h3>
                                <div className={s.options}>
                                    {widthRangeWithCustom.map((w, index) => <ProductRadioInputCustom key={index}
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
                            <h3>Height {extraPrices.height ? `+${extraPrices.height}$` : null}</h3>
                            <div className={s.options}>
                                {heightRangeWithCustom.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                                  name={'Height'}
                                                                                                  value={w}/>)}
                                {!height && <ProductInputCustom value={null} name={'Custom Height'}/>}
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
                            {hasMiddleSection &&
                              <div className={s.block}>
                                <h3>Middle Section Height</h3>
                                <ProductInputCustom value={null} name={'Middle Section'}/>
                              </div>
                            }
                        </div>

                        <HingeBlock hingeArr={hingeArr}/>
                        <CornerBlock isCornerChoose={isCornerChoose}/>

                        <LedBlock borders={ledBorders} alignment={ledAlignment} indent={ledIndent}
                                  hasLedBlock={hasLedBlock}/>
                        <OptionsBlock filteredOptions={filteredOptions} chosenOptions={chosenOptions}
                                      doorProfile={doorProfile} doorGlassType={doorGlassType}
                                      doorGlassColor={doorGlassColor} shelfProfile={shelfProfile}
                                      shelfGlassType={shelfGlassType} shelfGlassColor={shelfGlassColor}/>

                        <div className={s.block}>
                            <TextInput type={"text"} label={'Note'} name="Note"/>
                        </div>
                        <div className={s.total}>
                            <span>Total: </span>
                            <span>{totalPrice}$</span>
                        </div>
                        <button type="submit" className={['button yellow'].join(' ')}>Add to cart</button>
                        <Test addition={extraPrices} coef={coef}/>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default CabinetForm;