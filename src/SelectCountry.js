import React, {useEffect, useState} from 'react';
import './App.scss';
import * as firebase from "firebase";
import config from "./Config";
import ListePays from "./ListePays";
import {Link, Redirect} from "react-router-dom";


function App() {
    const [pays, setPays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [choisi, setChoisi] = useState(false);
    let jsxListePays=[];

    // Fonction exécutée au chargement de la page
    function getPays(){
        if(loading===true){
            if (!firebase.apps.length) {
                firebase.initializeApp(config);
            }
            //Référence de la table choisie (ici pays)
            const ref = firebase.database().ref('pays');
            ref.on('value', snapshot=>{
                let data=snapshot.val();
                update(data);
            });
        }

    }
    function update(data){
        console.log(data);
        setPays(data); //On crée une copie de la db dans la variable Pays
        setLoading(false); //On indique que le chargement est terminé
    }


    for(let i =0;i<pays.length;i++){
        jsxListePays.push(<ListePays
            key={i}
            id={i}
            pays={pays[i].nom}
        />)
    }

    function actualiserChoix(e){
        let choix = e.target.options[e.target.selectedIndex].value;
        setChoisi(choix);
    }

    useEffect(()=>{
        getPays();
    },[])

    function Validation() {
        console.log(choisi);
    }

    if (loading === false){
        return (
        <div className={'container selectCountry'}>
            <img src={'/images/terre.png'} alt={'Illustration'}/>
            <h1>Go outside with knowledges <br /> go outside with Epirules</h1>
            <select id="ListePays" defaultValue={'choix'} onChange={e=>actualiserChoix(e)}>
                <option value="choix" hidden>Choisissez votre pays</option>
                {jsxListePays}
            </select>
            {choisi ? <Link to={'/regles/'+choisi}><button onClick={e=>Validation()}>Valider</button></Link> : '' }

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
