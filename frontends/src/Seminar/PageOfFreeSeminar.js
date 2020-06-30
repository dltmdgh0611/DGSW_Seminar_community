import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Navigator from './Navigator'

import axios from 'axios';
 
const get_posts_of_free_seminar = 'query{ posts { title, id } }';

class PageOfFreeSeminar extends Component {  
    constructor() {
        super();
        this.state = { posts: [] };
    }

    componentDidMount() {        
        axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: get_posts_of_free_seminar
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }).then(result => {this.posts = 
            this.setState({ posts:result.data.data.posts });
        });
    }
    render() {
        return (
            <div>
                <Navigator/>
                <Jumbotron fluid>
                    <Container>
                        <h1 className="display-4">자유게시판</h1>
                        <p className="lead">학교에 관한 자유로운 이야기를 들려주세요</p>
                    </Container>
                </Jumbotron>
                <Container className="p-3">
                {this.state.posts.map(post => (
                    <Card className="m-3 p-3 shadow-sm" style={{ cursor: "poitner" }} key={post.id}>
                        <Card.Title as="h4">
                        {post.title}
                        </Card.Title>
                        <Card.Text as="h5">
                            3일전 작성
                        </Card.Text>
                    </Card>
                ))}
                </Container>
            </div>
        );
    }
}
export default PageOfFreeSeminar;