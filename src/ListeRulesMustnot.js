import React from 'react';

function ListeRulesMustnot(props) {
    if(props.log){
        return (
            <div className="suppRegle">
                <li suppressContentEditableWarning={true} contentEditable="true" className={'majregle r-'+props.id} data-id={props.id}> {props.desc} </li>
                <div className="suppr">
                    <p><i className="fas fa-times" data-suppr={props.suppr} onClick={props.onSuppr}> </i> </p>
                </div>
            </div>

        );
    }
    return (
        <li> {props.desc}</li>
    );

}

export default ListeRulesMustnot;