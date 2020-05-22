import React from 'react';
import {Link} from "react-router-dom";

function ListeRules(props) {
    let name = props.name;
    return (
        <Link to={'/regles/'+name}>
            <div className="link">
                <div className="title">  {name} </div>
            </div>
        </Link>
    );

}

export default ListeRules;