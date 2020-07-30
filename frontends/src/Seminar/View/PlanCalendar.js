import React, { Component } from 'react';
import moment from 'moment';
import axios from 'axios';
import cookie from 'react-cookies';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const now = new Date();

const myEventsList = [];
const localizer = momentLocalizer(moment);

class PlanCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myEventsList,
        };
    }

    async getCalendar() {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api',
            data: {
                query: `query{
              cal{
                planId
                title
                PlanStart
                PlanEnd
              }
            }
            `,
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                Authorization: cookie.load('token'),
            },
        });
        result.data.data.cal.map(
            (event) => (
                (event.PlanStart = new Date(event.PlanStart)),
                (event.PlanEnd = new Date(event.PlanEnd)),
                console.log(event)
            )
        );
        this.setState({ myEventsList: result.data.data.cal });

        return result.data.data.cal;
    }

    async componentDidMount() {
        const Calendars = await this.getCalendar();

        this.setState({
            myEventsList: Calendars,
        });
    }

    async handleSelect({ start, end }) {
        const title = window.prompt('New Event name');
        if (title) {
            const result = await axios({
                method: 'POST',
                url: 'http://localhost:8000/api',
                data: {
                    query: `mutation{
              createCalendar(
                title : "${title}"
                startplan : "${start.toString()}"
                endplan : "${end.toString()}"
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
            return await this.getCalendar();
        }
    }

    async handledelete(event) {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:8000/api',
            data: {
                query: `mutation{
            deleteCalendar(
              planId:"${event.planId}"
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
        return await this.getCalendar();
    }

    render() {
        console.log(this.state.myEventsList);
        return (
            <div>
                <Calendar
                    selectable
                    localizer={localizer}
                    events={this.state.myEventsList}
                    startAccessor="PlanStart"
                    endAccessor="PlanEnd"
                    style={{ height: 700 }}
                    onSelectEvent={(event) => this.setState(this.handledelete(event))}
                    onSelectSlot={(event) => this.setState(this.handleSelect(event))}
                />
                '
            </div>
        );
    }
}
export default PlanCalendar;
