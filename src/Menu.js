import React, {useState} from 'react';
import {Link} from "react-router-dom";
import {useCookies, withCookies} from 'react-cookie';

export default function Menu(props) {
    const [visible,setVisible]=useState(false);
    const [cookies, setCookie] = useCookies(['pays']);
    let pays=cookies.pays;

    function changer() {
        if(visible === false){
            setVisible(true);
        }else{
            setVisible(false);
        }
    }

    if(visible === true){
        return (
            <div className="menu">
                <img src={'/images/menuouvert.png'} onClick={e=>changer()} />
                <div className="liens">
                    <Link to={'/regles'}>
                        <div className="lien">
                            <div className="titre">Accueil</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    <Link to={'/urgences'}>
                        <div className="lien">
                            <div className="titre">Urgences</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    <Link to={'/faq'}>
                        <div className="lien">
                            <div className="titre">FAQ</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    <Link to={'/stats'}>
                        <div className="lien">
                            <div className="titre">Statistiques</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    <Link to={'/'}>
                        <div className="lien">
                            <div className="titre">Choix pays</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    <Link to={'/a-propos'}>
                        <div className="lien">
                            <div className="titre">À propos de nous</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }else{
        return (
            <div className="menu ferme">
                <img src={'/images/menuferme.png'} onClick={e=>changer()} />
                <div className="liens">
                    <Link to={'/'}>
                        <div className="lien">
                            <div className="titre">Accueil</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    <Link to={'/'}>
                        <div className="lien">
                            <div className="titre">Urgences</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    <Link to={'/'}>
                        <div className="lien">
                            <div className="titre">FAQ</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    <Link to={'/'}>
                        <div className="lien">
                            <div className="titre">Statistiques</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    <Link to={'/'}>
                        <div className="lien">
                            <div className="titre">Choix pays</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    <Link to={'/'}>
                        <div className="lien">
                            <div className="titre">À propos de nous</div>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }

}