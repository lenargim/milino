import React, {FC} from 'react';
import {productExtraType} from "../../store/reducers/generalSlice";
import s from "../OrderForm/Sidebar/sidebar.module.sass";
import {getFraction} from "../../helpers/helpers";
import {Dimentions} from "./CartItem";

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
    } = productExtra
    return (
        <>
            <Dimentions width={width} depth={depth} height={height} />
            {blindWidth ?
                <div className={s.itemOption}>
                    <span>Blind Width:</span>
                    <span>{getFraction(blindWidth)}</span>
                </div>
                : null}

            {middleSection ?
                <div className={s.itemOption}>
                    <span>Middle Section Height:</span>
                    <span>{getFraction(middleSection)}</span>
                </div> : null
            }
            {hinge ?
                <div className={s.itemOption}>
                    <span>Hinge opening:</span>
                    <span>{hinge}</span>
                </div> : null}
            {led ?
                <div className={s.itemOption}>
                    <span>LED:</span>
                    <span>{`${led.border.map(el => el)}. ${led.alignment} ${led.indent ? led.indent + '"' : ''}`}</span>
                </div> : null
            }
            {corner ?
                <div className={s.itemOption}>
                    <span>Corner:</span>
                    <span>{corner}</span>
                </div> : null
            }
            {leather ?
                <div className={s.itemOption}>
                    <span>Leather:</span>
                    <span>{leather}</span>
                </div> : null
            }

            {options.length ?
                <>
                    <div className={s.optionsTitle}>Options:</div>
                    {options.includes('Glass Door') ?
                        <div className={s.itemOption}>
                            <span>Glass Door:</span>
                            <span>{`${doorProfile}|${doorGlassType}|${doorGlassColor}`}</span>
                        </div> : null
                    }

                    {options.includes('Glass Shelf') ?
                        <div className={s.itemOption}>
                            <span>Glass Shelf:</span>
                            <span>{`${shelfProfile}|${shelfGlassType}|${shelfGlassColor}`}</span>
                        </div> : null
                    }


                    {options.filter(option => option !== 'Glass Door' && option !== 'Glass Shelf').map((el, index) =>
                        <div className={s.itemOption} key={index}>
                            <span>{el}:</span>
                            <span>True</span>
                        </div>)}
                </> : null
            }
        </>
    )
}

export default CartItemProductExtra;