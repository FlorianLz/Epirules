import React from 'react';

export default function Regles(props) {
    let pays=props.match.params.pays;
    return (
        <h1>Pays sélectionné : {pays}</h1>
    );

}