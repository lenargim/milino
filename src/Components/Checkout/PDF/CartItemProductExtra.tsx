import React, {FC} from "react";
import {productExtraType} from "../../../store/reducers/generalSlice";
import Dimentions from "./Dimentions";
import {Text, View} from "@react-pdf/renderer";
import {getFraction} from "../../../helpers/helpers";
import {s} from "../PDF";

const CartItemProductExtra: FC<{ productExtra: productExtraType }> = ({productExtra}) => {
    const {
        led,
        blindWidth,
        middleSection,
        hinge,
        options,
        doorProfile,
        doorGlassType,
        doorGlassColor,
        shelfProfile,
        shelfGlassType,
        shelfGlassColor,
        width, height, depth, leather, corner
    } = productExtra;

    return (
        <View>
            <Dimentions width={width} depth={depth} height={height}/>

            {blindWidth ?
                <View style={s.itemOption}>
                    <Text>Blind Width: {getFraction(blindWidth)}</Text>
                </View>
                : null}

            {middleSection ?
                <View style={s.itemOption}>
                    <Text>Middle Section Height: {getFraction(middleSection)}</Text>
                </View> : null
            }
            {hinge ?
                <View style={s.itemOption}>
                    <Text>Hinge opening: {hinge}</Text>
                </View> : null}
            {led ?
                <View style={s.itemOption}>
                    <Text>LED: {`${led.border.map(el => el)}. ${led.alignment} ${led.indent ? led.indent + '"' : ''}`}</Text>
                </View> : null
            }
            {corner ?
                <View style={s.itemOption}>
                    <Text>Corner: {corner}</Text>
                </View> : null
            }
            {leather ?
                <View style={s.itemOption}>
                    <Text>Leather: {leather}</Text>
                </View> : null
            }
            {options.length ?
                <View>
                    <View style={s.itemOption}>Options:</View>
                    {options.includes('Glass Door') ?
                        <View style={s.itemOption}>
                            <Text>Glass Door: {`${doorProfile}|${doorGlassType}|${doorGlassColor}`}</Text>
                        </View> : null
                    }

                    {options.includes('Glass Shelf') ?
                        <View style={s.itemOption}>
                            <Text>Glass Shelf: {`${shelfProfile}|${shelfGlassType}|${shelfGlassColor}`}</Text>
                        </View> : null
                    }

                    {options.filter(option => option !== 'Glass Door' && option !== 'Glass Shelf').map((el, index) =>
                        <View style={s.itemOption} key={index}>
                            <Text>{el}</Text>
                        </View>)}
                </View> : null
            }
        </View>
    )
}

export default CartItemProductExtra