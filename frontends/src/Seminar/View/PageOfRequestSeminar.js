import React, { Component } from 'react';
import Navigator from '../Navigator';
import axios from 'axios';
import moment from 'moment';
import {
    Modal,
    Button,
    Form,
    Jumbotron,
    Container,
    Badge,
    Card,
    ToggleButton,
    ToggleButtonGroup,
} from 'react-bootstrap';
import TextareaAutosize from 'react-textarea-autosize';
import 'moment/locale/ko';
import cookie from 'react-cookies';
import RecommendButton from '../RecommendButton';
import CommentControl from '../CommentControl';
moment.locale('ko');

const get_posts_of_request_seminar = `query{ postsOfRequestSeminar{ id, title, createdAt, getTags { name } link{ uuid, writer { username } recommends{id} } } }`;

class WriteForm extends Component {
    tts = {
        width: '100%',
        height: '56px',
        border: 'none',
        fontSize: '30px',
        color: '#202020',
        resize: 'none',
        outline: '0 none',
        lineHeight: '40px',
        overflow: 'hidden',
        letterSpacing: '-.4px',
    };

    cts = {
        width: '100%',
        border: 'none',
        fontSize: '16px',
        color: '#202020',
        outline: '0 none',
        overflow: 'hidden',
    };

    constructor(props) {
        super(props);
        this.state = {
            Show: false,
            Title: '',
            Content: '',
            UUID: '',
        };
        if (this.props.Edit === true) {
            this.state.Title = this.props.Title;
            this.state.Content = this.props.Content;
        }
        this.input_title = React.createRef();
        this.input_content = React.createRef();
        this.input_tag = React.createRef();
    }

    Show() {
        this.setState({ Show: true });
    }
    Hide() {
        this.setState({ Show: false });
    }
    async Submit(title, content, tagKind, uuid) {
        if (this.props.Edit === true) {
            const result = await axios({
                method: 'POST',
                url: 'http://localhost:8000/api',
                data: {
                    query: `mutation{
                        updatePost(
                          uuid:"${uuid}"
                          title:"${title}"
                          tagkind:"${tagKind}"
                          content:"${content.split('\n')}"
                        ){
                          ok
                        }
                      }`,
                },
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    Authorization: cookie.load('token'),
                },
            });
            if (result.status === 200) {
                if (result.data.data.updatePost.ok === true) {
                    this.Hide();
                    window.location.reload();
                } else alert('글 수정에 실패 했습니다.');
            } else alert('글 수정에 실패 했습니다.');
        } else {
            const result = await axios({
                method: 'POST',
                url: 'http://localhost:8000/api',
                data: {
                    query: `mutation {
                        createPost(
                            title:"${title}",
                            content:"${content.split('\n')}",
                            tagKind:"${tagKind}"
                            KindOf:"PostOfRequestSeminar"
                        )
                        {
                            ok
                        }
                        }`,
                },
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    Authorization: cookie.load('token'),
                },
            });

