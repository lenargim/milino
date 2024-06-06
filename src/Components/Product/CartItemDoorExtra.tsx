import React, {FC} from 'react';
import s from "../OrderForm/Sidebar/sidebar.module.sass";
import {DoorAccessoiresType} from "../CustomPart/DoorAccessoiresForm";

const CartItemDoorExtra: FC<{ productExtra: DoorAccessoiresType }> = ({productExtra}) => {
    const {aventos, PTO, hingeHoles, hingeHoleCustom, hingeAngles, servo} = productExtra
    const aventArr = aventos.filter(el => el.qty > 0);
    const hingeAnglesArr = hingeAngles.filter(el => el.qty > 0);
    const hingeHolesArr = hingeHoles.filter(el => el.qty > 0);
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

            {hingeAnglesArr.length ? <span className={s.part}>
                <span>Door Hinge:</span>
                {hingeAnglesArr.map((el, index) =>
                    <span className={s.itemOption} key={index}>
                            <span>{el.label}: {el.price}$ x {el.qty}</span>
                        </span>
                )}
            </span> : null}

            {hingeHolesArr.length || hingeHoleCustom.qty ? <span className={s.part}>
                <span>Hinge Holes:</span>
                {hingeHolesArr.map((el, index) =>
                    <span className={s.itemOption} key={index}>
                            <span>{el.label}: {el.price}$ x {el.qty}</span>
                        </span>
                )}

                {hingeHoleCustom.qty ?
                    <span className={s.part}>
                        <span>Custom: {hingeHoleCustom.price}$ x {hingeHoleCustom.qty}</span>
                </span> : null}
            </span> : null}

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