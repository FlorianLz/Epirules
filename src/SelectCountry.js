import React, {useEffect, useState} from 'react';
import './App.scss';
import * as firebase from "firebase";
import config from "./Config";
import ListePays from "./ListePays";
import {Link} from "react-router-dom";
import {useCookies} from 'react-cookie';


function App() {
    const [loading, setLoading] = useState(true);
    const [choisi, setChoisi] = useState(false);
    const [listePays, setListePays] = useState([]);
    const [cookies, setCookie] = useCookies(['pays']);
    let jsxListePays=[];
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    // Fonction exécutée au chargement de la page
    function getPays(){
        if(loading===true){
            db.collection("pays").get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    console.log(doc.id, " => ", doc.data());
                    listePays.push({
                        id: doc.id,
                        nom: doc.data().nom,
                        code: doc.data().code
                    })
                });
            }).then(function(){
                setLoading(false); //On indique que le chargement est terminé
            });
        }
    }


    for(let i =0;i<listePays.length;i++){
        jsxListePays.push(<ListePays
            key={i}
            id={listePays[i].id}
            pays={listePays[i].nom}
            code={listePays[i].code}
        />)
    }

    function actualiserChoix(e){
        let choix = e.target.options[e.target.selectedIndex].value;
        setCookie('pays', choix, '/');
        setChoisi(choix);
    }

    useEffect(()=>{
        getPays();
    },[])

    if (loading === false){
        return (
        <div className={'container selectCountry'}>
            <img src={'/images/terre.png'} alt={'Illustration'}/>
            <h1>Go outside with knowledges <br /> go outside with Epirules</h1>
            <select id="ListePays" defaultValue={'choix'} onChange={e=>actualiserChoix(e)}>
                <option value="choix" hidden>Choisissez votre pays</option>
                {jsxListePays}
            </select>
            {choisi ? <Link to={'/regles'}><button>Valider</button></Link> : '' }

        </div>
        )
    }else{
        return(
            <div className={"content"}>
                <div className="lds-roller">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        )
    }
}

export default App;
