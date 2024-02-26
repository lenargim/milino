import React from 'react';
import {NavLink} from "react-router-dom";
import s from './header.module.sass'

const Header = () => {
    return (
        <header className={s.header}>
            <NavLink to={"/"} className={s.link} >Order form</NavLink>
        </header>
    );
};

export default Header;