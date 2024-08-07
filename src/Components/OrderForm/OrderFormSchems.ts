import * as Yup from 'yup';
import {RoomType} from "../../helpers/categoriesTypes";
import {StringSchema} from "yup";

export const OrderFormSchema = Yup.object({
    'Category': Yup.string()
        .ensure()
        .required() as StringSchema<RoomType | ''>,
    'Door Type': Yup.string()
        .ensure()
        .when('Category',  {
            is: (val:RoomType | '') => val !== 'Standart Door',
            then: schema => schema.required('Please write down door type'),
        }),
    'Door Finish Material': Yup.string()
        .ensure()
        .when('Category',  {
            is: (val:RoomType | '') => val !== 'Standart Door',
            then: schema => schema.required('Please write down finish material'),
        }),
    'Door Frame Width': Yup.string()
        .when('Door Type', {
            is: 'Micro Shaker',
            then: schema => schema.required('Please write Leather')
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
    'Leather Type': Yup.string()
        .when('Category', {
            is: 'Leather Closet',
            then: schema => schema.required('Please write Leather Type')
        }),
    'Leather Color': Yup.string()
        .when('Category', {
            is: 'Leather Closet',
            then: schema => schema.required('Please write Leather Color')
        })
})
