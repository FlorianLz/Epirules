import React from 'react';

function ListeNumeros(props) {
    if(props.suppr){
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
                <div className="suppr">
                    <p><i className="fas fa-times" data-suppr={props.suppr} onClick={props.onSuppr}> </i> </p>
                </div>
            </div>
        );
    }else{
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

}

export default ListeNumeros;