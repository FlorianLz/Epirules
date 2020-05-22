import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {useCookies} from "react-cookie";
import {Redirect} from "react-router-dom";
import * as firebase from "firebase";
import config from "./Config";
import ListeNumeros from "./ListeNumeros";

export default function Urgences() {
    const [cookies] = useCookies(['pays']);
    const [cookiesID, setCookieID] = useCookies(['idpays']);
    const [listeNumeros, setListeNumeros] = useState([]);
    const [loading, setLoading] = useState(true);
    let jsxListeNumeros = [];
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getNumeros(){
        db.collection("numeros").orderBy("place","asc").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().idpays === idpays){
                    listeNumeros.push({
                        idpays: doc.data().idpays,
                        numero: doc.data().numero,
                        desc: doc.data().desc
                    })
                }
            });
        }).then(()=>setLoading(false));
    }

    getNumeros();

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    if(loading === false){
        for(let i =0;i<listeNumeros.length;i++){
            jsxListeNumeros.push(<ListeNumeros
                key={i}
                idpays={listeNumeros[i].idpays}
                numero={listeNumeros[i].numero}
                desc={listeNumeros[i].desc}

            />)
        }

        return (
            <div>
                <Header page={'Urgences '+pays}> </Header>
                <div className="emergency">
                    {jsxListeNumeros}
                </div>
            </div>
        )
    }else{
        return(
            <div className={"content"}>
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
        )
    }


}