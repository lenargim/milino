import React, {FC, useEffect} from 'react';
import s from "./OrderForm.module.sass";
import materials from "./../../api/materials.json"
import RoomType from "./RoomType";
import {DoorType} from "./DoorType";
import {DoorFinish} from "./DoorFinish";
import {DoorColor} from "./DoorColor";
import BoxMaterial from "./BoxMaterial";
import {DoorGrain} from "./DoorGrain";
import {Drawer} from "./Drawer";
import {DrawerType} from "./DrawerType";
import {DrawerColor} from "./DrawerColor";
import {OrderFormType} from "../../helpers/types";
import {colorType, finishType, MaterialsType} from "../../helpers/materialsTypes";

type MainType = {
    values: OrderFormType,
    isSubmitting: boolean,
    isValid: boolean,
    setFieldValue: (field: string, value: any) => void
}
const {rooms, doors, boxMaterial, drawers}: MaterialsType = materials
const Main: FC<MainType> = ({values, isSubmitting, isValid, setFieldValue}) => {
    const {
        room,
        ['Door Type']: doorType,
        ['Door Finish Material']: doorFinishMaterial,
        ['Door Color']: doorColor,
        ["Box Material"]: boxMaterialVal,
        ["Drawer"]: drawerVal,
        ["Drawer Type"]: drawerTypeVal,
        ['Drawer Color']: drawerColor,
        ['Door Grain']: doorGrain
    } = values;

    const finishArr: finishType[] | undefined = doors.find(el => el.name === doorType)?.finish;
    const colorArr: colorType[] | undefined = finishArr && finishArr.find(el => el.name === doorFinishMaterial)?.colors;
    const isGrain = colorArr && colorArr.find(el => el.name === doorColor)?.isGrain;
    const drawerTypesArr = drawers.find(el => el.value === drawerVal)?.types;
    const drawerColorsArr = drawerTypesArr && drawerTypesArr.find(el => el.value === drawerTypeVal)?.colors


    // Check is values are in array
    useEffect(() => {
        switch (finishArr?.length) {
            case 1:
                setFieldValue('Door Finish Material', finishArr[0].name);
                break;
            case undefined:
                setFieldValue('Door Finish Material', '');
                break;
            default:
                if (doorFinishMaterial && finishArr && !finishArr.some(el => el.name === doorFinishMaterial)) {
                    setFieldValue('Door Finish Material', '');
                }
        }
        switch (colorArr?.length) {
            case 1:
                setFieldValue('Door Color', colorArr[0].name);
                break;
            case undefined:
                setFieldValue('Door Color', '');
                break;
            default:
                if ((doorColor && colorArr && !colorArr.some(el => el.name === doorColor) || !doorFinishMaterial)) {
                    setFieldValue('Door Color', '');
                }
        }
        switch (drawerTypesArr?.length) {
            case 1:
                setFieldValue('Drawer Type', drawerTypesArr[0].value);
                break;
            case undefined:
                setFieldValue('Drawer Type', '');
                break;
            default:
                if (drawerTypeVal && drawerTypesArr && !drawerTypesArr.some(el => el.value === drawerTypeVal)) {
                    setFieldValue('Drawer Type', '');
                }
        }
        switch (drawerColorsArr?.length) {
            case 1:
                setFieldValue('Drawer Color', drawerColorsArr[0]);
                break;
            case undefined:
                setFieldValue('Drawer Color', '');
                break;
            default:
                if (drawerColor && drawerColorsArr && !drawerColorsArr.some(el => el === drawerColor)) {
                    setFieldValue('Drawer Color', '');
                }
        }

        if (isGrain && !doorGrain) setFieldValue('Door Grain', 'Gorizontal');
    }, [values])


    return (
        <main id="main" className={s.main}>
            <div className={s.container}>
                <h1 className="h1" id="anchor">ORDER FORM</h1>
                <div>
                    <RoomType rooms={rooms} value={room ? room : ''}/>
                    {room && <DoorType doors={doors}/>}
                    {doorType && finishArr && <DoorFinish finishArr={finishArr}/>}
                    {doorFinishMaterial && colorArr && <DoorColor colorArr={colorArr}/>}
                    {doorFinishMaterial && isGrain && <DoorGrain isGrain={isGrain}/>}
                    {(doorFinishMaterial === 'No Doors No Hinges' || doorColor || boxMaterialVal) &&
                      <BoxMaterial boxMaterial={boxMaterial}/>}
                    {boxMaterialVal && <Drawer drawers={drawers}/>}
                    {drawerVal && drawerTypesArr && <DrawerType drawerTypesArr={drawerTypesArr}/>}
                    {drawerTypeVal && drawerColorsArr && <DrawerColor drawerColorsArr={drawerColorsArr}/>}
                </div>
                {isValid && <button type="submit" className={['button yellow submit'].join(' ')}
                                    disabled={isSubmitting}>Submit</button>}
            </div>
        </main>
    );
};

export default Main;

