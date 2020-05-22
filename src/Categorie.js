import React, {useState} from 'react';
import Header from "./Header";
import {Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";
import ListeRulesCat from "./ListeRulesCat";

export default function Categorie(props) {
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
    const [listeRulesCat, setListeRulesCat] = useState([]);
    const [loading, setLoading] = useState(true);
    let jsxListeRulesCat = [];
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
                if (doc.data().idpays === idpays && doc.data().name === categorie){
                    listeRulesCat.push({
                        idpays: doc.data().idpays,
                        name: doc.data().name,
                        must: doc.data().must,
                        can: doc.data().can,
                        mustnot: doc.data().mustnot
                    })
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
        for(let i =0;i<listeRulesCat.length;i++){
            jsxListeRulesCat.push(<ListeRulesCat
                key={i}
                idpays={listeRulesCat[i].idpays}
                name={listeRulesCat[i].name}
                must={listeRulesCat[i].must}
                can={listeRulesCat[i].can}
                mustnot={listeRulesCat[i].mustnot}

            />)
        }

        return (
            <div>
                <Header page={categorie}> </Header>
                <div className="">
                    {jsxListeRulesCat}
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