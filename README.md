# Frank's Calendar

## How to collaborate
1. Fork this repository! This means you create your own version on your account that you own and can make changes to.
2. Start making changes to your fork. Once you make a significant change, make a commit and push to your remote.
3. Once you have a feature to implement (in the form of a series of commits), open a pull request on the [original repository](https://github.com/jack-greenberg/franks-calendar).
4. I'll check for merge conflicts, resolve any that come up, and then merge your request (this helps manage merge conflicts that are a pain to deal with on your own).

## Running the app
1. Create a virtual environment (run this after you have `cd`ed to the folder:
```bash
$ python3 -m pip install virtualenv
$ virtualenv venv
```
2. Activate the virtual environment and install the packages:
```bash
$ . venv/bin/activate
$ pip install -r requirements.txt
```
3. Install the javascript packages:
```bash
$ npm install
```
4. Run the server:
```bash
$ npm run serve
```
5. Profit (go to http://localhost:5000)

## Directory Organization

```txt
.
├── app.py - Handles setting up and running the application
├── blueprints - This is where the majority of backend work is done
│   ├── __init__.py
│   └── public.py - Handles routing for pages and backend functionality
├── config.py
├── package.json
├── package-lock.json
├── postcss.config.js
├── README.md - This file!
├── static - All static resources go here, like CSS and JavaScript
│   ├── build
│   │   └── build.css
│   └── tailwind.css
│       If you want to add a CSS file, add it here!
├── tailwind.config.js
├── templates - This is where all the HTML goes
│   ├── 404.html - The page loaded when the requested page doesn't exist
│   ├── base.html - Every page will include this HTML. It forms the base.
│   ├── example.html - Duplicate this to start a blank page
│   └── home.html - The home page (franks-calendar.com/)
└── webpack.config.js
```

### Additional Notes
* When editing the HTML files, put everything in between the {% block page %} and {% endblock %}. This will make sure it gets included when the page is loaded
* `tailwind.css` should take care of all CSS styling for you. [Go to this website to learn more about it](https://tailwindcss.com)



## Docker (windows) Instructions via Nathan
1. Clone your fork of repo using "git clone"
2. Ensure docker desktop is running
3. Open Docker Desktop settings (right click on tray icon)
4. Enable Drive sharing (Resources->File Sharing->Select your drive)
5. Navigate into root of the project using powershell
6. In powershell run (this may take a while)
```bash
$ docker-compose up -d
```
7. Navigate to localhost:5000 to see your Franks Calendar!
