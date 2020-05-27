import React, {useState} from 'react';
import Header from "./Header";
import {Redirect, Link} from "react-router-dom";
import {useCookies} from "react-cookie";
import * as firebase from "firebase";
import config from "./Config";
import ListeQuestions from "./ListeQuestion";
import ListeCategories from "./ListeCategories";

export default function Faq() {
    const [cookies] = useCookies(['pays']);
    const [cookiesID] = useCookies(['idpays']);
    const [listeQuestions, setListeQuestions] = useState([]);
    const [cookieLogin,setCookieLogin,removeCookieLogin] = useCookies(['login']);
    const [loading, setLoading] = useState(true);
    const [noReaload, setNoReload] = useState(false);
    const [admin, setAdmin] = useState(false);
    let pays=cookies.pays;
    let idpays=cookiesID.idpays;
    let jsxListeQuestions=[];

    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    const db = firebase.firestore();

    function getQuestions(){
        if (loading === true){
            db.collection("questions").orderBy("timestamp","desc").onSnapshot(function(querySnapshot) {
                let tab=[];
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    if (doc.data().idpays === idpays){
                        tab.push({
                            idpays: doc.data().idpays,
                            question: doc.data().question,
                            reponse: doc.data().reponse,
                            id: doc.id,
                            admin: admin
                        })
                    }
                });
                setListeQuestions(tab);
                setLoading(false);
            })
        }
    }

    function getQuestionsAdmin(){
        if (loading === true){
            db.collection("questions").orderBy("timestamp","desc").get().then(function(querySnapshot) {
                let tab=[];
                querySnapshot.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    //console.log(doc.id, " => ", doc.data());
                    if (doc.data().idpays === idpays){
                        tab.push({
                            idpays: doc.data().idpays,
                            question: doc.data().question,
                            reponse: doc.data().reponse,
                            id: doc.id,
                            admin: admin
                        })
                    }
                });
                setListeQuestions(tab);
                setLoading(false);
                setNoReload(true)
            })
        }
    }

    function toggleRep(id){
        let reponses=document.getElementsByClassName('reponse');
        [].forEach.call(reponses,function (elmt) {
            if (elmt.id !== 'r-'+id){
                elmt.classList.remove('visible')
            }
        });
        let reponse=document.getElementById('r-'+id);
        reponse.classList.toggle('visible');
    }

    function supprimer(id) {
        //console.log(id)
        db.collection("questions").doc(id).delete().then(function() {
            //console.log("Document successfully deleted!");
            setLoading(true)
            getQuestionsAdmin()
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    for(let i =0;i<listeQuestions.length;i++){
        jsxListeQuestions.push(<ListeQuestions
            key={i}
            idpays={listeQuestions[i].idpays}
            question={listeQuestions[i].question}
            reponse={listeQuestions[i].reponse}
            clic={e=>toggleRep(e)}
            id={listeQuestions[i].id}
            admin={listeQuestions[i].admin}
            onSuppr={e=>supprimer(listeQuestions[i].id)}

        />)
    }

    if(loading === false){
        if(admin === true){
            let questions = document.querySelectorAll('.majquestion');
            let reponses = document.querySelectorAll('.majreponses');
            [].forEach.call(questions, function(question) {
                question.addEventListener('input',function (e) {
                    let iddoc  = e.target.getAttribute('data-id');
                    let newquestion = document.querySelector('.q-'+iddoc).innerText;
                    db.collection("questions").doc(iddoc).update({
                        question: newquestion
                    })


                })
            });

            [].forEach.call(reponses, function(reponse) {
                reponse.addEventListener('input',function (e) {
                    let iddoc  = e.target.getAttribute('data-id');
                    let newreponse = document.querySelector('.r-'+iddoc).innerText;
                    db.collection("questions").doc(iddoc).update({
                        reponse: newreponse
                    })


                })
            });


        }
    }

    //On vérifie que la personne connectée est bien admin dans la bdd
    function getVerif(uid) {
        db.collection("users").get().then(function(querySnapshot) {
            let autorisation = false;
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                //console.log(doc.id, " => ", doc.data());
                if (doc.data().id === uid ){
                    let data = doc.data();
                    if (data.admin === true){
                        setAdmin(true);
                        autorisation = true;
                    }
                }
            });
            console.log(autorisation)
            if (autorisation === true){
                getQuestionsAdmin()
            }else{
                getQuestions()
            }
        });
    }

    getVerif(cookies.login);

    if(!cookies.pays){
        return (
            <Redirect to='/'/>
        );
    }

    return (
        <div>
            <Header page={'FAQ'}> </Header>
            <div className="questions">
                <div className="recherche">
                    <input type="text" placeholder={'Recherche...'} />
                </div>
                <div className="demande">
                    <Link to={'/faq/demande'}><button>Poser une question</button></Link>
                    {admin ? <Link to={'/faq/ajout'} className={'ajoutadmin'}><button>Ajouter une question</button></Link> : ''}
                </div>
                <div className="questions_liste">
                    { //Check if message failed
                        (noReaload === false)
                            ? (loading === false)
                            ? <div>{jsxListeQuestions}</div>
                            : <div className="lds-roller">
                                <div> </div>
                                <div> </div>
                                <div> </div>
                                <div> </div>
                                <div> </div>
                                <div> </div>
                                <div> </div>
                                <div> </div>
                            </div>
                            : <div>{jsxListeQuestions}</div>
                    }
                </div>

            </div>
        </div>

    );

}