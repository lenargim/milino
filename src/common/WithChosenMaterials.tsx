import {Navigate} from "react-router-dom";

export type WithChosenMaterialsProps = {
    outlet: JSX.Element;
};

export default function WithChosenMaterials({ outlet}: WithChosenMaterialsProps) {
    const materialsString = localStorage.getItem('materials');
    const materials = materialsString ? JSON.parse(materialsString) : null
    if(materials) {
        return outlet;
    } else {
        return <Navigate to={{ pathname: '/' }} />;
    }
};
