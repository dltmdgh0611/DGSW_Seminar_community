import React, { Component } from 'react';
import PageOfMain from './Seminar/PageOfMain' 
import PageOfFreeSeminar from './Seminar/PageOfFreeSeminar' 
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/">
            <PageOfMain/>
          </Route>
          <Route path="/free_seminar">
            <PageOfFreeSeminar/>
          </Route>
          <Route>
            <div>
              알 수 없는 경로입니다.
            </div>
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;