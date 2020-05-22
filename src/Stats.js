import React, {useState} from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Redirect} from "react-router-dom";
import axios from "axios";

export default function Stats() {
    const [cookies] = useCookies(['pays']);
    const [deaths,setDeaths] = useState('0');
    const [confirmed,setConfirmed] = useState('0');
    const [loading, setLoading] = useState(true);
    let pays=cookies.pays;
    let codepays=cookies.codepays;

    async function getData(codepays){
        const data = (await axios.get('https://cors-anywhere.herokuapp.com/https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code='+codepays)).data;
        setConfirmed(data.latest.confirmed);
        setDeaths(data.latest.deaths);
        setLoading(false);
    }

    getData(codepays);

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    if(loading === true){
        return (
            <div>
                <Header page={'Statistiques '+pays}> </Header>
                <div className="stats">
                    <div className="intro">
                        <h2>Ici vous pouvez retrouver les statistiques du pays que vous avez sélectionné</h2>
                    </div>
                    <div className="lds-roller">
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                        <div> </div>
                    </div>
                </div>
            </div>

        );
    }else{
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

}