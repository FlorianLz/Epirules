import React, {useEffect, useState} from 'react';
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
    const [listeNumeros,setListeNumeros] = useState([]);
    let idpays=cookiesID.idpays;
    let jsxListeNumeros = [];

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

    function addNumero(e) {
        e.preventDefault();
        //On récupère les différents champs
        let numero = document.querySelector("input[name='numero']").value;
        let desc = document.querySelector("input[name='desc']").value;
        if(numero === '' || desc === ''){
            document.querySelector('p.status_ok').innerHTML = '';
            document.querySelector('p.status').innerHTML = 'Merci de remplir tous les champs.';
        }else{
            if(numero.substr(0,1) == 0){
                db.collection("numeros").add({
                    desc: desc,
                    idpays: idpays,
                    numero: parseInt(numero),
                    zero: true
                }).then(function(docRef) {
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
            }else{
                db.collection("numeros").add({
                    desc: desc,
                    idpays: idpays,
                    numero: parseInt(numero)
                }).then(function(docRef) {
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

    }

    function getNumeros(){
        if(loading === true){
            db.collection("numeros").orderBy("numero","asc").onSnapshot(function(querySnapshot) {
                let tab=[];
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    if (doc.data().idpays === idpays){
                        if(doc.data().zero){
                            tab.push({
                                idpays: doc.data().idpays,
                                numero: '0'+doc.data().numero,
                                desc: doc.data().desc,
                                suppr: doc.id
                            })
                        }else{
                            tab.push({
                                idpays: doc.data().idpays,
                                numero: doc.data().numero,
                                desc: doc.data().desc,
                                suppr: doc.id
                            })
                        }
                    }
                });
                setListeNumeros(tab)
                setLoading(false)
            })
        }
    }
    useEffect(()=>{
        getNumeros();
    });

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

    function supprimer(id) {
        //console.log(id)
        db.collection("numeros").doc(id).delete().then(function() {
            //console.log("Document successfully deleted!");
        }).catch(function(error) {
            //console.error("Error removing document: ", error);
        });
    }

    for(let i =0;i<listeNumeros.length;i++){
        //console.log(listeNumeros[i].suppr)
        jsxListeNumeros.push(<ListeNumeros
            key={i}
            idpays={listeNumeros[i].idpays}
            numero={listeNumeros[i].numero}
            desc={listeNumeros[i].desc}
            suppr={listeNumeros[i].suppr}
            onSuppr={e=>supprimer(listeNumeros[i].suppr)}

        />)
    }

    return (
        <div>
            <Header page={'Panel admin'}> </Header>
            <Link to={'/admin'}><i id={'retour'} className="fas fa-arrow-left retour"> </i></Link>
            <form className={'formnumero'} name={'formnumero'} onSubmit={e=>addNumero(e)}>
                <input type="number" name="numero" placeholder={'Numéro...'} />
                <input type='text' name="desc" placeholder={'Description...'}/>
                <p className="status"> </p>
                <p className="status_ok"> </p>
                <input type="submit" value={'Ajouter le numéro'}/>
            </form>
            <div className={"addurgences"}>
                {jsxListeNumeros}
            </div>
        </div>

    );

}