import React, {FC} from 'react';
import s from "./product.module.sass";
import {ProductCheckboxInput, ProductInputCustom} from "../../common/Form";
import SelectField, {optionType} from "../../common/SelectField";
import {alignmentOptions} from "./ProductSchema";

export type borderType = 'Sides' | 'Top' | 'Bottom';
export type ledType = {
    hasLedBlock: boolean,
    borders: string[] | [],
    alignment: 'Center' | 'From Face' | 'From Back',
    indent?: number,
    error?: string
}
const LedBlock: FC<ledType> = ({alignment, indent, borders, error, hasLedBlock}) => {
    if (!hasLedBlock) return null;
    const borderOptions = ['Sides', 'Top', 'Bottom']
    const alignmentOpt: optionType[] = alignmentOptions.map(el => ({value: el, label: el}));

    return (
        <div className={s.block}>
            <h3>LED</h3>
            <div className={s.led}>
                <div className={s.options}>
                    {borderOptions.map((b, index) => <ProductCheckboxInput key={index}
                                                                           inputIndex={index}
                                                                           name={'LED borders'}
                                                                           value={b}/>)}
                    {error ? <div>{error}</div> : null}

                </div>
                <SelectField name="LED alignment" val={alignmentOpt[0]}
                             options={alignmentOpt}/>
                {alignment !== 'Center' ?
                    <ProductInputCustom value={null} name={'LED indent'} label="Indent"/>
                    : null}
            </div>
        </div>
    );
};

export default LedBlock;