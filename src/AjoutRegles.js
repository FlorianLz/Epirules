import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Link, Redirect} from "react-router-dom";
import * as firebase from "firebase";
import config from "./Config";
import ListeCategories from "./ListeCategories";

export default function Regles() {
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
        db.collection("categories").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().idpays === idpays){
                    listeCategories.push({
                        id: doc.id,
                        name: doc.data().name
                    })
                }
            });
        }).then(()=>setLoading(false));
    }

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    function ajoutRegle(e){
        e.preventDefault();
    }

    function actualiserChoix(e) {
        let choix = e.target.options[e.target.selectedIndex].value;
        setChoisi(choix);
         console.log(choix);
    }

    useEffect(()=>{
        getCategories();
    },[])

    if (loading === false){
        for(let i =0;i<listeCategories.length;i++){
            jsxListeCategories.push(<ListeCategories
                key={i}
                id={listeCategories[i].id}
                name={listeCategories[i].name}
            />)
        }

        return (
            <div>
                <Header page={'Ajouter une règle '}> </Header>
                <div className="ajouterRegle">
                    <p> Pays sélectionné : {pays}</p>
                    <form onSubmit={e => ajoutRegle(e)} id={"formRegle"}>
                        <select id="ListeCategories" defaultValue={'choix'} onChange={e=>actualiserChoix(e)}>
                            <option value="choix" hidden>Choisissez la catégorie </option>
                            {jsxListeCategories}
                        </select>
                        <div className="selectType">
                            <h3> Sélectionner le type de règle </h3>
                            <input type="radio" id="must" name="type" value="must" checked/>
                            <label htmlFor="type"> Je dois </label>
                            <input type="radio" id="mustnot" name="type" value="mustnot"/>
                            <label htmlFor="type"> Je ne dois pas </label>
                            <input type="radio" id="can" name="type" value="can"/>
                            <label htmlFor="type"> Je peux </label>
                        </div>
                        <div>
                            <h3> Écrire la règle </h3>
                            <input type="text" placeholder="La règle..." id="desc"/>
                        </div>
                        <div>
                            <input type="submit" value="Valider la règle"/>
                        </div>

                    </form>

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