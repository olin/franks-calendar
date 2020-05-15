# Frank's Calendar

## How to collaborate
1. Fork this repository! This means you create your own version on your account that you own and can make changes to.
2. Start making changes to your fork. Once you make a significant change, make a commit and push to your remote.
3. Once you have a feature to implement (in the form of a series of commits), open a pull request on the [original repository](https://github.com/jack-greenberg/franks-calendar).
4. I'll check for merge conflicts, resolve any that come up, and then merge your request (this helps manage merge conflicts that are a pain to deal with on your own).

## Running the app
1. Fork the repository by going to the [main repository](https://github.com/jack-greenberg/franks-calendar) and clicking the button that says `Fork`.

2. Clone the repository to your local computer. In your terminal, run

   ```bash
   $ git clone https://github.com/<your-username>/franks-calendar.git
   $ cd franks-calendar
   ```

3. Make sure you have [Docker installed](https://docs.docker.com/engine/install/).

4. Type in

   ```bash
   $ docker-compose up -d
   ```

5. Wait while Docker installs all its dependencies and builds the containers.

6. When the command finishes and you see the prompt again, navigate to [http://localhost:5000](http://localhost:5000).



If you are using Windows, I don't know that I will be of much assistance--I've gotten mixed results from trying to install this on Windows, but message me and I will do my best to help!



## How everything works

### Front end

Our front end uses the [ReactJS](https://reactjs.org) web app framework. I chose this because I have the most experience with it and it is an incredibly powerful tool. It also can do exactly what we want it to do.

The centerpiece of the app is a [FullCalendar](https://fullcalendar.io) module that runs the calendar that users can interact with. It's documentation is a bit confusing so feel free to ask me for help/clarification.

We use Sass (in particular, SCSS, which stands for "Sassy CSS") for CSS because it's cleaner and easier to read and maintain.

We use Webpack to bundle and transpile all SCSS and ES6 (JavaScript).

### Back end

The back end of the app uses Python's Flask framework for HTTP routing and creating an API. We use MongoDB for a database. The API is how the front end interfaces with the back end. It might be worth reading up on REST APIs, which is what we are using (and is the most common type).



## Additional Notes
* When editing the HTML files, put everything in between the {% block page %} and {% endblock %}. This will make sure it gets included when the page is loaded
