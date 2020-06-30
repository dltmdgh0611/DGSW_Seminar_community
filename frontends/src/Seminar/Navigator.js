import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'

class Navigator extends Component {
  render() {
    return (
        <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/">Seminar</Navbar.Brand>
            <Form className="mr-3">
                <Form.Row>
                    <Col>
                        <Form.Control type="text" placeholder="Search..."/>
                    </Col>
                    <Col xs="auto">
                        <Button variant="success" type="submit">Q</Button>
                    </Col>
                </Form.Row>
            </Form>
            <Nav fill varaint="tabs">
                <Nav.Item>
                    <Nav.Link href="">작성하기</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="">강의 목록</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="">강의 요청</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="/free_seminar">자유 게시판</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link href="" disabled>강의 수요현황 </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
  }
}
export default Navigator;