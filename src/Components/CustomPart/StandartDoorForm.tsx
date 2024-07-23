import {FieldArray, Form, Formik, useField} from 'formik';
import React, {FC} from 'react';
import {
    addToCartDoor,
    getSelectDoorVal,
    getSelectValfromVal,
    useAppDispatch
} from "../../helpers/helpers";
import s from "../Product/product.module.sass";
import {TextInput} from "../../common/Form";
import {v4 as uuidv4} from "uuid";
import {customPartDataType} from "../../helpers/productTypes";
import {changeAmountType} from "../Product/Cart";
import SelectField, {optionType} from "../../common/SelectField";
import SelectFieldInArr from "../../common/SelectFieldInArr";
import {standartDoorSchema} from "./standartDoorSchema";
import {addToCart} from "../../store/reducers/generalSlice";


type Door = {
    name: string,
    qty: number,
    width: number,
    height: number
}

export type DoorType = {
    ['Doors']: Door[]
    ['Color']: string,
}

export interface StandartDoorFormValuesType extends DoorType {
    price: number,
    Note: string,
}

const StandartDoorForm: FC<{ customPart: customPartDataType }> = ({customPart}) => {
    const {id, image, name, category, type} = customPart
    const dispatch = useAppDispatch();
    const initialValues: StandartDoorFormValuesType = {
        ['Color']: '',
        ['Doors']: [{
            name: '',
            qty: 1,
            width: 0,
            height: 0
        }],
        price: 0,
        Note: '',
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={standartDoorSchema}
            onSubmit={(values: StandartDoorFormValuesType, {resetForm}) => {
                if (values.price) {
                    const cartData = addToCartDoor(values, id, image, name, category)
                    dispatch(addToCart(cartData))
                    resetForm({
                        values: {
                            ['Color']: '',
                            ['Doors']: [{
                                name: '',
                                qty: 1,
                                width: 0,
                                height: 0
                            }],
                            price: 0,
                            Note: '',
                        }
                    });
                }
            }}
        >
            {({values, errors, setFieldValue}) => {
                const {
                    ['Color']: color,
                    ['Doors']: doorsArr,
                    price
                } = values;

                const priceNew = getPrice(values, type);
                if (price !== priceNew) setFieldValue('price', priceNew);

                console.log(initialValues)

                return (
                    <Form className={s.accessories}>
                        <div className={s.block}>
                            <h3>Door Type</h3>
                            <FieldArray name="Doors" render={({push, remove}) => (
                                <div>
                                    {doorsArr.map((door, index) =>
                                        <DoorItem door={door} index={index} key={index} remove={remove}/>)}
                                    {typeof errors['Doors'] === 'string' &&
                                      <div className="error">{errors['Doors']}</div>}
                                    <button
                                        type="button"
                                        onClick={() => push({uuid: uuidv4(), name: '', qty: 1, width: 0, height: 0})}
                                        className={['button yellow small'].join(' ')}>Add Door

                                    </button>
                                </div>
                            )}
                            />
                        </div>
                        <div className={s.block}>
                            <h3>Color</h3>
                            <SelectField options={doorColorArr} name="Color"
                                         val={getSelectValfromVal(color, doorColorArr)}/>
                        </div>


                        <div className={s.block}>
                            <TextInput type={"text"} label={'Note'} name="Note"/>
                        </div>
                        <div className={s.total}>
                            <span>Total: </span>
                            <span>{priceNew}$</span>
                        </div>
                        <button type="submit" className={['button yellow'].join(' ')}>Add to cart</button>
                    </Form>
                )
            }}
        </Formik>
    );
};

export default StandartDoorForm;

const getPrice = (values: StandartDoorFormValuesType, name: string): number => {
    const {Doors: doorsArr, Color: color} = values;
    const glassPrice: number = name !== 'standart-door' ? 10 : 0;
    const colorPrice: number = color !== 'White' ? 30 : 0;
    return doorsArr.reduce((acc, door) => {
        const sqr = door.width * door.height / 144;
        const doorPrice = sqr * (20 + glassPrice + colorPrice);
        return acc + (+(doorPrice * door.qty).toFixed(2))
    }, 0);
}

