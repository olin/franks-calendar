# Moving Forward

If you're reading this, it's likely you're taking over development of Franks Calendar from the founding members. Welcome on board! This document serves as a list of things that could be built up, rebuilt, or implemented in some way moving forward.

## First, some thoughts

When this project was started, I (Jack) architected the site the way I had taught myself a few years ago. The site is a combination of React and Flask, and some pages are built with Flask/Jinja-templates and some pages are built with React. The final result is a pretty messy platform that lacks robustness.

If this project really takes off (and I hope it does), it will likely require restructuring. Whether this happens during FA2020 or after isn't important, but I do have some ideas...

> Also a disclaimer: if this stuff doesn't happen, that's totally fine. It's possible that if I have more bandwidth in the spring I will rejoin the project and spend time working on converting everything to this new framework.

## Project Structure

Currently the project is a mish-mash of Python, Javascript, CSS, and HTML, and that needs to be cleaned up. I would propose a restructuring of the app that ends up looking like this:

```plaintext
.
├── docker-compose.yml (Docker stuff could also all be moved to a `docker` folder)
├── Dockerfile
├── docs
│   └── # Documentation about the techinical aspects of the project would live here
├── README.md
├── scripts
│   └── # Any bash scripts like entrypoints, healthchecks, etc. would live here
├── tests
│   └── # The python unittesting would live here
├── tools
│   └── # The entire backend would exist in this folder
└── web
    └── # All of the front-end would be here
```

I am using this structure on the [tools.olin.edu](https://github.com/jack-greenberg/tools.olin.edu) webapp I am working on, and it has served me very well.

## Frontend

I would recommend using create-react-app as a starting place for the frontend. It is well structured and I have found it to be very useful.

## Database Stuff

I initially chose MongoDB because I thought the flexible structure for documents would be the best way to store event data, but in the end I believe that a relational database (SQL database) would work much better since the event data is pretty structured. I highly recommend PostgreSQL, since I have found it pretty easy to work with.

With a database like that, I also recommend using SQLAlchemy as an ORM (look it up, it's pretty cool) because it is super helpful and allows you to set up schemas that are easy to query. It's essentially a layer of abstraction for database transactions.

You could also explore using GraphQL as an API instead of a REST API. I have been using GraphQL and am really enjoying it.

## Docker

I chose docker because it has the power to make setup and deployment super simple. It is supposed to be platform agnostic, however we ran into issues for a few folks trying to use Docker on windows. I'm not sure if those problems were solveable or not... I'm a Linux guy myself.

I recommend restructuring the docker setup into four components:

* Backend: the python container. I have an image I built for tools.olin.edu that can be used for inspiration
* Frontend: this could be based off the node:alpine image, and it will be responsible for running the react app
* Database: the database container, self-explanatory
* NGINX: a container for reverse proxying requests from the frontend to the backend. If you don't use this, you'll probably have to do some fancy CORS stuff to make sure the two sides of the app can communicate despite being at different origins (each container is it's own origin)

## Features for the future

### Email event parsing

This was supposed to be the flagship feature of the project: you would be able to invite *frankscalendar@olin.edu* to your event (like you would invite anyone else by email), and the receipt of an email would trigger a webhook that would send the iCal to the server. The iCal would be parsed and the details of the event would be entered into the database.

I think this feature would be super cool--I hope it gets implemented at some point, but like I wrote above, it doesn't have to be in the fall semester.

### More robust event administration

Currently, events have statuses like Pending Approval and Approved and Changes Requested, but there are probably some loopholes. One that I know of is that if you get an event approved and then you update it, the changes are directly applied to the event on the live site. It would be better the changes were stored as a draft that could needs to be reapproved.

### More secure authentication

The platform uses a pretty cheap and insecure way of restricting access to admin interfaces, just by using a magic code that we assign (it is a magic link infrastructure), but it's not super secure so it could be improved. The thought was that since it's just for the olin community, the honor code rules would apply.