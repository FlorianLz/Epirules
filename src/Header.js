import React, {useEffect, useState} from 'react';
import {Link} from "react-router-dom";
import * as firebase from "firebase";
import config from "./Config";
import {useCookies} from "react-cookie";
import axios from "axios";

export default function Header(props) {
    const [visible,setVisible]=useState(false);
    const [admin,setAdmin]=useState(false);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [loading, setLoading] = useState(true);
    const [menu1,setMenu1] = useState('Accueil');
    const [menu2,setMenu2] = useState('Numéros d\'urgence');
    const [menu3,setMenu3] = useState('FAQ');
    const [menu4,setMenu4] = useState('Statistiques');
    const [menu5,setMenu5] = useState('Choix pays');
    const [menu6,setMenu6] = useState('À propos de nous');
    const [menu7,setMenu7] = useState('Admin');

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

    async function translate() {
        let langue = navigator.language.split('-')[0];
        let cle = 'trnsl.1.1.20130922T110455Z.4a9208e68c61a760.f819c1db302ba637c2bea1befa4db9f784e9fbb8';
        if (langue !== 'fr'){
            let states = [menu1,menu2,menu3,menu4,menu5,menu6,menu7];
            let set = [setMenu1,setMenu2,setMenu3,setMenu4,setMenu5,setMenu6,setMenu7];
            for(let i=0; i<states.length; i++){
                await axios.get('https://translate.yandex.net/api/v1.5/tr.json/translate?key='+cle+'&text='+states[i]+'&lang='+langue).then(function (response) {
                    set[i](response.data.text)
                })
            }
            setLoading(false)
        }else{
            setLoading(false)
        }

    }
    useEffect(()=>{
       translate()
    },[])

    return (
        <div>
            <div className={'header'}>
                <Link to={'/regles'}><img src={'/images/epirules.png'} alt={'Epirules'}/></Link>
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
                            <div className="titre">{menu1}</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    <Link to={'/urgences'}>
                        <div className="lien">
                            <div className="titre">{menu2}</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    <Link to={'/faq'}>
                        <div className="lien">
                            <div className="titre">{menu3}</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    <Link to={'/stats'}>
                        <div className="lien">
                            <div className="titre">{menu4}</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    <Link to={'/'}>
                        <div className="lien">
                            <div className="titre">{menu5}</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    <Link to={'/a-propos'}>
                        <div className="lien">
                            <div className="titre">{menu6}</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>
                    {cookieLogin.login ? <Link to={'/admin'}>
                        <div className="lien">
                            <div className="titre">{menu7}</div>
                            <i className="fas fa-arrow-right"> </i>
                        </div>
                    </Link>:''}
                </div>
            </div>
        </div>

    );

}