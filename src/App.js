import React from 'react';
import './App.scss';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Pays from "./SelectCountry";
import Regles from "./Regles";


function App() {
  return (
      <BrowserRouter>
          <div>
              <Switch>
                  <Route exact={true} path="/" component={Pays} />
                  <Route exact={true} path="/regles/:pays" component={Regles} />
                  <Route path="*" component={() => <p>404 not found</p>} />
              </Switch>
          </div>
      </BrowserRouter>
  );
}

export default App;
