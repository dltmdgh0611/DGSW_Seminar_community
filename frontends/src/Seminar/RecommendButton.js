import React, { Component } from 'react';
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
import axios from 'axios';
import 'moment/locale/ko';
import cookie from 'react-cookies';

class PersonForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personInfo: undefined,
            show: false,
            mounted: false,
        };
    }

    Show() {
        this.setState({ Show: true });
    }
    Hide() {
        this.setState({ Show: false });
    }

    async getPersonInfo() {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api',
            data: {
                query: `query{
                    personInfo(refLinkUuid:"${this.props.link_uuid}"){
                      user{
                        username
                      }
                    }
                  }`,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                Authorization: cookie.load('token'),
            },
        });
        return result.data.data.personInfo;
    }

    async componentDidMount() {
        const personInfo = await this.getPersonInfo();
        this.setState({
            personInfo: personInfo,
            mounted: true,
        });
    }

    render() {
        if (this.state.mounted) {
            console.log(this.state);
            return (
                <Modal
                    show={this.state.Show}
                    onHide={() => {}}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton onClick={() => this.Hide()}>
                        <Modal.Title id="contained-modal-title-vcenter">수강 신청 현황</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.personInfo.map((personInfo) => (
                            <>
                                <a>{personInfo.user.username}</a>
                                <br />
                            </>
                        ))}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => this.Hide()}>확인</Button>
                    </Modal.Footer>
                </Modal>
            );
        } else {
            return <Modal></Modal>;
        }
    }
}

class RecommendButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            me: cookie.load('me'),
            Kindof: undefined,
            recommendInfo: undefined,
            personInfo: undefined,
            is_mounted: false,
            WShow: false,
            __dummy__: 0,
        };
        this.person_form = React.createRef();
        this.warning_form = React.createRef();
    }

    async getKindof() {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api',
            data: {
                query: `query{
                    links(uuid:"${this.props.link_uuid}")
                    {
                      namespace
                      writer{
                        username
                      }
                    }
                  }`,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                Authorization: cookie.load('token'),
            },
        });
        return result.data.data.links[0];
    }

    async getRecommendInfo() {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api',
            data: {
                query: `query{
                    recommendInfo(refLinkUuid:"${this.props.link_uuid}")
                    {
                      meToo
                      count
                    }
                  }`,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                Authorization: cookie.load('token'),
            },
        });
        return result.data.data.recommendInfo;
    }

    async componentDidMount() {
        const recommendInfo = await this.getRecommendInfo();
        const Kindof = await this.getKindof();
        this.setState({
            Kindof: Kindof,
            recommendInfo: recommendInfo,
            is_mounted: true,
        });
    }

    async ToggleRecommend() {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api',
            data: {
                query: `mutation{
                    toggleRecommend(
                      linkId:"${this.props.link_uuid}"
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
        return await this.getRecommendInfo();
    }

    flag_css = {
        float: 'left',
        borderRadius: '16px',
        border: '1px solid #959595',
        borderColor: 'rgba(185,185,185,0.5)',
        cursor: 'pointer',
    };

    viewpersoninfo = () => {
        if (this.state.me != null) {
            if (this.state.Kindof.writer.username === this.state.me.username) {
                return (
                    <span className="ml-2" onClick={() => this.person_form.current.Show()}>
                        신청자 보기
                    </span>
                );
            }
        }
    };

    viewWarning = () => {
        return (
            <Modal
                show={this.state.WShow}
                onHide={() => {}}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton onClick={() => this.setState({ WShow: false })}>
                    <Modal.Title id="contained-modal-title-vcenter">신청자 등록</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <>
                        <h3>신청자 등록을 하시겠습니까?</h3>
                        <br />
                        <h6>등록 하면 수업이 열릴경우 필참해야합니다.</h6>
                    </>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={async () =>
                            this.setState({ recommendInfo: await this.ToggleRecommend(), WShow: false })
                        }
                    >
                        동의하기
                    </Button>
                    <Button onClick={() => this.setState({ WShow: false })}>취소</Button>
                </Modal.Footer>
            </Modal>
        );
    };

    render() {
        if (this.state.is_mounted) {
            if (this.state.Kindof.namespace === 'PostOfRecruitSeminar') {
                if (this.state.recommendInfo.meToo) {
                    return (
                        <>
                            {this.viewpersoninfo()}
                            <div
                                className="px-2 pb-1"
                                style={this.flag_css}
                                onClick={async () => {
                                    this.setState({ recommendInfo: await this.ToggleRecommend() });
                                }}
                            >
                                <svg
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 16 16"
                                    class="bi bi-person-fill"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                                    />
                                </svg>
                                <a className="mx-2">{this.state.recommendInfo.count}</a>
                            </div>
                            <PersonForm
                                Show={this.state.show_post_modal}
                                ref={this.person_form}
                                link_uuid={this.props.link_uuid}
                            />
                        </>
                    );
                } else {
                    return (
                        <>
                            {this.viewpersoninfo()}
                            <div
                                className="px-2 pb-1"
                                style={this.flag_css}
                                onClick={async () => this.setState({ WShow: true })}
                            >
                                <svg
                                    width="1em"
                                    height="1em"
                                    viewBox="0 0 16 16"
                                    class="bi bi-person"
                                    fill="currentColor"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zm9.974.056v-.002.002zM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                                    />
                                </svg>
                                <a className="mx-2">{this.state.recommendInfo.count}</a>
                            </div>
                            <PersonForm
                                Show={this.state.show_post_modal}
                                ref={this.person_form}
                                link_uuid={this.props.link_uuid}
                            />
                            {this.viewWarning()}
                        </>
                    );
                }
            } else {
                if (this.state.recommendInfo.meToo) {
                    return (
                        <div
                            className="px-2 pb-1"
                            style={this.flag_css}
                            onClick={async () => {
                                this.setState({ recommendInfo: await this.ToggleRecommend() });
                            }}
                        >
                            <svg
                                className="bi bi-flag-fill"
                                width="1em"
                                height="1em"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"
                                />
                                <path
                                    fillRule="evenodd"
                                    d="M3.762 2.558C4.735 1.909 5.348 1.5 6.5 1.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126a8.89 8.89 0 0 0 .593-.25c.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 9.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916A.5.5 0 0 1 3.5 9V3a.5.5 0 0 1 .223-.416l.04-.026z"
                                />
                            </svg>
                            <a className="mx-2">{this.state.recommendInfo.count}</a>
                        </div>
                    );
                } else {
                    return (
                        <div
                            className="px-2 pb-1"
                            style={this.flag_css}
                            onClick={async () => {
                                this.setState({ recommendInfo: await this.ToggleRecommend() });
                            }}
                        >
                            <svg
                                className="bi bi-flag"
                                width="1em"
                                height="1em"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"
                                />
                                <path
                                    fillRule="evenodd"
                                    d="M3.762 2.558C4.735 1.909 5.348 1.5 6.5 1.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126a8.89 8.89 0 0 0 .593-.25c.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 9.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 1 1-.515-.858C4.735 7.909 5.348 7.5 6.5 7.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126.187-.068.376-.153.593-.25.058-.027.117-.053.18-.08.456-.204 1-.43 1.64-.512V2.543c-.433.074-.83.234-1.234.414l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 3.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 0 1-.554-.832l.04-.026z"
                                />
                            </svg>
                            <a className="mx-2">{this.state.recommendInfo.count}</a>
                        </div>
                    );
                }
            }
        } else {
            return (
                <div className="px-2 pb-1" style={this.flag_css}>
                    <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                        class="bi bi-person"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M13 14s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002.002zM3.022 13h9.956a.274.274 0 0 0 .014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 0 0 .022.004zm9.974.056v-.002.002zM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                        />
                    </svg>
                    <label className="mx-2">?</label>
                </div>
            );
        }
    }
}

export default RecommendButton;
