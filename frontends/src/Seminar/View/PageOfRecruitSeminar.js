import React, { Component } from 'react';
import Navigator from '../Navigator'
import axios from 'axios';
import moment from 'moment';
import {Modal,Button,Form,Jumbotron,Container,Badge,Card} from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize';
import 'moment/locale/ko'
import cookie from 'react-cookies';
moment.locale('ko')

const get_posts_of_recruit_seminar = `query{ postsOfRecruitSeminar{ id, title, createdAt, getTags { name } link{ uuid, writer { username } } } }`;

class PageOfRecruitSeminar extends Component {  
    constructor(props) {
      super(props);
      this.state = {
        postsOfRecruitSeminar:[],
        show_post_modal: null,
        post_title: '',
        post_content: '',
        post_tag: 'Web',
        gradeone:false,
        gradetwo:false,
        gradethree:false
      }
    }

    ShowPostModal = () => { this.setState({show_post_modal: true}); }
    HidePostModal = () => { this.setState({show_post_modal: false}); }

    handleChangetitle = (event) =>{this.setState({post_title: event.target.value})}
    handleChangecontent = (event) => {this.setState({post_content: event.target.value})}
    handleChangetag = (event) => {this.setState({post_tag : event.target.value})}

    handleChangetag_grade1 = (event) => {this.setState({gradeone : !this.state.gradeone}); console.log(this.state.gradeone) }
    handleChangetag_grade2 = (event) => {this.setState({gradetwo : !this.state.gradetwo}); console.log(this.state.gradetwo)}
    handleChangetag_grade3 = (event) => {this.setState({gradethree : !this.state.gradethree}); console.log(this.state.gradethree)}

    postbtn = (event) => {
        
        this.setState(this.doRecruitPost(this.state.post_title, this.state.post_content, this.state.post_tag, this.state.gradeone, this.state.gradetwo, this.state.gradethree))
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
        }).then(result => {
            this.setState({ postsOfRecruitSeminar: result.data.data.postsOfRecruitSeminar });

        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.history.push('/postview?v='+ this.sss);
    }

    PostRequestModal(props){
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
              show={this.state.show_post_modal}
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton onClick={this.HidePostModal}>
                <Modal.Title id="contained-modal-title-vcenter">
                  강의 등록하기
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form className="p-4">
                    <select className="form-control mb-4 w-25" name="tag_kind" onChange={this.handleChangetag}>
                        <option>Web</option>
                        <option>Android</option>
                        <option>Window</option>
                        <option>Embedded</option>
                        <option>Design</option>
                        <option>Know-how</option>
                        <option>ETC</option>
                    </select>
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

                    <input style={tts} type="text" name="title" placeholder="TITLE" onChange={this.handleChangetitle}></input>
                    <br></br>
                    <hr></hr>
                    <TextareaAutosize style={cts} placeholder="CONTENT" onChange={this.handleChangecontent}/>
                    <br></br>
                  </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={ this.postbtn }>작성하기</Button>
              </Modal.Footer>
            </Modal>
          );
    }

    async doRecruitPost(title, content, tag, one, two, three){
        if(one) tag += ',1학년' 
        if(two) tag += ',2학년'
        if(three) tag += ',3학년'
        console.log(tag)
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation {
                    createPost(
                      title:"${title}",
                      content:"${content}",
                      tagKind:"${tag}",
                      KindOf:"PostOfRecruitSeminar"
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

        if(result.status == 200){
            if(result.data.data.createPost.ok == true){
                this.HidePostModal()
                window.location.reload()
            }
        }
        else alert("lf")
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
                <Card className="m-3 p-4 shadow" style={{ "cursor": "pointer" }} onClick={this.ShowPostModal} >
                    <Card.Text as="h5">
                        글을 작성하시려면 클릭해주세요
                    </Card.Text>
                </Card>
                {this.PostRequestModal()}
                {this.state.postsOfRecruitSeminar.map(post => (
                    <Card key={post.id} className="m-3 p-3 shadow-sm" style={{ cursor: "poitner" }} onClick={this.handleSubmit.bind(this)} onMouseOver={(e) => {this.sss = post.link.uuid}}>
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
                    </Card>
                ))}
                </Container>
            </>
        );
    }
}
export default PageOfRecruitSeminar;