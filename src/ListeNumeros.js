import React from 'react';

function ListeNumeros(props) {
    return (
        <div className="partEmergency">
            <div className="numero">
                <a href="tel:+15">
                    <p> {props.numero} </p>
                </a>
            </div>
            <div className="nameNumero">
                <p> {props.desc} </p>
            </div>
        </div>
    );

}

export default ListeNumeros;