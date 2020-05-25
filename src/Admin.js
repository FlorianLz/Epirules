import React, {useState} from 'react';
import Header from "./Header";
import {Link, Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";

export default function Admin() {
    const [cookies] = useCookies(['pays']);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [pseudo,setPseudo] = useState([])
    let pays=cookies.pays;

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

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

    function deconnexion() {
        removeCookieLogin('login');
        window.location.href='/login';

    }

    return (
        <div>
            <Header page={'Panel admin'}> </Header>
            <div className={'admin'}>
                <div className={'infos'}>
                    <p>Bienvenue {pseudo}</p>
                    <button onClick={()=>deconnexion()}>Déconnexion</button>
                </div>
                <p>Pays : {cookies.pays}</p>
                <div className={'ajoutregle'}>
                    <Link to={'/nouvelle/regles'}><button>Ajouter une nouvelle règle</button></Link>
                </div>
                <div className={'ajoutregle'}>
                    <Link to={'/urgences/add'}><button>Ajouter numéro d'urgence</button></Link>
                </div>
                <div className={'ajoutregle'}>
                    <Link to={'/'}><button>Ajouter une question</button></Link>
                </div>
                <div className={'ajoutregle'}>
                    <Link to={'/'}><button>Voir les questions reçues</button></Link>
                </div>
            </div>
        </div>

    );

}