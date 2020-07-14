import React, { Component } from 'react';
import Navigator from '../Navigator'
import axios from 'axios';
import moment from 'moment';
import {Modal,Button,Form,Jumbotron,Container,Badge,Card} from 'react-bootstrap'
import TextareaAutosize from 'react-textarea-autosize';
import 'moment/locale/ko'
import cookie from 'react-cookies';
moment.locale('ko')

const get_posts_of_free_seminar = 'query{ postsOfFreeSeminar{ id, title, createdAt, link{ uuid } }, me { id } }';


class PageOfFreeSeminar extends Component {  
    constructor(props) {
        super(props);
        this.sss = ""
        this.state = {
            postsOfFreeSeminar:[],
            cts_var : 56,
            show_post_modal: null,
            post_title: '',
            post_content: ''
        }
    }
    
    ShowPostModal = () => { this.setState({show_post_modal: true}); }
    HidePostModal = () => { this.setState({show_post_modal: false}); }

    handleChangetitle = (event) =>{this.setState({post_title: event.target.value})}
    handleChangecontent = (event) => {this.setState({post_content: event.target.value})}
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
            this.setState({ postsOfFreeSeminar:result.data.data.postsOfFreeSeminar });
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.props.history.push('/postview?v='+ this.sss);
    }

    PostFreeModal(props){
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
                  자유게시판 작성하기
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <Form className="p-4">
                    <input style={tts} type="text" name="title" placeholder="TITLE" onChange={this.handleChangetitle}></input>
                    <br></br>
                    <hr></hr>
                    <TextareaAutosize style={cts} placeholder="CONTENT" onChange={this.handleChangecontent}/>
                    <br></br>
                  </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={ () => this.setState(this.doFreePost(this.state.post_title, this.state.post_content))}>작성하기</Button>
              </Modal.Footer>
            </Modal>
          );
    }

    async doFreePost(title, content){
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation {
                    createPost(
                      title:"${title}",
                      content:"${content}",
                      tagKind:"",
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
                        <h1 className="display-4">자유게시판</h1>
                        <p className="lead">학교에 관한 자유로운 이야기를 들려주세요</p>
                    </Container>
                </Jumbotron>
                <Container className="p-3">
                <Card className="m-3 p-4 shadow" style={{ "cursor": "pointer" }} onClick={this.ShowPostModal} >
                        <Card.Text as="h5">
                            글을 작성하시려면 클릭해주세요
                        </Card.Text>
                </Card>
                {this.PostFreeModal()}
                {this.state.postsOfFreeSeminar.map(post => (
                    <Card key={post.id} className="m-3 p-3" style={{ "cursor": "pointer" }} onClick={this.handleSubmit.bind(this)} onMouseOver={(e) => {this.sss = post.link.uuid}}>
                        <Card.Title as="h4">
                        {post.title}
                        </Card.Title>
                        <Card.Text as="h5">
                            {moment(Date.parse(post.createdAt)).fromNow()}-{post.writer}
                        </Card.Text>
                    </Card>
                ))}
                </Container>
            </>
        );
    }
}
export default PageOfFreeSeminar;