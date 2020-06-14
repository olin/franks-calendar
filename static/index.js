// Import React stuff
import React from "react";
import ReactDOM from "react-dom";

import './index.scss';

// Calendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import rrulePlugin from '@fullcalendar/rrule';

import client from './api';
import { ErrorBoundary } from './errorboundary';

export const AppContext = React.createContext({});

function clean_event_list(events) {
    for (var i = 0; i < events.length; i++) {
        events[i]['start'] = new Date(events[i]['start']['$date']);
        events[i]['end'] = new Date(events[i]['end']['$date']);
        events[i]['id'] = events[i]['_id']['$oid']; 
    }
    return events
}

const tagList = [

]

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <a className="Button" href="#">Publish an event</a>

                <section className="Sidebar__section">
                    <h2 className="Sidebar__header">
                        <svg className="Sidebar__header__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M14.1667 0H0.833333C0.61232 0 0.400358 0.0877973 0.244078 0.244078C0.0877975 0.400358 0 0.61232 0 0.833333V2.99167C0 3.4275 0.1775 3.85583 0.485833 4.16417L5 8.67833V15C5.00016 15.142 5.03656 15.2816 5.10575 15.4055C5.17494 15.5295 5.27462 15.6338 5.39537 15.7085C5.51612 15.7832 5.65393 15.8258 5.79575 15.8323C5.93758 15.8389 6.07873 15.8091 6.20583 15.7458L9.53917 14.0792C9.82167 13.9375 10 13.6492 10 13.3333V8.67833L14.5142 4.16417C14.8225 3.85583 15 3.4275 15 2.99167V0.833333C15 0.61232 14.9122 0.400358 14.7559 0.244078C14.5996 0.0877973 14.3877 0 14.1667 0ZM8.5775 7.74417C8.49996 7.82142 8.43847 7.91325 8.39657 8.01436C8.35467 8.11548 8.33317 8.22388 8.33333 8.33333V12.8183L6.66667 13.6517V8.33333C6.66683 8.22388 6.64533 8.11548 6.60343 8.01436C6.56152 7.91325 6.50004 7.82142 6.4225 7.74417L1.66667 2.99167V1.66667H13.3342L13.3358 2.98583L8.5775 7.74417Z" fill="black"/>
                        </svg>
                        Filters
                    </h2>
                    <div>
                        <input type="checkbox" id="filter--admissions" defaultChecked={this.props.tags['admissions']} onClick={this.props.handleClick} value={"admissions"} />
                        <label for="filter--admissions" className="Sidebar__filter">
                            Admissions/Financial
                        </label>

                        <input type="checkbox" id="filter--clubs" defaultChecked={this.props.tags['clubs']} onClick={this.props.handleClick} value={"clubs"} />
                        <label for="filter--clubs" className="Sidebar__filter">
                            Clubs
                        </label>

                        <input type="checkbox" id="filter--student-life" defaultChecked={this.props.tags['student-life']} onClick={this.props.handleClick} value={"student-life"} />
                        <label for="filter--student-life" className="Sidebar__filter">
                            Student Life
                        </label>

                        <input type="checkbox" id="filter--foundry-bow" defaultChecked={this.props.tags['foundry-bow']} onClick={this.props.handleClick} value={"foundry-bow"} />
                        <label for="filter--foundry-bow" className="Sidebar__filter">
                            Foundry/BOW
                        </label>

                        <input type="checkbox" id="filter--health-wellness" defaultChecked={this.props.tags['health-wellness']} onClick={this.props.handleClick} value={"health-wellness"} />
                        <label for="filter--health-wellness" className="Sidebar__filter">
                            Health/Wellness
                        </label>

                        <input type="checkbox" id="filter--library" defaultChecked={this.props.tags['library']} onClick={this.props.handleClick} value={"library"} />
                        <label for="filter--library" className="Sidebar__filter">
                            Library
                        </label>

                        <input type="checkbox" id="filter--shop" defaultChecked={this.props.tags['shop']} onClick={this.props.handleClick} value={"shop"} />
                        <label for="filter--shop" className="Sidebar__filter">
                            The Shop
                        </label>

                        <input type="checkbox" id="filter--pgp" defaultChecked={this.props.tags['pgp']} onClick={this.props.handleClick} value={"pgp"} />
                        <label for="filter--pgp" className="Sidebar__filter">
                            PGP
                        </label>
                    </div>
                </section>

                <section className="Sidebar__section">
                    <h2 className="Sidebar__header">
                        <svg className="Sidebar__header__icon" width="500" height="500" viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M427.083 302.083V333.333H395.833V302.083H427.083ZM385.417 197.917H354.167V187.5C354.167 170.924 360.752 155.027 372.473 143.306C384.194 131.585 400.092 125 416.667 125C433.242 125 449.139 131.585 460.86 143.306C472.581 155.027 479.167 170.924 479.167 187.5C479.167 207.708 468.75 226.667 452.292 237.708L446.042 241.667C434.167 250 427.083 262.708 427.083 277.083V281.25H395.833V277.083C395.833 252.292 408.333 229.167 428.958 215.625L435 211.667C443.125 206.25 447.917 197.292 447.917 187.5C447.917 179.212 444.625 171.263 438.764 165.403C432.904 159.542 424.954 156.25 416.667 156.25C408.379 156.25 400.429 159.542 394.569 165.403C388.708 171.263 385.417 179.212 385.417 187.5V197.917ZM187.5 270.833C243.125 270.833 354.167 298.75 354.167 354.167V416.667H20.8333V354.167C20.8333 298.75 131.875 270.833 187.5 270.833ZM187.5 83.3333C209.602 83.3333 230.798 92.1131 246.425 107.741C262.054 123.369 270.833 144.565 270.833 166.667C270.833 188.768 262.054 209.965 246.425 225.592C230.798 241.221 209.602 250 187.5 250C165.398 250 144.202 241.221 128.574 225.592C112.946 209.965 104.167 188.768 104.167 166.667C104.167 144.565 112.946 123.369 128.574 107.741C144.202 92.1131 165.398 83.3333 187.5 83.3333ZM187.5 310.417C125.625 310.417 60.4166 340.833 60.4166 354.167V377.083H314.583V354.167C314.583 340.833 249.375 310.417 187.5 310.417ZM187.5 122.917C175.897 122.917 164.769 127.526 156.564 135.731C148.359 143.935 143.75 155.064 143.75 166.667C143.75 178.27 148.359 189.398 156.564 197.602C164.769 205.807 175.897 210.417 187.5 210.417C199.103 210.417 210.231 205.807 218.435 197.602C226.642 189.398 231.25 178.27 231.25 166.667C231.25 155.064 226.642 143.935 218.435 135.731C210.231 127.526 199.103 122.917 187.5 122.917Z" fill="black"/>
                        </svg>
                        Information
                    </h2>
                    {/* <p>For help navigating the site, sharing an event to the calendar,
                    or saving an event to your personal calendar.</p> */}
                    <ul>
                        <li><p><a href="https://linktouserguide.com"> > Event type guidlines</a></p></li>
                        <li><p><a href="https://linktouserguide.com"> > How to publish an event</a></p></li>
                        <li><p><a href="https://linktouserguide.com"> > How to export an event</a></p></li>
                    </ul>
                </section>

                <section className="Sidebar__section">
                    <h2 className="Sidebar__header">
                        <svg className="Sidebar__header__icon" width="220" height="220" viewBox="0 0 220 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M114.783 100.634C120.458 100.634 126.006 98.9477 130.725 95.7878C135.444 92.628 139.122 88.1367 141.294 82.882C143.466 77.6273 144.034 71.8452 142.927 66.2669C141.82 60.6886 139.087 55.5646 135.073 51.5428C131.061 47.521 125.947 44.7822 120.381 43.6726C114.814 42.563 109.044 43.1325 103.801 45.309C98.5581 47.4856 94.0762 51.1714 90.923 55.9005C87.77 60.6296 86.087 66.1896 86.087 71.8771C86.087 79.504 89.1102 86.8185 94.4917 92.2115C99.8733 97.6045 107.173 100.634 114.783 100.634ZM114.783 62.2914C116.675 62.2914 118.524 62.8536 120.097 63.9069C121.67 64.9602 122.896 66.4573 123.62 68.2089C124.344 69.9604 124.533 71.8878 124.164 73.7472C123.795 75.6067 122.884 77.3147 121.546 78.6553C120.209 79.9959 118.504 80.9088 116.649 81.2787C114.793 81.6485 112.87 81.4587 111.122 80.7332C109.374 80.0076 107.88 78.779 106.829 77.2027C105.778 75.6263 105.217 73.773 105.217 71.8771C105.217 69.3348 106.226 66.8967 108.019 65.099C109.813 63.3014 112.246 62.2914 114.783 62.2914ZM154.096 99.2923C159.692 91.2502 162.692 81.6816 162.692 71.8771C162.692 62.0727 159.692 52.5041 154.096 44.462C156.847 43.5745 159.719 43.1217 162.609 43.12C170.219 43.12 177.518 46.1498 182.899 51.5428C188.281 56.9358 191.304 64.2503 191.304 71.8771C191.304 79.504 188.281 86.8185 182.899 92.2115C177.518 97.6045 170.219 100.634 162.609 100.634C159.719 100.633 156.847 100.18 154.096 99.2923ZM114.783 119.806C57.3913 119.806 57.3913 158.149 57.3913 158.149V177.32H172.174V158.149C172.174 158.149 172.174 119.806 114.783 119.806ZM76.5217 158.149C76.5217 155.369 79.5826 138.977 114.783 138.977C148.261 138.977 152.47 153.931 153.043 158.149H76.5217ZM220 158.149V177.32H191.304V158.149C191.081 151.023 189.443 144.013 186.487 137.529C183.531 131.044 179.315 125.215 174.087 120.381C220 125.078 220 158.149 220 158.149ZM60.6435 80.696L71.7391 94.2119L26.3043 139.744L0 110.987L11.0957 99.8674L26.3043 115.013L60.6435 80.696Z" fill="black"/>
                        </svg>
                        Moderators
                    </h2>
                    
                    <ul>
                        <li><p><a href="mailto:jbrettle@olin.edu"> > Email Jules Brettle</a></p></li>
                        <li><p><a href="mailto:jgreenberg@olin.edu"> > Email Jack Greenberg</a></p></li>
                    </ul>
                    <p> Contact them if you need urgent approval for a new event listing.
                    Otherwise, expect up to 24 hours for a new event to be displayed on the
                    calendar!</p>
                </section>
            </>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: null,
            ready: false,
            tags: {
                "admissions": true,
                "clubs": true,
                "student-life": true,
                "foundry-bow": true,
                "health-wellness": true,
                "library": true,
                "shop": true,
                "pgp": true
            },
        }

        this.eventClick = this.eventClick.bind(this);
        this.toggleTag = this.toggleTag.bind(this);
    }

    toggleTag(e) {
        var tags = this.state.tags;
        tags[e.target.value] = !tags[e.target.value];
        this.setState({
            tags: tags,
        }, () => {
            console.log(this.state.tags);
        })
    }

    eventClick(e) {
        console.log(e)
        //retrieves event information and returns as ical file
        var route = '/export/'+e.event.id; 
        client.get(route)
        .then(res => {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res.data));
            element.setAttribute('download', "calendar_event.ics");
            element.style.display = 'none';
            console.log(res)
            document.body.appendChild(element);
            //autmoatically downloads ical file
            element.click();
            document.body.removeChild(element);
        })
        .catch(err => {
            console.error(err);
        })
    }

    componentDidMount() {
        client.get('/api/events')
        .then(res => {
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
        return (
            <>
                <header className="Header">
                    <h1 className="Header__title">
                        <img src="/static/franks_cal_logo.png" alt="Frank's Calendar Logo" className="Header__title__icon" />
                        <span className="Header__title__text">Frank's Calendar</span>
                    </h1>
                </header>
                <main className="Main">
                    <aside className="Sidebar">
                        <Sidebar handleClick={this.toggleTag} tags={this.state.tags} />
                    </aside>
                    <article className="Calendar">
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
                <footer className="Footer">
                    <span className="Footer__message">Made with <span style={{color: "red"}}>♥</span> at Olin College</span>
                    <span className="Footer__links"><a href="https://forms.gle/R1WKvUcC85pcLiu28">Leave us feedback</a> | <a href="https://github.com/jack-greenberg/franks-calendar">View on Github</a></span>
                </footer>
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
