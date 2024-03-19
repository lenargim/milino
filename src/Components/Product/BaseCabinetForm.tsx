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
    calculatePrice, getDoorMinMaxValuesArr, getDoorPrice,
    getDoorSquare, getDrawerPrice, getHeightRange,
    getInitialPrice, getPriceData, getPvcPrice,
    getType, getWidthRange
} from "../../helpers/calculatePrice";
import {drawerType, getBoxMaterialCoefsType} from "./ProductMain";

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
    [key: string]:number,
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
    doorSquare: number,
    premiumCoef: number,
    boxMaterialCoef: number
}




const BaseCabinetForm: FC<BaseCabinetFormType> = ({
                                                      product,
                                                      basePriceType,
                                                      premiumCoef,
                                                      boxMaterialCoefs,
                                                      drawer,
                                                      doorPriceMultiplier, doorType, doorFinish
                                                  }) => {
    const dispatch = useAppDispatch();
    const {id, name, images, type, attributes, options, price, widthDivider, depth, category} = product;
    const priceData = getPriceData(id, basePriceType);
    const widthRange = getWidthRange(priceData);
    const heightRange = getHeightRange(priceData, category);
    const sizeLimit: sizeLimitsType | undefined = sizes.find(size => size.productIds.includes(product.id))?.limits;
    const depthRange: DepthRangeType = settings.depthRange;
    const depthRangeData = [depthRange[category], 0];
    const initialWidth = widthRange && widthRange[0]
    const attrArr = getAttributes(attributes, type);
    const doorValues = attributes.find(el => el.name === 'Door')?.values;
    const isShelfTypings = category === 'Wall Cabinets' || category === 'Tall Cabinets'
    const shelfValues = isShelfTypings ? attributes.find(el => el.name === 'Adjustable Shelf')?.values : undefined;
    const drawersQty = attrArr.reduce((acc, current) => {
        const qty = current.name.includes('Drawer') ? current.value : 0
        return acc + qty;
    },0);
    if (!initialWidth) return <div>Cannot find initial width</div>;
    if (!sizeLimit) return <div>Cannot find size limit</div>;
    const initialDoorsQty: number = doorValues && doorValues[0]?.value || 0
    const initialValues = {
        ['Width']: initialWidth,
        ['Height']: heightRange[0],
        ['Depth']: depth,
        ['Custom Width']: '',
        ['Custom Height']: '',
        ['Custom Depth']: '',
        ['Doors']: initialDoorsQty,
        ['Hinge opening']: settings["Hinge opening"][0],
        ['Options']: [],
        ['Profile']: '',
        ['Glass Type']: '',
        ['Glass Color']: '',
        ['Glass Shelf']: '',
        ['Note']: '',
    };
    const filteredOptions = options.filter(option => (option !== 'PTO for drawers' || drawer.drawerBrand !== 'Milino'));
    const isAcrylic = doorFinish === 'Ultrapan Acrylic';
    return (
        <Formik initialValues={initialValues}
                validationSchema={getProductSchema(sizeLimit)}
                onSubmit={(values: FormikValues, {resetForm}) => {
                    const {
                        ['Width']: width,
                        ['Height']: height,
                        ['Depth']: depth,
                        ['Custom Width']: customWidth,
                        ['Custom Height']: customHeight,
                        ['Custom Depth']: customDepth,
                        ['Doors']: doors,
                        ['Hinge opening']: hinge,
                        Options: chosenOptions,
                        Profile: profileVal,
                        ['Glass Type']: glassTypeVal,
                        ['Glass Color']: glassColorVal,
                        ['Glass Shelf']: glassShelfVal,
                        ['Note']: note,
                    } = values;

                    const realWidth = width || customWidth

                    const img = images[type - 1].value || ''
                    const cartData: CartItemType = {
                        id: id,
                        uuid: uuidv4(),
                        name: name,
                        img: img,
                        width: realWidth,
                        height: height || customHeight,
                        depth: depth || customDepth,
                        hinge: doors === 1 ? hinge : '',
                        doors,
                        options: chosenOptions,
                        amount: 1,
                        price: price ? price : 0,
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
            {({values, setFieldValue}) => {
                const {
                    ['Width']: width,
                    ['Height']: height,
                    ['Depth']: depth,
                    ['Custom Width']: customWidth,
                    ['Custom Height']: customHeight,
                    ['Custom Depth']: customDepth,
                    ['Doors']: doors,
                    Options: chosenOptions,
                    Profile: profileVal,
                    ['Glass Type']: glassTypeVal,
                    ['Glass Color']: glassColorVal,
                    ['Glass Shelf']: glassShelfVal,
                } = values

                const {
                    ['Glass Door']: glassDoor,
                } = settings;
                const {
                    ['Profile']: profile,
                    ['Glass Type']: glassType,
                    ['Glass Color']: glassColor,
                } = glassDoor;

                const realWidth: number = +width || customWidth || 0;
                const hasCabinetLegs = category === 'Base Cabinets' || category === 'Tall Cabinets';
                const realHeight = +height || customHeight || 0;
                const doorHeight: number = realHeight ? hasCabinetLegs ? realHeight - 4.5 : realHeight  : 0;
                const realDepth: number = +depth || customDepth || 0;
                const doorArr = doorValues ? getDoorMinMaxValuesArr(realWidth, doorValues) : null;

                console.log(doorArr)
                // const shelfArr = shelfValues ? getDoorMinMaxValuesArr(realWidth, shelfValues) : null;

                // ?????
                if (doorArr) {
                    if (!doorValues) {
                        setFieldValue('Doors', 0);
                    } else {
                        if (doorArr.length === 1 && doors !== doorArr[0]) {
                            // if (width <= 24 && doors === 2) setFieldValue('Doors', 1)
                            // if (width > 24 && doors === 1) setFieldValue('Doors', 2)
                            setFieldValue('Doors', doorArr[0])
                        }
                    }
                }

                const glassColorFiltered = glassColor.filter(el => el.type === glassTypeVal);
                const doorSquare = getDoorSquare(realWidth, doorHeight)
                const newType = getType(realWidth, realHeight, widthDivider, doorValues, shelfValues, doors, category);
                const initialPrice = priceData && getInitialPrice(priceData, widthRange[0], heightRange[0], category);
                if (!initialPrice) return <div>Cannot find initial price</div>
                const boxMaterialCoef = chosenOptions.includes("Box from finish material") ? boxMaterialCoefs.boxMaterialFinishCoef : boxMaterialCoefs.boxMaterialCoef;
                const pvcPrice = getPvcPrice(realWidth, doorHeight, isAcrylic, doorType, doorFinish)
                const doorPrice = getDoorPrice(realWidth, doorHeight, doorPriceMultiplier)
                const drawerPrice = getDrawerPrice(drawersQty, drawer, realWidth)
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
                    boxMaterialCoef: boxMaterialCoef,
                    premiumCoef: premiumCoef,
                    doorSquare: doorSquare
                }
                const calculatedData = calculatePrice(realWidth, realHeight, realDepth,  chosenOptions, profileVal, attributes, type, initialPrice, priceData, extraPrices, widthRange, heightRange, depthRangeData, sizeLimit, drawersQty, category, depthRangeData[0])
                const {addition, totalPrice, coef} = calculatedData;
                // const additionOptions = addition.glassShelf + addition.glassDoor + addition.ptoDoors + addition.ptoDrawers + addition.ptoTrashBins;
                addition.doorSquare = +(addition.doorSquare / 144).toFixed(2)

                setTimeout(() => {
                    if (price !== totalPrice || type !== newType) dispatch(updateProduct({
                        type: newType,
                        price: totalPrice
                    }));
                }, 0)

                return (
                    <Form>
                        <div className={s.block}>
                            <h3>Width {addition.width ? `+${addition.width}$` : null}</h3>
                            <div className={s.options}>
                                {widthRange.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                           name={'Width'}
                                                                                           value={w}/>)}
                                {!width && <ProductInputCustom value={null} name={'Custom Width'}/>}
                            </div>
                        </div>
                        {doorArr && doorArr.length > 1 &&
                          <div className={s.block}>
                            <h3>Doors</h3>
                            <div className={s.options}>
                                {doorArr.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                    nullable={true}
                                                                                    name={'Doors'}
                                                                                    value={w}/>)}
                            </div>
                          </div>
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
                        <div className={s.block}>
                            <h3>Depth {addition.depth ? `+${addition.depth}$` : null}</h3>
                            <div className={s.options}>
                                {depthRangeData.map((w, index) => <ProductRadioInputCustom key={index}
                                                                                                  name={'Depth'}
                                                                                                  value={w}/>)}
                                {!depth && <ProductInputCustom value={null} name={'Custom Depth'}/>}
                            </div>
                        </div>
                        {doors === 1 ?
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
                                <h3>Options</h3>
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

export default BaseCabinetForm;