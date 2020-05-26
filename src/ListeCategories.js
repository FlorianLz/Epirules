import React from 'react';

function ListeCategories(props) {
    if(props.suppr){
        return (
            <div className="lineCategorie">
                <p>{props.name}</p>
                <div className="suppr">
                    <p><i className="fas fa-times" data-suppr={props.suppr} onClick={props.onSuppr}> </i> </p>
                </div>
            </div>

        );
    } else {
        return (
            <option key={props.id} id={props.id} value={props.name} className="propsCat">{props.name}</option>
        );
    }


}

export default ListeCategories;