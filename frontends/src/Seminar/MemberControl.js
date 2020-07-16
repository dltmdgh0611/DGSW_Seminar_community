import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import axios from 'axios';
import Modal from 'react-bootstrap/Modal'
import cookie from 'react-cookies';
import { v4 as uuidv4 } from 'uuid';


  

class MemberControl extends Component {

    constructor(props) {
        super(props);
        this.state = {
            me: cookie.load('me'),
            show_login_modal: null,
            show_signup_modal: null,
            show_signuperror_modal: null,
            login_id_value : '',
            login_pw_value : '',
            signup_email: '',
            signup_id: '',
            signup_pw: '',
            signup_cpw: '',
            id_error: '',
            pw_error: '',
            pwc_error: '',
            email_error:''
    };
    }

    ShowLoginModal = () => { this.setState({show_login_modal: true}); }
    HideLoginModal = () => { this.setState({show_login_modal: false}); }
    ShowSignupModal = () => { this.setState({show_signup_modal: true}); }
    HideSignupModal = () => { this.setState({show_signup_modal: false}); }


    handleChangeid = (event) =>{this.setState({login_id_value: event.target.value})};
    handleChangepw = (event) => {this.setState({login_pw_value: event.target.value})};
    changesignupform = (event) => {
        const target = event.target
        const names = target.name

        console.log(names, target.value)
        this.setState({
            [names]: target.value
        });
        console.log(this.state)
    };

    LoginModal(props) {   
        return (
          <Modal
            show={this.state.show_login_modal}
            onHide={()=>{}}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton onClick={this.HideLoginModal}>
              <Modal.Title id="contained-modal-title-vcenter">
                로그인
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="p-4">
                    <h3 className="mb-3 font-weight-normal form-signin">Please Log in</h3>
                    <label className="sr-only">Email address</label>
                    <input type="text" className="form-control mb-3" placeholder="Email address" onChange={this.handleChangeid}></input>
                    <label htmlFor="inputPassword" className="sr-only">Password</label>
                    <input type="password" id="inputPassword" className="form-control" placeholder="Password" onChange={this.handleChangepw}></input>
                </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={ () => this.setState(this.doLogin(this.state.login_id_value, this.state.login_pw_value))}>Login</Button>
            </Modal.Footer>
          </Modal>
        );
    }
    
    SignupModal(props) {
        return (
            <Modal
            show={this.state.show_signup_modal}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton onClick={this.HideSignupModal}>
              <Modal.Title id="contained-modal-title-vcenter">
                회원가입
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form className="p-4" onChange={this.changesignupform}>
                    <h3 className="mb-3 font-weight-normal form-signin">Please sign in</h3>
                    <React.Fragment>
                        <div className="form-label-group">
                            <label for="inputEmail" className="mb-0">이메일 주소를 입력해주세요.</label>
                            <input name="signup_email" type="text" id="inputEmail" className="form-control mb-2" placeholder="Email address" required="" autofocus=""></input>
                            <p for="inputPassword" className="text-danger" style={{"white-space":"pre-line"}}>{this.state.email_error}</p>
                        </div>
                        <div className="form-label-group">
                            <label for="inputEmail" className="mb-0">아이디</label>
                            <input name="signup_id" type="text" id="inputId" className="form-control mb-2" placeholder="ID" required="" autofocus=""></input>
                            <p for="inputPassword" className="text-danger" style={{"white-space":"pre-line"}}>{this.state.id_error}</p>
                        </div>
                        <div className="form-label-group">
                            <label for="inputPassword" className="mb-0">패스워드</label>
                            <input name="signup_pw" type="password" id="inputPassword" className="form-control mb-2" placeholder="Password" required=""></input>
                            <p for="inputPassword" className="text-danger" style={{"white-space":"pre-line"}}>{this.state.pw_error}</p>
                        </div>
                        <div className="form-label-group">
                            <label for="inputPassword" className="mb-0">패스워드 확인</label>
                            <input name="signup_cpw" type="password" id="inputPasswordConfirm" className="form-control mb-2" placeholder="Password" required=""></input>
                            <p for="inputPassword" className="text-danger" style={{"white-space":"pre-line"}}>{this.state.pwc_error}</p>
                        </div>
                        {/* <div className="checkbox mb-3">
                            <input type="checkbox"></input>
                        </div> */}
                    </React.Fragment>
                </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={ () => this.setState(this.doSignup(this.state.signup_id, this.state.signup_pw, this.state.signup_cpw, this.state.signup_email))}>Sign Up</Button>
            </Modal.Footer>
          </Modal>
        );
    }
    
