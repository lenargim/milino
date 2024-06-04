import React, {FC} from 'react';
import {customPartDataType} from "../../helpers/productTypes";
import CustomPartForm from "./CustomPartForm";
import PVCForm from "./PVCForm";
import {OrderFormType} from "../../helpers/types";
import LEDForm from "./LEDForm";

type CustomPartCabinetType = {
    customPart: customPartDataType,
    materials: OrderFormType
}

const CustomPartCabinet: FC<CustomPartCabinetType> = ({customPart, materials}) => {
    const {type} = customPart
    switch (type) {
        case "custom":
            return <CustomPartForm customPart={customPart} materials={materials}/>
        case "pvc":
            return <PVCForm customPart={customPart} materials={materials}/>
        case "led-accessories":
            return <LEDForm customPart={customPart}/>
        default:
            return <></>
    }
};

export default CustomPartCabinet;