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
                <section className="Sidebar__section">

                    <button className="Sidebar__form">
                      Publish an New Event
                    </button>

                    <h2 className="Sidebar__header">
                        <svg className="Sidebar__header__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        Filters
                    </h2>

                    <div>
                      <ul className="Sidebar__filter__list">
                        <li>
                          <input type="checkbox" id="filter--academic" defaultChecked={this.props.tags['academic']} onClick={this.props.handleClick} value={"academic"} />
                          <label for="filter--academic" className="Sidebar__filter">
                              Academic Affairs
                          </label>
                          <input type="checkbox" id="dropdown--academic" className="Sidebar__filter__icon" defaultChecked={false}/>
                          <label for="dropdown--academic">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="9 18 15 12 9 6">
                              </polyline>
                            </svg>
                          </label>

                          <ul className="Sidebar__filter__list__group">
                            <li className="Sidebar__filter__list">
                              <input type="checkbox" id="filter--academic_calendar" defaultChecked={this.props.tags['academic_calendar']} onClick={this.props.handleClick} value={"academic_calendar"} />
                              <label for="filter--academic_calendar" className="Sidebar__filter">
                                  Academic Calendar
                              </label>
                            </li>
                            <li className="Sidebar__filter__list">
                              <input type="checkbox" id="filter--academic_advising" defaultChecked={this.props.tags['academic_advising']} onClick={this.props.handleClick} value={"academic_advising"} />
                              <label for="filter--academic_advising" className="Sidebar__filter">
                                  Academic Advising
                              </label>
                            </li>
                          </ul>
                        </li>

                        <li>
                          <input type="checkbox" id="filter--student" defaultChecked={this.props.tags['student']} onClick={this.props.handleClick} value={"student"} />
                          <label for="filter--student" className="Sidebar__filter">
                              Student Affairs
                          </label>
                          <input type="checkbox" id="dropdown--student" className="Sidebar__filter__icon" defaultChecked={false}/>
                          <label for="dropdown--student">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <polyline points="9 18 15 12 9 6">
                              </polyline>
                            </svg>
                          </label>

                          <ul className="Sidebar__filter__list__group">
                            <li className="Sidebar__filter__list">
                              <input type="checkbox" id="filter--residential" defaultChecked={this.props.tags['residential']} onClick={this.props.handleClick} value={"residential"} />
                              <label for="filter--residential" className="Sidebar__filter">
                                  Residential Life
                              </label>
                            </li>
                            <li className="Sidebar__filter__list">
                              <input type="checkbox" id="filter--health" defaultChecked={this.props.tags['health']} onClick={this.props.handleClick} value={"health"} />
                              <label for="filter--health" className="Sidebar__filter">
                                  Health/Wellness
                              </label>
                            </li>
                            <li className="Sidebar__filter__list">
                              <input type="checkbox" id="filter--international" defaultChecked={this.props.tags['international']} onClick={this.props.handleClick} value={"international"} />
                              <label for="filter--international" className="Sidebar__filter">
                                  Intl' & Study Away
                              </label>
                            </li>
                            <li className="Sidebar__filter__list">
                              <input type="checkbox" id="filter--PGP" defaultChecked={this.props.tags['PGP']} onClick={this.props.handleClick} value={"PGP"} />
                              <label for="filter--PGP" className="Sidebar__filter">
                                  PGP
                              </label>
                            </li>
                            <li className="Sidebar__filter__list">
                              <input type="checkbox" id="filter--HR" defaultChecked={this.props.tags['HR']} onClick={this.props.handleClick} value={"HR"} />
                              <label for="filter--HR" className="Sidebar__filter">
                                  HR
                              </label>
                            </li>
                          </ul>
                        </li>

                        <li>
                          <input type="checkbox" id="filter--admission" defaultChecked={this.props.tags['admission']} onClick={this.props.handleClick} value={"admission"} />
                          <label for="filter--admission" className="Sidebar__filter">
                              Admission & Financial Aid
                          </label>
                        </li>

                        <li>
                          <input type="checkbox" id="filter--library" defaultChecked={this.props.tags['library']} onClick={this.props.handleClick} value={"library"} />
                          <label for="filter--library" className="Sidebar__filter">
                              The Library
                          </label>
                        </li>

                        <li>
                          <input type="checkbox" id="filter--shop" defaultChecked={this.props.tags['shop']} onClick={this.props.handleClick} value={"shop"} />
                          <label for="filter--shop" className="Sidebar__filter">
                              The Shop
                          </label>
                        </li>

                        <li>
                          <input type="checkbox" id="filter--clubs" defaultChecked={this.props.tags['library']} onClick={this.props.handleClick} value={"clubs"} />
                          <label for="filter--clubs" className="Sidebar__filter">
                              Clubs & Organizations
                          </label>
                        </li>

                        <li>
                          <input type="checkbox" id="filter--other" defaultChecked={this.props.tags['shop']} onClick={this.props.handleClick} value={"other"} />
                          <label for="filter--other" className="Sidebar__filter">
                              Other Events
                          </label>
                        </li>
                      </ul>
                    </div>
                </section>

                <section className="Sidebar__section">
                    <h2 className="Sidebar__header">
                        <svg className="Sidebar__header__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Other Calendars
                    </h2>
                    <ul className="Sidebar__filter__list">
                        <li><p className="Sidebar__body"><a href="https://linktouserguide.com">Babson</a></p></li>
                        <li><p className="Sidebar__body"><a href="https://linktouserguide.com"> Wellesley</a></p></li>
                    </ul>
                </section>

                <section className="Sidebar__section">
                    <h2 className="Sidebar__header">
                        <svg className="Sidebar__header__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        Information
                    </h2>
                    <p className="Sidebar__body">For help navigating the site, sharing an event to the calendar,
                    or saving an event to your personal calendar.</p>
                    <ul>
                        <li className="Sidebar__body"><a href="https://linktouserguide.com"> > Event type guidlines</a></li>
                        <li className="Sidebar__body"><a href="https://linktouserguide.com"> > How to publish an event</a></li>
                        <li className="Sidebar__body"><a href="https://linktouserguide.com"> > How to export an event</a></li>
                    </ul>
                </section>

                <section className="Sidebar__section">
                    <h2 className="Sidebar__header">
                        <svg className="Sidebar__header__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        Moderators
                    </h2>
                    <p className="Sidebar__body"> Contact them if you need urgent approval for a new event listing.
                    Otherwise, expect up to 24 hours for a new event to be displayed on the
                    calendar!</p>
                    <ul className="Sidebar__filter__list">
                        <li><p className="Sidebar__body"><a href="mailto:jbrettle@olin.edu"> Jules Brettle</a></p></li>
                        <li><p className="Sidebar__body"><a href="mailto:jgreenberg@olin.edu"> Jack Greenberg</a></p></li>
                    </ul>
                </section>
            </>
        )
    }
}

class App extends React.Component {

    constructor(props) {
        super(props);
        this.academicDropdown = this.academicDropdown.bind(this);

        this.state = {
            events: null,
            ready: false,
            tags: {
                "academic": true,
                "academic_calendar": true,
                "academic_advising": true,
                "international": true,
                "student": true,
                "residential":true,
                "health":true,
                "PGP":true,
                "HR":true,
                "admission": true,
                "library": true,
                "shop": true,
                "clubs": true,
                "other": true,
            },
        }

        this.eventClick = this.eventClick.bind(this);
        this.toggleTag = this.toggleTag.bind(this);
    }

    academicDropdown() {
      alert("Great Shot!");
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
        console.log(e);
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
