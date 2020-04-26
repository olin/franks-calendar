// Import React stuff
import React from "react";
import ReactDOM from "react-dom";

import './index.scss';

// Calendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import client from './api';
import { ErrorBoundary } from './errorboundary';

export const AppContext = React.createContext({});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: null,
            ready: false,
        }
    }

    componentDidMount() {
        client.get('/api/events')
        .then(res => {
            console.log(res)
            this.setState({
                events: res.data,
                ready: true
            })
        })
        .catch(err => {
            console.error(err);
        })
    }

    render() {
        return (
            <>
                <FullCalendar defaultView="dayGridMonth" plugins={[ dayGridPlugin ]} />
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
