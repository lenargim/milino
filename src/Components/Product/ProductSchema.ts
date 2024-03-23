import * as Yup from 'yup';
import settings from './../../api/settings.json'
import {sizeLimitsType} from "../../helpers/productTypes";

const patterntwodigisaftercomma = /^\d+(\.\d{0,2})?$/;

export function getProductSchema(sizeLimit: sizeLimitsType, isAngle: boolean): Yup.InferType<any> {
    const blindDoorMinMax = settings.blindDoor;
    const minWidth = sizeLimit.width[0];
    const maxWidth = sizeLimit.width[1];
    const minHeight = sizeLimit.height[0];
    const maxHeight = sizeLimit.height[1];
    const minDepth = !isAngle ? sizeLimit.depth[0] : sizeLimit.width[0];
    const maxDepth = !isAngle ? sizeLimit.depth[1] : sizeLimit.width[1];

    const schema = Yup.object({
        'Width': Yup.number()
            .required(),
        'Custom Width': Yup.number()
            .when('Width', {
                is: 0,
                then: (schema) => schema
                    .required('Please wright down width')
                    .min(minWidth, `Min ${minWidth} inches`)
                    .max(maxWidth, `Max ${maxWidth} inches`)
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
        isBlind: Yup.boolean(),
        'Blind Width': Yup.number()
            .when('isBlind', {
                is: true,
                then: (schema) => schema.required()
            }),
        'Custom Blind Width': Yup.number()
            .when(['isBlind', 'Blind Width'], {
                is: (isBlind: boolean, blindWidth: number) => isBlind && blindWidth === 0,
                then: (schema) => schema
                    .required('Please wright down blind width')
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
                    .test(
                        "is-min",
                        `Width is too small`,
                        (val: any, {parent}) => {
                            const fullWidth = parent['Width'] || parent['Custom Width'];
                            if (isAngle) {
                                const maxCorner = blindDoorMinMax[1]*Math.cos(45);
                                return val >= Math.floor(fullWidth - maxCorner)
                            } else {
                                return val >= fullWidth - blindDoorMinMax[1]
                            }
                        }
                    )
                    .test(
                        "is-max",
                        `Width is too big`,
                        (val: any, {parent}) => {
                            const fullWidth = parent['Width'] || parent['Custom Width'];
                            if (isAngle) {
                                const minCorner = blindDoorMinMax[0]*Math.cos(45);
                                return val <= Math.floor(fullWidth - minCorner)
                            } else {
                                return val <= (fullWidth - blindDoorMinMax[0])
                            }
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
                    .min(minHeight, `Min ${minHeight} inches`)
                    .max(maxHeight, `Max ${maxHeight} inches`)
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
                    .min(minDepth, `Min ${minDepth} inches`)
                    .max(maxDepth, `Max ${maxDepth} inches`)
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

    return schema;
}