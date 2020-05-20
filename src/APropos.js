import React from 'react';
import Header from "./Header";

export default function APropos(props) {
    let pays=props.match.params.pays;
    return (
        <div>
            <Header page={'À propos de nous'}></Header>
        </div>

    );

}