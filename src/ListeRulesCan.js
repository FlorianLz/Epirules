import React from 'react';

function ListeRulesCan(props) {
    if(props.log){
        return (
            <div className="suppRegle">
                <li> {props.desc} </li>
                <div className="suppr">
                    <p><i className="fas fa-times" data-suppr={props.id} onClick={props.onSuppr}> </i> </p>
                </div>
            </div>

        );
    } else {
        return (
            <li> {props.desc}</li>
        );
    }


}

export default ListeRulesCan;