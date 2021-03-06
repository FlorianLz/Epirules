import React from 'react';
import './App.scss';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Pays from "./SelectCountry";
import Regles from "./Regles";
import Urgences from "./Urgences";
import Faq from "./Faq";
import Stats from "./Stats";
import APropos from "./APropos";
import Categorie from "./Categorie";
import Question from "./Question";
import Login from "./Login";
import AjoutRegles from "./AjoutRegles";
import Admin from "./Admin";
import AddUrgences from "./AddUrgences";
import AjoutCategorie from "./AjoutCategorie";
import QuestionsRecues from "./QuestionsRecues";
import AjoutQuestion from "./AjoutQuestion";
import Page404 from "./Page404";


function App() {
  return (
      <BrowserRouter>
          <div>
              <Switch>
                  <Route exact={true} path="/" component={Pays} />
                  <Route exact={true} path="/regles" component={Regles} />
                  <Route exact={true} path="/regles/:categorie" component={Categorie} />
                  <Route exact={true} path="/nouvelle/regles" component={AjoutRegles} />
                  <Route exact={true} path="/nouvelle/categorie" component={AjoutCategorie} />
                  <Route exact={true} path="/urgences" component={Urgences} />
                  <Route exact={true} path="/urgences/add" component={AddUrgences} />
                  <Route exact={true} path="/faq" component={Faq} />
                  <Route exact={true} path="/faq/demande" component={Question} />
                  <Route exact={true} path="/faq/recues" component={QuestionsRecues} />
                  <Route exact={true} path="/faq/ajout" component={AjoutQuestion} />
                  <Route exact={true} path="/stats" component={Stats} />
                  <Route exact={true} path="/a-propos" component={APropos} />
                  <Route exact={true} path="/login" component={Login} />
                  <Route exact={true} path="/admin" component={Admin} />
                  <Route path="*" component={Page404} />
              </Switch>
          </div>
      </BrowserRouter>
  );
}

export default App;
