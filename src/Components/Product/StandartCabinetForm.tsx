import React, {FC} from 'react';
import {Form, Formik, FormikValues} from "formik";
import {
    ProductInputCustom,
    ProductRadioInputCustom,
    TextInput
} from "../../common/Form";
import s from './product.module.sass'
import {
    addToCartData, checkDoors, checkHingeOpening, checkProduct,
    getInitialStandartProductValues,
    isHasLedBlock,
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
    getDoorMinMaxValuesArr, getDoorPrice,
    getDoorSquare,
    getDoorWidth, getDrawerPrice,
    getHingeArr,
    getInitialPrice,
    getLedPrice,
    getStandartStartPrice, getStandartTablePrice,
    getType, getValidHeightRange
} from "../../helpers/calculatePrice";
import LedBlock from "./LED";
import {getStandartProductSchema} from "./ProductSchema";
import TestStandart from "./TestStandart";
import OptionsBlock from "./OptionsBlock";
import HingeBlock from "./HingeBlock";
import CornerBlock from "./CornerBlock";

const CabinetForm: FC<StandartCabinetFormType> = ({
                                                      product,
                                                      standartProductPriceData,
                                                      productRange,
                                                      sizeLimit,
                                                      baseProductPrice,
    materialData
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
        depth,
        category,
        legsHeight,
        isBlind,
        isAngle,
        hasMiddleSection,
        isCornerChoose,
    } = product;
    const {
        doorValues,
        blindArr, filteredOptions, shelfsQty, drawersQty, rolloutsQty
    } = standartProductPriceData
    const {category:materialCat, drawer, boxMaterialCoef} = materialData
    const {widthRange, heightRange, depthRange} = productRange;


    const hasLedBlock = isHasLedBlock(category)
    const depthRangeWithCustom = depthRange.concat([0]);

    return (
        <Formik
            initialValues={getInitialStandartProductValues(productRange, doorValues, category, depth, isBlind, blindArr, isAngle, isCornerChoose)}
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

                const realWidth: number = +width ?? 0;
                const realBlindWidth: number = +blindWidth ?? 0;
                const realHeight = +height ?? 0;
                const doorHeight: number = realHeight ? realHeight - legsHeight : 0;
                const realDepth: number = isAngle ? realWidth : (+depth || +customDepth || 0);
                if (isAngle && realWidth !== depth) setFieldValue('Depth', realWidth);

                const validHeightRange = getValidHeightRange(realWidth, heightRange, baseProductPrice);

                if (!validHeightRange.includes(realHeight)) {
                    setFieldValue('Height', validHeightRange[0]);
                }

                const doorArr = getDoorMinMaxValuesArr(width, doorValues, widthDivider);
                const hingeArr = getHingeArr(doorArr || [], category);

                const doorWidth = getDoorWidth(realWidth, realBlindWidth, isBlind, isAngle)
                const doorSquare = getDoorSquare(doorWidth, doorHeight);
                const newType = getType(realWidth, realHeight, widthDivider, doors, category, attributes);

                const extraPrices: extraStandartPricesType = {
                    ptoDoors: chosenOptions.includes('PTO for doors') ? addPTODoorsPrice(attributes, type) : 0,
                    ptoDrawers: chosenOptions.includes('PTO for drawers') ? addPTODrawerPrice(type, drawersQty) : 0,
                    ptoTrashBins: chosenOptions.includes('PTO for Trash Bins') ? addPTOTrashBinsPrice() : 0,
                    glassShelf: chosenOptions.includes('Glass Shelf') ? addGlassShelfPrice(shelfsQty) : 0,
                    glassDoor: chosenOptions.includes('Glass Door') ? addGlassDoorPrice(doorSquare, doorProfile) : 0,
                    ledPrice: getLedPrice(realWidth, realHeight, ledBorders),
                    doorPrice: getDoorPrice(doorSquare, 37.8),
                    drawerPrice: getDrawerPrice(drawersQty + rolloutsQty, drawer, realWidth, materialCat),
                    boxMaterialCoef: boxMaterialCoef,
                    doorSquare: doorSquare,
                }

                checkDoors(+doors, doorArr, hingeOpening, setFieldValue)
                checkHingeOpening(hingeOpening, hingeArr, +doors, setFieldValue)

                const initialPrice = getInitialPrice(baseProductPrice, productRange, category, boxMaterialCoef);
                if (!initialPrice) return <div>Cannot find initial price</div>
                const tablePrice = getStandartTablePrice(realWidth, realHeight, realDepth, baseProductPrice);
                const startPrice: number = getStandartStartPrice(realDepth, boxMaterialCoef, sizeLimit, tablePrice);

                const calculatedStandartData = calculateStandartData(startPrice, extraPrices, realDepth, depthRange, isAngle);
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
                        <TestStandart extraPrices={extraPrices}/>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default CabinetForm;