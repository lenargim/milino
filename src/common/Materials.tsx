import React, {FC} from 'react';
import s from "../Components/OrderForm/Sidebar/sidebar.module.sass";
import {getDoorStr, getDrawerStr, getSingleStr} from "../helpers/helpers";
import {OrderFormType} from "../helpers/types";

const Materials:FC<{data: OrderFormType}> = ({data}) => {
    const choosenMaterials = Object.entries(data).filter(el => !!el[1]);
    const roomStr = getSingleStr(choosenMaterials, 'room')
    const doorStr = getDoorStr(choosenMaterials)
    const boxMaterialStr = getSingleStr(choosenMaterials, 'Box Material')
    const drawerStr = getDrawerStr(choosenMaterials);
    const leatherStr = getSingleStr(choosenMaterials, 'Leather')

    return (
        <div className={s.materials}>
            <h4 className={s.choose}>Materials you choose:</h4>
            {roomStr ? <span className={s.chooseItem}>
                     <span>{roomStr}</span>
                </span> : null}
            {doorStr ? <span className={s.chooseItem}>
                    <span>Door:</span> <span>{doorStr}</span>
                </span> : null}
            {boxMaterialStr ? <span className={s.chooseItem}>
                    <span>Box Material:</span><span>{boxMaterialStr}</span>
                </span> : null}
            {drawerStr ? <span className={s.chooseItem}>
                    <span>Drawer:</span> <span>{drawerStr}</span>
                </span> : null}
            {leatherStr ? <span className={s.chooseItem}>
                    <span>Leather:</span><span>{leatherStr}</span>
                </span> : null}
        </div>
    );
};

export default Materials;