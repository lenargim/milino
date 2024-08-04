import React, {FC} from "react";
import {customPartExtraType} from "../../../store/reducers/generalSlice";
import Dimentions from "./Dimentions";
import {Text, View} from "@react-pdf/renderer";
import {s} from "../PDF";

const CartItemCustomExtra: FC<{ productExtra: customPartExtraType }> = ({productExtra}) => {
    const {material, width, height, depth} = productExtra;
    return (
        <>
            <Dimentions width={width} depth={depth} height={height}/>
            {material &&
              <View style={s.itemOption}>
                <Text>Material: {material}</Text>
              </View>
            }
        </>
    )
}

export default CartItemCustomExtra