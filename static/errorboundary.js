import React from 'react';

export class ErrorBoundary extends React.Component {
    /*
        Error catcher to prevent White Screen of Death (from reactjs.org)
    */
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({
            hasError: true,
            error: error,
            info: info,
        })
    }

    render() {
        if (this.state.hasError && this.state.error && this.state.info) {
            // var locationMatch = /webpack:\/\/\/\.(\/[A-Z0-9\_\-\.]+)*\.js:([0-9]+):([0-9]+)(\))?\n/img
            // console.log(this.state);
            // var fullLocation = this.state.error.stack.match(locationMatch);
            // var location = fullLocation[0].match(/[^\s\/]*\.js:([0-9]+):([0-9]+)/ig)[0];

            return (
                <div className="errorhandler">
                    <h1 className="errorhandler__title">Uh oh. Something went wrong...</h1>
                    <h2 className="errorhandler__error">{this.state.error.toString()}</h2>
                    {/* <strong className="errorhandler__location">{location}</strong> */}
                    <details className="errorhandler__details" style={{ whiteSpace: 'pre-wrap' }} open>
                        <summary className="errorhandler__summary">Stack Trace</summary>
                        {this.state.info.componentStack}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}
