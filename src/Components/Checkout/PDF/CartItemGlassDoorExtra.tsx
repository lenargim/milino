import React, {FC} from "react";
import {glassDoorExtraType} from "../../../store/reducers/generalSlice";
import {Text, View} from '@react-pdf/renderer';
import {s} from "../PDF";

const CartItemGlassDoorExtra: FC<{ glassDoorExtra: glassDoorExtraType }> = ({glassDoorExtra}) => {
    const {Type, Profile, Color, material} = glassDoorExtra;

    return (
        <>
            {material &&
              <View style={s.itemOption}>
                <Text>Material: {material}</Text>
              </View>}
            {Profile &&
              <View style={s.itemOption}>
                <Text>Door Profile: {Profile}</Text>
              </View>}
            {Type &&
              <View style={s.itemOption}>
                <Text>Door Type: {Type}</Text>
              </View>}
            {Color &&
              <View style={s.itemOption}>
                <Text>Door Color: {Color}</Text>
              </View>}
        </>

    )
}

export default CartItemGlassDoorExtra;