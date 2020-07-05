import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import ReactDOM from 'react-dom';

class Navigator extends Component {
    
    constructor(props) {
      super(props);
      this.search_query = "";
    }
    componentDidMount() {
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.props.history.push('/search?s='+ this.search_query);

    }

    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand href="/" className="ml-5">Seminar</Navbar.Brand>
                <Form  className="mr-3">
                    <Form.Row>
                        <Col>
                            <Form.Control type="text" placeholder="Search..." onChange={(e) => {this.search_query = e.target.value}}/>
                        </Col>
                        <Col xs="auto">
                            <Button onClick={this.handleSubmit.bind(this)} variant="success" type="submit">Q</Button>
                        </Col>
                    </Form.Row>
                </Form>
                <Nav fill varaint="tabs">
                    <Nav.Item className="mx-2">
                        <Nav.Link href="">작성하기</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mx-2">
                        <Nav.Link href="/recruit_seminar">강의 목록</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mx-2">
                        <Nav.Link href="/request_seminar">강의 요청</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mx-2">
                        <Nav.Link href="/free_seminar">자유 게시판</Nav.Link>
                    </Nav.Item>
                    <Nav.Item className="mx-2">
                        <Nav.Link href="" disabled>강의 수요현황 </Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar>
        );
    }
}
export default Navigator;