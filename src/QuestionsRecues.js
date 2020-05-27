import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {Link, Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";
import ListeNumeros from "./ListeNumeros";
import ListeQuestions from "./ListeQuestion";
import ListeQuestionsRecues from "./ListeQuestionsrecues";

export default function QuestionsRecues() {
    const [cookies] = useCookies(['pays']);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [cookiesID] = useCookies(['idpays']);
    const [pseudo,setPseudo] = useState([]);
    const [loading,setLoading] = useState(true);
    const [listeQuestions,setListeQuestions] = useState([]);
    let pays=cookies.pays;
    let idpays=cookies.idpays;
    let jsxListeQuestions = [];

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    //On vérifie que la personne connectée est bien admin dans la bdd
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


    function getQuestions(){
        if(loading === true){
            db.collection("demandes").where("traite",'==',false).where("idpays",'==',idpays).onSnapshot(function(querySnapshot) {
                let tab=[];
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    if (doc.data().idpays === idpays){
                        tab.push({
                            idpays: doc.data().idpays,
                            nom: doc.data().nom,
                            prenom: doc.data().prenom,
                            email: doc.data().email,
                            question: doc.data().question,
                            id: doc.id
                        })
                    }
                });
                setListeQuestions(tab)
                setLoading(false)
                //console.log(tab)
            })
        }
    }
    useEffect(()=>{
        getQuestions();
    })

    if(!cookies.pays ){
        return (
            <Redirect to='/'/>
        );
    }
    if(cookies.login){
        getVerif(cookies.login);
    }else{
        return (
            <Redirect to='/login'/>
        );
    }

    function toggleForm(id) {
        let reponses=document.getElementsByClassName('reponse');
        [].forEach.call(reponses,function (elmt) {
            if (elmt.id !== 'r-'+id){
                elmt.classList.remove('visible')
            }
        })
        let reponse=document.getElementById('r-'+id);
        reponse.classList.toggle('visible');
    }

    function poster(e,id) {
        e.preventDefault();
        //On récupère les différents champs
        let question = document.querySelector("input[name='question-"+id+"']").value;
        let reponse = document.querySelector("textarea[name='reponse-"+id+"']").value;
        let iddocument = document.querySelector("input[name='document-"+id+"']").value;
        let emailDemande = document.querySelector("input[name='email-"+id+"']").value;
        let prenomDemande = document.querySelector("input[name='prenom-"+id+"']").value;
        let nomDemande = document.querySelector("input[name='nom-"+id+"']").value;

        if(question !== '' && reponse !== ''){
            db.collection("questions").add({
                idpays: idpays,
                question: question,
                reponse: reponse,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                emailDemande: emailDemande,
                prenomDemande: prenomDemande,
                nomDemande: nomDemande
            })
                .then(function(docRef) {
                    //console.log("Document written with ID: ", docRef.id);
                    ///document.querySelector("form[name='formquestion']").reset();
                    //document.querySelector('p.status').innerHTML = '';
                    //document.querySelector('p.status_ok').innerHTML = 'Votre question a bien été envoyée !';
                    let reponse=document.getElementById('r-'+iddocument);
                    //console.log(iddocument)
                    reponse.classList.remove('visible');
                    db.collection("demandes").doc(iddocument).update({
                        traite: true
                    })
                        .then(function() {
                            //console.log("Terminé");
                        })
                        .catch(function(error) {
                            // The document probably doesn't exist.
                            console.error("Error updating document: ", error);
                        });

                })
                .catch(function(error) {
                    //document.querySelector('p.status').innerHTML = 'Erreur lors de l\'envoi de la question';
                    //document.querySelector('p.status_ok').innerHTML = '';
                    //console.log(error)
                });
        }

    }

    for(let i =0;i<listeQuestions.length;i++){
        jsxListeQuestions.push(<ListeQuestionsRecues
            key={i}
            idpays={listeQuestions[i].idpays}
            nom={listeQuestions[i].nom}
            prenom={listeQuestions[i].prenom}
            email={listeQuestions[i].email}
            question={listeQuestions[i].question}
            clic={e=>toggleForm(e)}
            poster={e=>poster(e,listeQuestions[i].id)}
            id={listeQuestions[i].id}
        />)
    }

    return (
        <div>
            <Header page={'Questions reçues'}> </Header>
            <Link to={'/admin'}><i id={'retour'} className="fas fa-arrow-left retour"> </i></Link>
            <div className="questions">
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