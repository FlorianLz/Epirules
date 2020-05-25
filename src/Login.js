import React from 'react';
import Header from "./Header";
import {Link, Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";

export default function Login() {
    const [cookies] = useCookies(['pays']);
    const [cookieLogin,setCookieLogin] = useCookies(['login']);

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    if(!cookies.pays ){
        return (
            <Redirect to='/'/>
        );
    }
    if(cookies.login ){
        return (
            <Redirect to='/admin'/>
        );
    }

    function login(e) {
        e.preventDefault();
        //On récupère le login et le mdp
        let email = document.querySelector("input[name='email']").value;
        let mdp = document.querySelector("input[name='mdp']").value;
        let ok = true;
        if(email === '' || mdp === ''){
            document.querySelector('p.status').innerHTML = 'Merci de remplir tous les champs.';
        }else{
            firebase.auth().signInWithEmailAndPassword(email, mdp).then(function (response) {
                console.log(response.user.uid)
                let uid = response.user.uid;
                setCookieLogin('login', uid, '/');
                window.location.href='/admin';
            }).catch(function(error) {
                if (error.code === '400'){
                    document.querySelector('p.status').innerHTML = 'Trop de tentatives de connexion... Réessayez plus tard.';
                    document.querySelector("input[name='mdp']").value = "";
                }else{
                    document.querySelector('p.status').innerHTML = 'Identifiant ou mdp invalide !';
                    document.querySelector("input[name='mdp']").value = "";
                }
            });
        }

    }

    return (
        <div>
            <Header page={'Connexion admin'}> </Header>
            <form className={'formlogin'} onSubmit={e=>login(e)}>
                <input type="email" name="email" placeholder={'Email...'} />
                <input type='password' name="mdp" placeholder={'Mot de passe...'}/>
                <p className="status"> </p>
                <input type="submit" value={'Se connecter'}/>
            </form>
        </div>

    );

}