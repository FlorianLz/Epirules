import React from 'react';
import Menu from "./Menu";

export default function Header(props) {
    return (
        <div>
            <div className={'header'}>
                <img src={'/images/epirules.png'} alt={'Epirules'}/>
                <h3>{props.page}</h3>
            </div>
            <Menu pays={props.pays}> </Menu>
        </div>

    );

}