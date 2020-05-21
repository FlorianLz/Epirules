import React from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Redirect} from "react-router-dom";

export default function Stats(props) {
    const [cookies, setCookie] = useCookies(['pays']);
    let pays=cookies.pays;

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    return (
        <div>
            <Header page={'Statistiques '+pays}></Header>
        </div>

    );

}