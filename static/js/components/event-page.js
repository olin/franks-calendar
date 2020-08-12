import React from 'react';
import client from '../api';

export default class EventPage extends React.Component {
    constructor(props) {
        super(props);

        this.exportEvent = this.exportEvent.bind(this);
    }
    exportEvent(e) {
        // Retrieves event information and returns as ical file
        var eventID = this.props.event.id;
        var email = document.getElementById("exportEmail").value;
        console.log(email);

        if (!email) {
          alert("You must enter an email!");
          e.preventDefault();
          return;
        }
        //
        // var pattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/;
        // if (!pattern.test(email)) {
        //   alert("Please enter a valid email!");
        //   e.preventDefault();
        //   return;
        // }

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

    render() {
        window.location.hash = this.props.event.id;

        function timeString(date) {
            let hours = date.getHours();
            let minutes = date.getMinutes();

            // Check whether AM or PM
            var newformat = hours >= 12 ? 'PM' : 'AM';

            // Find current hour in AM-PM Format
            hours = hours % 12;

            // To display "0" as "12"
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;

            return (hours + ':' + minutes + ' ' + newformat);
        }

        var timeText;
        if (this.props.event.allDay) {

            // var startTime = new Date(event.start).toLocaleString().split(", ")[1].replace(":00 ", "");
            // var endTime = new Date(event.end).toLocaleString().split(", ")[1].replace(":00 ", "");

            var startDate = new Date(this.props.event.start).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            var endDate = new Date(this.props.event.end).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

            if (startDate === endDate) {
                timeText = (
                    <span class="Event__content__date">{startDate}</span>
                )
            } else {
                timeText = (
                    <>
                        <span class="Event__content__date">{startDate}</span> -
                        <span class="Event__content__time">{endDate}</span>
                    </>
                )
            }
        } else {
            timeText = (
                <>
                    <span class="Event__content__date">
                      {this.props.event.start.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    |
                    <span class="Event__content__time">
                      {timeString(this.props.event.start)}
                    </span>
                    -
                    <span class="Event__content__time">
                      {timeString(this.props.event.end)}
                    </span>
                </>
            )
        }

        var category = this.props.event.category[0];

        // check if the location is a url
        // location is a url if matches this pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        // display the location as <a href="location">location</a>
        var location_text = this.props.event.location;
        var location_el;
        if (location_text.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)) {
            location_el = <a class="Event__content__text__link" href={location_text}>{location_text}</a>;
        } else {
            location_el = location_text;
        }

        // check if the location is a url
        // location is a url if matches this pattern: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
        // display the location as <a href="location">location</a>
        var location_text = this.props.event.location;
        var location_el;
        if (location_text.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/)) {
            location_el = <a class="Event__content__text__link" href={location_text}>{location_text}</a>;
        } else {
            location_el = location_text;
        }

        return (
            <div class="Event">
              <div class="Event__width">
                <button class="Event__button" onClick={this.props.returnToCalendar}>
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
                </button>

                <section class="Event__content">
                  <h2 class="Event__content__title">
                    {this.props.event.title}
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
                          {this.props.event.host_name}
                        </span>
                        |
                        <a style={{paddingLeft:'0.5em'}} class="Event__content__text__link" href={"mailto:" + this.props.event.host_email}>
                          {this.props.event.host_email}
                        </a>
                      </td>
                    </tr>

                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        When?
                      </td>
                      <td class="Event__content__text">
                        {timeText}
                      </td>
                    </tr>

                    {this.props.event.location &&
                        <tr class="Event__content__table__row">
                          <td class="Event__content__headers">
                            Where?
                          </td>
                          <td class="Event__content__text">
                            {location_el}
                          </td>
                        </tr>
                    }

		                {this.props.event.description &&
                    <tr class="Event__content__table__row">
                      <td class="Event__content__headers">
                        What?
                      </td>
                      <td class="Event__content__text">
                         <div dangerouslySetInnerHTML={{__html: this.props.event.description.replace(/\<br\>/, '')}}>
                         </div>
                      </td>
                    </tr>
		                }
                  </table>
                </section>

                <div id="eventExport" class="Event__export">
                  <input type="email" id="exportEmail" class="Event__export__field" placeholder="franklin.olin@olin.edu"/>
                  <button class="Event__export__button" onClick={this.exportEvent}>
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
}