const DoorItem: FC<{ door: Door, index: number, remove: Function }> = ({door, index, remove}) => {
    const [{value}, _, {setValue}] = useField<Door[]>('Doors')
    const {qty, name} = door;

    const selectVal = getSelectDoorVal(name, doorSizesArr);

    const changeAmount = (type: changeAmountType) => {
        const door = value[index];
        door.qty = type === 'minus' ? door.qty - 1 : door.qty + 1;
        value.splice(index, 1, door)
        setValue(value)
    }
    return (
        <div className={s.row}>
            <button onClick={() => remove(index)} className={s.close} type={"button"}>×</button>
            <SelectFieldInArr options={doorSizesArr} name={`Doors`} val={selectVal} arrIndex={index}
                              placeholder={'Door size'}/>
            <div className={s.row}>×
                <div className={s.buttons}>
                    <button value="minus" disabled={qty <= 1} onClick={() => changeAmount('minus')}
                            type={"button"}>-
                    </button>
                    {qty}
                    <button value="plus" onClick={() => changeAmount('plus')} type={"button"}>+</button>
                </div>
            </div>
        </div>

    )
}

export type doorsizesArr = {
    width: number,
    height: number,
    value: string,
    label: string
}


const doorSizesArr: doorsizesArr[] = [
    {width: 6, height: 9, label: "6x9", value: "6x9"},
    {width: 6, height: 12, label: "6x12", value: "6x12"},
    {width: 6, height: 15, label: "6x15", value: "6x15"},
    {width: 6, height: 18, label: "6x18", value: "6x18"},
    {width: 6, height: 21, label: "6x21", value: "6x21"},
    {width: 6, height: 24, label: "6x24", value: "6x24"},
    {width: 6, height: 27, label: "6x27", value: "6x27"},
    {width: 6, height: 30, label: "6x30", value: "6x30"},
    {width: 6, height: 33, label: "6x33", value: "6x33"},
    {width: 6, height: 36, label: "6x36", value: "6x36"},
    {width: 12, height: 12, label: "12x12", value: "12x12"},
    {width: 12, height: 15, label: "12x15", value: "12x15"},
    {width: 12, height: 16.5, label: "12x16 1/2", value: "12x16 1/2"},
    {width: 12, height: 18, label: "12x18", value: "12x18"},
    {width: 12, height: 21, label: "12x21", value: "12x21"},
    {width: 12, height: 27, label: "12x27", value: "12x27"},
    {width: 12, height: 30, label: "12x30", value: "12x30"},
    {width: 12, height: 33, label: "12x33", value: "12x33"},
    {width: 15, height: 15, label: "15x15", value: "15x15"},
    {width: 15, height: 16.5, label: "15x16 1/2", value: "15x16 1/2"},
    {width: 15, height: 18, label: "15x18", value: "15x18"},
    {width: 15, height: 21, label: "15x21", value: "15x21"},
    {width: 15, height: 27, label: "15x27", value: "15x27"},
    {width: 15, height: 30, label: "15x30", value: "15x30"},
    {width: 15, height: 33, label: "15x33", value: "15x33"},
    {width: 15, height: 36, label: "15x36", value: "15x36"},
    {width: 15, height: 42, label: "15x42", value: "15x42"},
    {width: 18, height: 16.5, label: "18x16 1/2", value: "18x16 1/2"},
    {width: 18, height: 18, label: "18x18", value: "18x18"},
    {width: 24, height: 12, label: "24x12", value: "24x12"},
    {width: 24, height: 13.5, label: "24x13 1/2", value: "24x13 1/2"},
    {width: 24, height: 15, label: "24x15", value: "24x15"},
    {width: 24, height: 16.5, label: "24x16 1/2", value: "24x16 1/2"},
    {width: 24, height: 18, label: "24x18", value: "24x18"},
    {width: 24, height: 21, label: "24x21", value: "24x21"},
    {width: 24, height: 24, label: "24x24", value: "24x24"},
    {width: 30, height: 6, label: "30x6", value: "30x6"},
    {width: 30, height: 8.125, label: "30x8 1/8", value: "30x8 1/8"},
    {width: 30, height: 9, label: "30x9", value: "30x9"},
    {width: 30, height: 10.125, label: "30x10 1/8", value: "30x10 1/8"},
    {width: 30, height: 11.125, label: "30x11 1/8", value: "30x11 1/8"},
    {width: 30, height: 11.75, label: "30x11 3/4", value: "30x11 3/4"},
    {width: 30, height: 12, label: "30x12", value: "30x12"},
    {width: 30, height: 13.5, label: "30x13 1/2", value: "30x13 1/2"},
    {width: 30, height: 14.5625, label: "30x14   9/16", value: "30x14   9/16"},
    {width: 30, height: 15, label: "30x15", value: "30x15"},
    {width: 30, height: 15.9375, label: "30x15  15/16", value: "30x15  15/16"},
    {width: 30, height: 16.5, label: "30x16 1/2", value: "30x16 1/2"},
    {width: 30, height: 18, label: "30x18", value: "30x18"},
    {width: 30, height: 18.5, label: "30x18 1/2", value: "30x18 1/2"},
    {width: 30, height: 19.5, label: "30x19 1/2", value: "30x19 1/2"},
    {width: 30, height: 21, label: "30x21", value: "30x21"},
    {width: 30, height: 24, label: "30x24", value: "30x24"},
    {width: 36, height: 6, label: "36x6", value: "36x6"},
    {width: 36, height: 9, label: "36x9", value: "36x9"},
    {width: 36, height: 10.125, label: "36x10 1/8", value: "36x10 1/8"},
    {width: 36, height: 12, label: "36x12", value: "36x12"},
    {width: 36, height: 13.5, label: "36x13 1/2", value: "36x13 1/2"},
    {width: 36, height: 14.5625, label: "36x14   9/16", value: "36x14   9/16"},
    {width: 36, height: 15, label: "36x15", value: "36x15"},
    {width: 36, height: 16.5, label: "36x16 1/2", value: "36x16 1/2"},
    {width: 36, height: 18, label: "36x18", value: "36x18"},
    {width: 36, height: 18.5, label: "36x18 1/2", value: "36x18 1/2"},
    {width: 36, height: 19.5, label: "36x19 1/2", value: "36x19 1/2"},
    {width: 36, height: 21, label: "36x21", value: "36x21"},
    {width: 42, height: 9, label: "42x9", value: "42x9"},
    {width: 42, height: 10.125, label: "42x10 1/8", value: "42x10 1/8"},
    {width: 42, height: 12, label: "42x12", value: "42x12"},
    {width: 42, height: 13.5, label: "42x13 1/2", value: "42x13 1/2"},
    {width: 42, height: 14.5625, label: "42x14  9/16", value: "42x14  9/16"},
    {width: 42, height: 15, label: "42x15", value: "42x15"},
    {width: 42, height: 16.5, label: "42x16 1/2", value: "42x16 1/2"},
    {width: 42, height: 18, label: "42x18", value: "42x18"},
    {width: 42, height: 18.5, label: "42x18 1/2", value: "42x18 1/2"},
    {width: 42, height: 19.5, label: "42x19 1/2", value: "42x19 1/2"},
    {width: 42, height: 21, label: "42x21", value: "42x21"},
    {width: 49.5, height: 12, label: "49 1/2x12", value: "49 1/2x12"},
    {width: 49.5, height: 15, label: "49 1/2x15", value: "49 1/2x15"},
    {width: 49.5, height: 18, label: "49 1/2x18", value: "49 1/2x18"},
]
const doorColorArr: optionType[] = [
    {"value": "White", "label": "White"},
    {"value": "Aqua Marina", "label": "Aqua Marina"},
    {"value": "Azul Indigo", "label": "Azul Indigo"},
    {"value": "Verde Salvia", "label": "Verde Salvia"},
    {"value": "Gris Plomo", "label": "Gris Plomo"},
    {"value": "Antracita", "label": "Antracita"},
    {"value": "SW 0055 Light French Gray", "label": "SW 0055 Light French Gray"},
    {"value": "SW 6204 Sea Salt", "label": "SW 6204 Sea Salt"},
    {"value": "SW 6211 Rainwashed", "label": "SW 6211 Rainwashed"},
    {"value": "SW 6241 Aleutian", "label": "SW 6241 Aleutian"},
    {"value": "SW 6244 Naval", "label": "SW 6244 Naval"},
    {"value": "SW 6250 Granite Peak", "label": "SW 6250 Granite Peak"},
    {"value": "SW 6253 Olympus White", "label": "SW 6253 Olympus White"},
    {"value": "SW 6254 Lazy Gray", "label": "SW 6254 Lazy Gray"},
    {"value": "SW 6258 Tricorn Black", "label": "SW 6258 Tricorn Black"},
    {"value": "SW 6385 Dover White", "label": "SW 6385 Dover White"},
    {"value": "SW 7004 Snowbound", "label": "SW 7004 Snowbound"},
    {"value": "SW 7005 Pure White", "label": "SW 7005 Pure White"},
    {"value": "SW 7006 Extra White", "label": "SW 7006 Extra White"},
    {"value": "SW 7007 Ceiling Bright White", "label": "SW 7007 Ceiling Bright White"},
    {"value": "SW 7008 Alabaster", "label": "SW 7008 Alabaster"},
    {"value": "SW 7009 Pearly White", "label": "SW 7009 Pearly White"},
    {"value": "SW 7012 Creamy", "label": "SW 7012 Creamy"},
    {"value": "SW 7014 Eider White", "label": "SW 7014 Eider White"},
    {"value": "SW 7015 Repose Gray", "label": "SW 7015 Repose Gray"},
    {"value": "SW 7016 Mindful Gray", "label": "SW 7016 Mindful Gray"},
    {"value": "SW 7019 Gauntlet Gray", "label": "SW 7019 Gauntlet Gray"},
    {"value": "SW 7029 Agreeable Gray", "label": "SW 7029 Agreeable Gray"},
    {"value": "SW 7035 Aesthetic White", "label": "SW 7035 Aesthetic White"},
    {"value": "SW 7036 Accessible Beige", "label": "SW 7036 Accessible Beige"},
    {"value": "SW 7042 Shoji White", "label": "SW 7042 Shoji White"},
    {"value": "SW 7043 Worldly Gray", "label": "SW 7043 Worldly Gray"},
    {"value": "SW 7048 Urbane Bronze", "label": "SW 7048 Urbane Bronze"},
    {"value": "SW 7064 Passive", "label": "SW 7064 Passive"},
    {"value": "SW 7069 Iron Ore", "label": "SW 7069 Iron Ore"},
    {"value": "SW 7071 Gray Screen", "label": "SW 7071 Gray Screen"},
    {"value": "SW 7551 Greek Villa", "label": "SW 7551 Greek Villa"},
    {"value": "SW 7566 Westhighland White", "label": "SW 7566 Westhighland White"},
    {"value": "SW 7602 Indigo Batik", "label": "SW 7602 Indigo Batik"},
    {"value": "SW 7631 City Loft", "label": "SW 7631 City Loft"},
    {"value": "SW 7632 Modern Gray", "label": "SW 7632 Modern Gray"},
    {"value": "SW 7636 Origami White", "label": "SW 7636 Origami White"},
    {"value": "SW 7646 First Star", "label": "SW 7646 First Star"},
    {"value": "SW 7647 Crushed Ice", "label": "SW 7647 Crushed Ice"},
    {"value": "SW 7661 Reflection", "label": "SW 7661 Reflection"},
    {"value": "SW 7669 Summit Gray", "label": "SW 7669 Summit Gray"},
    {"value": "SW 7674 Peppercorn", "label": "SW 7674 Peppercorn"},
    {"value": "SW 7730 Forestwood", "label": "SW 7730 Forestwood"},
    {"value": "SW 7757 High Reflective White", "label": "SW 7757 High Reflective White"},
    {"value": "SW 9104 Woven Wicker", "label": "SW 9104 Woven Wicker"},
    {"value": "SW 9109 Natural Linen", "label": "SW 9109 Natural Linen"},
    {"value": "SW 9130 Evergreen Fog", "label": "SW 9130 Evergreen Fog"},
    {"value": "SW 9132 Acacia Haze", "label": "SW 9132 Acacia Haze"},
    {"value": "SW 9144 Moonmist", "label": "SW 9144 Moonmist"},
    {"value": "SW 9165 Gossamer Veil", "label": "SW 9165 Gossamer Veil"},
    {"value": "SW 9166 Drift of Mist", "label": "SW 9166 Drift of Mist"},
    {"value": "Other", "label": "Other"},
]