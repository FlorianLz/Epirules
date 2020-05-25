import React, {useState} from 'react';
import Header from "./Header";
import {Link, Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";

export default function Question() {
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
    const [listeQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();


    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    function poser(e) {
        e.preventDefault();
        //On récupère les différents champs
        let nom = document.querySelector("input[name='nom']").value;
        let prenom = document.querySelector("input[name='prenom']").value;
        let email = document.querySelector("input[name='email']").value;
        let question = document.querySelector("textarea[name='question']").value;
        if(nom === '' || prenom === '' || email === '' || question === ''){
            document.querySelector('p.status_ok').innerHTML = '';
            document.querySelector('p.status').innerHTML = 'Merci de remplir tous les champs.';
        }else{
            db.collection("demandes").add({
                nom: nom,
                prenom: prenom,
                email: email,
                question: question,
                traite: false
            })
                .then(function(docRef) {
                    //console.log("Document written with ID: ", docRef.id);
                    document.querySelector("form[name='formquestion']").reset();
                    document.querySelector('p.status').innerHTML = '';
                    document.querySelector('p.status_ok').innerHTML = 'Votre question a bien été envoyée !';

                })
                .catch(function(error) {
                    document.querySelector('p.status').innerHTML = 'Erreur lors de l\'envoi de la question';
                    document.querySelector('p.status_ok').innerHTML = '';
                });
        }

    }

    return (
        <div>
            <Header page={'Poser une question'}> </Header>
            <Link to={'/faq'}><i id={'retour'} className="fas fa-arrow-left retour"> </i></Link>
            <div className={'question'}>
                <form onSubmit={e=>poser(e)} name={'formquestion'}>
                    <div className="ligne1">
                        <input type="text" name={'prenom'} placeholder={'Prénom...'} />
                        <input type="text" name={'nom'} placeholder={'Nom...'} />
                    </div>
                    <input type='email' name={'email'} placeholder={'Email...'}/>
                    <textarea name={'question'} placeholder={'Question...'}></textarea>
                    <div className="infos">
                        <p>Nous vous enverrons un email lorsque nous aurons répondus à votre question. Si vous ne recevez aucune réponse d'ici 3 semaines, cela signifie que la question à déjà été posée sur la page <Link to={'/faq'}>FAQ</Link>.</p>
                    </div>
                    <p className="status"></p>
                    <p className="status_ok"></p>
                    <input type="submit" value={'Poser ma question'}/>
                </form>
            </div>
        </div>

    );

}