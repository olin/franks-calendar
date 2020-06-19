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

function clean_event_list(events) {
    for (var i = 0; i < events.length; i++) {
        events[i]['start'] = new Date(events[i]['start']['$date']);
        events[i]['end'] = new Date(events[i]['end']['$date']);
        events[i]['id'] = events[i]['_id']['$oid'];

        let isAllDay = events[i]['start'].getUTCHours() == 0;
        events[i]['allDay'] = isAllDay;

        if (!events[i].tag) {
            events[i].tag = ["other"]
        } else {
            events[i].tag = events[i]['tag'].split(":")
        }
        events[i].color = colorMap[events[i].tag[0]]
    }
    return events
}

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <section className="Sidebar__section">

                    <a href="/add" className="Sidebar__form">
                      PUBLISH A NEW EVENT
                    </a>

                    <h2 className="Sidebar__header">
                        <svg className="Sidebar__header__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                        </svg>
                        FILTERS
                    </h2>

                    <div>
                      <ul className="Sidebar__filter__list">
                        <li>
                          <input type="checkbox" id="filter--academic" defaultChecked={this.props.tags['academic_affairs']} onClick={this.props.handleClick} value={"academic_affairs"} />
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
                          <input type="checkbox" id="filter--student" defaultChecked={this.props.tags['student_affairs']} onClick={this.props.handleClick} value={"student_affairs"} />
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
                              <input type="checkbox" id="filter--pgp" defaultChecked={this.props.tags['pgp']} onClick={this.props.handleClick} value={"pgp"} />
                              <label for="filter--pgp" className="Sidebar__filter">
                                  PGP
                              </label>
                            </li>
                            <li className="Sidebar__filter__list">
                              <input type="checkbox" id="filter--hr" defaultChecked={this.props.tags['hr']} onClick={this.props.handleClick} value={"hr"} />
                              <label for="filter--hr" className="Sidebar__filter">
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
                        OTHER CALENDARS
                    </h2>
                    <ul className="Sidebar__filter__list">
                        <li><p className="Sidebar__body">&gt; <a href="https://www.foundry.babson.edu/events-calendar" target="_blank"> The Weissman Foundry</a></p></li>
                        <li><p className="Sidebar__body">&gt; <a href="http://calendar.babson.edu/" target="_blank"> Babson College</a></p></li>
                        <li><p className="Sidebar__body">&gt; <a href="https://www.wellesley.edu/publiccalendar#/?i=1" target="_blank"> Wellesley College</a></p></li>
                    </ul>
                </section>

                <section className="Sidebar__section">
                    <h2 className="Sidebar__header">
                        <svg className="Sidebar__header__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        INFORMATION
                    </h2>
                    <ul className="Sidebar__filter__list">
                        <li className="Sidebar__body">&gt; <a href="/features-guidelines"> Event Norms & Guidelines </a></li>
                        <li className="Sidebar__body">&gt; <a href="/publishing"> How to Publish an Event</a></li>
                        <li className="Sidebar__body">&gt; <a href="/exporting"> How to Export an Event</a></li>
                    </ul>
                </section>

                <section className="Sidebar__section">
                    <h2 className="Sidebar__header">
                        <svg className="Sidebar__header__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        MODERATORS
                    </h2>
                    <ul className="Sidebar__filter__list">
                        <li><p className="Sidebar__body">&gt; <a href="mailto:jbrettle@olin.edu"> Jules Brettle '23</a></p></li>
                        <li><p className="Sidebar__body">&gt; <a href="mailto:jgreenberg@olin.edu"> Jack Greenberg '23</a></p></li>
                        <p className="Sidebar__body__text"> Contact them if you need urgent approval for a new event listing.
                        Otherwise, expect up to 24 hours for a new event to be displayed on the
                        calendar!</p>
                    </ul>
                </section>
            </>
        )
    }
}

class EventPage extends React.Component {
    constructor(props) {
        super(props);

        this.exportEvent = this.exportEvent.bind(this);
    }
    exportEvent() {
        // Retrieves event information and returns as ical file
        let eventID = this.props.event.id;
        client.get('/export/' + eventID)
        .then(res => {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res.data));
            element.setAttribute('download', "calendar_event.ics");
            element.style.display = 'none';
            document.body.appendChild(element);
            // Autmoatically downloads ical file
            element.click();
            document.body.removeChild(element);
        })
        .catch(err => {
            console.error(err);
        })
    }

    render() {
        var tag = this.props.event.tag.pop();
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

        function dateToString(date) {
          let hours = date.getHours();
          let minutes = ('0'+date.getMinutes()).slice(-2);
          return (hours + ':' + minutes)
        }

        return (
            <div class="Event">
              <section class="Event__row">
                  <button class="Event__button" onClick={this.props.returnToCalendar}>
                    <span class="Event__button__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 8 8 12 12 16"></polyline>
                        <line x1="16" y1="12" x2="8" y2="12"></line>
                      </svg>
                    </span>
                    Back to Calendar
                  </button>

                  <button class="Event__button" onClick={this.exportEvent}>
                    <span class="Event__button__icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="8 12 12 16 16 12"></polyline>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                      </svg>
                    </span>
                    Export Event
                  </button>
              </section>

              <section class="Event__content">
                  <h2 class="Event__content__title">
                    {this.props.event.title}
                  </h2>

                  <div class="Event__content__block">
                    <span data-tag={tag} class="Event__content__tag">
                      {tag}
                    </span>
                  </div>

                  <table class="Event__content__table">
                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        Hosted by
                      </td>
                      <td class="Event__content__text">
                        <span class="Event__content__date">
                          Franklin Olin
                        </span>
                        |
                        <a class="Event__content__text__link" href="mailto:Eco-Reps@olin.edu">
                        franklin.olin@olin.edu
                        </a>
                      </td>
                    </tr>

                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        When?
                      </td>
                      <td class="Event__content__text">
                        <span class="Event__content__date">
                          {this.props.event.start.toLocaleDateString("en-US", options)}
                        </span>
                        |
                        <span class="Event__content__time">
                          {dateToString(this.props.event.start)}
                        </span>
                        -
                        <span class="Event__content__time">
                          {dateToString(this.props.event.end)}
                        </span>
                      </td>
                    </tr>

                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        Where?
                      </td>
                      <td class="Event__content__text">
                        {this.props.event.location}
                      </td>
                    </tr>

                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        What?
                      </td>
                      <td class="Event__content__text" dangerouslySetInnerHTML={{__html: this.props.event.description.replace(/\<br\>/, '')}}>
                      </td>
                    </tr>
                  </table>
                </section>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            events: [],
            allEvents: [],
            ready: false,
            tags: {
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
            },
            popUp: null,
        }

        this.eventClick = this.eventClick.bind(this);
        this.toggleTag = this.toggleTag.bind(this);
        // this.switchPanel = this.switchPanel.bind(this);
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
            let event_list = clean_event_list(res.data)
            this.setState({
                events: event_list,
                allEvents: event_list,
                ready: true,
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
                        <img src="/static/images/franks_cal_logo.png" alt="Frank's Calendar Logo" className="Header__title__icon" />
                        <span className="Header__title__text">Frank's Calendar</span>
                    </h1>
                </header>
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
                <footer className="Footer">
                    <span className="Footer__message">Made with <span style={{color: "red"}}>♥</span> at Olin College</span>
                    <span className="Footer__links"><a href="/about">About this Project</a>  |  <a href="https://forms.gle/R1WKvUcC85pcLiu28">Leave us Feedback</a>  |  <a href="https://github.com/jack-greenberg/franks-calendar">View on Github</a></span>
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
