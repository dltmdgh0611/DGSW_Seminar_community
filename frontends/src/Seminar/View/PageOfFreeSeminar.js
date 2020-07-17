import React, { Component } from 'react';
import Navigator from '../Navigator'
import axios from 'axios';
import moment from 'moment';
import {Modal,Button,Form,Jumbotron,Container,Card} from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize';
import 'moment/locale/ko'
import cookie from 'react-cookies';

moment.locale('ko')


const get_posts_of_free_seminar = 'query{ postsOfFreeSeminar{ id, title, createdAt, link{ uuid, writer { username } } } }';

class WriteForm extends Component {
    tts = {
        width: "100%",
        height: "56px",
        border: "none",
        fontSize: "30px",
        color: "#202020",
        resize: "none",
        outline: "0 none",
        lineHeight: "40px",
        overflow: "hidden",
        letterSpacing: "-.4px"
    }

    cts = {
        width: "100%",
        border: "none",
        fontSize: "16px",
        color: "#202020",
        outline: "0 none",
        overflow: "hidden",
    }

    constructor(props) {
        super(props);
        this.state = {
            Show: false,
            Title: "",
            Content: "",
            UUID: ""
        }      
        console.log(this.props)
        if (this.props.Edit === true) {
            this.state.Title =  this.props.Title;
            this.state.Content = this.props.Content
        }
        console.log(this.state)
        this.input_title = React.createRef();
        this.input_content = React.createRef();
    }

    Show() { this.setState({Show: true}) }
    Hide() { this.setState({Show: false}) }
    
    async Submit(title, content, uuid ) {
        
        
        if (this.props.Edit === true) {
            const result = await axios({
                method: "POST",
                url: "http://localhost:8000/api",
                data: {
                    query: `mutation{
                        updatePost(
                          uuid:"${uuid}"
                          title:"${title}"
                          content:"${content.split("\n")}"
                        ){
                          ok
                        }
                      }`
                },
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Authorization": cookie.load('token')
                }
            })
            if(result.status === 200){
                if(result.data.data.updatePost.ok === true) {
                    this.Hide()
                    window.location.reload()
                } else alert('글 수정에 실패 했습니다.')
            } else alert('글 수정에 실패 했습니다.')  
        }
        else {
            const result = await axios({
                method: "POST",
                url: "http://localhost:8000/api",
                data: {
                    query: `mutation {
                        createPost(
                            title:"${title}",
                            content:"${content.split("\n")}",
                            KindOf:"PostOfFreeSeminar"
                        )
                        {
                            ok
                        }
                        }`
                },
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Authorization": cookie.load('token')
                }
            })
    
            if(result.status === 200){
                if(result.data.data.createPost.ok === true) {
                    this.Hide()
                    window.location.reload()
                } else alert('글 작성에 실패 했습니다.')
            } else alert('글 작성에 실패 했습니다.')    
        }    
    }

    componentDidMount() {
    }

    render() {
        return (
            <Modal
            show={this.state.Show}
            onHide = {()=>{}}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            >
            <Modal.Header closeButton onClick={() => this.Hide()}>
                <Modal.Title id="contained-modal-title-vcenter">
                    자유게시판 {this.props.Edit ? "수정하기" : "작성하기"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="p-4">
                    <input style={this.tts} type="text" name="title" placeholder="TITLE" ref={this.input_title} defaultValue={this.state.Title}></input>
                    <br/>
                    <hr/>
                    <TextareaAutosize style={this.cts} placeholder="CONTENT" ref={this.input_content} defaultValue={this.state.Content.replaceAll(",", "\n")}/>
                    <br/>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={ () => this.Submit(this.input_title.current.value, this.input_content.current.value, new URLSearchParams(window.location.search).get('v'))}>작성하기</Button>
            </Modal.Footer>
            </Modal>
        );
    }
}

class PostView extends Component {  
    constructor(props) {
        super(props);
        this.state = {
            me: cookie.load('me'),
            post: null,
            comments:[],
            recommend:[],
            isRecommend:false,
            show_post_modal: null
        }
        this.commnet_form = React.createRef();      
        this.write_form = React.createRef();  
    }
    
