import React, {useEffect, useState} from 'react';
import Header from "./Header";
import {Link, Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";
import ListeRulesCan from "./ListeRulesCan";
import ListeRulesMust from "./ListeRulesMust";
import ListeRulesMustnot from "./ListeRulesMustnot";
import axios from "axios";

export default function Categorie(props) {
    const [cookies] = useCookies(['pays']);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [cookiesID] = useCookies(['idpays']);
    const [pseudo,setPseudo] = useState([]);
    const [listeRulesCan, setListeRulesCan] = useState([]);
    const [listeRulesMust, setListeRulesMust] = useState([]);
    const [listeRulesMustnot, setListeRulesMustnot] = useState([]);
    const [nameCategorie, setNameCategorie] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cat, setCat] = useState('');
    const [dois, setDois] = useState('Je dois');
    const [peux, setPeux] = useState('Je peux');
    const [doisPas, setDoisPas] = useState('Je ne dois pas');
    let jsxListeRulesCan = [];
    let jsxListeRulesMust = [];
    let jsxListeRulesMustnot = [];
    let idpays=cookiesID.idpays;
    let categorie = props.match.params.categorie;
    let nameCat = "";

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    async function getName(){
        db.collection("categories").onSnapshot(function(querySnapshot)  {
            let tab = [];
            querySnapshot.forEach(function(doc) {
                if (doc.data().idpays === idpays && doc.id === categorie){
                    tab.push({
                        idpays: doc.data().idpays,
                        name: doc.data().name,
                        id: doc.id
                    })
                    nameCat=doc.data().name;
                }
            });
            setNameCategorie(tab);
        })
    }

    function getRulesinfo(){
      if(loading===true){
          db.collection("regles").onSnapshot(function(querySnapshot) {
              let tabMust = [];
              let tabCan = [];
              let tabMustnot = [];
              querySnapshot.forEach(function(doc) {
                  // doc.data() is never undefined for query doc snapshots
                  //console.log(doc.id, " => ", doc.data());
                  if (doc.data().idpays === idpays && doc.data().idcategorie === categorie){
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

              let langue=navigator.language.split('-')[0];
              let cle = 'trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8';
              let newtab = [];
              let newtab1 = [];
              let newtab2 = [];

              if(langue !== 'fr'){
                  async function translate() {
                      let states = ['Catégorie : '+nameCat,dois,peux,doisPas];

                      let set = [setCat,setDois,setPeux,setDoisPas];

                      for(let i=0; i<states.length; i++){
                          await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+states[i]+'&lang='+langue).then(function (response) {
                              set[i](response.data.text)
                          })
                      }

                      for(let i=0; i<tabMust.length; i++){
                          await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+tabMust[i].desc+'&lang='+langue).then(function (response) {
                              newtab.push({
                                  idpays: tabMust[i].idpays,
                                  id: tabMust[i].id,
                                  name: tabMust[i].name,
                                  desc: response.data.text,
                                  type: tabMust[i].type,
                                  log: false
                              })
                          })
                          await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+tabCan[i].desc+'&lang='+langue).then(function (response) {
                              newtab1.push({
                                  idpays: tabCan[i].idpays,
                                  id: tabCan[i].id,
                                  name: tabCan[i].name,
                                  desc: response.data.text,
                                  type: tabCan[i].type,
                                  log: false
                              })
                          })
                          await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+tabMustnot[i].desc+'&lang='+langue).then(function (response) {
                              newtab2.push({
                                  idpays: tabMustnot[i].idpays,
                                  id: tabMustnot[i].id,
                                  name: tabMustnot[i].name,
                                  desc: response.data.text,
                                  type: tabMustnot[i].type,
                                  log: false
                              })
                          })
                      }
                  }
                  translate().then(function(){
                      setListeRulesCan(newtab);
                      setListeRulesMust(newtab1);
                      setListeRulesMustnot(newtab2);
                      setLoading(false);
                  }).catch(function (errors) {
                      setListeRulesCan(tabCan);
                      setListeRulesMust(tabMust);
                      setListeRulesMustnot(tabMustnot);
                      setLoading(false);
                  })

              }else{
                  setListeRulesCan(tabCan);
                  setListeRulesMust(tabMust);
                  setListeRulesMustnot(tabMustnot);
                  setLoading(false);
              }
          })
      }
    }

    useEffect(()=>{
        getName().then(()=>getRulesinfo())
    },[]);

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
        nameCat = nameCategorie[0].name;

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
                <Header page={cat}> </Header>
                <Link to={'/regles'}><i id={'retour'} className="fas fa-arrow-left retour"> </i></Link>
                <div className="listeRegles">
                    <div className="indicationRegle">
                        <h2 className="titleCat"> {dois} </h2>
                        <ul className="must">
                            {jsxListeRulesMust}
                        </ul>
                    </div>
                    <div className="indicationRegle">
                        <h2 className="titleCat"> {doisPas} </h2>
                        <ul className="mustnot">
                            {jsxListeRulesMustnot}
                        </ul>
                    </div>
                    <div className="indicationRegle">
                        <h2 className="titleCat"> {peux} </h2>
                        <ul className="can">
                            {jsxListeRulesCan}
                        </ul>
                    </div>
                </div>
            </div>
        );

    }else{
        return(
            <div>
                <Header page={cat}> </Header>
                <Link to={'/regles'}><i id={'retour'} className="fas fa-arrow-left retour"> </i></Link>
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
            </div>


        )
    }

}