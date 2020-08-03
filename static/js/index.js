// Import React stuff
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route } from "react-router-dom";

import '../css/index.scss';
import Sidebar from './components/sidebar.js';
import EventPage from './components/event-page.js';
import { ErrorBoundary } from './errorboundary';
import client from './api';

// Calendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';

const colorMap = {
    links: "#009BDF",
    academic_affairs: "#BFD1E2",
    student_affairs: "#C9EAE8",
    admission: "#F8C7CE",
    library: "#DED6E9",
    shop: "#E3EFCF",
    clubs: "#FCDDC7",
    other: "#FFF0C3",
}
const tagList = {
    "academic": true,
    "academic_affairs": true,
    "academic_calendar": true,
    "academic_advising": true,
    "student_affairs": true,
    "international": true,
    "student": true,
    "residential":true,
    "health":true,
    "pgp":true,
    "hr":true,
    "admission": true,
    "library": true,
    "shop": true,
    "clubs": true,
    "other": true,
}

function clean_event_list(events) {
    for (var i = 0; i < events.length; i++) {
        let dtstart = new Date(events[i]['dtstart']['$date']);
        let dtend = new Date(events[i]['dtend']['$date']);

        events[i]['id'] = events[i]['_id']['$oid'];

        let numDays = events[i]['dtend']['$date'] - events[i]['dtstart']['$date'] + 1000;
        if (numDays % 86400000 == 0) {
            events[i]['allDay'] = true;
            /*
            I hate javascript :(
            */
            let startDate = new Date([dtstart.getFullYear(), dtstart.getUTCMonth()+1, dtstart.getUTCDate()].join('-'));
            let endDate = new Date([dtend.getFullYear(), dtend.getUTCMonth()+1, dtend.getUTCDate()].join('-'));
            events[i]['start'] = startDate.setDate(startDate.getDate() + 1);
            events[i]['end'] = endDate.setDate(endDate.getDate() + 1);
        } else {
            events[i]['start'] = dtstart;
            events[i]['end'] = dtend;
        }
        if (!events[i].category) {
            events[i].category = ["other"]
            events[i].categoryColor = "other"
        } else {
            events[i].category = events[i]['category'].split(":")
            events[i].categoryColor = events[i].category[0]
        }
        events[i].color = colorMap[events[i].category[0]]
    }
    return events
}

const EventComponent = ({ event, el }) => {
  var startTime = new Date(event.start).toLocaleString().split(", ")[1].replace(":00 ", "");
  var endTime = new Date(event.end).toLocaleString().split(", ")[1].replace(":00 ", "");

  const content = (
    <div class="EventContent" data-category={event.extendedProps.category} data-category-color={event.extendedProps.categoryColor}>
      <div class="EventContent__title">{event.title}</div>
      {!event.allDay && <div class="EventContent__time">{startTime} - {endTime}</div> }
      {!event.allDay && <div class="EventContent__location">{event.extendedProps.location}</div> }
    </div>
  );
  ReactDOM.render(content, el);
  return el;
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
            allEvents: [],
            tags: tagList,
            popUp: null,
            urlid: window.location.hash.substring(1),
        }
        this.eventClick = this.eventClick.bind(this);
        this.toggleTag = this.toggleTag.bind(this);
        this.destroyPopUp = this.destroyPopUp.bind(this);
        this.renderEventPage = this.renderEventPage.bind(this);

    }
    destroyPopUp() {
        this.setState({
            popUp: null
        })
    }
    toggleTag(e) {
        const tagName = e.target.value;
        // Make a copy of the tags in state (we shouldn't update the array
        // in the state, otherwise React won't rerender our components)
        const tags = [...this.state.tags];
        tags[tagName] = !tags[tagName];

        // Filter the events so only those with selected tags are shown
        const filteredEvents = this.state.allEvents.filter(event => {
            // Check each category/tag on an event to see if it's selected
            for (const eventCategory of event.category) {
                // Check if this specific category/tag is currently hidden
                if (tags[eventCategory] === false) {
                    // FIXME: This doesn't seem like what we want to do
                    // This category/tag is hidden, so don't show the event
                    return false;
                }
            }
            // All tags on this event are visible, so show this event
            return true;
        });

        // Update the state
        this.setState({
            tags,
            events: filteredEvents,
        });
    }
    eventClick(e) {
        let eventID = e.event.id;
        this.setState({
            popUp: <EventPage event={this.state.events.find(obj => obj.id === eventID)} returnToCalendar={this.destroyPopUp} />
        })
    }
    renderEventPage() {
        let event = this.state.allEvents.find(obj => obj.id.toString() === this.state.urlid)
        if (event){
            this.setState({
                popUp: <EventPage event={event} returnToCalendar={this.destroyPopUp} />
            })
        }
    }

    componentDidMount() {
        client.get('/api/events')
        .then(res => {
            let event_list = clean_event_list(JSON.parse(res.data))
            this.setState({
                events: event_list,
                allEvents: event_list,
            })
            this.renderEventPage();
        })
        .catch(err => {
            console.error(err);
        })

    }
    render() {
        window.location.hash = ""; // Clear the hash when the calendar renders

        return (
            <>
              <aside className="Sidebar">
                <Sidebar handleClick={this.toggleTag} tags={this.state.tags} />
              </aside>
                <div className="Calendar">
                    {this.state.popUp}

                    <FullCalendar
                        defaultView="timeGridWeek"
                        nowIndicator={true}
                        plugins={[ dayGridPlugin, timeGridPlugin ]}
                        events={this.state.events}
                        displayEventTime={true}
                        eventRender={EventComponent}
                        eventClick={this.eventClick}
                        header={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                        }}
                        height="parent"
                    />
                </div>
            </>
        );
    };
};

var renderedApp = (
    <ErrorBoundary>
        <HashRouter hashType="noslash">
            <App />
        </HashRouter>
    </ErrorBoundary>
);

ReactDOM.render(renderedApp, document.getElementById('calendar-root'));
