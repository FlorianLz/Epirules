import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";
import ListeRulesCan from "./ListeRulesCan";
import ListeRulesMust from "./ListeRulesMust";
import ListeRulesMustnot from "./ListeRulesMustnot";

export default function Categorie(props) {
    const [cookies] = useCookies(['pays']);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [cookiesID] = useCookies(['idpays']);
    const [pseudo,setPseudo] = useState([]);
    const [listeRulesCan, setListeRulesCan] = useState([]);
    const [listeRulesMust, setListeRulesMust] = useState([]);
    const [listeRulesMustnot, setListeRulesMustnot] = useState([]);
    const [loading, setLoading] = useState(true);
    let jsxListeRulesCan = [];
    let jsxListeRulesMust = [];
    let jsxListeRulesMustnot = [];
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;
    let categorie = props.match.params.categorie;

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getRulesinfo(){
      if(loading===true){
          db.collection("regles").onSnapshot(function(querySnapshot) {
              let tabMust = [];
              let tabCan = [];
              let tabMustnot = [];
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                  //console.log(doc.id, " => ", doc.data());
                  if (doc.data().idpays === idpays && doc.data().namecategorie === categorie){
                      if(doc.data().type === "must"){
                          tabMust.push({
                              idpays: doc.data().idpays,
                              id: doc.id,
                              name: doc.data().name,
                              desc: doc.data().desc,
                              type: doc.data().type,
                              log: false
                          })
                      }
                      if(doc.data().type === "can"){
                          tabCan.push({
                              idpays: doc.data().idpays,
                              id: doc.id,
                              name: doc.data().name,
                              desc: doc.data().desc,
                              type: doc.data().type,
                              log: false
                          })
                      }
                      if(doc.data().type === "mustnot"){
                          tabMustnot.push({
                              idpays: doc.data().idpays,
                              id: doc.id,
                              name: doc.data().name,
                              desc: doc.data().desc,
                              type: doc.data().type,
                              log: false
                          })
                      }

                  }
              });
              setListeRulesCan(tabCan);
              setListeRulesMust(tabMust);
              setListeRulesMustnot(tabMustnot);
              setLoading(false);
          })
      }
    }

    useEffect(()=>{
        getRulesinfo();
    });

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

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    function supprimer(id) {
        //console.log(id)
        db.collection("regles").doc(id).delete().then(function() {
            //console.log("Document successfully deleted!");
        }).catch(function(error) {
            //console.error("Error removing document: ", error);
        });
    }


    if(loading === false){

        if(cookies.login){
            getVerif(cookies.login);
            for(let i =0;i<listeRulesCan.length;i++){
                jsxListeRulesCan.push(<ListeRulesCan
                    key={i}
                    idpays={listeRulesCan[i].idpays}
                    id={listeRulesCan[i].id}
                    name={listeRulesCan[i].name}
                    desc={listeRulesCan[i].desc}
                    type={listeRulesCan[i].type}
                    log={true}
                    onSuppr={e=>supprimer(listeRulesCan[i].id)}

                />)
            }

            for(let i =0;i<listeRulesMust.length;i++){
                jsxListeRulesMust.push(<ListeRulesMust
                    key={i}
                    idpays={listeRulesMust[i].idpays}
                    id={listeRulesMust[i].id}
                    name={listeRulesMust[i].name}
                    desc={listeRulesMust[i].desc}
                    type={listeRulesMust[i].type}
                    log={true}
                    onSuppr={e=>supprimer(listeRulesMust[i].id)}

                />)
            }

            for(let i =0;i<listeRulesMustnot.length;i++){
                jsxListeRulesMustnot.push(<ListeRulesMustnot
                    key={i}
                    idpays={listeRulesMustnot[i].idpays}
                    id={listeRulesMustnot[i].id}
                    name={listeRulesMustnot[i].name}
                    desc={listeRulesMustnot[i].desc}
                    type={listeRulesMustnot[i].type}
                    log={true}
                    onSuppr={e=>supprimer(listeRulesMustnot[i].id)}

                />)
            }

        }else{
            for(let i =0;i<listeRulesCan.length;i++){
                jsxListeRulesCan.push(<ListeRulesCan
                    key={i}
                    idpays={listeRulesCan[i].idpays}
                    id={listeRulesCan[i].id}
                    name={listeRulesCan[i].name}
                    desc={listeRulesCan[i].desc}
                    type={listeRulesCan[i].type}
                    log={false}

                />)
            }

            for(let i =0;i<listeRulesMust.length;i++){
                jsxListeRulesMust.push(<ListeRulesMust
                    key={i}
                    idpays={listeRulesMust[i].idpays}
                    id={listeRulesMust[i].id}
                    name={listeRulesMust[i].name}
                    desc={listeRulesMust[i].desc}
                    type={listeRulesMust[i].type}
                    log={false}

                />)
            }

            for(let i =0;i<listeRulesMustnot.length;i++){
                jsxListeRulesMustnot.push(<ListeRulesMustnot
                    key={i}
                    idpays={listeRulesMustnot[i].idpays}
                    id={listeRulesMustnot[i].id}
                    name={listeRulesMustnot[i].name}
                    desc={listeRulesMustnot[i].desc}
                    type={listeRulesMustnot[i].type}
                    log={false}

                />)
            }

        }

        return (
            <div>
                <Header page={"Catégorie : "+categorie}> </Header>
                <div className="listeRegles">
                    <div className="indicationRegle">
                        <h2 className="titleCat"> Je dois </h2>
                        <ul className="must">
                            {jsxListeRulesMust}
                        </ul>
                    </div>
                    <div className="indicationRegle">
                        <h2 className="titleCat"> Je ne dois pas </h2>
                        <ul className="mustnot">
                            {jsxListeRulesMustnot}
                        </ul>
                    </div>
                    <div className="indicationRegle">
                        <h2 className="titleCat"> Je peux </h2>
                        <ul className="can">
                            {jsxListeRulesCan}
                        </ul>
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