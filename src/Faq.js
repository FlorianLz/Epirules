import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {Redirect, Link} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";
import ListeQuestions from "./ListeQuestion";
import ListeCategories from "./ListeCategories";
import axios from "axios";

export default function Faq() {
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
    const [listeQuestions, setListeQuestions] = useState([]);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [loading, setLoading] = useState(true);
    const [noReaload, setNoReload] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [nomPage, setNomPage] = useState('');
    const [txtRecherche, setTxtRecherche] = useState('Rechercher');
    const [poser, setPoser] = useState('Poser une question');


    let pays=cookies.pays;
    let idpays=cookiesID.idpays;
    let jsxListeQuestions=[];

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getQuestions(){
        let langue=navigator.language.split('-')[0];
        let cle = 'trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8';
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
                            id: doc.id,
                            admin: admin
                        })
                    }
                });
                let newtab = [];
                if(langue !== 'fr'){
                    async function translate() {
                        let states = [txtRecherche,poser,'FAQ'];
                        let set = [setTxtRecherche,setPoser,setNomPage];

                        for(let i=0; i<states.length; i++){
                            await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+states[i]+'&lang='+langue).then(function (response) {
                                set[i](response.data.text)
                            })
                        }

                        for(let i=0; i<tab.length; i++){

                            let [u1, u2] = await Promise.all([
                                axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+tab[i].question+'&lang=fr-'+langue),
                                axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+tab[i].reponse+'&lang=fr-'+langue)
                            ])
                            newtab.push({
                                idpays: tab[i].idpays,
                                question: u1.data.text,
                                reponse: u2.data.text,
                                id: tab[i].id,
                                admin: admin
                            })
                        }
                    }
                    translate().then(function(){
                        setListeQuestions(newtab);
                        setLoading(false);
                        console.log(newtab)
                    }).catch(function (errors) {
                        setNomPage('FAQ');
                        setLoading(false)
                    })
                }else{
                    setListeQuestions(tab);
                    setLoading(false);
                }
            })
        }
    }

    function getQuestionsAdmin(){
        if (loading === true){
            db.collection("questions").orderBy("timestamp","desc").get().then(function(querySnapshot) {
                let tab=[];
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    if (doc.data().idpays === idpays){
                        tab.push({
                            idpays: doc.data().idpays,
                            question: doc.data().question,
                            reponse: doc.data().reponse,
                            id: doc.id,
                            admin: admin
                        })
                    }
                });
                setListeQuestions(tab);
                setLoading(false);
                setNoReload(true)
            })
        }
    }

    function toggleRep(id){
        let reponses=document.getElementsByClassName('reponse');
        [].forEach.call(reponses,function (elmt) {
            if (elmt.id !== 'r-'+id){
                elmt.classList.remove('visible')
            }
        });
        let reponse=document.getElementById('r-'+id);
        reponse.classList.toggle('visible');
    }

    function supprimer(id) {
        //console.log(id)
        db.collection("questions").doc(id).delete().then(function() {
            //console.log("Document successfully deleted!");
            setLoading(true)
            getQuestionsAdmin()
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    for(let i =0;i<listeQuestions.length;i++){
        jsxListeQuestions.push(<ListeQuestions
            key={i}
            idpays={listeQuestions[i].idpays}
            question={listeQuestions[i].question}
            reponse={listeQuestions[i].reponse}
            clic={e=>toggleRep(e)}
            id={listeQuestions[i].id}
            admin={listeQuestions[i].admin}
            onSuppr={e=>supprimer(listeQuestions[i].id)}

        />)
    }

    if(loading === false){
        if(admin === true){
            let questions = document.querySelectorAll('.majquestion');
            let reponses = document.querySelectorAll('.majreponses');
            [].forEach.call(questions, function(question) {
                question.addEventListener('input',function (e) {
                    let iddoc  = e.target.getAttribute('data-id');
                    let newquestion = document.querySelector('.q-'+iddoc).innerText;
                    db.collection("questions").doc(iddoc).update({
                        question: newquestion
                    })


                })
            });

            [].forEach.call(reponses, function(reponse) {
                reponse.addEventListener('input',function (e) {
                    let iddoc  = e.target.getAttribute('data-id');
                    let newreponse = document.querySelector('.r-'+iddoc).innerText;
                    db.collection("questions").doc(iddoc).update({
                        reponse: newreponse
                    })


                })
            });


        }
    }

    //On vérifie que la personne connectée est bien admin dans la bdd
    function getVerif(uid) {
        db.collection("users").get().then(function(querySnapshot) {
            let autorisation = false;
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().id === uid ){
                    let data = doc.data();
                    if (data.admin === true){
                        setAdmin(true);
                        autorisation = true;
                    }
                }
            });
            if (autorisation === true){
                getQuestionsAdmin()
            }else{
                getQuestions()
            }
        });
    }

    useEffect(()=>{
        getVerif(cookies.login);
    },[])

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    function recherche(e) {
        //console.log(e.target.value)
        let recherche  = e.target.value;
        if(admin === true){
            db.collection("questions").orderBy('question').startAt(recherche).endAt(recherche+'\uf8ff').get().then(function(querySnapshot) {
                let tab=[];
                //console.log(querySnapshot.docs)
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    //console.log(doc.data())
                    if (doc.data().idpays === idpays){
                        tab.push({
                            idpays: doc.data().idpays,
                            question: doc.data().question,
                            reponse: doc.data().reponse,
                            id: doc.id,
                            admin: admin
                        })
                    }
                });
                setListeQuestions(tab);
                setLoading(false);
                setNoReload(true)
            })
        }
    }

    return (
        <div>
            <Header page={nomPage}> </Header>
            <div className="questions">
                {
                    loading === false ?
                        <div className="recherche">
                            <input type="search" placeholder={txtRecherche+'...'} onKeyUp={e=>recherche(e)}/>
                        </div>
                    : ''
                }
                {loading === false ?
                    <div className="demande">
                        <Link to={'/faq/demande'}><button>{poser}</button></Link>
                        {admin ? <Link to={'/faq/ajout'} className={'ajoutadmin'}><button>Ajouter une question</button></Link> : ''}
                    </div>
                : ''}
                <div className="questions_liste">
                    { //Check if message failed
                        (noReaload === false)
                            ? (loading === false)
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
                            : <div>{jsxListeQuestions}</div>
                    }
                </div>

            </div>
        </div>

    );

}