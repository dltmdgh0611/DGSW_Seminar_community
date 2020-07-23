import React, { Component } from 'react';
import PageOfMain from './Seminar/PageOfMain' 
import PageOfFreeSeminar, { PostView  as ViewOfFreeSeminar } from './Seminar/View/PageOfFreeSeminar'
import PageOfRequestSeminar, { PostView  as ViewOfRequestSeminar} from './Seminar/View/PageOfRequestSeminar' 
import PageOfRecruitSeminar, { PostView as ViewOfRecruitSeminar} from './Seminar/View/PageOfRecruitSeminar' 
import PageOfSearchResults from './Seminar/View/PageOfSearchResults'
import Calendar from './Seminar/View/Calendar'
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
          <Route path="/postview/free_seminar" component={ViewOfFreeSeminar}/>
          <Route path="/postview/request_seminar" component={ViewOfRequestSeminar}/>
          <Route path="/postview/recruit_seminar" component={ViewOfRecruitSeminar}/>
          <Route exact path="/request_seminar" component={PageOfRequestSeminar}/>
          <Route exact path="/recruit_seminar" component={PageOfRecruitSeminar}/>
          <Route exact path="/search" component={PageOfSearchResults}/>
          <Route exact path="/Calendar" component={Calendar}/>
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