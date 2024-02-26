import React, {FC} from 'react';
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
import {MaterialsType} from "../../helpers/materialsTypes";

type MainType = {
    values: OrderFormType,
    isSubmitting: boolean,
    isValid: boolean
}

const {rooms, doors, boxMaterial, drawers}: MaterialsType = materials

const Main: FC<MainType> = ({values, isSubmitting, isValid}) => {
    return (
        <main id="main" className={s.main}>
            <div className={s.container}>
                <h1 className="h1" id="anchor">ORDER FORM</h1>
                <div>
                    <RoomType rooms={rooms}/>
                    {values.room && <DoorType doors={doors}/>}
                    {values["Door Type"] && <DoorFinish doors={doors}/>}
                    {values["Door Finish Material"] && <DoorColor doors={doors}/>}
                    {values["Door Finish Material"] && <DoorGrain doors={doors}/>}

                    {(values["Door Color"] || values['Door Finish Material'] === 'No Doors No Hinges') &&
                      <BoxMaterial boxMaterial={boxMaterial}/>}

                    {values["Box Material"] && <Drawer drawers={drawers}/>}
                    {values["Drawer"] && <DrawerType drawers={drawers}/>}
                    {values["Drawer Type"] && <DrawerColor drawers={drawers}/>}
                </div>
                {isValid && <button type="submit" className={['button yellow submit'].join(' ')}
                                    disabled={isSubmitting}>Submit</button>}
            </div>
        </main>
    );
};

export default Main;

