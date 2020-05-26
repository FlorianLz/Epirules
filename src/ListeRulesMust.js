import React from 'react';

function ListeRulesMust(props) {
    if(props.log){
        return (
            <div className="suppRegle">
                <li> {props.desc} </li>
                <div className="suppr">
                    <p><i className="fas fa-times" data-suppr={props.suppr} onClick={props.onSuppr}> </i> </p>
                </div>
            </div>

        );
    } else {
        return (
            <li> {props.desc}</li>
        );
    }
}

export default ListeRulesMust;