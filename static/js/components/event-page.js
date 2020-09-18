import React from 'react';
import client from '../api';
import {Link, useParams} from "react-router-dom";


function exportEvent(eventID) {
        // Retrieves event information and returns as ical file
        var email = document.getElementById("exportEmail").value;

        const emailPattern = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

        if (!emailPattern.test(email)) {
          alert("You must enter an email!");
          return;
        }

        client.post('/export/' + eventID, {
          email: email
        })
        .then(res => {
            document.getElementById("eventExport").innerHTML = (
                '<p class="Event__export__message">&#127881; Success! Check your email for an iCal to this event.</p>'
            )
            // var element = document.createElement('a');
            // element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res.data));
            // element.setAttribute('download', "calendar_event.ics");
            // element.style.display = 'none';
            // document.body.appendChild(element);
            // // Autmoatically downloads ical file
            // element.click();
            // document.body.removeChild(element);
        })
        .catch(err => {
            console.error(err);
            alert("Sorry, there was an error processing your email!");
        })
    }

/**
 * Uses the Day.js formatting utils to generate the desired event "When?" string.
 * Considers whether the event is all-day or if it spans multiple days when determining
 * the specific format to use.
 * @see https://day.js.org/docs/en/display/format
 * @param event an event object with `start`, `end` and `allDay` properties
 * @returns {string} the formatted string
 */
const getFormattedWhenString = (event) => {
  const startDateTime = dayjs(event.start);
  const endDateTime = dayjs(event.end);
  if (event.allDay) {
    if (startDateTime.isSame(endDateTime, 'day')) {
      return startDateTime.format('MMM D, YYYY');
    } else {
      // Subtract one day from the end date because the date is actually the following day (the end datetime was stored
      // as midnight Eastern the following day in the database, though we weren't given the time here)
      return `${startDateTime.format('MMM D, YYYY')} - ${endDateTime.subtract(1, 'day').format('MMM D, YYYY')}`;
    }
  } else {
    if (startDateTime.isSame(endDateTime, 'day')) {
      return `${startDateTime.format('MMM D, YYYY h:mm A')} - ${endDateTime.format('h:mm A')}`;
    } else {
      return `${startDateTime.format('MMM D, YYYY h:mm A')} - ${endDateTime.format('MMM D, YYYY h:mm A')}`;
    }
  }
};

const EventPage = (props) => {
  // Get the event ID from the URL
  const { eventId } = useParams();

  // If the user navigated straight to this page and the event data hasn't been loaded
  // by index.js yet, show a loading message.
  if (!props.events || props.events.length === 0) {
    return (
      <div className="Event">
        <h1 className="Event__content__title">Loading...</h1>
      </div>
    );
  }

  const event = props.events.find(e => e.id === eventId);

  // Make sure we've found the event. Otherwise, show a 404 message.
  if (!event) {
    return (
      <div className="Event">
        <h1 className="Event__content__title">404 Event Not Found</h1>
        <p>We're sorry, but we could not find the event you were looking for. Perhaps it has been deleted.</p>
      </div>
    )
  }
        var category = event.category.split(":").slice(-1)[0];

        // check if the location is a url
        // location is a url if matches this pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        // display the location as <a href="location">location</a>
        var location_text = event.location;
        var location_el;
        if (location_text.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)) {
            location_el = <a class="Event__content__text__link" href={location_text}>{location_text}</a>;
        } else {
            location_el = location_text;
        }

        // check if the location is a url
        // location is a url if matches this pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        // display the location as <a href="location">location</a>
        var location_text = event.location;
        var location_el;
        if (location_text.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)) {
            location_el = <a class="Event__content__text__link" href={location_text}>{location_text}</a>;
        } else {
            location_el = location_text;
        }

        return (
            <div class="Event">
              <div class="Event__width">
                <Link class="Event__button" to="/">
                  <span class="Event__button__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 8 8 12 12 16"></polyline>
                      <line x1="16" y1="12" x2="8" y2="12"></line>
                    </svg>
                  </span>
                  <span class="Event__button__text">
                    Back to Calendar
                  </span>
                </Link>

                <section class="Event__content">
                  <h2 class="Event__content__title">
                    {event.title}
                  </h2>

                  <div class="Event__content__block">
                    <span data-tag={category} class="Event__content__tag">
                      {category === "pgp" ? "PGP": category === "hr" ? "HR": category.replace("_", " ")}
                    </span>
                  </div>

                  <table class="Event__content__table">
                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        Hosted by
                      </td>
                      <td class="Event__content__text">
                        <span class="Event__content__date">
                          {event.host_name}
                        </span>
                        |
                        <a style={{paddingLeft:'0.5em'}} class="Event__content__text__link" href={"mailto:" + event.host_email}>
                          {event.host_email}
                        </a>
                      </td>
                    </tr>

                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        When?
                      </td>
                      <td class="Event__content__text">
                        {getFormattedWhenString(event)} (your time)
                      </td>
                    </tr>

                    {event.location &&
                        <tr class="Event__content__table__row">
                          <td class="Event__content__headers">
                            Where?
                          </td>
                          <td class="Event__content__text">
                            {location_el}
                          </td>
                        </tr>
                    }

		                {event.description &&
                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        What?
                      </td>
                      <td class="Event__content__text">
                         <div dangerouslySetInnerHTML={{__html: event.description.replace(/\<br\>/, '')}}>
                         </div>
                      </td>
                    </tr>
		                }
                  </table>
                </section>

                <div id="eventExport" class="Event__export">
                  <input id="exportEmail" class="Event__export__field" placeholder="franklin.olin@olin.edu" type="email" required/>
                  <button class="Event__export__button" onClick={() => exportEvent(eventId)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>Send me an iCal</span>
                  </button>
                </div>
              </div>
            </div>
        )
}

export default EventPage;

