import React from 'react';

function ListePays(props) {
    return (
        <option key={props.id} id={props.id} value={props.pays}>{props.pays}</option>
    );

}

export default ListePays;