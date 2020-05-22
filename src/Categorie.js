import React from 'react';
import Header from "./Header";
import {Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";

export default function Categorie(props) {
    const [cookies] = useCookies(['pays']);
    let categorie = props.match.params.categorie;
    console.log(categorie)


    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }
    return (
        <div>
            <Header page={'Catégorie'}> </Header>
            {categorie}
        </div>

    );

}