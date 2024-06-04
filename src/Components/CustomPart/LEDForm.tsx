import {Form, Formik} from 'formik';
import React, {FC} from 'react';
import {addToCartLed, useAppDispatch} from "../../helpers/helpers";
import s from "../Product/product.module.sass";
import {TextInput} from "../../common/Form";
import {v4 as uuidv4} from "uuid";
import AlumProfile, {alProfileType} from "./AlumProfile";
import GolaProfile, {golaProfileType} from "./GolaProfile";
import NumberPart from "./NumberPart";
import {addToCart, setCustomPart} from "../../store/reducers/generalSlice";
import {customPartDataType} from "../../helpers/productTypes";


export type LEDAccessoriesType = {
    ['Aluminum Profiles']: alProfileType[],
    ['Gola Profiles']: golaProfileType[],
    ['Door Sensor']: number,
    ['Dimmable Remote']: number,
    ['Transformer']: number,
}

export interface LEDFormValuesType extends LEDAccessoriesType{
    price: number,
    Note: string,
}

const LEDForm: FC<{ customPart: customPartDataType }> = ({customPart}) => {
    const {id, image, name, category} = customPart
    const dispatch = useAppDispatch();
    const initialValues: LEDFormValuesType = {
        ['Aluminum Profiles']: [],
        ['Gola Profiles']: [],
        ['Door Sensor']: 0,
        ['Dimmable Remote']: 0,
        ['Transformer']: 0,
        price: 0,
        Note: '',
    }

    return (
        <Formik
            initialValues={initialValues}
            onSubmit={(values: LEDFormValuesType, {resetForm}) => {
                if (values.price) {
                    const cartData = addToCartLed(values, id, image, name, category)
                    dispatch(addToCart(cartData))
                    resetForm();
                }
            }}
        >
            {({values, errors, setFieldValue}) => {
                const {
                    ['Aluminum Profiles']: alumProfiles,
                    ['Gola Profiles']: golaProfiles,
                    ['Door Sensor']: doorSensor,
                    ['Dimmable Remote']: dimRemote,
                    ['Transformer']: transformer,
                    price
                } = values;

                const addProfile = (field: string) => {
                    switch (field) {
                        case 'Aluminum Profiles':
                            setFieldValue('Aluminum Profiles', [...alumProfiles, {
                                uuid: uuidv4(),
                                length: '',
                                qty: 1
                            }])
                            break;
                        case 'Gola Profile':
                            setFieldValue('Gola Profiles', [...golaProfiles, {
                                uuid: uuidv4(),
                                length: '',
                                color: 'Black',
                                qty: 1
                            }])
                            break;

                    }
                }
                const priceNew = getPrice(values);

                if (price !== priceNew) setFieldValue('price', priceNew);

                return (
                    <Form className={s.accessories}>
                        <div className={s.block}>
                            <h3>Aluminum Profile</h3>
                            {alumProfiles.length
                                ? alumProfiles.map((profile, index) => <AlumProfile
                                    profile={profile}
                                    index={index}
                                    key={profile.uuid}
                                />)
                                : null}
                            <button type="button" className={['button yellow small'].join(' ')}
                                    onClick={() => addProfile('Aluminum Profiles')}>+
                                Aluminum Profile
                            </button>
                        </div>
                        <div className={s.block}>
                            <h3>Gola Profile</h3>
                            {golaProfiles.length
                                ? golaProfiles.map((profile, index) => <GolaProfile
                                    profile={profile}
                                    index={index}
                                    key={profile.uuid}
                                />)
                                : null}
                            <button type="button" className={['button yellow small'].join(' ')}
                                    onClick={() => addProfile('Gola Profile')}>+
                                Gola Profile
                            </button>
                        </div>

                        <NumberPart name={'Door Sensor'} qty={doorSensor}/>
                        <NumberPart name={'Dimmable Remote'} qty={dimRemote}/>
                        <NumberPart name={'Transformer'} qty={transformer}/>

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

export default LEDForm;


const getPrice = (values: LEDFormValuesType): number => {
    const {
        'Aluminum Profiles': alumProf,
        "Gola Profiles": golaProf,
        'Dimmable Remote': dimRemote,
        "Door Sensor": doorSensor,
        "Transformer": transformer
    } = values;
    const alumProfPrice = alumProf.reduce((acc, profile) => acc + (profile.length * 2.55 * profile.qty), 0);
    const golaProfPrice = golaProf.reduce((acc, profile) => acc + (profile.length * 5.5 * profile.qty), 0);
    const dimRemotePrice = dimRemote * 100;
    const doorSensorPrice = doorSensor * 150;
    const transformerPrice = transformer * 50;

    return +(alumProfPrice + golaProfPrice + dimRemotePrice + doorSensorPrice + transformerPrice).toFixed(2)
}