    async doLogin(id_value, pw_value) {
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation {tokenAuth(username: "${id_value}", password: "${pw_value}"){success,errors, unarchiving, token, refreshToken, unarchiving, user {id, username }}}`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        })
            
        if (result.status === 200) 
            if (result.data.data.tokenAuth.success === true) 
            {    
                console.log(result)
                const user = result.data.data.tokenAuth.user;
                
                this.setState({'me': user})
                cookie.save('me', user,{path:'/'}, {maxAge : 3600*24*30})
                cookie.save('token', "JWT " + result.data.data.tokenAuth.token ,{path:'/'}, {maxAge : 3600*24*30})
                cookie.save('refreshToken', result.data.data.tokenAuth.refreshToken ,{path:'/'}, {maxAge : 3600*24*30})
                this.HideLoginModal()
                return {'me': user}
            }
            else alert("올바른 id와 pw를 입력해주세요.")
        else console.log("hosterror")
        return {}
    }

    async doSignup(id_value, pw_value, pw_confirm, email_value){
        console.log(email_value,id_value, pw_value, pw_confirm)

        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation {
                    register(
                      email: "${email_value}"
                      username: "${id_value}",
                      password1: "${pw_value}",
                      password2: "${pw_confirm}",
                      uuid: "${uuidv4()}",
                    ) {
                      success,
                      errors,
                      token,
                      refreshToken
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        })
        if (result.status === 200){
            

            console.log(result.data.data.register.errors)
            if(result.data.data.register.success){
                this.HideSignupModal()
                alert("회원가입이 완료되었습니다")
            }
            else {
                var error = result.data.data.register.errors
                this.state.email_error = ''
                this.state.id_error = ''
                this.state.pwc_error = ''
                this.state.pw_error = ''
                if(error.password2 != null) error.password2.forEach(e=>this.state.pwc_error+=(e.message+"\n"))
                if(error.email != null) error.email.forEach(e=>this.state.email_error+=(e.message+"\n") )
                if(error.username != null)error.username.forEach(e=> this.state.id_error+=(e.message+"\n") )
                if(error.password1 != null)error.password1.forEach(e=>this.state.pw_error+=(e.message+"\n") )
            }
        }
        else alert('host error')
         
    }

    doLogout() {
        cookie.remove('me',{path: '/'})
        return {'me': undefined}
    }

    render() {
        if(this.state.me === undefined)
        {
            return (
                <React.Fragment>
                    <Form className="form-inline my-2 my-lg-0 ml-2">
                        <Button className="btn btn-outline-success my-2 my-sm-0" variant="dark" onClick={this.ShowLoginModal} >로그인</Button>
                        {this.LoginModal()}
                    </Form>
                    <Form className="form-inline my-2 my-lg-0 ml-2">
                        <Button className="btn btn-outline-light my-2 my-sm-0" variant="dark" onClick={this.ShowSignupModal} >회원가입</Button>
                        {this.SignupModal()}
                    </Form>
                </React.Fragment> 
                )
        }
        else
        {
            return(
                <React.Fragment>
                    <label className="nav-link disabled ml-auto">{this.state.me.username}</label>
                    <Form className="form-inline my-2 my-lg-0 ml-2">
                        <Button className="btn btn-outline-light my-2 my-sm-0" variant="dark" onClick={() => this.setState(this.doLogout())}>로그아웃</Button>
                    </Form>
                </React.Fragment>
            )
        }
    }
}
export default MemberControl;