import React from 'react';
import {Link} from "react-router-dom";

function ListeRules(props) {
    let name = props.name;
    if(props.log){
        return (
            <div className="elementCategorie">
                <Link to={'/regles/'+props.id}>
                    <div className="link">
                        <div className="title">  {name} </div>
                    </div>
                </Link>
                <div className="suppr">
                    <p><i className="fas fa-times" data-suppr={props.id} onClick={props.onSuppr}> </i> </p>
                </div>
            </div>
        );

    } else {
        return (
            <Link to={'/regles/'+props.id}>
                <div className="link">
                    <div className="title">  {name} </div>
                </div>
            </Link>
        );
    }

}

export default ListeRules;