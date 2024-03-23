import React, {FC} from 'react';
import {OrderFormType} from "../../../helpers/types";
import s from './sidebar.module.sass'
import {NavLink, useLocation} from "react-router-dom";

type SideBarType = {
    values: OrderFormType
}
const Sidebar: FC<SideBarType> = ({values}) => {
    const location = useLocation();
    const {room, ...data} = Object.assign({}, values);
    return (
        <aside className={s.sidebar}>
            <div className={s.sidebarContent}>
                <span className={s.choose}>Materials you choose:</span>
                {Object.entries(data).map((el, index) => {
                    return (
                        el[1] ? <div key={index} className={s.chooseItem}>
                            <span>{el[0]}:</span>
                            <span>{el[1]}</span>
                        </div> : null
                    )
                })}
            </div>
            {location.pathname === '/cabinets' &&
              <NavLink to={'/'} className={['button yellow', s.back].join(' ')}>← Back</NavLink>}
        </aside>
    );
};

export default Sidebar;