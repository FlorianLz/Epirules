import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {Link, Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";
import axios from "axios";

export default function Question() {
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
    const [loading, setLoading] = useState(true);
    const [nomPage, setNomPage] = useState('');
    const [prenom, setPrenom] = useState('Prénom');
    const [nom, setNom] = useState('Nom');
    const [email, setEmail] = useState('Email');
    const [question, setQuestion] = useState('Question');
    const [txt, setTxt] = useState('Nous vous enverrons un email lorsque nous aurons répondus à votre question. Si vous ne recevez aucune réponse d\'ici 3 semaines, cela signifie que la question à déjà été posée sur la page');
    const [maQuestion, setMaQuestion] = useState('Poser ma question');
    const [faq, setFaq] = useState('FAQ');
    let idpays=cookiesID.idpays;

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    async function translate() {
        let langue=navigator.language.split('-')[0];
        let cle = 'trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8';
        if(langue !== 'fr'){
            let states = ['Poser une question',prenom,nom,email,question,txt,maQuestion,faq];
            let set = [setNomPage,setPrenom,setNom,setEmail,setQuestion,setTxt,setMaQuestion,setFaq];

            for(let i=0; i<states.length; i++){
                await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+states[i]+'&lang=fr-'+langue).then(function (response) {
                    set[i](response.data.text)
                })
            }
        }else{
            setNomPage('Poser une question')
        }
    }

    useEffect(()=>{
        translate().then(function () {
            setLoading(false)
        }).catch(function (errors) {
            setNomPage('Poser une question')
        });
    },[])


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
                idpays: idpays,
                traite: false,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
            <Header page={nomPage}> </Header>
            <Link to={'/faq'}><i id={'retour'} className="fas fa-arrow-left retour"> </i></Link>
            {loading === false ?
                <div className={'question'}>
                    <form onSubmit={e=>poser(e)} name={'formquestion'}>
                        <div className="ligne1">
                            <input type="text" name={'prenom'} placeholder={prenom+'...'} />
                            <input type="text" name={'nom'} placeholder={nom+'...'} />
                        </div>
                        <input type='email' name={'email'} placeholder={email+'...'}/>
                        <textarea name={'question'} placeholder={question+'...'}></textarea>
                        <div className="infos">
                            <p>{txt} <Link to={'/faq'}>{faq}</Link>.</p>
                        </div>
                        <p className="status"></p>
                        <p className="status_ok"></p>
                        <input type="submit" value={maQuestion}/>
                    </form>
                </div>
            :
                <div className="lds-roller">
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

    );

}