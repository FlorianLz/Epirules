import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Redirect} from "react-router-dom";
import * as firebase from "firebase";
import ListeRules from "./ListeRules";
import config from "./Config";
import axios from "axios";

export default function Regles() {
    const [cookies] = useCookies(['pays']);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [cookiesID] = useCookies(['idpays']);
    const [pseudo,setPseudo] = useState([]);
    const [listeRules, setListeRules] = useState([]);
    const [nomPage, setNomPage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadRules, setLoadRules] = useState(true);
    const [principales, setPrincipales] = useState('Règles principales');
    const [laverMains,setLaverMains] = useState('Se laver très régulièrement les mains');
    const [tousser,setTousser] = useState('Tousser ou éternuer dans son coude ou dans un mouchoir');
    const [mouchoir,setMouchoir] = useState('Utiliser un mouchoir à usage unique et le jeter');
    const [saluer,setSaluer] = useState('Saluer sans se serrer la main, éviter les embrassades');
    const [categorie,setCategorie] = useState('Sélectionner une catégorie');
    const [vide,setVide] = useState(false);

    let jsxListeRules = [];
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getRules(){
        if(loading ===true){
            let langue=navigator.language.split('-')[0];
            let cle = 'trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8';
            db.collection("categories").orderBy("name","asc").onSnapshot(function(querySnapshot)  {
                let tab = [];
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    if (doc.data().idpays === idpays){
                        tab.push({
                            idpays: doc.data().idpays,
                            name: doc.data().name,
                            id: doc.id,
                            log: false
                        })
                    }
                });
                if(tab.length === 0){
                    setVide(true)
                }
                let newtab = [];
                if (langue !== 'fr'){
                    async function translate() {
                        let states = ['Règles '+pays,principales,laverMains,tousser,mouchoir,saluer,categorie];
                        let set = [setNomPage,setPrincipales,setLaverMains,setTousser,setMouchoir,setSaluer,setCategorie];

                        for(let i=0; i<states.length; i++){
                            await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+states[i]+'&lang='+langue).then(function (response) {
                                set[i](response.data.text)
                            })
                        }
                        setLoadRules(false)

                        for(let i=0; i<tab.length; i++){
                            await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+tab[i].name+'&lang='+langue).then(function (response) {
                                newtab.push({
                                    idpays: tab[i].idpays,
                                    name: response.data.text,
                                    id: tab[i].id,
                                    log: tab[i].log
                                })
                            })
                        }
                    }
                    translate().then(function(){
                        setListeRules(newtab);
                        setLoading(false);
                    }).catch(function (errors) {
                        setListeRules(tab);
                        setNomPage('Règles '+pays)
                        setLoading(false);
                    })
                }else{
                    setListeRules(tab);
                    setLoadRules(false)
                    setNomPage('Règles '+pays)
                    setLoading(false);
                }
            })
        }
    }

    useEffect(()=>{
        getRules();
    },[]);

    function getVerif(uid) {
        db.collection("users").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().id === uid ){
                    let data = doc.data();
                    if (data.admin !== true){
                        removeCookieLogin('login');
                        window.location.href='/login';
                    }else{
                        setPseudo(doc.data().pseudo);
                    }
                }
            });
        });
    }

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    function supprimer(id) {
        //console.log(id);
        db.collection("categories").doc(id).delete().then(function() {
            //console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }


    if(loading === false){
        if(cookies.login){
            getVerif(cookies.login);
            for(let i =0;i<listeRules.length;i++){
                jsxListeRules.push(<ListeRules
                    key={i}
                    idpays={listeRules[i].idpays}
                    name={listeRules[i].name}
                    id={listeRules[i].id}
                    log={true}
                    onSuppr={e=>supprimer(listeRules[i].id)}

                />)
            }
        } else {
            for(let i =0;i<listeRules.length;i++){
                jsxListeRules.push(<ListeRules
                    key={i}
                    idpays={listeRules[i].idpays}
                    name={listeRules[i].name}
                    id={listeRules[i].id}
                    log={false}

                />)
            }

        }
    }
    if(loading === true && loadRules === true){
        return (
            <div>
                <Header page={nomPage}> </Header>
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
        );
    }

    if(loading === true && loadRules === false){
        return (
            <div>
                <Header page={nomPage}> </Header>

                <div className="rules">
                    {
                        loadRules === false ?
                            <div className="mainRules">
                                <h2 className="titlePart"> {principales} </h2>

                                <div className="liste">
                                    <div className="onerule">
                                        <img src={'/images/main.png'} alt={'Fermer le menu'}/>
                                        <p> {laverMains} </p>
                                    </div>
                                    <div className="onerule">
                                        <img src={'/images/moucher.png'} alt={'Fermer le menu'}/>
                                        <p> {tousser} </p>
                                    </div>
                                    <div className="onerule">
                                        <img src={'/images/mouchoir.png'} alt={'Fermer le menu'}/>
                                        <p> {mouchoir} </p>
                                    </div>
                                    <div className="onerule">
                                        <img src={'/images/serrermains.png'} alt={'Fermer le menu'}/>
                                        <p> {saluer} </p>
                                    </div>
                                </div>
                            </div>
                            :
                            ''

                    }
                    {loading === false && loadRules === false ?
                        <div>
                            <div className="categories">
                                <h2 className="titlePart"> {categorie} </h2>
                                <div className="liste">
                                    <div style={{backgroundImage: "url('/images/vague-cat.png')"}}>
                                        {jsxListeRules}
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="lds-roller t-75">
                            <div> </div>
                            <div> </div>
                            <div> </div>
                            <div> </div>
                            <div> </div>
                            <div> </div>
                            <div> </div>
                            <div> </div>
                        </div>}
                </div>
            </div>
        );
    }else{
        return (
            <div>
                <Header page={nomPage}> </Header>

                <div className="rules">
                    <div className="mainRules">
                        <h2 className="titlePart"> {principales} </h2>

                        <div className="liste">
                            <div className="onerule">
                                <img src={'/images/main.png'} alt={'Fermer le menu'}/>
                                <p> {laverMains} </p>
                            </div>
                            <div className="onerule">
                                <img src={'/images/moucher.png'} alt={'Fermer le menu'}/>
                                <p> {tousser} </p>
                            </div>
                            <div className="onerule">
                                <img src={'/images/mouchoir.png'} alt={'Fermer le menu'}/>
                                <p> {mouchoir} </p>
                            </div>
                            <div className="onerule">
                                <img src={'/images/serrermains.png'} alt={'Fermer le menu'}/>
                                <p> {saluer} </p>
                            </div>
                        </div>
                    </div>
                    {vide === true ?
                    '' :
                        <div className="categories">
                            <h2 className="titlePart"> {categorie} </h2>
                            <div className="liste">
                                <div style={{backgroundImage: "url('/images/vague-cat.png')"}}>
                                    {jsxListeRules}
                                </div>
                            </div>
                        </div>}
                </div>
            </div>
        );
    }

}