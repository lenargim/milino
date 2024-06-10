import React, {FC} from 'react';
import {LEDAccessoriesType} from "../CustomPart/LEDForm";
import s from "../OrderForm/Sidebar/sidebar.module.sass";

const CartItemLedExtra:FC<{productExtra: LEDAccessoriesType}> = ({productExtra}) => {
    const {
        ['LED Aluminum Profiles']: alumProfiles,
        ['LED Gola Profiles']: golaProfiles,
        ['Door Sensor']: doorSensor,
        ['Dimmable Remote']: dimRemote,
        ['Transformer']: transformer,
    } = productExtra
    return (
        <>
            {alumProfiles.length ?
                <div className={s.itemOption}>
                    <span>LED Aluminum Profiles:</span>
                    <span>{alumProfiles.map(profile =>
                        <span className={s.profileItem} key={profile.uuid}>{profile.length}'' x {profile.qty}</span>
                    )}</span>
                </div>
                : null}
            {golaProfiles.length ?
                <div className={s.itemOption}>
                    <span>LED Gola Profiles:</span>
                    <span>{golaProfiles.map(profile =>
                        <span className={s.profileItem} key={profile.uuid}>{profile.length}'' x {profile.qty} - {profile.color}</span>
                    )}</span>
                </div>
                : null}
            {doorSensor ?
                <div className={s.itemOption}>
                    <span>Door Sensor:</span>
                    <span>{doorSensor}</span>
                </div>
                : null}
            {dimRemote ?
                <div className={s.itemOption}>
                    <span>Dimmable Remote:</span>
                    <span>{dimRemote}</span>
                </div>
                : null}
            {transformer ?
                <div className={s.itemOption}>
                    <span>Transformer:</span>
                    <span>{transformer}</span>
                </div>
                : null}

        </>
    );
};

export default CartItemLedExtra