import * as Yup from 'yup';
import {RoomType} from "../../helpers/categoriesTypes";
import {StringSchema} from "yup";

export const OrderFormSchema = Yup.object({
    'room': Yup.string()
        .ensure()
        .required() as StringSchema<RoomType | ''>,
    'Door Type': Yup.string()
        .ensure()
        .when('room',  {
            is: (val:RoomType | '') => val !== 'Standart Door',
            then: schema => schema.required('Please write down door type'),
        }),
    'Door Finish Material': Yup.string()
        .ensure()
        .when('room',  {
            is: (val:RoomType | '') => val !== 'Standart Door',
            then: schema => schema.required('Please write down finish material'),
        }),
    'Door Color': Yup.string()
        .when('Door Finish Material', {
            is: (val: string) => val !== 'No Doors No Hinges',
            then: (schema => schema.required('Please choose down color'))
        }),
    'Door Grain': Yup.string(),
    'Box Material': Yup.string()
        .required('Please write down box material'),
    'Drawer': Yup.string()
        .required('Please write down Drawer'),
    'Drawer Type': Yup.string()
        .required('Please write down drawer type'),
    'Drawer Color': Yup.string()
        .required('Please write color'),
})
