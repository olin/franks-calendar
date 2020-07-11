// Import React stuff
import React from "react";
import ReactDOM from "react-dom";

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
    links: "#0087C6",
    academic_affairs: "#0087C6",
    student_affairs: "#1FC9B3",
    admission: "#DD2E44",
    library: "#722780",
    shop: "#95CC3F",
    clubs: "#F37820",
    other: "#FFC700",
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
        if (!events[i].tag) {
            events[i].tag = ["other"]
        } else {
            events[i].tag = events[i]['tag'].split(":")
        }
        events[i].color = colorMap[events[i].tag[0]]
    }
    return events
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
            allEvents: [],
            tags: tagList,
            popUp: null,
        }

        this.eventClick = this.eventClick.bind(this);
        this.toggleTag = this.toggleTag.bind(this);
        this.destroyPopUp = this.destroyPopUp.bind(this);
    }
    destroyPopUp() {
        this.setState({
            popUp: null
        })
    }
    toggleTag(e) {
        var tags = this.state.tags;
        tags[e.target.value] = !tags[e.target.value];

        this.setState({
            tags: tags,
        }, () => {
            let events = this.state.allEvents.filter(event => {
                for (let i = 0; i < event.tag.length; i++) {
                    if (tags[event.tag[i]] === false) {
                        return false;
                    } else {
                        continue;
                    }
                }
                return true
            });
            this.setState({
                events: events
            })
        })
    }
    eventClick(e) {
        let eventID = e.event.id;
        this.setState({
            popUp: <EventPage event={this.state.events.find(obj => obj.id === eventID)} returnToCalendar={this.destroyPopUp} />
        })
    }
    componentDidMount() {
        client.get('/api/events')
        .then(res => {
            let event_list = clean_event_list(JSON.parse(res.data))
            this.setState({
                events: event_list,
                allEvents: event_list,
            })
        })
        .catch(err => {
            console.error(err);
        })
    }
    render() {
        return (
            <>
                <main className="Main">
                    <aside className="Sidebar">
                        <Sidebar handleClick={this.toggleTag} tags={this.state.tags} />
                    </aside>
                    <article className="Calendar">
                        {this.state.popUp}

                        <FullCalendar
                            defaultView="timeGridWeek"
                            nowIndicator={true}
                            plugins={[ dayGridPlugin, rrulePlugin, timeGridPlugin ]}
                            events={this.state.events}
                            eventClick={this.eventClick}
                            header={{
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                            }}
                            height="parent"
                        />
                    </article>
                </main>
            </>
        );
    };
};

var renderedApp = (
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);

ReactDOM.render(renderedApp, document.getElementById('calendar-root'));
