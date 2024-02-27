import * as Yup from 'yup';
import settings from './../../api/settings.json'
const patterntwodigisaftercomma = /^\d+(\.\d{0,2})?$/;

export const BaseCabinetsSchema = Yup.object({
    'Width': Yup.number()
        .required(),
    'Custom Width': Yup.number()
        .when('Width', {
            is: 0,
            then: (schema) => schema
                .required('Please wright down width')
                .min(9, 'Min 9 inches')
                .max(48, 'Max 48 inches')
                .typeError('Invalid Input: numbers please')
                .test(
                    "is-decimal",
                    "Maximum two digits after comma",
                    (val: any) => {
                        if (val !== undefined) {
                            return patterntwodigisaftercomma.test(val);
                        }
                        return true;
                    }
                )
        }),
    'Height': Yup.number()
        .required(),
    'Custom Height': Yup.number()
        .when('Height', {
            is: 0,
            then: (schema) => schema
                .required('Please wright down height')
                .min(10.5, 'Min 10.5 inches')
                .max(54, 'Max 54 inches')
                .typeError('Invalid Input: numbers please')
                .test(
                    "is-decimal",
                    "Maximum two digits after comma",
                    (val: any) => {
                        if (val !== undefined) {
                            return patterntwodigisaftercomma.test(val);
                        }
                        return true;
                    }
                )
        }),
    'Depth': Yup.number()
        .required(),
    'Custom Depth': Yup.number()
        .when('Depth', {
            is: 0,
            then: (schema) => schema
                .required('Please wright down depth')
                .min(9, 'Min 9 inches')
                .max(48, 'Max 48 inches')
                .typeError('Invalid Input: numbers please')
                .test(
                    "is-decimal",
                    "Maximum two digits after comma",
                    (val: any) => {
                        if (val !== undefined) {
                            return patterntwodigisaftercomma.test(val);
                        }
                        return true;
                    }
                )
        }),
    'Hinge opening': Yup.string()
        // .required()
        .oneOf(settings["Hinge opening"]),
    'Options': Yup.array()
        .of(Yup.string()),
    'Profile': Yup.string()
        .when('Options', (options, field) =>
            options[0].includes('Glass Door') ? field.required() : field
        ),
    'Glass Type': Yup.string()
        .when('Options', (options, field) =>
            options[0].includes('Glass Door') ? field.required() : field
        ),
    'Glass Color': Yup.string()
        .when('Options', (options, field) =>
            options[0].includes('Glass Door') ? field.required() : field
        ),
    'Glass Shelf': Yup.string()
        .when('Options', (options, field) =>
            options[0].includes('Glass Shelf') ? field.required() : field
        ),
    'Note': Yup.string(),
    itemTotalPrice: Yup.number()
        .required()
        .positive()
})
