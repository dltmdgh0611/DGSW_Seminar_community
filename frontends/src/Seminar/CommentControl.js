import React, { Component } from 'react';
import axios from 'axios';
import 'moment/locale/ko'
import cookie from 'react-cookies';
import moment from 'moment';
import 'moment/locale/ko'

class CommentControl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            me: cookie.load('me'),
            comments: [],
            default: ""
        }
        this.commnet_form = React.createRef(); 
    }

    async getComments() {
        
        
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: 
                `query{
                    comment(refLinkUuid:"${this.props.link_uuid}"){
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
                "Authorization": cookie.load('token')   
            }
        })
        this.setState({ 
            comments: result.data.data.comment
        }) 
        return result.data.data.comment
    }

    async componentDidMount() {        
        const Comments = await this.getComments();
        this.setState({ 
            comments: Comments
        })        
    }

    DeleteCommentButton(comment){
        if(comment.commentWriter.username === this.state.me.username){
            return(
                <span style={{"cursor" : "pointer"}} onClick={ () => this.setState(this.deleteComment(comment))}>   삭제하기</span>
            );
        }
    }

    async doCommentCreate(user){
        
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation{
                    createComment(
                      content:"${this.commnet_form.current.value.split("\n")}",
                      linkId:"${this.props.link_uuid}",
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
            if(result.data.data.createComment.ok === true){
                const commentinput = document.getElementById("commentinput")
                console.log(commentinput)
                commentinput.value = ""
                return await this.getComments()
            }
            else alert("create error")
        }
        else alert("lf")
        
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
            if(result.data.data.deleteComment !== null){
                if(result.data.data.deleteComment.ok === true){
                    return await this.getComments()
                }
                else alert("delete error")
            }
            else alert(result.data.data.error)
        }
        else alert("lf")
    }

    render(){
        console.log(this.state)
        return(
            <>
            <div className="input-group">
                <textarea id="commentinput" ref={this.commnet_form} type="text" className="form-control" style={{"height":"50px"}} placeholder="Write your comment" ></textarea>
                <div className="input-group-btn">
                    <button className="btn bhi" style={{"border": "solid 1px #ccc", "height":"50px"}}
                    onClick={ () =>this.setState(this.doCommentCreate()) }>
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
                    {this.DeleteCommentButton(comment)}
                    <br/>
                    
                    <div
                        dangerouslySetInnerHTML = {{__html:
                            comment.commentContent.replace(/,/gi, "<br/>")
                        }}
                    />
                    </div>
                </div>
            ))}
            </>
        );
    }
}

export default CommentControl;