import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Redirect} from "react-router-dom";
import * as firebase from "firebase";
import ListeRules from "./ListeRules";
import config from "./Config";

export default function Regles() {
    const [cookies] = useCookies(['pays']);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [cookiesID] = useCookies(['idpays']);
    const [pseudo,setPseudo] = useState([]);
    const [listeRules, setListeRules] = useState([]);
    const [loading, setLoading] = useState(true);
    let jsxListeRules = [];
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getRules(){
        if(loading ===true){
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
                setListeRules(tab);
                setLoading(false);
            })
        }
    }

    useEffect(()=>{
        getRules();
    });

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
                        setPseudo(doc.data().pseudo)
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
        console.log(id)
        db.collection("categories").doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
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

        return (
            <div>
                <Header page={'Règles '+pays}> </Header>

                <div className="rules">
                    <div className="mainRules">
                        <h2 className="titlePart"> Règles principales </h2>

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
                        <h2 className="titlePart"> Sélectionner une catégorie </h2>
                        <div className="liste">
                            <div style={{backgroundImage: "url('/images/vague-cat.png')"}}>
                                {jsxListeRules}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }else{
        return(
            <div>
                <Header page={'Règles '+pays}> </Header>

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