            if (result.status === 200) {
                if (result.data.data.createPost.ok === true) {
                    this.Hide();
                    window.location.reload();
                } else alert('글 작성에 실패 했습니다.');
            } else alert('글 작성에 실패 했습니다.');
        }
    }

    componentDidMount() {}

    render() {
        return (
            <Modal
                show={this.state.Show}
                onHide={() => {}}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton onClick={() => this.Hide()}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        강의 요청글 {this.props.Edit ? '수정하기' : '작성하기'}
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
                        <input
                            style={this.tts}
                            type="text"
                            name="title"
                            placeholder="TITLE"
                            ref={this.input_title}
                            defaultValue={this.state.Title}
                        ></input>
                        <br />
                        <hr />
                        <TextareaAutosize
                            style={this.cts}
                            placeholder="CONTENT"
                            ref={this.input_content}
                            defaultValue={this.state.Content.replace(/,/gi, '\n')}
                        />
                        <br />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() =>
                            this.Submit(
                                this.input_title.current.value,
                                this.input_content.current.value,
                                this.input_tag.current.value,
                                new URLSearchParams(window.location.search).get('v')
                            )
                        }
                    >
                        작성하기
                    </Button>
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
            show_post_modal: null,
        };
        this.commnet_form = React.createRef();
        this.write_form = React.createRef();
    }

    componentDidMount() {
        const link_uuid = new URLSearchParams(this.props.location.search).get('v');
        axios({
            //POST
            method: 'POST',
            url: 'http://localhost:8000/api',
            data: {
                query: `query{
                    links(uuid:"${link_uuid}"){
                      writer {
                        username
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
                  }`,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                Authorization: cookie.load('token'),
            },
        }).then((result) => {
            this.setState({
                link_uuid: link_uuid,
                post: result.data.data.links[0],
                is_mounted: true,
            });
        });
    }

    async doDeletePost(uuid) {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api',
            data: {
                query: `mutation{
                    deletePost(uuid:"${uuid}"){
                      ok
                    }
                  }`,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                Authorization: cookie.load('token'),
            },
        });

        if (result.status === 200) {
            if (result.data.data.deletePost.ok === true) {
                window.history.back();
            } else alert('delete error');
        } else alert('lf');
    }

    GetEditButtonBar = () => {
        if (this.state.me != null) {
            if (this.state.post.writer.username === this.state.me.username) {
                return (
                    <div>
                        <span
                            onClick={() => this.write_form.current.Show()}
                            style={{ cursor: 'pointer' }}
                            className="mr-3"
                        >
                            수정하기
                        </span>
                        <span
                            onClick={() => this.setState(this.doDeletePost(this.state.link_uuid))}
                            style={{ cursor: 'pointer' }}
                            className="mr-3"
                        >
                            삭제하기
                        </span>
                    </div>
                );
            }
        }
    };

    tts = {
        width: '100%',
        height: '56px',
        border: 'none',
        fontSize: '30px',
        color: '#202020',
        resize: 'none',
        outline: '0 none',
        lineHeight: '40px',
        overflow: 'hidden',
        letterSpacing: '-.4px',
    };

    cts = {
        width: '100%',
        border: 'none',
        fontSize: '16px',
        color: '#202020',
        outline: '0 none',
        overflow: 'hidden',
    };

    render() {
        let post_view = <></>;
        if (this.state.post != null) {
            post_view = (
                <div className="my-5 p-5 rounded bg-white shadow-sm container">
                    <WriteForm
                        Show={this.state.show_post_modal}
                        Edit={true}
                        Title={this.state.post.postofrequestseminar.title}
                        Content={this.state.post.postofrequestseminar.content}
                        ref={this.write_form}
                    />
                    <h1 className=" pb-2 mb-0">
                        {this.state.post.postofrequestseminar.title}
                        {this.state.post.postofrequestseminar.getTags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant={(tag.name.indexOf('학년') > -1 ? 'secondary' : 'success') + ' mx-1'}
                            >
                                {tag.name}
                            </Badge>
                        ))}
                    </h1>
                    <div className="text-right mb-2 d-flex align-items-center">
                        <div className="mr-auto">
                            {moment(Date.parse(this.state.post.postofrequestseminar.createdAt)).fromNow()}
                            <strong>- {this.state.post.writer.username}</strong>님 작성
                        </div>
                        {this.GetEditButtonBar()}
                    </div>

                    <div
                        className="media-body pb-5 pt-5 lh-125 border-top border-gray"
                        dangerouslySetInnerHTML={{
                            __html: this.state.post.postofrequestseminar.content.replace(/,/gi, '<br/>'),
                        }}
                    />

                    <div className="align-items-center mb-5">
                        <RecommendButton link_uuid={this.state.link_uuid} />
                    </div>

                    <hr />
                    <CommentControl link_uuid={this.state.link_uuid} />
                </div>
            );
        }
        return (
            <>
                <Navigator {...this.props} />
                {post_view}
            </>
        );
    }
}

