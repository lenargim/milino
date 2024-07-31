import React, {FC} from 'react';
import s from "./product.module.sass";
import SelectField from "../../common/SelectField";
import {getSelectValfromVal} from "../../helpers/helpers";
import {ProductOptionsInput} from "../../common/Form";
import settings from "../../api/settings.json";

type OptionsBlockType = {
    filteredOptions: string[],
    chosenOptions: string[],
    doorProfile: string,
    doorGlassType: string,
    doorGlassColor: string,
    shelfProfile: string,
    shelfGlassType: string,
    shelfGlassColor: string
}

const glassSettings = settings['Glass'];
const {
    ['Profile']: profileSettings,
    ['Glass Type']: glassTypeSettings,
    ['Glass Color']: glassColorSettings,
} = glassSettings;

const OptionsBlock: FC<OptionsBlockType> = ({filteredOptions, chosenOptions, doorProfile, doorGlassType, shelfGlassType, doorGlassColor, shelfProfile, shelfGlassColor}) => {
    const glassDoorColorFiltered = glassColorSettings.filter(el => el.type === doorGlassType);
    const glassShelfColorFiltered = glassColorSettings.filter(el => el.type === shelfGlassType);
    return (
        <>
            {filteredOptions.length
                ? <div className={s.block}>
                    <h3>Options</h3>
                    <div className={s.options} role="group">
                        {filteredOptions.map((w, index) => <ProductOptionsInput key={index} name={`Options`}
                                                                                value={w}/>)}
                    </div>
                </div> : null
            }
            {chosenOptions.includes('Glass Door') &&
              <>
                <h3>Glass Door</h3>
                <div className={s.blockWrap}>
                  <div className={s.block}>
                    <SelectField name="Door Profile" val={getSelectValfromVal(doorProfile, profileSettings)}
                                 options={profileSettings}/>
                  </div>
                  <div className={s.block}>
                    <SelectField name="Door Glass Type"
                                 val={getSelectValfromVal(doorGlassType, glassTypeSettings)}
                                 options={glassTypeSettings}/>
                  </div>
                  <div className={s.block}>
                    <SelectField name="Door Glass Color"
                                 val={getSelectValfromVal(doorGlassColor, glassDoorColorFiltered)}
                                 options={glassDoorColorFiltered}/>
                  </div>
                </div>
              </>}

            {chosenOptions.includes('Glass Shelf') &&
              <>
                <h3>Glass Shelf</h3>
                <div className={s.blockWrap}>
                  <div className={s.block}>
                    <SelectField name="Shelf Profile"
                                 val={getSelectValfromVal(shelfProfile, profileSettings)}
                                 options={profileSettings}/>
                  </div>
                  <div className={s.block}>
                    <SelectField name="Shelf Glass Type"
                                 val={getSelectValfromVal(shelfGlassType, glassTypeSettings)}
                                 options={glassTypeSettings}/>
                  </div>
                  <div className={s.block}>
                    <SelectField name="Shelf Glass Color"
                                 val={getSelectValfromVal(shelfGlassColor, glassShelfColorFiltered)}
                                 options={glassShelfColorFiltered}/>
                  </div>
                </div>
              </>}
        </>
    );
};

export default OptionsBlock;