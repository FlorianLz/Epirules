import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {Link, Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";
import ListeQuestions from "./ListeQuestion";
import ListeQuestionsRecues from "./ListeQuestionsrecues";

export default function AjoutQuestion() {
    const [cookies] = useCookies(['pays']);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [cookiesID] = useCookies(['idpays']);
    const [pseudo,setPseudo] = useState([]);
    const [loading,setLoading] = useState(true);
    const [admin, setAdmin] = useState(false);
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
                        setPseudo(doc.data().pseudo);
                        setAdmin(true);
                    }
                }
            });
        });
        getQuestions();
    }


    function getQuestions(){
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
            })
        }
    }


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


    function poser(e) {
        e.preventDefault();
        let question = document.querySelector('input[name="question"]').value;
        let reponse = document.querySelector('textarea[name="reponse"]').value;
        //console.log(question,reponse)

        if(question === '' || reponse === ''){
            document.querySelector('p.status_ok').innerHTML = '';
            document.querySelector('p.status').innerHTML = 'Merci de remplir tous les champs.';
        } else {
            db.collection("questions").add({
                idpays: idpays,
                question: question,
                reponse: reponse,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
                .then(function(docRef) {
                    //console.log("Document written with ID: ", docRef.id);
                    document.querySelector("form[name='formquestion']").reset();
                    document.querySelector('p.status').innerHTML = '';
                    document.querySelector('p.status_ok').innerHTML = 'Question ajoutée !';

                })
                .catch(function(error) {
                    //console.log(error);
                    document.querySelector('p.status').innerHTML = 'Erreur lors de l\'ajout de la question.';
                    document.querySelector('p.status_ok').innerHTML = '';
                });

        }

    }

    function supprimer(id) {
        //console.log(id)
        db.collection("questions").doc(id).delete().then(function() {
            //console.log("Document successfully deleted!");
            setLoading(true)
            getQuestions()
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

    return (
        <div>
            <Header page={'Ajouter une nouvelle question'}> </Header>
            <Link to={'/admin'}><i id={'retour'} className="fas fa-arrow-left retour"> </i></Link>
            <div className={'question'}>
                <form onSubmit={e=>poser(e)} name={'formquestion'}>
                    <h3>Pays sélectionné : {pays}</h3>
                    <input type='text' name={'question'} placeholder={'Question...'}/>
                    <textarea name={'reponse'} placeholder={'Réponse...'}></textarea>
                    <p className="status ptop"></p>
                    <p className="status_ok ptop"></p>
                    <input type="submit" value={'Publier la question'} className={'no-margin'}/>
                </form>
                <div className="questions">
                    <div className="question">
                        <div className="questions_liste">
                            {jsxListeQuestions}
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );

}