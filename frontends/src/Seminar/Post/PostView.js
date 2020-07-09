import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge'
import Navigator from '../Navigator'
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko'
moment.locale('ko')



const all_seminar = 'query{ search(keyword:""){ title, content, createdAt, uuid, tagKind} }';

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

class PostView extends Component {  
    constructor(props) {
        super(props);
        this.state = {
            allseminar:[]
            
        }
        
    }
   
    

    componentDidMount() {        
        this.postuuid = new URLSearchParams(this.props.location.search).get('v')
        axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: all_seminar
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }).then(result => {this.search = 
            this.setState({ allseminar:result.data.data.search });
        });
    }


    render() {
        
        return (
            <>
                <Navigator {...this.props}/>
                <div className="my-5 p-5 rounded bg-white shadow-sm container">
                    {this.state.allseminar.filter(allseminar => allseminar.uuid.includes(this.postuuid)).map(post => (
                        <React.Fragment>
                            <React.Fragment>
                            <h1 class=" pb-2 mb-0">
                                {post.title}
                                {render_tags(post)}
                            </h1>
                            <div class="text-right mb-2 d-flex align-items-center">
                                <div class="mr-auto">
                                    {moment(Date.parse(post.createdAt)).fromNow()}
                                    <strong>- {post.writer}</strong>
                                    님 작성
                                </div>
                                <span onclick="" style={{cursor: "poitner"}} class="mr-3">삭제하기</span>
                            </div>
                            </React.Fragment>
                            <React.Fragment>
                                <div class="media-body pb-5 pt-5 lh-125 border-top border-gray">
                                    {post.content}
                                </div>
                            </React.Fragment>
                            
                        </React.Fragment>
                    ))}
                </div>
            </>
        );
    }
}
export default PostView;