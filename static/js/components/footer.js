import React from 'react';

export default class Footer extends React.Component {
    render() {
        return (
            <footer className="Footer">
                <span className="Footer__message">Made with <span style={{color: "red"}}>♥</span> at Olin College</span>
                <span className="Footer__links"><a href="/about">About this Project</a>  |  <a href="https://forms.gle/R1WKvUcC85pcLiu28">Leave us Feedback</a>  |  <a href="https://github.com/jack-greenberg/franks-calendar">View on Github</a></span>
            </footer>
        )
    }
}
