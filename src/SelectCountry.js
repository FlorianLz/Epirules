import React, {useEffect, useState} from 'react';
import './App.scss';
import * as firebase from "firebase";
import config from "./Config";
import ListePays from "./ListePays";
import {Link} from "react-router-dom";
import {useCookies} from 'react-cookie';
import axios from "axios";


function App() {
    const [loading, setLoading] = useState(true);
    const [choisi, setChoisi] = useState(false);
    const [listePays, setListePays] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies(['pays']);
    const [cookiesID, setCookieID, removeCookieID] = useCookies(['idpays']);
    const [cookiesCodePays, setCookieCodePays, removeCookieCodePays] = useCookies(['codepays']);
    const [intro, setIntro] = useState('Go outside with knowledges');
    const [intro1, setIntro1] = useState('go outside with Epirules');
    const [choisir, setChoisir] = useState('Choisissez votre pays');
    let jsxListePays=[];

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    // Fonction exécutée au chargement de la page
    function getPays(){
        //console.log(navigator.language);
        if(loading===true){
            db.collection("pays").orderBy('nom','asc').onSnapshot(function(querySnapshot) {
                let tab=[];
                querySnapshot.forEach(function(doc) {
                    //console.log(doc.id, " => ", doc.data());
                    tab.push({
                        id: doc.id,
                        nom: doc.data().nom,
                        code: doc.data().code
                    })

                });
                let langue=navigator.language.split('-')[0];
                let cle = 'trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8';
                let newtab = [];
                if(langue !== 'fr'){
                    async function translate() {
                        let states = [intro,intro1,choisir];
                        let set = [setIntro,setIntro1,setChoisir];

                        for(let i=0; i<states.length; i++){
                            await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+states[i]+'&lang='+langue).then(function (response) {
                                set[i](response.data.text)
                            })
                        }

                        for(let i=0; i<tab.length; i++){
                            await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+tab[i].nom+'&lang='+langue).then(function (response) {
                                newtab.push({
                                    id: tab[i].id,
                                    nom: response.data.text,
                                    code: tab[i].code
                                })
                            })
                        }
                    }
                    translate().then(function(){
                        setListePays(newtab)
                        setLoading(false);
                    }).catch(function (errors) {
                        setLoading(false); //On indique que le chargement est terminé
                        setListePays(tab);
                    })
                }else{
                    setIntro('Sortez intelligemment')
                    setIntro1('sortez avec Epirules')
                    setLoading(false); //On indique que le chargement est terminé
                    setListePays(tab);
                }

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
    },[]);

    if (loading === false){
        return (
        <div className={'container selectCountry'}>
            <img src={'/images/terre.png'} alt={'Illustration'}/>
            <h1>{intro} <br /> {intro1}</h1>
            <select id="ListePays" defaultValue={'choix'} onChange={e=>actualiserChoix(e)}>
                <option value="choix" hidden>{choisir}</option>
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
