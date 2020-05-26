import React, {useState} from 'react';
import Header from "./Header";
import {Redirect, Link} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";
import ListeRules from "./ListeRules";
import ListeQuestions from "./ListeQuestion";

export default function Faq() {
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
    const [listeQuestions, setListeQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;
    let jsxListeQuestions=[];

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getQuestions(){
        if (loading === true){
            db.collection("questions").orderBy("timestamp","desc").onSnapshot(function(querySnapshot) {
                let tab=[];
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    if (doc.data().idpays === idpays){
                        tab.push({
                            idpays: doc.data().idpays,
                            question: doc.data().question,
                            reponse: doc.data().reponse,
                            id: doc.id
                        })
                    }
                });
                setListeQuestions(tab)
                setLoading(false)
            })
        }
    }

    getQuestions();

    function toggleRep(id){
        let reponses=document.getElementsByClassName('reponse');
        [].forEach.call(reponses,function (elmt) {
            if (elmt.id !== 'r-'+id){
                elmt.classList.remove('visible')
            }
        })
        let reponse=document.getElementById('r-'+id);
        reponse.classList.toggle('visible');
    }

    for(let i =0;i<listeQuestions.length;i++){
        jsxListeQuestions.push(<ListeQuestions
            key={i}
            idpays={listeQuestions[i].idpays}
            question={listeQuestions[i].question}
            reponse={listeQuestions[i].reponse}
            clic={e=>toggleRep(e)}
            id={listeQuestions[i].id}

        />)
    }

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }
    return (
        <div>
            <Header page={'FAQ'}> </Header>
            <div className="questions">
                <div className="recherche">
                    <input type="text" placeholder={'Recherche...'} />
                </div>
                <div className="demande">
                    <Link to={'/faq/demande'}><button>Poser une question</button></Link>
                </div>
                <div className="questions_liste">
                    { //Check if message failed
                        (loading === false)
                            ? <div>{jsxListeQuestions}</div>
                            : <div className="lds-roller">
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

            </div>
        </div>

    );

}