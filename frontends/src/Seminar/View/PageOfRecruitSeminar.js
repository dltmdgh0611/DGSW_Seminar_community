import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron'
import Container from 'react-bootstrap/Container'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Navigator from '../Navigator'
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko'
moment.locale('ko')

const get_posts_of_recruit_seminar = 'query{ postsOfRecruitSeminar { createdAt ,title, id, tagKind } }';

class PageOfRecruitSeminar extends Component {  
    constructor(props) {
      super(props);
    }

    componentDidMount() {        
        axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: get_posts_of_recruit_seminar
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }).then(result => {this.postsOfRecruitSeminar = 
            this.setState({ postsOfRecruitSeminar:result.data.data.postsOfRecruitSeminar });
            console.log(result)
        });
    }
    render() {

        return (
            <div>
                <Navigator {...this.props}/>
                <Jumbotron fluid>
                    <Container>
                        <h1 className="display-4">강의 목록</h1>
                        <p className="lead">자신만의 강의를 올려보세요</p>
                    </Container>
                </Jumbotron>
                <Container className="p-3">
                {this.state.postsOfRecruitSeminar.map(post => (
                    <Card className="m-3 p-3 shadow-sm" style={{ cursor: "poitner" }} key={post.id}>
                        <Card.Title as="h4">
                        {post.title}
                        {post.tagKind
                        .split(',')
                        .sort()
                        .map(tag => (
                           <Badge variant={(tag.indexOf('학년') > -1 ? "secondary" : "success") + " mx-1"}>{tag}</Badge>
                        ))}
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
export default PageOfRecruitSeminar;