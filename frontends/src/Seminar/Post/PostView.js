import React, { Component } from 'react';
import Badge from 'react-bootstrap/Badge'
import Navigator from '../Navigator'
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko'
import cookie from 'react-cookies';
moment.locale('ko')



const all_seminar = ``;

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
            me: undefined,
            targetseminar:[],
            postnamespace:'',
            postuuid:''
        }
        
    }
   
    
    componentWillMount(){
        this.setState( { me : cookie.load('me')})
    }
    componentDidMount() {        
        this.state.postuuid = new URLSearchParams(this.props.location.search).get('v')
        axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: 
                `query{
                    links(uuid:"${this.state.postuuid}"){
                      writer {
                        username
                      }
                      postoffreeseminar{
                        title
                        content
                        createdAt
                      }
                      postofrecruitseminar{
                        title
                        content
                        createdAt
                        getTags{
                            name
                          }
                      }
                      postofrequestseminar{
                        title
                        content
                        createdAt
                        getTags{
                            name
                          }
                      }
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }).then(result => {
            this.state.targetseminar = this.setState({ targetseminar:result.data.data.links });
            console.log(this.state.targetseminar)
        });
        
        
    }

    async doDeletePost(uuid){
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation{
                    deletePost(uuid:"${uuid}"){
                      ok
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": cookie.load('token')
            }
        })

        if(result.status == 200){
            console.log(result.data.data.deletePost.ok)
            if(result.data.data.deletePost.ok == true){
                window.history.back()
                console.log("ok")
            }
            else alert("delete error")
        }
        else alert("lf")
    }

    whatkindpost = (post) =>{
        if(post.postoffreeseminar != null) this.state.postnamespace = 'free'
        else if(post.postofrequestseminar != null) this.state.postnamespace = 'request'
        else if(post.postofrecruitseminar != null) this.state.postnamespace = 'recruit'
        console.log(this.state.postnamespace)
    }

    printTitle = (post) => {
        console.log(post)
        if(this.state.postnamespace == 'free'){
            return(
                <h1 className=" pb-2 mb-0">
                    {post.postoffreeseminar.title}
                </h1>
            );
        }
        else if(this.state.postnamespace == 'request'){
            return(
                <h1 className=" pb-2 mb-0">
                    {post.postofrequestseminar.title}
                    {post.postofrequestseminar.getTags
                    .map(tag => (
                    <Badge key={tag.id} variant={(tag.name.indexOf('학년') > -1 ? "secondary" : "success") + " mx-1"} >{tag.name}</Badge>
                    ))}
                </h1>
            );
        }
        else if(this.state.postnamespace == 'recruit'){
            return(
                <h1 className=" pb-2 mb-0">
                    {post.postofrecruitseminar.title}
                    {post.postofrecruitseminar.getTags
                    .map(tag => (
                    <Badge key={tag.id} variant={(tag.name.indexOf('학년') > -1 ? "secondary" : "success") + " mx-1"} >{tag.name}</Badge>
                    ))}
                </h1>
            );
        }
    }

    printmoment = (post) => {
        console.log(this.state.postnamespace)
        if(this.state.postnamespace == 'free') {return (moment(Date.parse(post.postoffreeseminar.createdAt)).fromNow());}
        else if(this.state.postnamespace == 'request') {return (moment(Date.parse(post.postofrequestseminar.createdAt)).fromNow());}
        else if(this.state.postnamespace == 'recruit') {return (moment(Date.parse(post.postofrecruitseminar.createdAt)).fromNow());}
    }

    printcontent = (post) => {
        if(this.state.postnamespace == 'free') {
            return (
                <div className="media-body pb-5 pt-5 lh-125 border-top border-gray">
                    {post.postoffreeseminar.content}
                </div>
            );
        }
        else if(this.state.postnamespace == 'request') 
        {
            return (
                <div className="media-body pb-5 pt-5 lh-125 border-top border-gray">
                    {post.postofrequestseminar.content}
                </div>
            );
        }
        else if(this.state.postnamespace == 'recruit') 
        {
            return (
                <div className="media-body pb-5 pt-5 lh-125 border-top border-gray">
                    {post.postofrecruitseminar.content}
                </div>
            );
        }
    }

    setpermission = (post) => {
        if(post.writer.username == this.state.me.username){
            return(
                <span onClick={ () => this.setState(this.doDeletePost(this.state.postuuid))} style={{cursor: "pointer"}} className="mr-3">삭제하기</span>
            );
        }
    }
    

    render() {
        
        return (
            <>
                <Navigator {...this.props}/>
                
                <div className="my-5 p-5 rounded bg-white shadow-sm container">
                {this.state.targetseminar.map(post => (
                    
                        <React.Fragment>
                            <React.Fragment>
                            
                            {this.whatkindpost(post)}
                            {this.printTitle(post)}
                            
                            <div className="text-right mb-2 d-flex align-items-center">
                                <div className="mr-auto">
                                    {this.printmoment(post)}
                                    <strong>- {post.writer.username}</strong>
                                    님 작성
                                </div>
                                {this.setpermission(post)}
                            </div>
                            </React.Fragment>
                            <React.Fragment>
                                {this.printcontent(post)}
                            </React.Fragment> 
                            
                        </React.Fragment>
                ))}
                </div> 
            </>
        );
    }
}
export default PostView;