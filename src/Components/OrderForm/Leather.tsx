import React, {FC} from 'react';
import s from "./OrderForm.module.sass";
import {RadioInput} from "../../common/Form";
import {getImg} from "../../helpers/helpers";
import leather from './../../api/materials.json'

const Leather:FC<{name: string, value:string, leatherArr: {name:string, img:string}[]}> = ({name, value, leatherArr}) => {
    return (
        <div className={[s.orderBlock, value && s.checked].join(' ')}>
            <h2>{name}</h2>
            <div className={[s.type, value && s.checked].join(' ')} role="group">
                {leatherArr.map((el, key) => <RadioInput
                    value={el.name}
                    img={getImg('leather', el.img)}
                    name={name}
                    className={s.typeItem}
                    key={key}
                />)}
            </div>
        </div>
    );
};

export default Leather;