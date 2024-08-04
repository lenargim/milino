import React, {FC} from "react";
import {DoorAccessoiresType} from "../../CustomPart/DoorAccessoiresForm";
import {Text, View} from "@react-pdf/renderer";
import {s} from "../PDF";

const CartItemDoorExtra: FC<{ productExtra: DoorAccessoiresType }> = ({productExtra}) => {
    const {aventos, PTO, ['Door Hinge']: doorHinge, ['Hinge Holes']: hingeHoles, servo} = productExtra
    const aventArr = aventos.filter(el => el.qty > 0);
    const PTOArr = PTO.filter(el => el.qty > 0);
    const servoArr = servo.filter(el => el.qty > 0);
    return (
        <View style={s.blocks}>
            {aventArr.length ? <View>
                <Text style={s.h2}>Aventos:</Text>
                {aventArr.map((el, index) =>
                    <Text style={s.itemOption} key={index}>
                        <Text>{el.label}: {el.price}$ x {el.qty}</Text>
                    </Text>
                )}
            </View> : null}

            <View>
                {doorHinge ?
                    <View style={s.itemOption}>
                        <Text>Door Hinge: {doorHinge}</Text>
                    </View>
                    : null}

                {hingeHoles ?
                    <View style={s.itemOption}>
                        <Text>Hinge Holes: {hingeHoles}</Text>
                    </View>
                    : null}
            </View>

            {PTOArr.length ? <View>
                <Text style={s.h2}>Push to Open:</Text>
                {PTOArr.map((el, index) =>
                    <Text style={s.itemOption} key={index}>
                        <Text>{el.label}: {el.price}$ x {el.qty}</Text>
                    </Text>
                )}
            </View> : null}

            {servoArr.length ? <View>
                <Text style={s.h2}>Servo System:</Text>
                {servoArr.map((el, index) =>
                    <Text style={s.itemOption} key={index}>
                        <Text>{el.label}: {el.price}$ x {el.qty}</Text>
                    </Text>
                )}
            </View> : null}

        </View>
    );
};

export default CartItemDoorExtra