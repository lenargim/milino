import {Form, Formik} from 'formik';
import React, {FC} from 'react';
import {addToCartDoorAccessories, useAppDispatch} from "../../helpers/helpers";
import s from "../Product/product.module.sass";
import {TextInput} from "../../common/Form";
import {customPartDataType} from "../../helpers/productTypes";
import NumberPartCustom from "./NumberPartCustom";
import NumberPartArrayItem from "./NumberPartArrayItem";
import {doorAccessoiresSchema} from "./doorAccessoiresSchema";
import {addToCart} from "../../store/reducers/generalSlice";


export type HingeType = {
    title: string,
    label: string,
    qty: number,
    price: number
}

export type hingeHoleCustomType = {
    title: string,
    qty: number,
    price: 6
}

export type DoorAccessoiresType = {
    aventos: HingeType[],
    hingeAngles: HingeType[],
    hingeHoles: HingeType[],
    hingeHoleCustom: hingeHoleCustomType,
    PTO: HingeType[],
    servo: HingeType[]

}

export interface DoorAccessoiresValuesType extends DoorAccessoiresType {
    price: number,
    Note: string,
}

const DoorAccessoiresForm: FC<{ customPart: customPartDataType }> = ({customPart}) => {
    const dispatch = useAppDispatch();
    const {id, image, name, category} = customPart
    const initialValues: DoorAccessoiresValuesType = {
        aventos: [
            {
                title: 'HF',
                label: 'Aventos HF',
                qty: 0,
                price: 280
            },
            {
                title: 'HK',
                label: 'Aventos HK',
                qty: 0,
                price: 210
            },
            {
                title: 'HL',
                label: 'Aventos HL',
                qty: 0,
                price: 350
            }
        ],
        hingeAngles: [
            {
                title: '0',
                label: 'Regular',
                qty: 0,
                price: 10
            },
            {
                title: '180',
                label: 'Blind corner 180°',
                qty: 0,
                price: 10
            },
            {
                title: '90',
                label: 'Corner 90°',
                qty: 0,
                price: 10
            },
            {
                title: '45',
                label: 'Corner 45°',
                qty: 0,
                price: 10
            },
            {
                title: '-45',
                label: 'Corner -45°',
                qty: 0,
                price: 10
            },

        ],
        hingeHoles: [
            {
                title: '3',
                label: '3"x3"',
                qty: 0,
                price: 6
            },
            {
                title: '4',
                label: '4"x4"',
                qty: 0,
                price: 6
            },
            {
                title: '6',
                label: '6"x6"',
                qty: 0,
                price: 6
            }
        ],
        hingeHoleCustom: {
            title: '',
            qty: 0,
            price: 6
        },
        PTO: [
            {
                title: 'Doors',
                label: 'For Doors',
                qty: 0,
                price: 30
            },
            {
                title: 'Drawers',
                label: 'For Drawers',
                qty: 0,
                price: 80
            },
            {
                title: 'Trash Bins',
                label: 'For Trash Bins',
                qty: 0,
                price: 350
            }
        ],
        servo: [
            {
                title: 'WBA',
                label: 'For WBA Cab',
                qty: 0,
                price: 1000
            },
            {
                title: 'WBL',
                label: 'For WBL Cab',
                qty: 0,
                price: 1000
            },
            {
                title: 'WDA',
                label: 'For WDA Cab',
                qty: 0,
                price: 1000
            },
            {
                title: 'BG',
                label: 'For BG Cab',
                qty: 0,
                price: 1000
            }
        ],
        price: 0,
        Note: '',
    }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={doorAccessoiresSchema}
            onSubmit={(values: DoorAccessoiresValuesType, {resetForm}) => {
                if (values.price) {
                    const cartData = addToCartDoorAccessories(values, id, image, name, category)
                    dispatch(addToCart(cartData))
                    resetForm();
                }
            }}
        >
            {({values, errors, setFieldValue}) => {
                const {
                    aventos: aventos,
                    hingeAngles,
                    hingeHoles,
                    PTO: pto,
                    servo,
                    price
                } = values;


                const priceNew = addToCartAccessories(values);
                if (price !== priceNew) setFieldValue('price', priceNew);

                return (
                    <Form className={s.accessories}>
                        <div className={s.block}>
                            <h3>Aventos</h3>
                            {aventos.map((el, index) => <NumberPartArrayItem key={index} name="aventos"
                                                                             index={index}/>)}
                        </div>
                        <div className={s.block}>
                            <h3>Door Hinge</h3>
                            {hingeAngles.map((el, index) => <NumberPartArrayItem key={index} name="hingeAngles"
                                                                                 index={index}/>)}
                        </div>
                        <div className={s.block}>
                            <h3>Hinge Holes</h3>
                            {hingeHoles.map((el, index) => <NumberPartArrayItem key={index} name="hingeHoles"
                                                                                index={index}/>)}
                            {<NumberPartCustom name="hingeHoleCustom"/>}
                        </div>

                        <div className={s.block}>
                            <h3>Push To Open</h3>
                            {pto.map((el, index) => <NumberPartArrayItem key={index} name="PTO"
                                                                         index={index}/>)}
                        </div>

                        <div className={s.block}>
                            <h3>Servo System</h3>
                            {servo.map((el, index) => <NumberPartArrayItem key={index} name="servo"
                                                                                 index={index}/>)}
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

export default DoorAccessoiresForm;


const addToCartAccessories = (values: DoorAccessoiresValuesType): number => {
    const {aventos, hingeAngles, hingeHoles, hingeHoleCustom, PTO, servo} = values
    const aventosPrice = aventos.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const hingeAnglesPrice = hingeAngles.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const hingeHolesPrice = hingeHoles.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const hingeHoleCustomPrice = hingeHoleCustom.price * hingeHoleCustom.qty;
    const PTOPrice = PTO.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const servoPrice = servo.reduce((acc, item) => acc + (item.price * item.qty), 0);
    return +(aventosPrice+hingeAnglesPrice+hingeHolesPrice+hingeHoleCustomPrice+PTOPrice+servoPrice).toFixed(2)
}