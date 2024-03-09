import * as Yup from 'yup';
import settings from './../../api/settings.json'
import { sizeLimitsType} from "../../helpers/productTypes";

const patterntwodigisaftercomma = /^\d+(\.\d{0,2})?$/;

export function getProductSchema(sizeLimit: sizeLimitsType): Yup.InferType<any> {

    const schema = Yup.object({
        'Width': Yup.number()
            .required(),
        'Custom Width': Yup.number()
            .when('Width', {
                is: 0,
                then: (schema) => schema
                    .required('Please wright down width')
                    .min(sizeLimit.width[0], `Min ${sizeLimit.width[0]} inches`)
                    .max(sizeLimit.width[1], `Max ${sizeLimit.width[1]} inches`)
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
                    .min(sizeLimit.height[0], `Min ${sizeLimit.height[0]} inches`)
                    .max(sizeLimit.height[1], `Max ${sizeLimit.height[1]} inches`)
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
                    .min(sizeLimit.depth[0], `Min ${sizeLimit.depth[0]} inches`)
                    .max(sizeLimit.depth[1], `Max ${sizeLimit.depth[1]} inches`)
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
        'Doors': Yup.number()
            .required('Select doors quantity')
            .nullable(),
        'Hinge opening': Yup.string()
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
    })

    return schema
}