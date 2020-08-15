// Import React stuff
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route } from "react-router-dom";
import color from 'color';

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

const masterTagList = [
  {
    id: 'academic_affairs',
    displayName: 'Academic',
    children: [
      {
        id: 'academic_calendar',
        color: '#00458C',
        displayName: 'Academic Calendar',
        defaultVisible: true,
        path: 'academic_affairs:academic_calendar',
      },
      {
        id: 'academic_advising',
        color: '#00458C',
        displayName: 'Academic Advising',
        defaultVisible: true,
        path: 'academic_affairs:academic_advising',
      },
    ],
    color: '#00458C',
    defaultExpanded: true,
    defaultVisible: true,
    path: 'academic_affairs',
  },
  {
    id: 'student_affairs',
    children: [
      {
        id: 'residential',
        color: '#26AAA5',
        displayName: 'Residential',
        defaultVisible: true,
        path: 'student_affairs:residential',
      },
      {
        id: 'health',
        color: '#26AAA5',
        displayName: 'Health and Wellness',
        defaultVisible: true,
        path: 'student_affairs:health',
      },
      {
        id: 'pgp',
        color: '#26AAA5',
        displayName: 'PGP',
        defaultVisible: true,
        path: 'student_affairs:pgp',
      },
      {
        id: 'hr',
        color: '#26AAA5',
        displayName: 'HR',
        defaultVisible: true,
        path: 'student_affairs:hr',
      },
      {
        id: 'diversity',
        color: '#26AAA5',
        displayName: 'Diversity and Inclusion',
        defaultVisible: true,
        path: 'student_affairs:diversity',
      },
      {
        id: 'international',
        color: '#26AAA5',
        displayName: "Intl' and Study Away",
        defaultVisible: true,
        path: 'student_affairs:international',
        },
      ],
      color: '#26AAA5',
      defaultExpanded: true,
      defaultVisible: true,
      displayName: 'Student Affairs',
      path: 'student_affairs',
  },
  {
    id: 'admission',
    color: '#E31D3C',
    displayName: 'Admission and Financial Aid',
    defaultVisible: true,
    path: 'admission',
  },
  {
    id: 'library',
    color: '#511C74',
    displayName: 'The Library',
    defaultVisible: true,
    path: 'library',
  },
  {
    id: 'shop',
    color: '#8EBE3F',
    displayName: 'The Shop',
    defaultVisible: true,
    path: 'shop',
  },
  {
    id: 'clubs',
    color: '#F47920',
    displayName: 'Clubs and Organizations',
    defaultVisible: true,
    path: 'clubs',
  },
  {
    id: 'other',
    color: '#FFC20E',
    displayName: 'Other Events',
    defaultVisible: true,
    path: 'other',
  },
];

function generateTagLookupTable(tagList, table = {}) {
  tagList.forEach(tag => {
    table[tag.path] = tag;
    if (tag.children) {
      table = generateTagLookupTable(tag.children, table);
    }
  });
  return table;
}

const tagLookupTable = generateTagLookupTable(masterTagList);

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
            events[i].category = events[i]['category'];
            events[i].categoryColor = events[i].category[0]
        }
        // TODO: Change this so it uses the color of the first visible tag
        const tagColor =  tagLookupTable[events[i].category[0]].color;
        events[i].backgroundColor = color(tagColor).lightness(88).hex().toString();
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

        const tagStates = this.generateInitialTagState(masterTagList);

        this.state = {
            events: [],
            allEvents: [],
            tags: masterTagList,
            tagStates,
            popUp: null,
            urlid: window.location.hash.substring(1),
        }
        this.eventClick = this.eventClick.bind(this);
        this.toggleTag = this.toggleTag.bind(this);
        this.destroyPopUp = this.destroyPopUp.bind(this);
        this.renderEventPage = this.renderEventPage.bind(this);
        this.handleTagCaretClick = this.handleTagCaretClick.bind(this);

    }
    generateInitialTagState(tagList, tagState = {}) {
        tagList.forEach(tag => {
            // Initialized visibility based on the tag's defaultVisible attribute
            tagState[tag.path] = {
                visible: Boolean(tag.defaultVisible),
            }
            // Check if this tag has any children
            if (tag.children) {
                // Initialize whether this family is expanded or not
                tagState[tag.path].expanded = Boolean(tag.defaultExpanded);
                // Process the children
                this.generateInitialTagState(tag.children, tagState);
            }
        });
        return tagState;
    }

    destroyPopUp() {
        this.setState({
            popUp: null
        })
    }

    recursivelySetTagVisibility(tag, visibility, tagStates) {
      tagStates[tag.path].visible = visibility;
      if (tag.children) {
        tag.children.forEach(childTag => this.recursivelySetTagVisibility(childTag, visibility, tagStates));
      }
    }

    toggleTag(tag) {
      // Create a copy of the state and a new copy of the tag state that we can modify
      const newTagStates = {
        ...this.state.tagStates,
        [tag.path]: {...this.state.tagStates[tag.path]},
      };
      // Toggle the visibility of this tag
      const newVisibility = !newTagStates[tag.path].visible;
      this.recursivelySetTagVisibility(tag, newVisibility, newTagStates);

      // Filter the events so only those with selected tags are shown
      const filteredEvents = this.state.allEvents.filter(event => {
        // Check each category/tag on an event to see if it's selected
        for (const eventCategory of event.category) {
          // Check if this specific category/tag is currently hidden
          if (newTagStates[eventCategory].visible) {
            // This category/tag is visible, so show the event
            return true;
          }
        }
        // None of the tags on this event are visible, so hide this event
        return false;
      });

      // Update the state
      this.setState({
        tags: masterTagList,
        events: filteredEvents,
        tagStates: newTagStates,
      });
    }
    eventClick(e) {
        let eventID = e.event.id;
        this.setState({
            popUp: <EventPage event={this.state.events.find(obj => obj.id === eventID)} returnToCalendar={this.destroyPopUp} />
        })
    }
    handleTagCaretClick(tag) {
      const newState = {
        tagStates: {
          ...this.state.tagStates,
          [tag.path]: {
            ...this.state.tagStates[tag.path],
            expanded: !this.state.tagStates[tag.path].expanded,
          },
        },
      };
      console.log(this.state.tagStates[tag.path])
      console.log(newState.tagStates[tag.path])
      this.setState(newState);
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
                <Sidebar tags={this.state.tags} onTagClicked={this.toggleTag} tagStates={this.state.tagStates} onTagCaretClick={this.handleTagCaretClick} />
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
