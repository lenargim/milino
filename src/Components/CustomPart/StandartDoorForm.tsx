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
import SelectField, {optionType, optionTypeDoor} from "../../common/SelectField";
import SelectFieldInArr from "../../common/SelectFieldInArr";
import {standartDoorSchema} from "./standartDoorSchema";
import {addToCart} from "../../store/reducers/generalSlice";
import settings from './../../api/settings.json'


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

    const doorColors = settings.doorColors as string[]
    const doorColorsArr = doorColors.map(el => ({value: el, label: el}))

    const doorSizes = type === 'standart-door' ? settings.standartDoorSizes : settings.glassDoorSizes as DoorSizesArrType[];
    const doorSizesArr:optionTypeDoor[] = doorSizes.map(el => ({...el, label: el.value}))

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

                return (
                    <Form className={s.accessories}>
                        <div className={s.block}>
                            <h3>Door Type</h3>
                            <FieldArray name="Doors" render={({push, remove}) => (
                                <div>
                                    {doorsArr.map((door, index) =>
                                        <DoorItem door={door} index={index} key={index} remove={remove} doorSizesArr={doorSizesArr}/>)}
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
                            <SelectField options={doorColorsArr} name="Color"
                                         val={getSelectValfromVal(color, doorColorsArr)}/>
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
        return acc + (+(doorPrice * door.qty).toFixed(1))
    }, 0);
}

const DoorItem: FC<{ door: Door, index: number, remove: Function, doorSizesArr:optionTypeDoor[] }> = ({door, index, remove, doorSizesArr}) => {
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

export type DoorSizesArrType = {
    width: number,
    height: number,
    value: string
}
