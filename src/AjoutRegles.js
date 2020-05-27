import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {useCookies} from 'react-cookie';
import {Link, Redirect} from "react-router-dom";
import * as firebase from "firebase";
import config from "./Config";
import ListeCategories from "./ListeCategories";
import ListePays from "./ListePays";

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

    function ajoutRegle(e){
        e.preventDefault();
        let regle = document.querySelector("input[name='regle']").value;
        let radios = document.querySelectorAll("input[name='type']");
        let type = "";
        let categorie = choisi;

        //verif pour les boutons radios
        for(let i=0; i < radios.length; i++){
            if(radios[i].checked){
                type = radios[i].value;
            }
        }

        if(regle === '' || categorie === false || type === ''){
            document.querySelector('p.status_ok').innerHTML = '';
            document.querySelector('p.status').innerHTML = 'Merci de remplir tous les champs.';
        } else {
            db.collection("regles").add({
                desc: regle,
                idpays: idpays,
                namecategorie: categorie,
                type: type
            })
                .then(function(docRef) {
                    //console.log("Document written with ID: ", docRef.id);
                    document.querySelector("form[name='formRegle']").reset();
                    document.querySelector('p.status').innerHTML = '';
                    document.querySelector('p.status_ok').innerHTML = 'Votre règle a bien été ajouté !';

                })
                .catch(function(error) {
                    console.log(error);
                    document.querySelector('p.status').innerHTML = 'Erreur lors de l\'envoi de la règle';
                    document.querySelector('p.status_ok').innerHTML = '';
                });

        }

    }

    if (loading === false){
        return (
            <div>
                <Header page={'Ajouter une règle '}> </Header>
                <Link to={'/admin'}><i id={'retour'} className="fas fa-arrow-left retour"> </i></Link>

                <div className="ajouterRegles">
                    <h3> Pays sélectionné : {pays}</h3>
                    <form onSubmit={e => ajoutRegle(e)} name={"formRegle"} id={"formRegle"}>
                        <div className="listeCategories">
                            <select id="ListeCategories" defaultValue={'choix'} onChange={e=>actualiserChoix(e)}>
                                <option value="choix" name="choix" hidden> Choisissez la catégorie </option>
                                {jsxListeCategories}
                            </select>
                        </div>
                        <div className="selectType">
                            <h3 className="titlePartie"> Sélectionner le type de règle </h3>
                            <div className="listeType">
                                <div className="unType">
                                    <input type="radio" id="must" name="type" value="must"/>
                                    <label htmlFor="type"> Je dois </label>
                                </div>
                                <div className="unType">
                                    <input type="radio" id="mustnot" name="type" value="mustnot"/>
                                    <label htmlFor="type"> Je ne dois pas </label>
                                </div>
                                <div className="unType">
                                    <input type="radio" id="can" name="type" value="can"/>
                                    <label htmlFor="type"> Je peux </label>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="titlePartie"> Écrire la règle </h3>
                            <input type="text" name="regle" placeholder="La règle..." id="desc" className="descRegle"/>
                        </div>
                        <div>
                            <p className="status"></p>
                            <p className="status_ok"></p>
                            <input type="submit" value="Valider la règle" className="validateRule"/>
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