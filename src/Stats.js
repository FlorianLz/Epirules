import React from 'react';
import Header from "./Header";

export default function Stats(props) {
    let pays=props.match.params.pays;
    return (
        <div>
            <Header page={'Statistiques'}></Header>
        </div>

    );

}