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
    const [cookies, setCookie, removeCookie] = useCookies(['pays']);
    const [cookiesID, setCookieID, removeCookieID] = useCookies(['idpays']);
    const [cookiesCodePays, setCookieCodePays, removeCookieCodePays] = useCookies(['codepays']);
    let jsxListePays=[];
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    // Fonction exécutée au chargement de la page
    function getPays(){
        //console.log(navigator.language);
        if(loading===true){
            db.collection("pays").onSnapshot(function(querySnapshot) {
                let tab=[];
                querySnapshot.forEach(function(doc) {
                    //console.log(doc.id, " => ", doc.data());
                    tab.push({
                        id: doc.id,
                        nom: doc.data().nom,
                        code: doc.data().code
                    })

                });
                setLoading(false); //On indique que le chargement est terminé
                setListePays(tab);
            })
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
        let idpays = e.target.options[e.target.selectedIndex].id;
        let codepays = e.target.options[e.target.selectedIndex].getAttribute('data-code');
        removeCookie('pays');
        removeCookieID('idpays');
        removeCookieCodePays('codepays');
        setCookie('pays', choix, '/');
        setCookieID('idpays', idpays, '/');
        setCookieCodePays('codepays', codepays, '/');
        setChoisi(choix);
    }

    useEffect(()=>{
        getPays();
    })

    if (loading === false){
        return (
        <div className={'container selectCountry'}>
            <img src={'/images/terre.png'} alt={'Illustration'}/>
            <h1>Go outside with knowledges <br /> go outside with Epirules</h1>
            <select id="ListePays" defaultValue={'choix'} onChange={e=>actualiserChoix(e)}>
                <option value="choix" hidden>Choisissez votre pays</option>
                {jsxListePays}
            </select>
            {choisi ? <Link to={'/regles'}><button>Valider</button></Link> : <Link to={'/regles'}><button className={'masque'}>Valider</button></Link> }

        </div>
        )
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

export default App;
