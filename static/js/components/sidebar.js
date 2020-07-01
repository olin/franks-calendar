import React from 'react';

export default class Sidebar extends React.Component {
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
                                  Health & Wellness
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
                        <li className="Sidebar__body">&gt; <a href="/features-guidelines"> Calendar Features & Guidelines </a></li>
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