import React, {FC} from 'react';
import {Form, Formik, FormikValues} from "formik";
import settings from './../../api/settings.json'
import sizes from './../../api/sizes.json'
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
import {getAttributes, getSelectValfromVal, useAppDispatch} from "../../helpers/helpers";
import {
    addToCart,
    CartItemType, updateProduct,
} from "../../store/reducers/generalSlice";
import {v4 as uuidv4} from "uuid";
import {pricesTypings, productType, sizeLimitsType} from "../../helpers/productTypes";
import {
    calculatePrice, getBlindArr, getDepthRange, getDoorMinMaxValuesArr, getDoorPrice,
    getDoorSquare, getDoorWidth, getDrawerPrice, getHeightRange, getHingeArr,
    getInitialPrice, getLedPrice, getPriceData, getPvcPrice,
    getType, getWidthRange
} from "../../helpers/calculatePrice";
import {drawerType, getBoxMaterialCoefsType} from "./ProductMain";
import LedBlock from "./LED";

type BaseCabinetFormType = {
    product: productType,
    basePriceType: pricesTypings,
    premiumCoef: number,
    boxMaterialCoefs: getBoxMaterialCoefsType,
    drawer: drawerType,
    doorPriceMultiplier: number
    doorType: string
    doorFinish: string
}

export type DepthRangeType = {
    [key: string]: number,
}

export interface extraPricesType {
    width: number,
    height: number,
    depth: number,
    ptoDoors: number,
    ptoDrawers: number,
    ptoTrashBins: number,
    glassShelf: number,
    glassDoor: number,
    pvcPrice: number,
    doorPrice: number,
    drawerPrice: number,
    ledPrice: number,
    doorSquare: number,
    premiumCoef: number,
    boxMaterialCoef: number,
    tablePrice?: number
}


