import React, { Component } from 'react';
import Navigator from '../Navigator'
import axios from 'axios';
import moment from 'moment';
import {Modal,Button,Form,Jumbotron,Container,Badge,Card, ToggleButton, ToggleButtonGroup} from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize';
import 'moment/locale/ko'
import cookie from 'react-cookies';
import RecommendButton from '../RecommendButton';
import CommentControl from '../CommentControl'
moment.locale('ko')

const get_posts_of_recruit_seminar = `query{ postsOfRecruitSeminar{ id, title, createdAt, getTags { name } link{ uuid, writer { username } recommends{id} } } }`;

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
            
            g1: false,
            g2: false,
            g3: false
        }      
        if (this.props.Edit === true) {
            this.state.Title =  this.props.Title;
            this.state.Content = this.props.Content
        }
        


        this.minpeoplecount = React.createRef();
        this.maxpeoplecount = React.createRef();
        this.timesofcount = React.createRef();

        this.input_title = React.createRef();
        this.input_content = React.createRef();
        this.input_tag = React.createRef();
        this.grade1 = React.createRef();
        this.grade2 = React.createRef();
        this.grade3 = React.createRef();
    }

    Show() { this.setState({Show: true}) }
    Hide() { this.setState({Show: false}) }
    async  Submit(arg) {
/*{
                    title: this.input_title.current.value, 
                    content: this.input_content.current.value, 
                    tag: this.input_tag.current.value,
                    uuid: new URLSearchParams(window.location.search).get('v'), 
                    grade1: this.grade1.current.checked, 
                    grade2: this.grade2.current.checked, 
                    grade3: this.grade3.current.checked} */

        if (arg.grade1) arg.tag += ',1학년'
        if (arg.grade2) arg.tag += ',2학년'
        if (arg.grade3) arg.tag += ',3학년'
        
        if (this.props.Edit === true) {
            const result = await axios({
                method: "POST",
                url: "http://localhost:8000/api",
                data: {
                    query: `mutation{
                        updatePost(
                            uuid:"${arg.uuid}"
                            title:"${arg.title}"
                            tagkind:"${arg.tag}"
                            content:"${arg.content.split("\n")}"
                            minPeopleCount:${arg.minpeoplecount}
                            maxPeopleCount:${arg.maxpeoplecount}
                            timesOfClass:${arg.timesofclass}
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
                            title:"${arg.title}",
                            content:"${arg.content.split("\n")}",
                            tagKind:"${arg.tag}"
                            KindOf:"PostOfRecruitSeminar"
                            minPeopleCount:${arg.minpeoplecount}
                          	maxPeopleCount:${arg.maxpeoplecount}
                          	timesOfClass:${arg.timesofclass}
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
                    강의 모집글 작성 {this.props.Edit ? "수정하기" : "작성하기"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="p-4">
                    <select className="form-control mb-4 w-25" name="tag_kind" ref={this.input_tag}>
                        <option>Web</option>
                        <option>Android</option>
                        <option>Window</option>
                        <option>Embedded</option>
                        <option>Design</option>
                        <option>Know-how</option>
                        <option>ETC</option>
                    </select>
                    <div className="py-3 my-3">
                        <div className="d-inline-flex">
                            <h4 className="mb-3"> 차시 수 : </h4>
                            <div className="inline mx-3 mb-4">
                                <input type="text" style={{"width" : "50px"}} name="class_count" ref={this.timesofcount}></input> 차시
                            </div>
                        </div>
                        <br/>
                        <div className="d-inline-flex">
                            <h4 className="mb-4"> 타겟 학년 : </h4>
                            <div className="form-check form-check-inline mx-3 mb-3">
                                <input className="form-check-input" type="checkbox" id="inlineCheckbox1" name="tag_kind" ref={this.grade1}/>
                                <label className="form-check-label" for="inlineCheckbox1" name="tag_kind">1학년</label>
                            </div>
                            <div className="form-check form-check-inline mb-3">
                                <input className="form-check-input" type="checkbox" id="inlineCheckbox2" name="tag_kind" ref={this.grade2}/>
                                <label className="form-check-label" for="inlineCheckbox2" name="tag_kind">2학년</label>
                            </div>
                            <div className="form-check form-check-inline mb-3">
                                <input className="form-check-input" type="checkbox" id="inlineCheckbox3" name="tag_kind" ref={this.grade3}/>
                                <label className="form-check-label" for="inlineCheckbox3">3학년</label>
                            </div>
                        </div>
                        <br/>
                        <div className="d-inline-flex">
                            <h4 className="mb-3"> 최소 인원 ~ 최대 인원 : </h4>
                            <div className="inline mb-4 mx-3">
                                <input type="text" style={{"width" : "50px"}} name="min_people_count" ref={this.minpeoplecount}></input> 명
                                ~ <input type="text" style={{"width" : "50px"}} name="max_people_count" ref={this.maxpeoplecount}></input> 명
                            </div>
                        </div>
                        
                    </div>
                    <input style={this.tts} type="text" name="title" placeholder="TITLE" ref={this.input_title} defaultValue={this.state.Title.replace(/,/gi, "\n")}></input>
                    <br/>
                    <hr/>
                    <TextareaAutosize style={this.cts} placeholder="CONTENT" ref={this.input_content} defaultValue={this.state.Content}/>
                    <br/>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={ () => this.Submit({
                    title: this.input_title.current.value, 
                    content: this.input_content.current.value, 
                    tag: this.input_tag.current.value,
                    uuid: new URLSearchParams(window.location.search).get('v'), 
                    grade1: this.grade1.current.checked, 
                    grade2: this.grade2.current.checked, 
                    grade3: this.grade3.current.checked,
                    minpeoplecount: this.minpeoplecount.current.value,
                    maxpeoplecount: this.maxpeoplecount.current.value,
                    timesofclass: this.timesofcount.current.value, })}>작성하기</Button>
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
            recommends:[],
            isRecommend:false,
            show_post_modal: null
        }
        this.commnet_form = React.createRef();      
        this.write_form = React.createRef();  
    }
    
    componentDidMount() {        
        const link_uuid = new URLSearchParams(this.props.location.search).get('v');
        axios({ //POST
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: 
                `query{
                    links(uuid:"${link_uuid}"){
                      writer {
                        username
                      }
                      postofrecruitseminar{
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
                "Authorization": cookie.load('token'),
            }
        }).then(result => {
            this.setState({ post:result.data.data.links[0] });
        });

        axios({ //COMMENT
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
                "Authorization": cookie.load('token'),
            }
        }).then(result => {
            this.setState({ comments:result.data.data.comment });
        });
        this.setState({ link_uuid: link_uuid });
        
        
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
            if(result.data.data.deletePost.ok === true){
                window.history.back()
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
                        <span onClick={() =>this.write_form.current.Show()} style={{cursor: "pointer"}} className="mr-3">수정하기</span>
                        <span onClick={ () => this.setState(this.doDeletePost(this.state.link_uuid))} style={{cursor: "pointer"}} className="mr-3">삭제하기</span>
                    </div>
                );
            }   
        }
    }
    
   

    render() {        
        let post_view = <></>;
        if (this.state.post != null) {
            post_view = (
            <div className="my-5 p-5 rounded bg-white shadow-sm container">
                <WriteForm Show={this.state.show_post_modal} 
                    Edit={true} 
                    Title={this.state.post.postofrecruitseminar.title} 
                    Content={this.state.post.postofrecruitseminar.content} 
                    ref={this.write_form}
                />
                <h1 className=" pb-2 mb-0">
                    {this.state.post.postofrecruitseminar.title}
                    {this.state.post.postofrecruitseminar.getTags
                    .map(tag => (
                    <Badge key={tag.id} variant={(tag.name.indexOf('학년') > -1 ? "secondary" : "success") + " mx-1"} >{tag.name}</Badge>
                    ))}
                </h1>
                <div className="text-right mb-2 d-flex align-items-center">
                    <div className="mr-auto">
                        {moment(Date.parse(this.state.post.postofrecruitseminar.createdAt)).fromNow()}
                        <strong>- {this.state.post.writer.username}</strong>
                        님 작성
                    </div>
                    {this.GetEditButtonBar()}
                </div>
                
                <div className="media-body pb-5 pt-5 lh-125 border-top border-gray" 
                    dangerouslySetInnerHTML = {{__html:
                       this.state.post.postofrecruitseminar.content.replace(/,/gi, "<br/>")
                    }}
                />
                <div className="align-items-center mb-5">
                    <RecommendButton link_uuid={this.state.link_uuid}/>
                </div>
                <hr/>                
                <CommentControl link_uuid={this.state.link_uuid}/>
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

class PageOfRecruitSeminar extends Component {  
    constructor(props) {
      super(props);
      this.sortbytime = React.createRef();
      this.state = {
        posts:[],
        me: cookie.load('me'),
        gradeone:false,
        gradetwo:false,
        gradethree:false
      }
      this.write_form = React.createRef();
    }

    
    listFlag = {
        position: "absolute",
        right: "50px",
        top: "35px"
    }
    
    componentDidMount() {        
        this.parseRecruitdata()
    }

    parseRecruitdata() {
        axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: get_posts_of_recruit_seminar
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": cookie.load('token'),
            }
        }).then(result => {
            this.setState({ posts: result.data.data.postsOfRecruitSeminar });

        });
    }

    GoPost(e) {
        e.preventDefault();
        if(this.state.me === undefined){
            alert("로그인 후 이용바랍니다.")
        }
        else {
            console.log(this.state.me)
            this.props.history.push('/postview/recruit_seminar/?v='+ e.currentTarget.getAttribute('value'));
        }
    }


    compbyrecommend(a,b){
        return b.link.recommends.length - a.link.recommends.length
    }

    ToggleSort(value){
        console.log(123)
        if(value === "byrecommend") {
            this.setState({posts: this.state.posts.sort(this.compbyrecommend)})
        }
        else {
            this.parseRecruitdata()
        }

    }

    render() {

        return (
            <>
                <Navigator {...this.props}/>
                <Jumbotron fluid>
                    <Container>
                        <h1 className="display-4">강의 목록</h1>
                        <p className="lead">자신만의 강의를 올려보세요</p>
                    </Container>
                </Jumbotron>
                <Container className="p-3">
                <ToggleButtonGroup ref={this.sortbytime} className="p-3" type="radio" name="options"  defaultValue="bytime" onChange={(e) => this.ToggleSort(e)}>
                    <ToggleButton variant="secondary"  value="bytime">최신순 보기</ToggleButton>
                    <ToggleButton variant="secondary" value="byrecommend">신청자순 보기</ToggleButton>
                </ToggleButtonGroup>
                <Card className="m-3 p-4 shadow" style={{ "cursor": "pointer" }} onClick={() =>this.write_form.current.Show()}>
                    <Card.Text as="h5">
                        글을 작성하시려면 클릭해주세요
                    </Card.Text>
                </Card>
                <WriteForm Show={this.state.show_post_modal} ref={this.write_form}/>
                {this.state.posts.map(post => (
                    <Card className="m-3 p-3 shadow-sm" style={{ cursor: "pointer" }}
                    onClick={(e) => this.GoPost(e)}
                    value ={post.link.uuid}
                    >
                        <Card.Title as="h4">
                        {post.title}
                        {post.getTags
                        .map(tag => (
                           <Badge key={tag.id} variant={(tag.name.indexOf('학년') > -1 ? "secondary" : "success") + " mx-1"} >{tag.name}</Badge>
                        ))}
                        </Card.Title>
                        <Card.Text as="h5">
                            {moment(Date.parse(post.createdAt)).fromNow()}-{post.link.writer.username}
                        </Card.Text>
                        <div style={this.listFlag}>
                            <svg width="1em" height="1em" viewBox="0 0 16 16"  width="24px" height="24px" class="bi bi-person-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                            </svg>
                            <h5 className="d-inline mt-1"> {post.link.recommends.length}</h5>
                        </div>
                    </Card>
                ))}
                </Container>
            </>
        );
    }
}

export default PageOfRecruitSeminar;
export {PostView};