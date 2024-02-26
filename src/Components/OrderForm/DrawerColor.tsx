import React, {FC} from 'react';
import s from './OrderForm.module.sass'
import {RadioInput} from "../../common/Form";
import {useField} from "formik";
import {drawer} from "../../helpers/materialsTypes";


export const DrawerColor: FC<{drawers: drawer[]}> = ({drawers}) => {
  const [field] = useField('Drawer');
  const [fieldType] = useField('Drawer Type');
  const drawerTypes = drawers.find(el => el.value === field.value)?.types;
  const DrawerColors = drawerTypes && drawerTypes.find(el => el.value === fieldType.value)?.colors
  return (
    <div className={s.orderBlock}>
      <h2>Drawer Color</h2>
      <div className={s.type} role="group">
        {DrawerColors && DrawerColors.map((drawerEl, key) => {
          return (
            <RadioInput value={drawerEl} name="Drawer Color" className={s.typeItem} key={key}/>
          )
        })}
      </div>
    </div>
  )
};


