import React from 'react';

function ListeQuestions(props) {
    if(props.admin === true){
        return (
            <div className="listeQuestions">
                <div>
                    <div id={props.id} className="question" onClick={e=>props.clic(props.id)}>
                        <p suppressContentEditableWarning={true} contentEditable="true" className={'majquestion q-'+props.id} data-id={props.id}>{props.question}</p>
                    </div>
                    <div id={'r-'+props.id} className="reponse">
                        <p suppressContentEditableWarning={true} contentEditable="true" className={'majreponses r-'+props.id} data-id={props.id}>{props.reponse}</p>
                    </div>
                </div>
                <div className="suppr">
                    <p><i className="fas fa-times" data-suppr={props.id} onClick={props.onSuppr}> </i> </p>
                </div>
            </div>
        );
    }else{
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

}

export default ListeQuestions;