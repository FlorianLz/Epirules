import React from 'react';

function ListeQuestions(props) {
    return (
        <div>
            <div id={props.id} className="question" onClick={e=>props.clic(props.id)}>
                <p>{props.question}</p>
            </div>
            <div id={'r-'+props.id} className="reponse">
                <p>{props.reponse}</p>
            </div>
        </div>
    );

}

export default ListeQuestions;