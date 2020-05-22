import React, {useState} from 'react';
import Header from "./Header";
import {Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";

export default function Faq() {
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
    const [listeQuestions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getQuestions(){
        db.collection("questions").orderBy("ordre","asc").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().idpays === idpays){
                    listeQuestions.push({
                        idpays: doc.data().idpays,
                        question: doc.data().question,
                    })
                }
            });
        }).then(()=>setLoading(false));
    }

    getQuestions();

    if(loading === false){
        console.log(listeQuestions)
    }

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }
    return (
        <div>
            <Header page={'FAQ'}> </Header>
        </div>

    );

}