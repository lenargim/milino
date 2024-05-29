import React, {FC} from 'react';
import s from "../OrderForm/OrderForm.module.sass";
import {RadioInput} from "../../common/Form";
import {getImg} from "../../helpers/helpers";
import {room} from "../../helpers/materialsTypes";


const RoomType: FC<{ rooms: room[], value: string }> = ({rooms, value}) => {
    return (
        <div className={s.room} role="group">
            {rooms.map((room, key) => <RadioInput
                img={getImg('rooms', room.img)}
                key={key}
                value={room.value}
                name="room"
                className={s.typeItem}
                checked={room.value === value}/>)}
        </div>
    );
};

export default RoomType;