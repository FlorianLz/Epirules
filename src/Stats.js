import React, {useState} from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Redirect} from "react-router-dom";
import axios from "axios";

export default function Stats() {
    const [cookies] = useCookies(['pays']);
    const [deaths,setDeaths] = useState('0');
    const [confirmed,setConfirmed] = useState('0');
    let pays=cookies.pays;
    let codepays=cookies.codepays;

    async function getData(codepays){
        const data = (await axios.get('https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code='+codepays)).data;
        setConfirmed(data.latest.confirmed);
        setDeaths(data.latest.deaths);
    }

    getData(codepays)


    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    return (
        <div>
            <Header page={'Statistiques '+pays}> </Header>
            <div className="stats">
                <div className="intro">
                    <h2>Ici vous pouvez retrouver les statistiques du pays que vous avez sélectionné</h2>
                </div>
                <p className={'pays'}>Pays sélectionné : {pays}</p>
                <p>Nombre de cas : {confirmed}</p>
                <p>Nombre de morts : {deaths}</p>
            </div>
        </div>

    );

}