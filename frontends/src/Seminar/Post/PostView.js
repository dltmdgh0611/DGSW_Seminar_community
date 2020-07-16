import React, { Component } from 'react';
import {Modal,Button,Form,Jumbotron,Container,Badge,Card} from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize';
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

const cms = {
    height : "24px",
    fontSize: "16px",
    color: "#202020",
    resize: "none",
    outline: "0 none",
    lineHeight: "24px",
    overflow: "hidden",
    letterSpacing: "-.4px",
    minHeight: "50px" 
}

class PostView extends Component {  
    constructor(props) {
        super(props);
        this.state = {
            me: undefined,
            targetseminar:[],
            comments:[],
            comment_content:'',
            postnamespace:'',
            postuuid:'',
            currentTitle:'',
            currentContent:'',
            show_edit_modal:'',
            edit_title:'', edit_content:'', edit_tag:'Web',
            gradeone:false, gradetwo:false, gradethree:false
        }
        
    }

    ShowEditModal = () => { this.setState({show_edit_modal: true}); }
    HideEditModal = () => { this.setState({show_edit_modal: false}); }

    handleChangetitle = (event) =>{this.setState({edit_title: event.target.value})}
    handleChangecontent = (event) => {this.setState({edit_content: event.target.value})}
    handleChangetag = (event) => {this.setState({edit_tag : event.target.value})}

    handleChangetag_grade1 = (event) => {this.setState({gradeone : !this.state.gradeone}); console.log(this.state.gradeone) }
    handleChangetag_grade2 = (event) => {this.setState({gradetwo : !this.state.gradetwo}); console.log(this.state.gradetwo)}
    handleChangetag_grade3 = (event) => {this.setState({gradethree : !this.state.gradethree}); console.log(this.state.gradethree)}

    handleChangeComment = (event) => {
        this.setState({comment_content: event.target.value})
        console.log(this.state.comment_content)
    }


