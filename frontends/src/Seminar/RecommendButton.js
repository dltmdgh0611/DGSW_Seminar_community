import React, { Component } from 'react';
import axios from 'axios';
import 'moment/locale/ko'
import cookie from 'react-cookies';

class RecommendButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recommendInfo: undefined,
            is_mounted: false,
            __dummy__: 0,
        }
    }

    async getRecommendInfo() {
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: 
                `query{
                    recommendInfo(refLinkUuid:"${this.props.link_uuid}")
                    {
                      meToo
                      count
                    }
                  }`
            },
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Authorization": cookie.load('token')   
            }
        });
        return result.data.data.recommendInfo;
    }

    async componentDidMount() {        
        const recommendInfo = await this.getRecommendInfo();
        this.setState({ 
            recommendInfo: recommendInfo,
            is_mounted: true 
        })        
    }

    async ToggleRecommend(){
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/api",
            data: {
                query: `mutation{
                    toggleRecommend(
                      linkId:"${this.props.link_uuid}"
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
        return await this.getRecommendInfo()
    }

    flag_css= {
        float: "left",
        borderRadius: "16px",
        border: "1px solid #959595",
        borderColor: "rgba(185,185,185,0.5)",
        cursor: "pointer"
    }

    render() {   
        console.log(this.state)  
        if (!this.state.is_mounted) return (
            <div className="px-2 pb-1" style={this.flag_css}>
                <svg className="bi bi-flag" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>
                    <path fillRule="evenodd"
                        d="M3.762 2.558C4.735 1.909 5.348 1.5 6.5 1.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126a8.89 8.89 0 0 0 .593-.25c.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 9.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 1 1-.515-.858C4.735 7.909 5.348 7.5 6.5 7.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126.187-.068.376-.153.593-.25.058-.027.117-.053.18-.08.456-.204 1-.43 1.64-.512V2.543c-.433.074-.83.234-1.234.414l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 3.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 0 1-.554-.832l.04-.026z"/>
                </svg>
                <label className="mx-2">?</label>
            </div>
        );
        if(this.state.recommendInfo.meToo){
            return (
                <div className="px-2 pb-1" style={this.flag_css} onClick={async () => {this.setState({recommendInfo: await this.ToggleRecommend()})}}>
                    <svg className="bi bi-flag-fill" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>
                    <path fillRule="evenodd"
                        d="M3.762 2.558C4.735 1.909 5.348 1.5 6.5 1.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126a8.89 8.89 0 0 0 .593-.25c.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 9.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916A.5.5 0 0 1 3.5 9V3a.5.5 0 0 1 .223-.416l.04-.026z"/>
                    </svg>
                    <a className="mx-2">{this.state.recommendInfo.count}</a>
                </div>
            );
        }
        else{
            return (
                <div className="px-2 pb-1" style={this.flag_css} onClick={async () => {this.setState({recommendInfo: await this.ToggleRecommend()})}}>
                    <svg className="bi bi-flag" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M3.5 1a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5z"/>
                    <path fillRule="evenodd"
                        d="M3.762 2.558C4.735 1.909 5.348 1.5 6.5 1.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126a8.89 8.89 0 0 0 .593-.25c.058-.027.117-.053.18-.08.57-.255 1.278-.544 2.14-.544a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5c-.638 0-1.18.21-1.734.457l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 9.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 1 1-.515-.858C4.735 7.909 5.348 7.5 6.5 7.5c.653 0 1.139.325 1.495.562l.032.022c.391.26.646.416.973.416.168 0 .356-.042.587-.126.187-.068.376-.153.593-.25.058-.027.117-.053.18-.08.456-.204 1-.43 1.64-.512V2.543c-.433.074-.83.234-1.234.414l-.159.07c-.22.1-.453.205-.678.287A2.719 2.719 0 0 1 9 3.5c-.653 0-1.139-.325-1.495-.562l-.032-.022c-.391-.26-.646-.416-.973-.416-.833 0-1.218.246-2.223.916a.5.5 0 0 1-.554-.832l.04-.026z"/>
                    </svg>
                    <a className="mx-2">{this.state.recommendInfo.count}</a>
                </div>
            );
        } 
        
    }
}

export default RecommendButton;