import React, {FC} from "react";
import {PVCExtraType} from "../../../store/reducers/generalSlice";
import {Text, View} from '@react-pdf/renderer';
import {s} from "../PDF";

const CartItemPvcExtra: FC<{ productExtra: PVCExtraType }> = ({productExtra}) => {
    const {material, pvcFeet} = productExtra;

    return (
        <>
            {pvcFeet && <View style={s.itemOption}>
              <Text>Width: {pvcFeet} ft.</Text>
            </View>}
            {material &&
              <View style={s.itemOption}>
                <Text>Material: {material}</Text>
              </View>}
        </>

    )
};

export default CartItemPvcExtra;