    postbtn = (event) => {
        this.setState(this.doEditPost(this.state.postuuid,this.state.edit_title, this.state.edit_content, this.state.edit_tag, this.state.gradeone, this.state.gradetwo, this.state.gradethree))
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

        axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `query{
                    comment(refLinkUuid:"${this.state.postuuid}"){
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
            console.log(this.state.comments)
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

    async doEditPost(uuid, title, content, tag, one, two, three){
        if(one) tag += ',1학년' 
        if(two) tag += ',2학년'
        if(three) tag += ',3학년'
    
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation{
                    updatePost(
                      uuid:"${uuid}"
                      title:"${title}"
                      content:"${content}"
                      tagkind:"${tag}"
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
        if(result.status == 200){
            if(result.data.data.updatePost.ok == true){
                this.HideEditModal()
                window.location.reload()
            }
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
            this.state.currentTitle = post.postoffreeseminar.title
            return(
                <h1 className=" pb-2 mb-0">
                    {post.postoffreeseminar.title}
                </h1>
            );
        }
        else if(this.state.postnamespace == 'request'){
            this.state.currentTitle = post.postofrequestseminar.title
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
            this.state.currentTitle = post.postofrecruitseminar.title
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
            this.state.currentContent = post.postoffreeseminar.content
            return (
                <div className="media-body pb-5 pt-5 lh-125 border-top border-gray">
                    {post.postoffreeseminar.content.split(",").map(content =>(
                        <>
                        <a>{content}</a>
                        <br></br>
                        </>
                    ))}
                </div>
            );
        }
        else if(this.state.postnamespace == 'request') 
        {
            this.state.currentContent = post.postofrequestseminar.content
            return (
                <div className="media-body pb-5 pt-5 lh-125 border-top border-gray">
                    {post.postofrequestseminar.content.split(",").map(content =>(
                        <>
                        <a>{content}</a>
                        <br></br>
                        </>
                    ))}
                </div>
            );
        }
        else if(this.state.postnamespace == 'recruit') 
        {
            this.state.currentContent = post.postofrecruitseminar.content
            return (
                <div className="media-body pb-5 pt-5 lh-125 border-top border-gray">
                    {post.postofrecruitseminar.content.split(",").map(content =>(
                        <>
                        <a>{content}</a>
                        <br></br>
                        </>
                    ))}
                </div>
            );
        }
    }

    setpermission = (post) => {
        if(this.state.me != null){
            if(post.writer.username == this.state.me.username){
                return(
                    <div>
                        <span onClick={this.ShowEditModal} style={{cursor: "pointer"}} className="mr-3">수정하기</span>
                        <span onClick={ () => this.setState(this.doDeletePost(this.state.postuuid))} style={{cursor: "pointer"}} className="mr-3">삭제하기</span>
                    </div>
                );
            }   
        }
    }
    
    Editmodal_tag(){
        if(this.state.postnamespace != 'free'){
            return(
                <select className="form-control mb-4 w-25" name="tag_kind" onChange={this.handleChangetag}>
                        <option>Web</option>
                        <option>Android</option>
                        <option>Window</option>
                        <option>Embedded</option>
                        <option>Design</option>
                        <option>Know-how</option>
                        <option>ETC</option>
                </select>
            );
        }
    }

    EditModal_recruit(){
        if(this.state.postnamespace == 'recruit'){
            return(
                <div className="py-3 my-3">
                    <h4 className="mb-3"> 타겟 학년 : </h4>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value=",1학년" name="tag_kind" onChange={this.handleChangetag_grade1}/>
                        <label className="form-check-label" for="inlineCheckbox1" name="tag_kind">1학년</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value=",2학년" name="tag_kind" onChange={this.handleChangetag_grade2}/>
                        <label className="form-check-label" for="inlineCheckbox2" name="tag_kind">2학년</label>
                    </div>
                    <div className="form-check form-check-inline mb-4">
                        <input className="form-check-input" type="checkbox" id="inlineCheckbox3" value=",3학년" name="tag_kind" onChange={this.handleChangetag_grade3}/>
                        <label className="form-check-label" for="inlineCheckbox3">3학년</label>
                    </div>
                    <h4 className="mb-3"> 최소 인원 ~ 최대 인원 : </h4>
                    <div className="inline mb-4">
                        <input type="text" style={{"width" : "50px"}} name="min_people_count"></input> 명
                        ~
                        <input type="text" style={{"width" : "50px"}} name="max_people_count"></input> 명
                    </div>
                    <h4 className="mb-3"> 차시 수 : </h4>
                    <div className="inline">
                        <input type="text" style={{"width" : "50px"}} name="class_count"></input> 차시
                    </div>
                </div>
            );
        }
    }

    EditModal(props){
        const tts = {
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

        const cts = {
            width: "100%",
            border: "none",
            fontSize: "16px",
            color: "#202020",
            outline: "0 none",
            overflow: "hidden",
        }


        return (
            <Modal
              show={this.state.show_edit_modal}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton onClick={this.HideEditModal}>
                <Modal.Title id="contained-modal-title-vcenter">
                  강의 수정하기
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form className="p-4">
                    {this.Editmodal_tag()}
                    {this.EditModal_recruit()}

                    

                    <input style={tts} type="text" name="title" defaultValue={this.state.currentTitle}  onChange={this.handleChangetitle}></input>
                    <br></br>
                    <hr></hr>
                    <TextareaAutosize type="text" style={cts} defaultValue={this.state.currentContent} onChange={this.handleChangecontent}/>
                    <br></br>
                  </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={ this.postbtn }>수정하기</Button>
              </Modal.Footer>
            </Modal>
          );
    }

    async doCommentCreate(content, user, postlink){
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation{
                    createComment(
                      content:"${content}",
                      linkId:"${postlink}",
                      userId:"3440eb36-70c3-480a-93fb-1116932afdd6"
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

        if(result.status == 200){
            console.log(result)
            if(result.data.data.createComment.ok == true){
                console.log("ok")
                window.location.reload()
            }
            else alert("create error")
        }
        else alert("lf")
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
                <hr></hr>
                
                <div className="input-group">
                    <textarea type="text" className="form-control" style={{"height":"50px"}} placeholder="Write your comment" onChange={this.handleChangeComment}></textarea>
                    <div className="input-group-btn">
                        <button className="btn bhi" style={{"border": "solid 1px #ccc", "height":"50px"}}
                        onClick={ () =>this.setState(this.doCommentCreate(this.state.comment_content,"",this.state.postuuid))}>
                            <svg className="bi bi-capslock-fill" width="24px" height="24px" viewBox="0 0 16 16" fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                    d="M7.27 1.047a1 1 0 0 1 1.46 0l6.345 6.77c.6.638.146 1.683-.73 1.683H11.5v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1H1.654C.78 9.5.326 8.455.924 7.816L7.27 1.047zM4.5 13.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-5a1 1 0 0 1-1-1v-1z"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <hr></hr>
                {this.state.comments.map(comment => (
                <div className="my-4">
                    <strong> {comment.commentWriter.username} </strong>
                    <a>{moment(Date.parse(comment.commentDate)).fromNow()}</a>
                    <br></br>
                <a>{comment.commentContent}</a>
                </div>
                ))}
                {this.EditModal()}
                </div> 
                

                
                

            </>
        );
    }
}
export default PostView;