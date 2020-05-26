import React from 'react';

function ListeQuestionsRecues(props) {
    return (
        <div>
            <div id={props.id} className={"question"} onClick={e=>props.clic(props.id)}>
                <p>{props.question}</p>
            </div>
            <div id={'r-'+props.id} className={"reponse"}>
                <form onSubmit={e=>props.poster(e)}>
                    <input type={'text'} name={'question'} defaultValue={props.question}/>
                    <input type={'hidden'} name={'document'} value={props.id}/>
                    <textarea name="reponse"></textarea>
                    <input type="submit" value="Valider" />
                </form>
            </div>
        </div>
    );

}

export default ListeQuestionsRecues;