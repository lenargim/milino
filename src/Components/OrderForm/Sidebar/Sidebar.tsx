import React, {FC, useEffect} from 'react';
import {OrderFormType} from "../../../helpers/types";
import s from './sidebar.module.sass'
import Materials from "../../../common/Materials";

type SideBarType = {
    values: OrderFormType
}
const Sidebar: FC<SideBarType> = ({values}) => {
    return (
        <aside className={s.sidebar}>
            <div className={s.sidebarContent}>
                <Materials data={values}/>
            </div>
        </aside>
    );
};

export default Sidebar;


