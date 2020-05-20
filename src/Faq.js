import React from 'react';
import Header from "./Header";

export default function Faq(props) {
    let pays=props.match.params.pays;
    return (
        <div>
            <Header page={'FAQ'}></Header>
        </div>

    );

}