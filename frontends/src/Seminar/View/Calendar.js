import React, { Component } from 'react';
import Navigator from '../Navigator'
import PlanCalendar from '../View/PlanCalendar'
import { Container, Jumbotron } from 'react-bootstrap';

class Calendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }
  
  render() {
    return (
        <div>
            <Navigator {...this.props}/>
            <Jumbotron fluid>
            <Container>
                <h1 className="display-4">강의 일정</h1>
                <p className="lead">신청한 강의나 관심있는 강의 일정을 찾아보세요</p>
            </Container>
            </Jumbotron>
            <Container className="mt-5 border bg-white p-3 rounded">
                
                    <PlanCalendar/>
                
            </Container>
        </div>
    );
  }
}
export default Calendar;