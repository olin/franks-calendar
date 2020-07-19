import React from 'react';

export default class Header extends React.Component {
    render() {
        return (
            <header className="Header">
                <h1 className="Header__title">
                    <img src="/static/images/franks_cal_logo.png" alt="Frank's Calendar Logo" className="Header__title__icon" />
                    <span className="Header__title__text">Frank's Calendar</span>
                </h1>
            </header>
        )
    }
}
