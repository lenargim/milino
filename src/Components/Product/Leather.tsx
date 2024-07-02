import React, {FC} from 'react';
import s from "./product.module.sass";
import SelectField, {optionType} from "../../common/SelectField";
import settings from './../../api/settings.json'



const LedBlock: FC = () => {
    const {leatherOptions} = settings
    const leatherOpt: optionType[] = leatherOptions.map(el => ({value: el, label: el}));
    return (
        <div className={s.block}>
            <h3>Leather</h3>
            <SelectField name="Leather" val={leatherOpt[0]}
                         options={leatherOpt}/>
        </div>
    );
};

export default LedBlock;