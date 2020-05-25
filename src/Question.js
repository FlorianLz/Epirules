import React, {useState} from 'react';
import Header from "./Header";
import {Link, Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";

export default function Question() {
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
    const [listeQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }
    return (
        <div>
            <Header page={'Poser une question'}> </Header>
            <Link to={'/faq'}><i id={'retour'} className="fas fa-arrow-left retour"> </i></Link>
            <div className={'question'}>
                <form>
                    <div className="ligne1">
                        <input type="text" placeholder={'Prénom...'} />
                        <input type="text" placeholder={'Nom...'} />
                    </div>
                    <input type='email' placeholder={'Email...'}/>
                    <textarea placeholder={'Question...'}></textarea>
                    <div className="infos">
                        <p>Nous vous enverrons un email lorsque nous aurons répondus à votre question. Si vous ne recevez aucune réponse d'ici 3 semaines, cela signifie que la question à déjà été posée sur la page <Link to={'/faq'}>FAQ</Link>.</p>
                    </div>
                    <input type="submit" value={'Poser ma question'}/>
                </form>
            </div>
        </div>

    );

}