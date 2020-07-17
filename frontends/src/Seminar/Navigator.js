import React, { Component } from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import MemberControl from './MemberControl'
import cookie from 'react-cookies';
import axios from 'axios';



class Navigator extends Component {
    search_query = "";
    
    handleSubmit(event) {
        event.preventDefault();
        if(this.search_query.includes("#")){
            this.search_query = this.search_query.replace("#", "$");
        }
        this.props.history.push('/search?s= '+ this.search_query);

    }

    refresh() {
        const token = cookie.load('token')
        const Q = `mutation RefreshToken($token: String!) {
            refreshToken(token: ${token}) {
              token
              payload
              refreshExpiresIn
            }
          }`
          axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: Q
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }).then(result => {
            console.log(result)
        });

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
                            <Button onClick={this.refresh.bind(this)} variant="success">CC</Button>
                        </Col>
                        <Col xs="auto">
                            <Button onClick={this.handleSubmit.bind(this)} variant="success" type="submit">Q</Button>
                        </Col>
                    </Form.Row>
                </Form>
                <Nav fill varaint="tabs">
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
                <Nav className="ml-auto d-flex px-5">
                    <MemberControl {...this.props}/>                   
                </Nav>
            </Navbar>
        );
    }
}
export default Navigator;