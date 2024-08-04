import React, {FC} from "react";
import {s} from "../PDF";
import {Text, View} from '@react-pdf/renderer';

const CartItemShelfExtra: FC<{ productExtra: string }> = ({productExtra}) => {
    return (
        <View style={s.itemOption}>
            <Text>Glass Color: {productExtra}</Text>
        </View>
    );
};

export default CartItemShelfExtra