import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Link, Redirect} from "react-router-dom";
import * as firebase from "firebase";
import config from "./Config";
import ListeCategories from "./ListeCategoriesAdd";
import ListePays from "./ListePays";

export default function AjoutCategorie() {
    const [loading, setLoading] = useState(true);
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
    const [choisi, setChoisi] = useState(false);
    const [listeCategories, setListeCategories] = useState([]);
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;
    let jsxListeCategories=[];

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getCategories(){
        //console.log(navigator.language);
        if(loading===true){
            db.collection("categories").onSnapshot(function(querySnapshot) {
                let tab=[];
                querySnapshot.forEach(function(doc) {
                    if(doc.data().idpays === idpays){
                        tab.push({
                            id: doc.id,
                            name: doc.data().name,
                        })
                    }
                });

                setLoading(false); //On indique que le chargement est terminé
                setListeCategories(tab);
            })
        }
    }


    for(let i =0;i<listeCategories.length;i++){
        jsxListeCategories.push(<ListeCategories
            key={i}
            id={listeCategories[i].id}
            name={listeCategories[i].name}
        />)
    }

    function actualiserChoix(e) {
        let choix = e.target.options[e.target.selectedIndex].value;
        setChoisi(choix);
    }

    useEffect(()=>{
        getCategories();
    })

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    function addCategorie(e){
        e.preventDefault();
        let name = document.querySelector("input[name='categorie']").value;

        if(name === ''){
            document.querySelector('p.status_ok').innerHTML = '';
            document.querySelector('p.status').innerHTML = 'Merci de remplir tous les champs.';
        } else {
            db.collection("categories").add({
                idorder: "12",
                idpays: idpays,
                name: name
            })
                .then(function(docRef) {
                    //console.log("Document written with ID: ", docRef.id);
                    document.querySelector("form[name='formCategorie']").reset();
                    document.querySelector('p.status').innerHTML = '';
                    document.querySelector('p.status_ok').innerHTML = 'Votre catégorie a bien été ajouté !';

                })
                .catch(function(error) {
                    console.log(error);
                    document.querySelector('p.status').innerHTML = 'Erreur lors de l\'envoi de la catégorie';
                    document.querySelector('p.status_ok').innerHTML = '';
                });

        }

    }

    if (loading === false){
        return (
            <div>
                <Header page={'Ajouter une règle '}> </Header>
                <div className="ajouterCategorie">
                    <h3> Pays sélectionné : {pays}</h3>
                    <form onSubmit={e => addCategorie(e)} name={"formCategorie"} id={"formCategorie"}>
                        <div className="newCategorie">
                            <h3> Écrire la catégorie </h3>
                            <input type="text" name="categorie" placeholder="La catégorie..." id="desc" className="descRegle"/>
                        </div>
                        <div>
                            <p className="status"></p>
                            <p className="status_ok"></p>
                            <input type="submit" value="Valider" className="validateCategorie"/>
                        </div>
                    </form>

                    <div className="listeCategories">
                        <h3> Liste des catégories </h3>
                            {jsxListeCategories}
                    </div>

                </div>

            </div>

        );
    }else{
        return(
            <div className={"content"}>
                <div className="lds-roller">
                    <div> </div>
                    <div> </div>
                    <div> </div>
                    <div> </div>
                    <div> </div>
                    <div> </div>
                    <div> </div>
                    <div> </div>
                </div>
            </div>
        )
    }

}