    componentDidMount() {        
        const link_uuid = new URLSearchParams(window.location.search).get('v');
        axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: 
                `query{
                    links(uuid:"${link_uuid}"){
                      writer {
                        username
                      }
                      postoffreeseminar{
                        title
                        content
                        createdAt
                      }
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }).then(result => {
            this.setState({ post:result.data.data.links[0] });
        });

        axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `query{
                    comment(refLinkUuid:"${link_uuid}"){
                        uuid,
                      commentDate,
                      commentWriter{
                        username
                      }
                      commentContent
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }).then(result => {
            this.setState({ comments:result.data.data.comment });
        });
        this.setState({ link_uuid: link_uuid });
        

        axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `query{
                    recommend(refLinkUuid:"${link_uuid}")
                    {
                      id,
                      user {
                        uuid
                      }
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        }).then(result => {
            
            this.setState({ recommend:result.data.data.recommend });
            
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

        if(result.status === 200){
            console.log(result.data.data.deletePost.ok)
            if(result.data.data.deletePost.ok === true){
                window.history.back()
                console.log("ok")
            }
            else alert("delete error")
        }
        else alert("lf")
    }


    GetEditButtonBar = () => {
        if(this.state.me != null){
            if(this.state.post.writer.username === this.state.me.username){
                return(
                    <div>
                        <span onClick={ () => this.write_form.current.Show()} style={{cursor: "pointer"}} className="mr-3">수정하기</span>
                        <span onClick={ () => this.setState(this.doDeletePost(this.state.link_uuid))} style={{cursor: "pointer"}} className="mr-3">삭제하기</span>
                    </div>
                );
            }   
        }
    }
    
    tts = {
        width: "100%",
        height: "56px",
        border: "none",
        fontSize: "30px",
        color: "#202020",
        resize: "none",
        outline: "0 none",
        lineHeight: "40px",
        overflow: "hidden",
        letterSpacing: "-.4px"
    }

    cts = {
        width: "100%",
        border: "none",
        fontSize: "16px",
        color: "#202020",
        outline: "0 none",
        overflow: "hidden",
    }

    async doCommentCreate(user){
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation{
                    createComment(
                      content:"${this.commnet_form.current.value.split("\n")}",
                      linkId:"${this.state.link_uuid}",
                      userId:"${this.state.me.uuid}"
                    ){
                      ok
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": cookie.load('token')
            }
        })

        if(result.status === 200){
            console.log(result)
            if(result.data.data.createComment.ok === true){
                console.log("ok")
                window.location.reload();
            }
            else alert("create error")
        }
        else alert("lf")
    }


    deleteCommentValue(comment){
        if(comment.commentWriter.username === this.state.me.username){
            return(
                <span style={{"cursor" : "pointer"}} onClick={ () => this.setState(this.deleteComment(comment))}>   삭제하기</span>
            );
        }
    }

    async deleteComment(comment){
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation{
                    deleteComment(uuid:"${comment.uuid}"){
                      ok
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": cookie.load('token')
            }
        })
        if(result.status === 200){
            if(result.data.data.deleteComment.ok === true){
                window.location.reload();
            }
            else alert("delete error")
        }
        else alert("lf")
    }

    async ADDRecommend(user, post){
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation{
                    createRecommend(
                      userId:"${user}"
                      linkId:"${post}"
                    ){
                     ok 
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": cookie.load('token')
            }
        })
        if(result.status === 200){
            if(result.data.data.createRecommend.ok === true){
                window.location.reload();
            }
            else alert("delete error")
        }
        else alert("delete error")
    }

    async DELRecommend(user, post){
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation{
                    deleteRecommend(
                      userId:"${user}"
                      linkId:"${post}"
                    ){
                     ok 
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": cookie.load('token')
            }
        })
        if(result.status === 200){
            if(result.data.data.deleteRecommend.ok === true){
                window.location.reload();
            }
            else alert("delete error")
        }
        else alert("delete error")
    }

    toggleRecommend(){     
        const flagDiv={
            float: "left",
            borderRadius: "16px",
            border: "1px solid #959595",
            borderColor: "rgba(185,185,185,0.5)",
            cursor: "pointer"
        }
        
            this.state.recommend.map(recommend => {
                if(recommend.user.uuid === this.state.me.uuid){
                    this.state.isRecommend = true
                }
            })

            if(this.state.isRecommend){
                return (
                        <div className="px-2 pb-1" style={flagDiv} onClick={() =>this.setState(this.DELRecommend(this.state.me.uuid, this.state.link_uuid))}>
                            <svg className="bi bi-flag-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>
                            <path fillRule="evenodd"
                                d="M3.762 2.558C4.735 1.909 5.348 1.5 6.5 1.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126a8.89 8.89 0 0 0 .593-.25c.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 9.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916A.5.5 0 0 1 3.5 9V3a.5.5 0 0 1 .223-.416l.04-.026z"/>
                            </svg>
                            <a className="mx-2">{this.state.recommend.length}</a>
                        </div>
                );
            }
            else{
                return (
                        <div className="px-2 pb-1" style={flagDiv} onClick={() =>this.setState(this.ADDRecommend(this.state.me.uuid, this.state.link_uuid))}>
                            <svg className="bi bi-flag" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>
                            <path fillRule="evenodd"
                                d="M3.762 2.558C4.735 1.909 5.348 1.5 6.5 1.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126a8.89 8.89 0 0 0 .593-.25c.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 9.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 1 1-.515-.858C4.735 7.909 5.348 7.5 6.5 7.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126.187-.068.376-.153.593-.25.058-.027.117-.053.18-.08.456-.204 1-.43 1.64-.512V2.543c-.433.074-.83.234-1.234.414l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 3.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 0 1-.554-.832l.04-.026z"/>
                            </svg>
                            <a className="mx-2">{this.state.recommend.length}</a>
                        </div>
                );
            } 
        
    }

    render() {        
        let post_view = <></>;
        if (this.state.post != null) {
            post_view = (
            <div className="my-5 p-5 rounded bg-white shadow-sm container">
                <WriteForm Show={this.state.show_post_modal} 
                    Edit={true} 
                    Title={this.state.post.postoffreeseminar.title} 
                    Content={this.state.post.postoffreeseminar.content} 
                    ref={this.write_form}
                />
                <h1 className=" pb-2 mb-0">
                    {this.state.post.postoffreeseminar.title}
                </h1>
                <div className="text-right mb-2 d-flex align-items-center">
                    <div className="mr-auto">
                        {moment(Date.parse(this.state.post.postoffreeseminar.createdAt)).fromNow()}
                        <strong>- {this.state.post.writer.username}</strong>
                        님 작성
                    </div>
                    {this.GetEditButtonBar()}
                </div>
                
                <div className="media-body pb-5 pt-5 lh-125 border-top border-gray" 
                    dangerouslySetInnerHTML = {{__html:
                       this.state.post.postoffreeseminar.content.replaceAll(",", "<br/>")
                    }}
                />

                <div className="align-items-center mb-5">
                    {this.toggleRecommend()}
                </div>
                
                <hr/>                
                <div className="input-group">
                    <textarea ref={this.commnet_form} type="text" className="form-control" style={{"height":"50px"}} placeholder="Write your comment" onChange={this.handleChangeComment}></textarea>
                    <div className="input-group-btn">
                        <button className="btn bhi" style={{"border": "solid 1px #ccc", "height":"50px"}}
                        onClick={ () =>this.setState(this.doCommentCreate())}>
                            <svg className="bi bi-capslock-fill" width="24px" height="24px" viewBox="0 0 16 16" fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                    d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM4.5 13.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1z"/>
                            </svg>
                        </button>
                    </div>
                </div>    
                <hr/>
                {this.state.comments.map(comment => (
                    <div key={comment.uuid} className="my-4">
                        <div className="px-3 py-2" style={{"display" : "inline-block", "borderRadius": "15px", "backgroundColor": "#F0F2F5"}}>
                        <strong> {comment.commentWriter.username} </strong>
                        {moment(Date.parse(comment.commentDate)).fromNow()}
                        {this.deleteCommentValue(comment)}
                        <br/>
                        
                        <div
                            dangerouslySetInnerHTML = {{__html:
                                comment.commentContent.replaceAll(",", "<br/>")
                            }}
                        />
                        </div>
                    </div>
                ))}
            </div> 
            );
        }
        return (
            <>
                <Navigator {...this.props}/>
                {post_view}
            </>
        );
    }
}

class PageOfFreeSeminar extends Component {  
    constructor(props) {
        super(props);
        this.state = {
            posts:[],
            cts_var : 56
        }
       this.write_form = React.createRef();
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
        }).then(result => {
            console.log(result.data.data);
            this.setState({ posts:result.data.data.postsOfFreeSeminar });
        });
    }
    
    GoPost(e) {
        e.preventDefault();
        this.props.history.push('/postview/free_seminar/?v='+ e.currentTarget.getAttribute('value'));
    }

    render() {
        
        return (
            <>
                <Navigator {...this.props}/>
                <Jumbotron fluid>
                    <Container>
                        <h1 className="display-4">자유게시판</h1>
                        <p className="lead">학교에 관한 자유로운 이야기를 들려주세요</p>
                    </Container>
                </Jumbotron>
                <Container className="p-3">
                <Card className="m-3 p-4 shadow" style={{ "cursor": "pointer" }} onClick={() =>this.write_form.current.Show()}>
                    <Card.Text as="h5">
                        글을 작성하시려면 클릭해주세요
                    </Card.Text>
                </Card>
                <WriteForm Show={this.state.show_post_modal} ref={this.write_form}/>
                {this.state.posts.map(post => (
                    <Card key={post.id} className="m-3 p-3 shadow-sm" style={{ "cursor": "pointer" }} 
                    onClick={(e) => this.GoPost(e)}
                    value ={post.link.uuid}
                    >
                        <Card.Title as="h4">
                        {post.title}
                        </Card.Title>
                        <Card.Text as="h5">
                            {moment(Date.parse(post.createdAt)).fromNow()}-{post.link.writer.username}
                        </Card.Text>
                    </Card>
                ))}
                </Container>
            </>
        );
    }
}


export default PageOfFreeSeminar;
export {PostView};