const CabinetForm: FC<BaseCabinetFormType> = ({
                                                  product,
                                                  basePriceType,
                                                  premiumCoef,
                                                  boxMaterialCoefs,
                                                  drawer,
                                                  doorPriceMultiplier, doorType, doorFinish
                                              }) => {
    const dispatch = useAppDispatch();
    const {
        id,
        name,
        images,
        type,
        attributes,
        options,
        price,
        widthDivider,
        depth,
        category,
        legsHeight,
        isBlind,
        isAngle,
        customHeight,
        customDepth,
        hasSolidWidth,
        hasMiddleSection
    } = product;

    const priceData = getPriceData(id, basePriceType);
    const widthRange = getWidthRange(priceData);
    const heightRange = getHeightRange(priceData, category, customHeight);
    const sizeLimit: sizeLimitsType | undefined = sizes.find(size => size.productIds.includes(product.id))?.limits;
    const depthRange = getDepthRange(customDepth, category)

    const initialWidth = widthRange && widthRange[0]
    const attrArr = getAttributes(attributes, type);
    const doorValues = attributes.find(el => el.name === 'Door')?.values;
    const isShelfTypings = category === 'Wall Cabinets' || category === 'Tall Cabinets'
    const shelfValues = isShelfTypings ? attributes.find(el => el.name === 'Adjustable Shelf')?.values : undefined;
    const drawersQty = attrArr.reduce((acc, current) => {
        const qty = current.name.includes('Drawer') ? current.value : 0
        return acc + qty;
    }, 0);

    const rolloutsQty = attrArr.reduce((acc, current) => {
        const qty = current.name.includes('Rollout') ? current.value : 0
        return acc + qty;
    }, 0);
    if (!initialWidth) return <div>Cannot find initial width</div>;
    if (!sizeLimit) return <div>Cannot find size limit</div>;
    const initialDoorsQty: number = doorValues && doorValues[0]?.value || 0;
    const blindArr = isBlind ? getBlindArr(category, isAngle) : undefined;
    const initialValues = {
        ['Width']: initialWidth,
        isBlind: isBlind,
        ['Blind Width']: blindArr ? blindArr[0] : 0,
        ['Height']: heightRange[0],
        ['Depth']: !isAngle ? depth : initialWidth,
        ['Custom Width']: '',
        ['Custom Blind Width']: '',
        ['Custom Height']: '',
        ['Custom Depth']: '',
        ['Doors']: initialDoorsQty,
        ['Hinge opening']: settings["Hinge opening"][0],
        ['Options']: [],
        ['Profile']: '',
        ['Glass Type']: '',
        ['Glass Color']: '',
        ['Glass Shelf']: '',
        ['Middle Section']: '',
        'LED borders': [],
        'LED alignment': 'Center',
        'LED indent': '',
        ['Note']: '',
    };

    const filteredOptions = options.filter(option => (option !== 'PTO for drawers' || drawer.drawerBrand !== 'Milino'));
    const isAcrylic = doorFinish === 'Ultrapan Acrylic';
    return (
        <Formik initialValues={initialValues}
                validationSchema={getProductSchema(sizeLimit, isAngle, hasMiddleSection)}
                onSubmit={(values: FormikValues, {resetForm}) => {
                    const {
                        ['Width']: width,
                        ['Blind Width']: blindWidth,
                        ['Height']: height,
                        ['Depth']: depth,
                        ['Custom Width']: customWidth,
                        ['Custom Blind Width']: customBlindWidth,
                        ['Custom Height']: customHeight,
                        ['Custom Depth']: customDepth,
                        // ['Doors']: doors,
                        ['Hinge opening']: hinge,
                        Options: chosenOptions,
                        ['Door Profile']: doorProfile,
                        ['Door Glass Type']: doorGlassType,
                        ['Door Glass Color']: doorGlassColor,
                        ['Shelf Profile']: shelfProfile,
                        ['Shelf Glass Type']: shelfGlassType,
                        ['Shelf Glass Color']: shelfGlassColor,
                        ['Middle Section']: middleSection,
                        ['Note']: note,
                        'LED borders': ledBorders,
                        'LED alignment': ledAlignment,
                        'LED indent': ledIndent,
                    } = values;

                    const realWidth = width || customWidth;
                    const img = images[type - 1].value || ''
                    const cartData: CartItemType = {
                        id: id,
                        uuid: uuidv4(),
                        name: name,
                        img: img,
                        width: realWidth,
                        height: height || customHeight,
                        depth: depth || customDepth,
                        hinge,
                        // doors,
                        options: chosenOptions,
                        amount: 1,
                        price: price ? price : 0,
                        note
                    }

                    if (isBlind) {
                        cartData.blindWidth = blindWidth || customBlindWidth;
                    }

                    if (chosenOptions.includes('Glass Door')) {
                        cartData.doorProfile = doorProfile;
                        cartData.doorGlassType = doorGlassType;
                        cartData.doorGlassColor = doorGlassColor;
                    }

                    if (chosenOptions.includes('Glass Shelf')) {
                        cartData.shelfProfile = shelfProfile;
                        cartData.shelfGlassType = shelfGlassType;
                        cartData.shelfGlassColor = shelfGlassColor;
                    }

                    if (hasMiddleSection) {
                        cartData.middleSection = middleSection
                    }

                    if (ledBorders.length) {
                        cartData.led = {
                            border: ledBorders,
                            alignment: ledAlignment
                        }
                        if (ledIndent) cartData.led.indent = ledIndent;
                    }

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

                const realWidth: number = +width || customWidth || 0;
                const realBlindWidth: number = +blindWidth || customBlindWidth || 0;

                const realHeight = +height || customHeight || 0;
                const doorHeight: number = realHeight ? realHeight - legsHeight : 0;
                const realDepth: number = !isAngle ? (+depth || customDepth || 0) : realWidth;

                if (isAngle && realWidth !== depth) setFieldValue('Depth', realWidth);

                const doorArr = doorValues ? getDoorMinMaxValuesArr(realWidth, doorValues) : null;
                const hingeArr = getHingeArr(doorArr || [], category)

                if (doorArr) {
                    if (!doorValues) {
                        setFieldValue('Doors', 0);
                    } else {
                        if (doorArr.length === 1 && doors !== doorArr[0]) {
                            setFieldValue('Doors', doorArr[0])
                        }
                    }
                }

                if (!hingeArr.length && hingeOpening !== 'Double Door') setFieldValue('Hinge opening', "Double Door");
                const doorWidth = getDoorWidth(realWidth, realBlindWidth, isBlind, isAngle)
                const glassDoorColorFiltered = glassColorSettings.filter(el => el.type === doorGlassType);
                const glassShelfColorFiltered = glassColorSettings.filter(el => el.type === shelfGlassType);

                const ledPrice = getLedPrice(realWidth,realHeight,ledBorders);

                const doorSquare = getDoorSquare(doorWidth, doorHeight)
                const newType = getType(realWidth, realHeight, widthDivider, doorValues, shelfValues, doors, category);
                const initialPrice = priceData && getInitialPrice(priceData, widthRange[0], heightRange[0], category);
                if (!initialPrice) return <div>Cannot find initial price</div>
                const boxMaterialCoef = chosenOptions.includes("Box from finish material") ? boxMaterialCoefs.boxMaterialFinishCoef : boxMaterialCoefs.boxMaterialCoef;
                const pvcPrice = getPvcPrice(!isBlind ? realWidth : realWidth - realBlindWidth, doorHeight, isAcrylic, doorType, doorFinish)
                const doorPrice = getDoorPrice(doorSquare, doorPriceMultiplier)
                const drawerPrice = getDrawerPrice(drawersQty + rolloutsQty, drawer, realWidth)
                const extraPrices: extraPricesType = {
                    width: 0,
                    height: 0,
                    depth: 0,
                    ptoDoors: 0,
                    ptoDrawers: 0,
                    ptoTrashBins: 0,
                    glassShelf: 0,
                    glassDoor: 0,
                    pvcPrice: pvcPrice,
                    doorPrice: doorPrice,
                    drawerPrice: drawerPrice,
                    ledPrice:ledPrice,
                    boxMaterialCoef: boxMaterialCoef,
                    premiumCoef: premiumCoef,
                    doorSquare: doorSquare,
                }
                const calculatedData = calculatePrice(realWidth, realHeight, realDepth, chosenOptions, doorProfile, attributes, type, initialPrice, priceData, extraPrices, widthRange, heightRange, depthRange, sizeLimit, drawersQty, category, ledPrice)
                const {addition, totalPrice, coef} = calculatedData;
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
                                    {widthRange.map((w, index) => <ProductRadioInputCustom key={index}
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
                                {heightRange.map((w, index) => <ProductRadioInputCustom key={index}
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
                                        {depthRange.map((w, index) => <ProductRadioInputCustom key={index}
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


                        {category === 'Wall Cabinets' ?
                        <LedBlock borders={ledBorders} alignment={ledAlignment} indent={ledIndent}    />
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
                        <h2>Test:</h2>
                        <h3>Extra prices</h3>
                        {
                            Object.entries(addition).map((el, index) => <div key={index}>{el[0]}: {el[1]}</div>)

                        }
                        <h3>Additional coefs for custom sizes</h3>
                        {
                            Object.entries(coef).map((el, index) => <div key={index}>{el[0]}: {el[1]}</div>)

                        }
                    </Form>
                )
            }}
        </Formik>
    );
};

export default CabinetForm;