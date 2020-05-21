import React, {useEffect} from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Redirect} from "react-router-dom";

export default function Regles() {
    const [cookies] = useCookies(['pays']);
    let pays=cookies.pays;

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    return (
        <div>
            <Header page={'Règles '+pays}></Header>
        </div>

    );

}