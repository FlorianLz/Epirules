import React from 'react';
import Header from "./Header";
import {Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";

export default function APropos() {
    const [cookies] = useCookies(['pays']);

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    return (
        <div>
            <Header page={'À propos de nous'}> </Header>
            <div className="apropos">
                <div>
                    <h3> The Internationals & InProgress </h3>
                    <p className="desc">
                        Tout d'abord, The Internationals est un groupe d'étudiants internationaux qui ont participé au projet BUSIT.
                        Le sujet était : "Designer et créer une application mobile innovante utile durant une période d'épidemie." en mixant les nationalités : Belges, Français, Espagnol, Finlandais et Irlandais.
                        Notre attention s'est porté sur le fait que personne ne connaît vraiment toutes les règles qui existent durant une période d'épidemie et quand l'on rentre dans une nouvelle phase, les nouvelles règles ne sont jamais très claires.
                        Avec cette application, on espère dissiper tout malentendu sur les règles et faire du monde un endroit plus sûr.
                        Après ce projet, l'équipe InProgress, composé d'étudiants français, a developpé cette application et a créé une campagne de communication.
                    </p>
                </div>

                <div className="personnes">
                    <div className="theInternationals">
                        <p className="title"> L'idée de l'application est venue de : </p>
                        <div className="names">
                            <p> Achacortabarria Andoni </p>
                            <p> Van Tilborgh Liam </p>
                            <p> Paluch Loïc </p>
                            <p> Hendrickx Luka </p>
                            <p> Vittu Lydie </p>
                            <p> Troumelen Morgane </p>
                        </div>
                    </div>
                    <div className="inProgress">
                        <p className="title"> L'application a été développé par: </p>
                        <div className="names">
                            <p> Paluch Loïc </p>
                            <p> Vittu Lydie </p>
                            <p> Troumelen Morgane </p>
                            <p> Laignez Florian </p>
                            <p> Tournemaine Tiphaine </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}