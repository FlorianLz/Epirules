import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";

export default function APropos() {
    const [cookies] = useCookies(['pays']);
    let desc = 'Tout d\'abord, The Internationals est un groupe d\'étudiants internationaux qui ont participé au projet BUSIT.\n' +
        '                        Le sujet était : "Designer et créer une application mobile innovante utile durant une période d\'épidemie." en mixant les nationalités : Belges, Français, Espagnol, Finlandais et Irlandais.\n' +
        '                        Notre attention s\'est porté sur le fait que personne ne connaît vraiment toutes les règles qui existent durant une période d\'épidemie et quand l\'on rentre dans une nouvelle phase, les nouvelles règles ne sont jamais très claires.\n' +
        '                        Avec cette application, on espère dissiper tout malentendu sur les règles et faire du monde un endroit plus sûr.\n' +
        '                        Après ce projet, l\'équipe InProgress, composé d\'étudiants français, a developpé cette application et a créé une campagne de communication.';
    let idea = 'L\'idée de l\'application est venue de :';
    let create = 'L\'application a été développé par :';
    const [description, setDescription] = useState(desc);
    const [idee, setIdee] = useState(idea);
    const [creation, setCreation] = useState(create);
    const [loading,setLoading] = useState(true);
    const [nomPage, setNomPage] = useState('');

    async function translate() {
        let langue=navigator.language.split('-')[0];
        let cle = 'trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8';
        if(langue !== 'fr'){
            let states = ['À propos de nous',description,idee,creation];
            let set = [setNomPage,setDescription,setIdee, setCreation];

            for(let i=0; i<states.length; i++){
                await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+states[i]+'&lang='+langue).then(function (response) {
                    set[i](response.data.text)
                })
            }
            setLoading(false)
        }else{
            setNomPage('À propos de nous')
            setLoading(false)
        }
    }

    useEffect(()=>{
        translate()
    },[])

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    return (
        <div>
            <Header page={nomPage}> </Header>
            {
                loading === false ?
                    <div className="apropos">
                        <div>
                            <h3> The Internationals & InProgress </h3>
                            <p className="desc">
                                {description}
                            </p>
                        </div>

                        <div className="personnes">
                            <div className="theInternationals">
                                <p className="title"> {idee} </p>
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
                                <p className="title"> {creation} </p>
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
                    :
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
            }
        </div>

    );

}