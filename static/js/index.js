// Import React stuff
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route } from "react-router-dom";
import color from 'color';

import '../css/index.scss';
import Sidebar from './components/Sidebar/sidebar.js';
import EventPage from './components/event-page.js';
import { ErrorBoundary } from './errorboundary';
import client from './api';

// Calendar
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import masterTagList from './tag-list.json';

function generateTagLookupTable(tagList, table = {}) {
  tagList.forEach(tag => table[tag.id] = tag);
  return table;
}

function clean_event_list(events, tags) {
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
            events[i].categoryColor = events[i].category;
        }
        const tagColor =  tags[events[i].category].color;
        const tagColorLight = color(tagColor).lightness(88).hex().toString();
        events[i].backgroundColor = tagColorLight;
        events[i].borderColor = tagColorLight;
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
            tags: generateTagLookupTable(masterTagList),
            popUp: null,
            urlid: window.location.hash.substring(1),
        }
        this.eventClick = this.eventClick.bind(this);
        this.toggleTag = this.toggleTag.bind(this);
        this.destroyPopUp = this.destroyPopUp.bind(this);
        this.renderEventPage = this.renderEventPage.bind(this);
        this.handleTagCaretClick = this.handleTagCaretClick.bind(this);

    }

    destroyPopUp() {
        this.setState({
            popUp: null
        })
    }

    recursivelySetTagVisibility(tagId, visibility, newTagsState = null) {
      if (newTagsState === null) {
        // Create a new copy of this.state.tags that we can modify
        newTagsState = {...this.state.tags};
      }
      // Create a copy of the tag object and set its visibility
      newTagsState[tagId] = {
        ...newTagsState[tagId],
        visible: visibility,
      };
      if (newTagsState[tagId].children) {
        newTagsState[tagId].children.forEach(childTagId => this.recursivelySetTagVisibility(childTagId, visibility, newTagsState));
      }
      return newTagsState;
    }

  /**
   * Toggles the visibility of a tag. If the tag has any children, their visibility
   * will be set to be the same as the parent tag.
   * @param tag the tag whose visibility is to be toggled
   */
  toggleTag(tag) {
      const newTagStates = this.recursivelySetTagVisibility(tag.id, !tag.visible);

      // Filter the events so only those with selected tags are shown
      const filteredEvents = this.state.allEvents.filter(event => newTagStates[event.category].visible);

      // Update the state
      this.setState({
        tags: newTagStates,
        events: filteredEvents,
      });
    }
    eventClick(e) {
        let eventID = e.event.id;
        this.setState({
            popUp: <EventPage event={this.state.events.find(obj => obj.id === eventID)} returnToCalendar={this.destroyPopUp} />
        })
    }
    handleTagCaretClick(tag) {
      const newTagsState = {
        ...this.state.tags,
        [tag.id]: {
          ...this.state.tags[tag.id],
          expanded: !this.state.tags[tag.id].expanded,
        },
      };
      this.setState({ tags: newTagsState });
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
            let event_list = clean_event_list(JSON.parse(res.data), this.state.tags)
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
                <Sidebar tags={this.state.tags} onTagClicked={this.toggleTag} onTagCaretClick={this.handleTagCaretClick} />
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
