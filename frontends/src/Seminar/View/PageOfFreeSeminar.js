import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Card from 'react-bootstrap/Card'
import Navigator from '../Navigator'
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko'
moment.locale('ko')

const get_posts_of_free_seminar = 'query{ postsOfFreeSeminar { createdAt ,title, id } }';

class PageOfFreeSeminar extends Component {  
    constructor(props) {
        super(props);
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
        }).then(result => {this.postsOfFreeSeminar = 
            this.setState({ postsOfFreeSeminar:result.data.data.postsOfFreeSeminar });
        });
    }
    render() {
        
        return (
            <div>
                <Navigator {...this.props}/>
                <Jumbotron fluid>
                    <Container>
                        <h1 className="display-4">자유게시판</h1>
                        <p className="lead">학교에 관한 자유로운 이야기를 들려주세요</p>
                    </Container>
                </Jumbotron>
                <Container className="p-3">
                {this.state.postsOfFreeSeminar.map(post => (
                    <Card className="m-3 p-3 shadow-sm" style={{ cursor: "poitner" }} key={post.id}>
                        <Card.Title as="h4">
                        {post.title}
                        </Card.Title>
                        <Card.Text as="h5">
                            {moment(Date.parse(post.createdAt)).fromNow()}
                        </Card.Text>
                    </Card>
                ))}
                </Container>
            </div>
        );
    }
}
export default PageOfFreeSeminar;