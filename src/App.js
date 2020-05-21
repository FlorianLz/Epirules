import React from 'react';
import './App.scss';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Pays from "./SelectCountry";
import Regles from "./Regles";
import Urgences from "./Urgences";
import Faq from "./Faq";
import Stats from "./Stats";
import APropos from "./APropos";


function App() {
  return (
      <BrowserRouter>
          <div>
              <Switch>
                  <Route exact={true} path="/" component={Pays} />
                  <Route exact={true} path="/regles" component={Regles} />
                  <Route exact={true} path="/urgences" component={Urgences} />
                  <Route exact={true} path="/faq" component={Faq} />
                  <Route exact={true} path="/stats" component={Stats} />
                  <Route exact={true} path="/a-propos" component={APropos} />
                  <Route path="*" component={() => <p>404 not found</p>} />
              </Switch>
          </div>
      </BrowserRouter>
  );
}

export default App;
