import * as Yup from 'yup';
import {materialsCustomPart, materialsLimitsType} from "../../helpers/productTypes";

const patterntwodigisaftercomma = /^\d+(\.\d{0,2})?$/;

export function getCustomPartSchema(materialsRange: materialsCustomPart[]|undefined, limits: materialsLimitsType|undefined): Yup.InferType<any> {
    console.log(materialsRange)
    const schemaMain = Yup.object({
        'Width': Yup.number()
            .when(('Has Width'), {
                is: true,
                then: (schema) => schema
                    .required('Please wright down width')
                    .typeError('Invalid Input: numbers please')
                    .test("is-decimal",
                        "Maximum two digits after comma",
                        (val: any) => {
                            return val !== undefined ? patterntwodigisaftercomma.test(val) : true})
                    .test('min',
                        ({value}) => `It's too small size`,
                        (value, context) => {
                            const material: string|undefined = context.parent['Material'];
                            const sizeLimit = materialsRange?.find(el => el.name === material)?.limits || limits
                            if (!material || !sizeLimit) return true;
                            const minWidth = sizeLimit.width && sizeLimit.width[0] || 1;
                            return value >= minWidth;
                        }
                    )
                    .test('max',
                        ({value}) => `It's too huge size`,
                        (value, context) => {
                            const material: string|undefined = context.parent['Material'];
                            const sizeLimit = materialsRange?.find(el => el.name === material)?.limits || limits
                            if (!material || !sizeLimit) return true;
                            const maxWidth = sizeLimit.width && sizeLimit.width[1] || 999;
                            return value <= maxWidth;
                        }
                    )

            }),
        'Height': Yup.number()
            .when(('Has Height'), {
                is: true,
                then: (schema) => schema
                    .required('Please wright down height')
                    .typeError('Invalid Input: numbers please')
                    .test("is-decimal",
                        "Maximum two digits after comma",
                        (val: any) => {
                            return val !== undefined ? patterntwodigisaftercomma.test(val) : true})

                    .test('min',
                        ({value}) => `It's too small size`,
                        (value, context) => {
                            const material: string|undefined = context.parent['Material'];
                            const sizeLimit = materialsRange?.find(el => el.name === material)?.limits || limits
                            if (!material || !sizeLimit) return true;
                            const minHeight = sizeLimit.height && sizeLimit.height[0] || 1;
                            return value >= minHeight;
                        }
                    )
                    .test('max',
                        ({value}) => `It's too huge size`,
                        (value, context) => {
                            const material: string|undefined = context.parent['Material'];
                            const sizeLimit = materialsRange?.find(el => el.name === material)?.limits || limits
                            if (!material || !sizeLimit) return true;
                            const maxHeight = sizeLimit.height && sizeLimit.height[1] || 999;
                            return value <= maxHeight;
                        }
                    )

            }),
        'Depth': Yup.number()
            .when(('Has Depth'), {
                is: true,
                then: (schema) => schema
                    .required('Please wright down depth')
                    .typeError('Invalid Input: numbers please')
                    .test("is-decimal",
                        "Maximum two digits after comma",
                        (val: any) => {
                            return val !== undefined ? patterntwodigisaftercomma.test(val) : true})

                    .test('min',
                        ({value}) => `It's too small size`,
                        (value, context) => {
                            const material: string|undefined = context.parent['Material'];
                            const sizeLimit = materialsRange?.find(el => el.name === material)?.limits || limits
                            if (!material || !sizeLimit) return true;
                            const minDepth = sizeLimit.depth && sizeLimit.depth[0] || 1;
                            return value >= minDepth;
                        }
                    )
                    .test('max',
                        ({value}) => `It's too huge size`,
                        (value, context) => {
                            const material: string|undefined = context.parent['Material'];
                            const sizeLimit = materialsRange?.find(el => el.name === material)?.limits || limits
                            if (!material || !sizeLimit) return true;
                            const maxDepth = sizeLimit.depth && sizeLimit.depth[1] || 999;
                            return value <= maxDepth;
                        }
                    )
            }),
        'Material': Yup.string(),
        'Note': Yup.string(),
    })

    return schemaMain;
}