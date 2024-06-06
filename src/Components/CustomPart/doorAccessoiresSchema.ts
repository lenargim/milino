import * as Yup from 'yup';
import {HingeType} from "./DoorAccessoiresForm";

const patterntwodigisaftercomma = /^\d+(\.\d{0,2})?$/;

export const doorAccessoiresSchema = Yup.object().shape({
    hingeHoleCustom: Yup.object().shape({
        qty: Yup.number(),
        label: Yup.string(),
        title: Yup.string()
            .when('qty', {
                is: (val: number) => val > 0,
                then: schema => schema.required('Enter custom hinge')
            })
    })
})
