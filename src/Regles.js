import React from 'react';
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
            <Header page={'Règles '+pays}> </Header>
            <div className="rules">
                <div className="mainRules">
                    <h2 className="titlePage"> Main rules </h2>
                    <div className="liste">
                        <div className="onerule">
                            <img src={'/images/main.png'} alt={'Fermer le menu'}/>
                            <p> Se laver très régulièrement les mains </p>
                        </div>
                        <div className="onerule">
                            <img src={'/images/moucher.png'} alt={'Fermer le menu'}/>
                            <p> Tousser ou éternuer dans son coude ou dans un mouchoir</p>
                        </div>
                        <div className="onerule">
                            <img src={'/images/mouchoir.png'} alt={'Fermer le menu'}/>
                            <p> Utiliser un mouchoir à usage unique et le jeter </p>
                        </div>
                        <div className="onerule">
                            <img src={'/images/serrermains.png'} alt={'Fermer le menu'}/>
                            <p> Saluer sans se serrer la main, éviter les embrassades </p>
                        </div>
                    </div>
                </div>
                <div className="categories">
                    <p> Sélectionner une catégorie </p>
                    <div className="liste">
                        
                    </div>
                </div>
            </div>
        </div>

    );

}