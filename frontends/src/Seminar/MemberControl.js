import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'

const query_login = 'mutation {tokenAuth(username: "root", password: "toor"){success,errors, unarchiving, token, refreshToken, unarchiving, user {id, username }}}'

function LoginModal(props) {   
    return (
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            로그인
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form className="p-4">
                <h3 className="mb-3 font-weight-normal form-signin">Please sign in</h3>
                <label className="sr-only">Email address</label>
                <input type="text" className="form-control mb-3" placeholder="Email address" required="" autofocus="" name="username" ></input>
                <label for="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" class="form-control" placeholder="Password" required="" name="password"></input>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Login</Button>
        </Modal.Footer>
      </Modal>
    );
}

function SignupModal(props) {
    return (
        <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            회원가입
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form className="p-4">
                <h3 className="mb-3 font-weight-normal form-signin">Please sign in</h3>
                <React.Fragment>
                    <div className="form-label-group">
                        <label for="inputEmail">Email address</label>
                        <input name="id" type="text" id="inputEmail" className="form-control mb-3" placeholder="Email address" required="" autofocus=""></input>
                    </div>

                    <div className="form-label-group">
                        <label for="inputPassword">Password</label>
                        <input name="password" type="password" id="inputPassword" className="form-control mb-3" placeholder="Password" required=""></input>
                    </div>
                    <div className="form-label-group">
                        <label for="inputPassword">Confirm Password</label>
                        <input name="cpassword" type="password" id="inputPassword" className="form-control mb-3" placeholder="Password" required=""></input>
                    </div>
                    <div className="checkbox mb-3">
                        <input type="checkbox"></input>
                    </div>
                </React.Fragment>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Sign Up</Button>
        </Modal.Footer>
      </Modal>
    );
}

function Login() {
    const [modalShow, setModalShow] = React.useState(false);
    return(
    <>
        <Button className="btn btn-outline-success my-2 my-sm-0" variant="dark" onClick={() => setModalShow(true)} >로그인</Button>
        <LoginModal show={modalShow} onHide={() => setModalShow(false)}/>
    </>
    )
}

function SignUp() {
    const [modalShow, setModalShow] = React.useState(false);
    return(
    <>
        <Button className="btn btn-outline-light my-2 my-sm-0" variant="dark" onClick={() => setModalShow(true)}>회원가입</Button>
        <SignupModal show={modalShow} onHide={() => setModalShow(false)}/>
    </>
    )
}

class MemberControl extends Component {
    


    constructor(props) {
      super(props);
      
      this.state = {
          
      }
    }

    async doLogin() {
        console.log('doLogin')
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: query_login
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        })
            
        console.log('didLogin')
        console.log(result)
        if (result.status !== 200) return {};
        if (result.data.data.tokenAuth.success !== true) return {};
        
        this.props.me = result.data.data.tokenAuth.user;
    }

    componentDidMount() {
        console.log('componentDidMount');
        console.log(this.props)
    }

    render() {
        
        console.log('render')
        if(this.props.me === undefined)
        {
            return (
                <React.Fragment>
                    <Form className="form-inline my-2 my-lg-0 ml-auto">
                        <SignUp/>
                    </Form>
                    <Form className="form-inline my-2 my-lg-0 ml-2">
                        <Login/>
                    </Form>
                </React.Fragment> 
                )
        }
        else
        {
            return(
                <React.Fragment>
                    <label className="nav-link disabled ml-auto">{this.props.me.username}</label>
                    <Form className="form-inline my-2 my-lg-0 ml-2">
                        <Button className="btn btn-outline-light my-2 my-sm-0" variant="dark">로그아웃</Button>
                    </Form>
                </React.Fragment>
            )
        }
    }
}
export default MemberControl;