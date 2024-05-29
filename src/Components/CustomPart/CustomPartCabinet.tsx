import React, {FC} from 'react';
import {customPartDataType, sizeLimitsType} from "../../helpers/productTypes";
import CustomPartForm from "./CustomPartForm";
import {OrderFormType} from "../../helpers/types";

type CustomPartCabinetType = {
    customPart: customPartDataType,
    materials: OrderFormType
}

const CustomPartCabinet: FC<CustomPartCabinetType> = ({customPart, materials}) => {
    return (
        <CustomPartForm customPart={customPart}
                        materials={materials}
        />
    );
};

export default CustomPartCabinet;