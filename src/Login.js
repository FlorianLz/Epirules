import React from 'react';
import Header from "./Header";
import {Link, Redirect} from "react-router-dom";
import {useCookies} from "react-cookie";

export default function Login() {
    const [cookies] = useCookies(['pays']);

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    return (
        <div>
            <Header page={'Connexion admin'}> </Header>
            <form>
                <input type="email" placeholder={'Email...'} />
                <input type='mdp' placeholder={'Mot de passe...'}/>
                <input type="submit" value={'Se connecter'}/>
            </form>
        </div>

    );

}