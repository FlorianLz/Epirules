import React, {useState} from 'react';
import Header from "./Header";
import {Link, Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";
import ListeNumeros from "./ListeNumeros";

export default function AddUrgences() {
    const [cookies] = useCookies(['pays']);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [cookiesID] = useCookies(['idpays']);
    const [pseudo,setPseudo] = useState([]);
    const [loading,setLoading] = useState(true);
    const [listeNumeros] = useState([]);
    let pays=cookies.pays;
    let idpays=cookies.idpays;
    let jsxListeNumeros = [];

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

    function addNumero(e) {
        e.preventDefault();
        //On récupère les différents champs
        let numero = document.querySelector("input[name='numero']").value;
        let desc = document.querySelector("input[name='desc']").value;
        if(numero === '' || desc === ''){
            document.querySelector('p.status_ok').innerHTML = '';
            document.querySelector('p.status').innerHTML = 'Merci de remplir tous les champs.';
        }else{

            db.collection("numeros").add({
                desc: desc,
                idpays: idpays,
                numero: parseInt(numero)
            })
                .then(function(docRef) {
                    //console.log("Document written with ID: ", docRef.id);
                    document.querySelector("form[name='formnumero']").reset();
                    document.querySelector('p.status').innerHTML = '';
                    document.querySelector('p.status_ok').innerHTML = 'Numéro ajouté !';

                })
                .catch(function(error) {
                    console.log(error)
                    document.querySelector('p.status').innerHTML = 'Erreur lors de l\'ajout du numéro !';
                    document.querySelector('p.status_ok').innerHTML = '';
                });
        }

    }

    function getNumeros(){
        db.collection("numeros").orderBy("numero","asc").onSnapshot(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().idpays === idpays){
                    listeNumeros.push({
                        idpays: doc.data().idpays,
                        numero: doc.data().numero,
                        desc: doc.data().desc
                    })
                }
            });
            setLoading(false)
        })
    }

    getNumeros();

    if(loading === false){
        for(let i =0;i<listeNumeros.length;i++){
            jsxListeNumeros.push(<ListeNumeros
                key={i}
                idpays={listeNumeros[i].idpays}
                numero={listeNumeros[i].numero}
                desc={listeNumeros[i].desc}

            />)
        }
    }

    return (
        <div>
            <Header page={'Panel admin'}> </Header>
            <form className={'formnumero'} name={'formnumero'} onSubmit={e=>addNumero(e)}>
                <input type="number" name="numero" placeholder={'Numéro...'} />
                <input type='text' name="desc" placeholder={'Description...'}/>
                <p className="status"> </p>
                <p className="status_ok"> </p>
                <input type="submit" value={'Se connecter'}/>
            </form>
            {jsxListeNumeros}
        </div>

    );

}