// Import React stuff
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, useHistory } from "react-router-dom";
import color from 'color';

import '../css/index.scss';
import Sidebar from './components/Sidebar/Sidebar.js';
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
        events[i]['id'] = events[i]['_id']['$oid'];
        // Convert seconds since UNIX epoch to Date objects
        // FIXME: Dates will appear off by one if user is past the West Coast going west or past England going east.
        // Fix is to only send the date (no time) from the server for all-day events.
        events[i]['start'] = new Date(events[i]['dtstart']['$date']);
        events[i]['end'] = new Date(events[i]['dtend']['$date']);
        // Convert to Full Calendar's preferred format
        events[i]['allDay'] = events[i]['all_day'];

        if (!events[i].category) {
            events[i].category = "other";
            events[i].categoryColor = "other"
        } else {
            events[i].category = events[i]['category'];
            events[i].categoryColor = events[i].category.split(":")[0];
        }
        const { category } = events[i];
        if (category in tags) {
          const tagColor = tags[events[i].category].color;
          const tagColorLight = color(tagColor).lightness(88).hex().toString();
          events[i].backgroundColor = tagColorLight;
          events[i].borderColor = tagColorLight;
        } else {
          console.warn(`Could not find event category "${category}" in the map of event colors.`);
        }
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

const App = () => {
  const [state, setState] = useState({
    events: [],
    allEvents: [],
    tags: generateTagLookupTable(masterTagList),
  });

  // Load the events from the server on the component render
  useEffect(() => {
    client.get('/api/events')
      .then(res => {
        let event_list = clean_event_list(JSON.parse(res.data), state.tags);
        setState({
          ...state,
          events: event_list,
          allEvents: event_list,
        });
      }).catch((err) => {
        console.error(err);
        alert('There was an error fetching events.');
    });
  }, []);

  // We'll use this later to push a URL onto the history stack (to view an event)
  const history = useHistory();

  const recursivelySetTagVisibility = (tagId, visibility, newTagsState = null) => {
    if (newTagsState === null) {
      // Create a new copy of this.state.tags that we can modify
      newTagsState = {...state.tags};
    }
    // Create a copy of the tag object and set its visibility
    newTagsState[tagId] = {
      ...newTagsState[tagId],
      visible: visibility,
    };
    if (newTagsState[tagId].children) {
      newTagsState[tagId].children.forEach(childTagId => recursivelySetTagVisibility(childTagId, visibility, newTagsState));
    }
    return newTagsState;
  };

  /**
   * Toggles the visibility of a tag. If the tag has any children, their visibility
   * will be set to be the same as the parent tag.
   * @param tag the tag whose visibility is to be toggled
   */
  const toggleTag = (tag) => {
    const newTagStates = recursivelySetTagVisibility(tag.id, !tag.visible);

    // Filter the events so only those with selected tags are shown
    const filteredEvents = state.allEvents.filter(event => newTagStates[event.category].visible);

    // Update the state
    setState({
      ...state,
      tags: newTagStates,
      events: filteredEvents,
    });
  }
    const eventClick = (e) => {
      const eventID = e.event.id;
      history.push(`/events/${eventID}`);
    };
    const handleTagCaretClick = (tag) => {
      const newTagsState = {
        ...state.tags,
        [tag.id]: {
          ...state.tags[tag.id],
          expanded: !state.tags[tag.id].expanded,
        },
      };
      setState({ ...state, tags: newTagsState });
    }

    // TODO: Preserve the state of Full Calendar (view mode, date, etc) so we don't need to keep rendering it when
    // showing the event details page and so we can re-render it later with the same appearance
        return (
            <>
                <Sidebar tags={state.tags} onTagClicked={toggleTag} onTagCaretClick={handleTagCaretClick} />
                <div className="Calendar">
                  <Route path="/events/:eventId">
                    <EventPage events={state.allEvents} />
                  </Route>
                    <FullCalendar
                        allDaySlot={true}
                        defaultView="timeGridWeek"
                        nowIndicator={true}
                        plugins={[ dayGridPlugin, timeGridPlugin ]}
                        events={state.events}
                        displayEventTime={true}
                        eventRender={EventComponent}
                        eventClick={eventClick}
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

var renderedApp = (
    <ErrorBoundary>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ErrorBoundary>
);

ReactDOM.render(renderedApp, document.getElementById('calendar-root'));
