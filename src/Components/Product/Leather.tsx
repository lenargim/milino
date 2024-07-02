import React, {FC} from 'react';
import s from "./product.module.sass";
import SelectField, {optionType} from "../../common/SelectField";
import settings from './../../api/settings.json'
import {getSelectValfromVal} from "../../helpers/helpers";



const LedBlock: FC<{val:string}> = ({val}) => {
    const {leatherOptions} = settings
    const leatherOpt: optionType[] = leatherOptions.map(el => ({value: el, label: el}));
    return (
        <div className={s.block}>
            <h3>Leather</h3>
            <SelectField name="Leather" val={getSelectValfromVal(val, leatherOpt)}
                         options={leatherOpt}/>
        </div>
    );
};

export default LedBlock;