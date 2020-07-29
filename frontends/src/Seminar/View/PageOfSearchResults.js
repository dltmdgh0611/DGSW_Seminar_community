import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Navigator from '../Navigator'
import moment from 'moment';
import 'moment/locale/ko'
import axios from 'axios';
import cookie from 'react-cookies';

moment.locale('ko')


const render_tags = (post) => {
    if (post.tagKind)
        return post.tagKind
        .split(',')
        .sort()
        .map(tag => (
        <Badge variant={(tag.indexOf('학년') > -1 ? "secondary" : "success") + " mx-1"}>{tag}</Badge>
        ))
    return ;
}

class PageOfSearchResults extends Component { 

    constructor(props) {
      super(props);
      this.state = {
        search_result: [],
      };
    }

    updateSerachResult() {        
        const keyword = new URLSearchParams(this.props.location.search).get('s')
        if (keyword.length > 0)
        {
            axios({
                method: "POST",
                url: "http://localhost:8000/api",
                data: {
                    
                    query: `query{
                        search(keyword:"${keyword}"){
                          title,
                          createdAt,
                          uuid,
                          namespace,
                          username,
                          tagKind
                        }
                      }`
                },
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Authorization": cookie.load('token'),
                }
            }).then(result => {this.search_result = 
                this.setState({ search_result:result.data.data.search });
            });
        }
    }

    componentDidUpdate(prv_prop, pr_state, snapshot) {
        if (this.props.location.search !== prv_prop.location.search)
            this.updateSerachResult();
        
        prv_prop = this.props
    }

    componentDidMount() {
        this.updateSerachResult();
    }

    GoPost(e, post) {
        e.preventDefault();
        if(post.namespace === "PostOfFreeSeminar"){
            this.props.history.push('/postview/free_seminar/?v='+ e.currentTarget.getAttribute('value'));
        }
        else if(post.namespace === "PostOfRequestSeminar"){
            this.props.history.push('/postview/request_seminar/?v='+ e.currentTarget.getAttribute('value'));
        }
        else if(post.namespace === "PostOfRecruitSeminar"){
            this.props.history.push('/postview/recruit_seminar/?v='+ e.currentTarget.getAttribute('value'));
        }
        
    }

    ViewNamespace(post){
        console.log(post.namespace)
        if(post.namespace === "PostOfFreeSeminar"){
            return(
                <>자유게시판</>
            );
        }
        else if(post.namespace === "PostOfRequestSeminar"){
            return(
                <>강의요청</>
            );
        }
        else if(post.namespace === "PostOfRecruitSeminar"){
            return(
                <>강의목록</>
            );
        }
    }

    render() {
        
        return (
            <>
                <Navigator {...this.props}/>
                <Container className="p-3">

                {this.state.search_result.map(post => (
                    <Card className="m-3 p-3 shadow-sm" style={{ cursor: "pointer" }} key={post.id}>
                        <Card.Title as="h4" style={{ "cursor": "pointer" }} onClick={(e) => this.GoPost(e, post)} value={post.uuid}>
                            {post.title}
                            {render_tags(post)}
                        </Card.Title>
                        <Card.Text as="h5">
                            {moment(Date.parse(post.createdAt)).fromNow()} - {post.username} - {this.ViewNamespace(post)}
                        </Card.Text>
                    </Card>
                ))}
                </Container>
            </>
        );
    }
}
//ReactDOM.render(<SearchSeminar />, document.getElementById('root'));
export default PageOfSearchResults;