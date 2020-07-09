import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Navigator from './Navigator'

class PageOfMain extends Component {
  render() {
    return (
        <div>
            <Navigator {...this.props}/>
            <Jumbotron fluid>
            <Container>
                <h1 className="display-4">학생 전문가 특강 Seminar</h1>
                <p className="lead">Seminar는 기존의 학생 전문가 특강의 시스템을 개편하고자 만든 서비스로, <br/>자신의 만든 강의의 수강생을 모집하거나 듣고 싶은 강의를 요청할 수 있습니다</p>
            </Container>
            </Jumbotron>
        </div>
    );
  }
}
export default PageOfMain;