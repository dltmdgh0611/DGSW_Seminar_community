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

const get_posts_of_request_seminar = `{
        postsOfRequestSeminar {
            id
            title
            createdAt
            getTags {
                id
                name
            }
            link {
                uuid
            }
        }
    }
  `;

class PageOfRequestSeminar extends Component {  
    constructor(props) {
      super(props);
      this.state = {
        postsOfRequestSeminar:[]
      }
    }

    componentDidMount() {        
        axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: get_posts_of_request_seminar
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }).then(result => {this.postsOfRequestSeminar = 
            this.setState({ postsOfRequestSeminar:result.data.data.postsOfRequestSeminar });
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.history.push('/postview?v='+ this.sss);
    }

    render() {
        return (
            <>
                <Navigator {...this.props}/>
                <Jumbotron fluid>
                    <Container>
                        <h1 className="display-4">강의 요청</h1>
                        <p className="lead">듣고 싶은 강의를 요청해보세요</p>
                    </Container>
                </Jumbotron>
                <Container className="p-3">
                
                {this.state.postsOfRequestSeminar.map(post => (
                    <Card className="m-3 p-3 shadow-sm" style={{ cursor: "poitner" }} key={post.id} onClick={this.handleSubmit.bind(this)} onMouseOver={(e) => {this.sss = post.link.uuid}}>
                        <Card.Title as="h4">
                            {post.title}
                        <Badge variant="success mx-1">{post.tagKind}</Badge>
                        </Card.Title>
                        <Card.Text as="h5">
                            {moment(Date.parse(post.createdAt)).fromNow()}
                        </Card.Text>
                    </Card>
                ))}
                </Container>
            </>
        );
    }
}
export default PageOfRequestSeminar;