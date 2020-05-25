import React, {useState} from 'react';
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
    const [cookiesID] = useCookies(['idpays']);
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
    console.log(categorie);

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getRulesinfo(){
        db.collection("regles").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().idpays === idpays && doc.data().namecategorie === categorie){
                    if(doc.data().type === "must"){
                        listeRulesMust.push({
                            idpays: doc.data().idpays,
                            name: doc.data().name,
                            desc: doc.data().desc,
                            type: doc.data().type
                        })
                    }
                    if(doc.data().type === "can"){
                        listeRulesCan.push({
                            idpays: doc.data().idpays,
                            name: doc.data().name,
                            desc: doc.data().desc,
                            type: doc.data().type
                        })
                    }
                    if(doc.data().type === "mustnot"){
                        listeRulesMustnot.push({
                            idpays: doc.data().idpays,
                            name: doc.data().name,
                            desc: doc.data().desc,
                            type: doc.data().type
                        })
                    }

                }
            });
        }).then(()=>setLoading(false));
    }

    getRulesinfo();

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }


    if(loading === false){
        for(let i =0;i<listeRulesCan.length;i++){
            jsxListeRulesCan.push(<ListeRulesCan
                key={i}
                idpays={listeRulesCan[i].idpays}
                name={listeRulesCan[i].name}
                desc={listeRulesCan[i].desc}
                type={listeRulesCan[i].type}

            />)
        }

        for(let i =0;i<listeRulesMust.length;i++){
            jsxListeRulesMust.push(<ListeRulesMust
                key={i}
                idpays={listeRulesMust[i].idpays}
                name={listeRulesMust[i].name}
                desc={listeRulesMust[i].desc}
                type={listeRulesMust[i].type}

            />)
        }

        for(let i =0;i<listeRulesMustnot.length;i++){
            jsxListeRulesMustnot.push(<ListeRulesMustnot
                key={i}
                idpays={listeRulesMustnot[i].idpays}
                name={listeRulesMustnot[i].name}
                desc={listeRulesMustnot[i].desc}
                type={listeRulesMustnot[i].type}

            />)
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