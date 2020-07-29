import React, { Component } from 'react'
import moment from 'moment'
import axios from 'axios';
import cookie from 'react-cookies';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'


const now = new Date()

const myEventsList = []
const localizer = momentLocalizer(moment)

class PlanCalendar extends Component{

  constructor(props) {
    super(props);
    this.state = {
      myEventsList
    }
  }

  async getCalendar(){
    const result = await axios({
        method: "POST",
        url: "http://localhost:8000/api",
        data: {
            query: 
            `query{
              cal{
                planId
                title
                PlanStart
                PlanEnd
              }
            }
            `
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": cookie.load('token')   
        }
    })
    return result.data.data.cal
  }

  async componentDidMount() {
    const Calendars = await this.getCalendar();
    
    this.setState({ 
        myEventsList: Calendars
    })  

    this.state.myEventsList.map( event => (
      event.PlanStart = new Date(event.PlanStart), event.PlanEnd = new Date(event.PlanEnd)
    ))
    console.log(this.state.myEventsList)
  }

  async handleSelect({ start, end }){
    const title = window.prompt('New Event name')
    console.log(start.toString(), end.toString())

    if (title){
      const result = await axios({
        method: "POST",
        url: "http://localhost:8000/api",
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
            }`
        },
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Authorization": cookie.load('token')
        }
    })
    }
    
  }
     
  async handledelete(event){
    const result = await axios({
      method: "POST",
      url: "http://localhost:8000/api",
      data: {
          query: `mutation{
            deleteCalendar(
              planId:"${event.planId}"
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
    
  }

  render(){
    return(
      <div>
        <Calendar
        selectable
          localizer={localizer}
          events={this.state.myEventsList}
          startAccessor="PlanStart"
          endAccessor="PlanEnd"
          style={{ height: 700}}
          onSelectEvent={event => this.handledelete(event)}
          onSelectSlot={this.handleSelect}
        />
      </div>
    );
  }
}
export default PlanCalendar