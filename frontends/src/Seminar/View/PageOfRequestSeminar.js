import React, { Component } from 'react';
import Navigator from '../Navigator'
import axios from 'axios';
import moment from 'moment';
import {Modal,Button,Form,Jumbotron,Container,Badge,Card} from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize';
import 'moment/locale/ko'
import cookie from 'react-cookies';
moment.locale('ko')

const get_posts_of_request_seminar = `query{ postsOfRequestSeminar{ id, title, createdAt, getTags { name } link{ uuid, writer { username } } } }`;

class PageOfRequestSeminar extends Component {  
    constructor(props) {
      super(props);
      this.state = {
        postsOfRequestSeminar:[],
        show_post_modal: null,
        post_title: '',
        post_content: '',
        post_tag: 'Web'
      }
    }

    ShowPostModal = () => { this.setState({show_post_modal: true}); }
    HidePostModal = () => { this.setState({show_post_modal: false}); }

    handleChangetitle = (event) =>{this.setState({post_title: event.target.value})}
    handleChangecontent = (event) => {this.setState({post_content: event.target.value})}
    handleChangetag = (event) => {this.setState({post_tag : event.target.value})}
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
                  강의 요청하기
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
                    <input style={tts} type="text" name="title" placeholder="TITLE" onChange={this.handleChangetitle}></input>
                    <br></br>
                    <hr></hr>
                    <TextareaAutosize style={cts} placeholder="CONTENT" onChange={this.handleChangecontent}/>
                    <br></br>
                  </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={ () => this.setState(this.doRequestPost(this.state.post_title, this.state.post_content, this.state.post_tag))}>작성하기</Button>
              </Modal.Footer>
            </Modal>
          );
    }

    async doRequestPost(title, content, tag){
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation {
                    createPost(
                      title:"${title}",
                      content:"${content}",
                      tagKind:"${tag}",
                      KindOf:"PostOfRequestSeminar"
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
            this.HidePostModal()
        }
        else alert("lf")
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
                <Card className="m-3 p-4 shadow" style={{ "cursor": "pointer" }} onClick={this.ShowPostModal} >
                    <Card.Text as="h5">
                        글을 작성하시려면 클릭해주세요
                    </Card.Text>
                </Card>
                {this.PostRequestModal()}
                {this.state.postsOfRequestSeminar.map(post => (
                    <Card className="m-3 p-3 shadow-sm" style={{ cursor: "poitner" }} key={post.id} onClick={this.handleSubmit.bind(this)} onMouseOver={(e) => {this.sss = post.link.uuid}}>
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
export default PageOfRequestSeminar;