class PageOfRequestSeminar extends Component {
    constructor(props) {
        super(props);
        this.sortbytime = React.createRef();
        this.state = {
            me: cookie.load('me'),
            posts: [],
            show_post_modal: null,
            post_title: '',
            post_content: '',
            post_tag: 'Web',
        };

        this.write_form = React.createRef();
    }

    listFlag = {
        position: 'absolute',
        right: '50px',
        top: '35px',
    };

    componentDidMount() {
        this.parseRequestdata();
    }

    parseRequestdata() {
        axios({
            method: 'POST',
            url: 'http://localhost:8000/api',
            data: {
                query: get_posts_of_request_seminar,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                Authorization: cookie.load('token'),
            },
        }).then((result) => {
            this.setState({ posts: result.data.data.postsOfRequestSeminar });
        });
    }

    GoPost(e) {
        e.preventDefault();
        if (this.state.me === undefined) {
            alert('로그인 후 이용바랍니다.');
        } else {
            console.log(this.state.me);
            this.props.history.push('/postview/request_seminar/?v=' + e.currentTarget.getAttribute('value'));
        }
    }

    compbyrecommend(a, b) {
        return b.link.recommends.length - a.link.recommends.length;
    }

    ToggleSort(value) {
        console.log(123);
        if (value === 'byrecommend') {
            this.setState({ posts: this.state.posts.sort(this.compbyrecommend) });
        } else {
            this.parseRequestdata();
        }
    }

    render() {
        return (
            <>
                <Navigator {...this.props} />
                <Jumbotron fluid>
                    <Container>
                        <h1 className="display-4">강의 요청</h1>
                        <p className="lead">듣고 싶은 강의를 요청해보세요</p>
                    </Container>
                </Jumbotron>
                <Container className="p-3">
                    <ToggleButtonGroup
                        ref={this.sortbytime}
                        className="p-3"
                        type="radio"
                        name="options"
                        defaultValue="bytime"
                        onChange={(e) => this.ToggleSort(e)}
                    >
                        <ToggleButton variant="secondary" value="bytime">
                            최신순 보기
                        </ToggleButton>
                        <ToggleButton variant="secondary" value="byrecommend">
                            인기순 보기
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Card
                        className="m-3 p-4 shadow"
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.write_form.current.Show()}
                    >
                        <Card.Text as="h5">글을 작성하시려면 클릭해주세요</Card.Text>
                    </Card>
                    <WriteForm Show={this.state.show_post_modal} ref={this.write_form} />
                    {this.state.posts.map((post) => (
                        <Card
                            className="m-3 p-3 shadow-sm"
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => this.GoPost(e)}
                            value={post.link.uuid}
                        >
                            <Card.Title as="h4">
                                {post.title}
                                {post.getTags.map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        variant={(tag.name.indexOf('학년') > -1 ? 'secondary' : 'success') + ' mx-1'}
                                    >
                                        {tag.name}
                                    </Badge>
                                ))}
                            </Card.Title>
                            <Card.Text as="h5">
                                {moment(Date.parse(post.createdAt)).fromNow()}-{post.link.writer.username}
                            </Card.Text>
                            <div style={this.listFlag}>
                                <svg
                                    className="bi bi-flag-fill d-inline"
                                    width="24px"
                                    height="24px"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"
                                    />
                                    <path
                                        fill-rule="evenodd"
                                        d="M3.762 2.558C4.735 1.909 5.348 1.5 6.5 1.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126a8.89 8.89 0 0 0 .593-.25c.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 9.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916A.5.5 0 0 1 3.5 9V3a.5.5 0 0 1 .223-.416l.04-.026z"
                                    />
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

export default PageOfRequestSeminar;
export { PostView };
