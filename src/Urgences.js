import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {useCookies} from "react-cookie";
import {Redirect} from "react-router-dom";
import * as firebase from "firebase";
import config from "./Config";
import ListeNumeros from "./ListeNumeros";
import axios from "axios";

export default function Urgences() {
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
    const [listeNumeros,setListeNumeros] = useState([]);
    const [nomPage, setNomPage] = useState('');
    const [loading, setLoading] = useState(true);
    const [vide,setVide] = useState(false);
    const [msgVide,setMsgVide] = useState('Aucun numéro disponible pour le moment.')
    let jsxListeNumeros = [];
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getNumeros(){
        let langue=navigator.language.split('-')[0];
        let cle = 'trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8';
        db.collection("numeros").orderBy("numero","asc").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().idpays === idpays){
                    if(doc.data().zero){
                        listeNumeros.push({
                            idpays: doc.data().idpays,
                            numero: '0'+doc.data().numero,
                            desc: doc.data().desc
                        })
                    }else{
                        listeNumeros.push({
                            idpays: doc.data().idpays,
                            numero: doc.data().numero,
                            desc: doc.data().desc
                        })
                    }
                }
            });
            if(listeNumeros.length === 0){
                setVide(true)
            }
            let newtab = [];
            if(langue !== 'fr'){
                async function translate() {

                    await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text=Urgences%20'+pays+'&lang='+langue).then(function (response) {
                        setNomPage(response.data.text)
                    }).catch(function (errors) {
                        setNomPage('Urgences '+pays)
                    })

                    await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+msgVide+'&lang='+langue).then(function (response) {
                        setMsgVide(response.data.text)
                    }).catch(function (errors) {
                        setMsgVide('Aucun numéro disponible pour le moment.')
                    })

                    for(let i=0; i<listeNumeros.length; i++){
                        await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+listeNumeros[i].desc+'&lang=fr-'+langue).then(function (response) {
                            newtab.push({
                                idpays: listeNumeros[i].idpays,
                                numero: listeNumeros[i].numero,
                                desc: response.data.text
                            })
                        })
                    }
                }
                translate().then(function(){
                    setListeNumeros(newtab);
                    setLoading(false);
                }).catch(function (errors) {
                    setNomPage('Urgences '+pays);
                    setLoading(false)
                })
            }else{
                setNomPage('Urgences '+pays);
                setLoading(false)
            }
        });
    }

    useEffect(()=>{
        getNumeros();
    },[])

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
                <Header page={nomPage}> </Header>
                {vide === true ? <p className={'msgVideUrgences'}>{msgVide}</p>:
                    <div className="emergency">
                    {jsxListeNumeros}
                </div>}
            </div>
        )
    }else{
        return(
            <div>
                <Header page={nomPage}> </Header>
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
            </div>

        )
    }


}