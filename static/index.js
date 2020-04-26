// Import React stuff
import React from "react";
import ReactDOM from "react-dom";

import './index.scss';

// Calendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';

import client from './api';
import { ErrorBoundary } from './errorboundary';

export const AppContext = React.createContext({});

function clean_event_list(events) {
    for (var i = 0; i < events.length; i++) {
        console.log(events[i]);
        events[i]['start'] = new Date(events[i]['start']['$date']);
        events[i]['end'] = new Date(events[i]['end']['$date']);
    }
    return events
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: null,
            ready: false,
        }

        this.eventClick = this.eventClick.bind(this);
    }

    eventClick(e) {
        console.log(e);
    }

    componentDidMount() {
        client.get('/api/events')
        .then(res => {
            // console.log(res)
            this.setState({
                events: clean_event_list(res.data),
                ready: true
            })
        })
        .catch(err => {
            console.error(err);
        })
    }

    render() {
        // console.log(this.state.events)
        return (
            <>
                <FullCalendar
                    defaultView="dayGridMonth"
                    plugins={[ dayGridPlugin, rrulePlugin ]}
                    events={this.state.events}
                    eventClick={this.eventClick}
                />
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
