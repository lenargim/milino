import React, {useEffect} from 'react';
import s from "./OrderForm.module.sass"
import {RadioInput} from "../../common/Form";
import {useField} from "formik";
import {FC} from "react";
import {getImg} from "../../helpers/helpers";
import {drawer} from "../../helpers/materialsTypes";


export const DrawerType: FC<{drawers: drawer[]}> = ({drawers}) => {
  const [dr] = useField('Drawer')
  const [drType] = useField('Drawer Type')
  const [drColor, , coloreHelpers] = useField('Drawer Color')

  const DrawerTypes = drawers.find(el => el.value === dr.value)?.types;

  useEffect(() => {
    if (drColor.value ) {
      const checkType = drawers.find(el => el.value === dr.value)?.types;
      const checkColor = checkType ?checkType.find(el => el.value === drType.value)?.colors.find(el => el === drColor.value) : null;

      if (!checkColor) {
        coloreHelpers.setValue('');
        coloreHelpers.setTouched(false)
      }

    }
  }, [drType.value])

  return (
    <div className={s.orderBlock}>
      <h2>Drawer Type</h2>
      <div className={s.type} role="group">
        {DrawerTypes && DrawerTypes.map((drawerEl, key) => {
          return (
            <RadioInput value={drawerEl.value} img={getImg('drawers', drawerEl.img)} name="Drawer Type" className={s.typeItem} key={key}/>
          )
        })}
      </div>
    </div>
  )
};


