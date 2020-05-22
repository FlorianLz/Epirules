import React, {useState} from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Link, Redirect} from "react-router-dom";
import * as firebase from "firebase";
import ListeRules from "./ListeRules";
import config from "./Config";
import ListeNumeros from "./ListeNumeros";

export default function Regles() {
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
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
        db.collection("regles").orderBy("desc","asc").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().idpays === idpays){
                    listeRules.push({
                        idpays: doc.data().idpays,
                        name: doc.data().name,
                        desc: doc.data().desc
                    })
                }
            });
        }).then(()=>setLoading(false));
    }

    getRules();

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }


    if(loading === false){
        for(let i =0;i<listeRules.length;i++){
            jsxListeRules.push(<ListeRules
                key={i}
                idpays={listeRules[i].idpays}
                name={listeRules[i].name}
                desc={listeRules[i].desc}

            />)
        }


        return (
            <div>
                <Header page={'Règles '+pays}> </Header>

                <div className="rules">
                    <div className="mainRules">
                        <h2 className="titlePart"> Main rules </h2>
                        {jsxListeRules}
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
                            <Link to={'/regles/'}>
                                <div className="link">
                                    <div className="title"> Travail </div>
                                </div>
                            </Link>
                            <Link to={'/regles/'}>
                                <div className="link">
                                    <div className="title"> Vie sociale </div>
                                </div>
                            </Link>
                            <Link to={'/regles/'}>
                                <div className="link">
                                    <div className="title"> Transport </div>
                                </div>
                            </Link>
                            <Link to={'/regles/'}>
                                <div className="link">
                                    <div className="title"> Santé </div>
                                </div>
                            </Link>
                            <Link to={'/regles/'}>
                                <div className="link">
                                    <div className="title"> École </div>
                                </div>
                            </Link>
                            <Link to={'/regles/'}>
                                <div className="link">
                                    <div className="title"> Magasins </div>
                                </div>
                            </Link>
                            <Link to={'/regles/'}>
                                <div className="link">
                                    <div className="title"> Infrastructure </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        );
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