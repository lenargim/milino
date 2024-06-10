import React, {FC} from 'react';
import s from "../OrderForm/Sidebar/sidebar.module.sass";
import {DoorAccessoiresType} from "../CustomPart/DoorAccessoiresForm";

const CartItemDoorExtra: FC<{ productExtra: DoorAccessoiresType }> = ({productExtra}) => {
    const {aventos, PTO, ['Door Hinge']:doorHinge, ['Hinge Holes']: hingeHoles, servo} = productExtra
    const aventArr = aventos.filter(el => el.qty > 0);
    const PTOArr = PTO.filter(el => el.qty > 0);
    const servoArr = servo.filter(el => el.qty > 0);
    return (
        <>
            {aventArr.length ? <span className={s.part}>
                <span>Aventos:</span>
                {aventArr.map((el, index) =>
                    <span className={s.itemOption} key={index}>
                            <span>{el.label}: {el.price}$ x {el.qty}</span>
                        </span>
                )}
            </span> : null}

            {doorHinge ?
                <div className={s.itemOption}>
                    <span>Door Hinge:</span>
                    <span>{doorHinge}</span>
                </div>
                : null}

            {hingeHoles ?
                <div className={s.itemOption}>
                    <span>Hinge Holes:</span>
                    <span>{hingeHoles}</span>
                </div>
                : null}

            {PTOArr.length ? <span className={s.part}>
                <span>Push to Open:</span>
                {PTOArr.map((el, index) =>
                    <span className={s.itemOption} key={index}>
                            <span>{el.label}: {el.price}$ x {el.qty}</span>
                        </span>
                )}
            </span> : null}

            {servoArr.length ? <span className={s.part}>
                <span>Servo System:</span>
                {servoArr.map((el, index) =>
                    <span className={s.itemOption} key={index}>
                            <span>{el.label}: {el.price}$ x {el.qty}</span>
                        </span>
                )}
            </span> : null}

        </>
    );
};

export default CartItemDoorExtra