import React from 'react';
import client from '../api';


export default class EventPage extends React.Component {
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
