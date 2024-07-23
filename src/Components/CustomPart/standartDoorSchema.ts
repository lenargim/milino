import * as Yup from 'yup';


const doors = Yup.object().shape({
    // uuid: Yup.string(),
    name: Yup.string()
        // .required('Choose size or delete the row')
    ,
    qty: Yup.number().integer().positive()
})

export const standartDoorSchema = Yup.object().shape({
    Doors: Yup.array().of(doors).min(1),
    Color: Yup.string().required('Choose Color')
})