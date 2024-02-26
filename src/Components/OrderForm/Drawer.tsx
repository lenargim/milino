import React, {useEffect} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {useField} from "formik";
import {FC} from "react";
import {getImg} from "../../helpers/helpers";
import {drawer} from "../../helpers/materialsTypes";


export const Drawer: FC<{drawers: drawer[]}> = ({drawers}) => {
  const [dr] = useField('Drawer')
  const [drType] = useField('Drawer Type')
  const [drColor, , coloreHelpers] = useField('Drawer Color')

  useEffect(() => {
    if (drColor.value ) {
      const checkType = drawers.find(el => el.value === dr.value)?.types;
      const checkColor = checkType
          ? checkType.find(el => el.value === drType.value)?.colors.find(el => el === drColor.value)
          : null;

      if (!checkColor) {
        coloreHelpers.setValue('');
        coloreHelpers.setTouched(false)
      }

    }
  }, [dr.value])

  return (
    <div className={s.orderBlock}>
      <h2>Drawer</h2>
      <div className={s.type} role="group">
        {drawers.map((drawerEl, key) => {
          return (
            <RadioInput value={drawerEl.value} img={getImg('drawers', drawerEl.img)} name="Drawer" className={s.typeItem} key={key}/>
          )
        })}
      </div>
    </div>
  )
};


