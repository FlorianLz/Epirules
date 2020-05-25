import React from 'react';

function ListeCategories(props) {
    return (
        <option key={props.id} id={props.id} value={props.name} className="propsCat">{props.name}</option>
    );

}

export default ListeCategories;