import React from 'react';
import Header from "./Header";
import {Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";

export default function Faq() {
    const [cookies, setCookie] = useCookies(['pays']);

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }
    return (
        <div>
            <Header page={'FAQ'}></Header>
        </div>

    );

}