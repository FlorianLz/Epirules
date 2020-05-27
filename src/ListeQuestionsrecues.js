import React from 'react';

function ListeQuestionsRecues(props) {
    return (
        <div>
            <div id={props.id} className={"question"} onClick={e=>props.clic(props.id)}>
                <p>{props.question}</p>
            </div>
            <div id={'r-'+props.id} className={"reponse"}>
                <p>Posée par {props.prenom} {props.nom}</p>
                <p>({props.email})</p>
                <form onSubmit={e=>props.poster(e)} className={'form-admin'}>
                    <input type={'text'} name={'question-'+props.id} defaultValue={props.question}/>
                    <input type={'hidden'} name={'document-'+props.id} value={props.id}/>
                    <input type={'hidden'} name={'email-'+props.id} value={props.email}/>
                    <input type={'hidden'} name={'prenom-'+props.id} value={props.prenom}/>
                    <input type={'hidden'} name={'nom-'+props.id} value={props.nom}/>
                    <textarea name={'reponse-'+props.id} placeholder={'Réponse...'}></textarea>
                    <input type="submit" value="Valider" />
                </form>
            </div>
        </div>
    );

}

export default ListeQuestionsRecues;