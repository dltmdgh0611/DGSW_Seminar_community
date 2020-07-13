import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Badge from 'react-bootstrap/Badge'
import Card from 'react-bootstrap/Card'
import Navigator from '../Navigator'
import moment from 'moment';
import 'moment/locale/ko'
import axios from 'axios';
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
                    
                    query: `query{ search(keyword:"${keyword}"){ uuid, id, title, createdAt, tagKind, namespace }}`
                },
                headers: {
                    "Access-Control-Allow-Origin": "*",
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

    render() {
        
        return (
            <>
                <Navigator {...this.props}/>
                <Container className="p-3">

                {this.state.search_result.map(post => (
                    <Card className="m-3 p-3 shadow-sm" style={{ cursor: "poitner" }} key={post.id}>
                        <Card.Title as="h4" style={{ cursor: "poitner" }}>
                            {post.title}
                            {render_tags(post)}
                        </Card.Title>
                        <Card.Text as="h5">
                            {post.namespace} 
                            {moment(Date.parse(post.createdAt)).fromNow()} {post.writer}
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