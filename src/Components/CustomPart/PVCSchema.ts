import * as Yup from 'yup';
import {materialsCustomPart, materialsLimitsType} from "../../helpers/productTypes";

const patterntwodigisaftercomma = /^\d+(\.\d{0,2})?$/;

export function getPVCSchema(materialsRange: materialsCustomPart[] | undefined, limits: materialsLimitsType | undefined): Yup.InferType<any> {
    const schemaMain = Yup.object({
        'Width': Yup.number()
            .required('Please wright down width')
            .typeError('Invalid Input: numbers please')
            .test("is-decimal",
                "Maximum two digits after comma",
                (val: any) => {
                    return val !== undefined ? patterntwodigisaftercomma.test(val) : true
                })
            .test('min',
                ({value}) => `It's too small size`,
                (value, context) => {
                    const material: string | undefined = context.parent['Material'];
                    const sizeLimit = materialsRange?.find(el => el.name === material)?.limits ?? limits
                    if (!sizeLimit?.width) return true;
                    const minWidth = sizeLimit.width && sizeLimit.width[0] || 1;
                    return value >= minWidth;
                }
            )
            .test('max',
                ({value}) => `It's too huge size`,
                (value, context) => {
                    const material: string | undefined = context.parent['Material'];
                    const sizeLimit = materialsRange?.find(el => el.name === material)?.limits || limits
                    if (!sizeLimit?.width) return true;
                    const maxWidth = sizeLimit.width && sizeLimit.width[1] || 999;
                    return value <= maxWidth;
                }
            ),
        'Material': Yup.string().required(),
        'Note': Yup.string(),
    })

    return schemaMain;
}