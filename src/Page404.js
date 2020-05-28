import React from 'react';
import Header from "./Header";


export default function Page404() {
    return (
        <div className="contenu404">
            <Header page={''}> </Header>
            <div className="erreur">
                <h1> 404</h1>
                <p> La page que vous recherchez est introuvable. </p>
            </div>
        </div>

    );

}