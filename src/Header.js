import React, {useState} from 'react';
import {Link} from "react-router-dom";
import * as firebase from "firebase";
import config from "./Config";
import {useCookies} from "react-cookie";

export default function Header(props) {
    const [visible,setVisible]=useState(false);
    const [admin,setAdmin]=useState(false);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function changer() {
        if(visible === false){
            setVisible(true);
            if(document.getElementById('retour')){
                document.getElementById('retour').classList.add('cache');
            }
        }else{
            setVisible(false);
            if(document.getElementById('retour')){
                document.getElementById('retour').classList.remove('cache');
            }
        }
    }

    return (
        <div>
            <div className={'header'}>
                <img src={'/images/epirules.png'} alt={'Epirules'}/>
            </div>
            <div className="header_titre">
                <div className="vague">
                    <img src={'/images/vague.png'} alt={'Vague'}/>
                    <h2>{props.page}</h2>
                </div>
            </div>
            <div className={visible ? 'menu' : 'menu ferme'}>
                {visible ? <img src={'/images/menuouvert.png'} onClick={e=>changer(e)} alt={'Fermer le menu'}/> :<img src={'/images/menuferme.png'} onClick={e=>changer(e)} alt={'Ouvrir le menu'}/>}
                <div className="liens">
                    <Link to={'/regles'}>
                        <div className="lien">
                            <div className="titre">Accueil</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    <Link to={'/urgences'}>
                        <div className="lien">
                            <div className="titre">Urgences</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    <Link to={'/faq'}>
                        <div className="lien">
                            <div className="titre">FAQ</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    <Link to={'/stats'}>
                        <div className="lien">
                            <div className="titre">Statistiques</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    <Link to={'/'}>
                        <div className="lien">
                            <div className="titre">Choix pays</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    <Link to={'/a-propos'}>
                        <div className="lien">
                            <div className="titre">À propos de nous</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    {cookieLogin.login ? <Link to={'/admin'}>
                        <div className="lien">
                            <div className="titre">Admin</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>:''}
                </div>
            </div>
        </div>

    );

}