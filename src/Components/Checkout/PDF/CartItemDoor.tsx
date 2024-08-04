import React, {FC} from "react";
import {DoorType} from "../../CustomPart/StandartDoorForm";
import {Text, View} from '@react-pdf/renderer';
import {s} from "../PDF";

const CartItemShelfExtra: FC<{ productExtra: DoorType }> = ({productExtra}) => {
    const {Color: color, Doors: doorArr} = productExtra
    return (
        <View>
            <View style={s.itemOption}>
                <Text>Door Color: {color}</Text>
            </View>
            {doorArr.map((el, index) => {
                return (
                    <Text style={s.itemOption} key={index}>
                        <Text>Size: {el.name}. Amount: {el.qty}</Text>
                    </Text>
                )
            })}
        </View>
    );
};

export default CartItemShelfExtra