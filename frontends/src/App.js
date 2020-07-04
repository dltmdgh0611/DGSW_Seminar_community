import React, { Component } from 'react';
import PageOfMain from './Seminar/PageOfMain' 
import PageOfFreeSeminar from './Seminar/View/PageOfFreeSeminar'
import PageOfRequestSeminar from './Seminar/View/PageOfRequestSeminar' 
import PageOfRecruitSeminar from './Seminar/View/PageOfRecruitSeminar' 
import PageOfSearchResults from './Seminar/View/PageOfSearchResults'
import PostView from './Seminar/Post/PostView'
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
          <Route exact path="/" component={PageOfMain}/>
          <Route exact path="/free_seminar" component={PageOfFreeSeminar}/>
          <Route exact path="/request_seminar" component={PageOfRequestSeminar}/>
          <Route exact path="/recruit_seminar" component={PageOfRecruitSeminar}/>
          <Route exact path="/search" component={PageOfSearchResults}/>
          <Route exact path="/postview" component={PostView}/>
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