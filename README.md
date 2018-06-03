# Wipefest

[Wipefest](https://www.wipefest.net/) uses data from [Warcraft Logs](https://www.warcraftlogs.com/) to display insights and timelines for raid encounters.

This repository contains the code for the Wipefest frontend. The frontend is an [Angular 6](https://angular.io/) application, running inside of [Node.js](https://nodejs.org/en/) as an [Express](https://expressjs.com/) server.

## How does it all fit together?

The architecture of the entire Wipefest solution is separated into a few distinct layers.

This project focuses mostly on presentation and user experience, with all actual logic handled by the [Wipefest.Core](https://github.com/JoshYaxley/Wipefest.Core) library, and persistence handled by [Wipefest.Api](https://github.com/JoshYaxley/Wipefest.Api).

The relationships between the Wipefest family of projects is as follows:

![](/docs/infrastructure.png)

To understand which layer is responsible for which domain, consider a user requesting Wipefest to process and return a fight:

### Wipefest

A user uses the Wipefest frontend to find the fight that they want to see data for. The frontend makes a HTTP request to Wipefest.Api for the data. When the data is returned, the frontend presents it appropriately.

### Wipefest.Api

When the API receives a request for fight data, it first checks if it has processed that fight before. If it has, it will pull the previous results from its [Redis](https://redis.io/) cache, and return that. Otherwise, it will call into the Wipefest.Core library. When Wipefest.Core returns the data, the API caches it and returns it.

### Wipefest.Core

The core library exists as an [NPM package](https://www.npmjs.com/package/@wipefest/core) that people can use in their own projects. When this library receives a request to process a fight, it pulls configuration data from [Wipefest.EventConfigs](https://github.com/JoshYaxley/Wipefest.EventConfigs/) to work out what events it should be building. It then makes the relevant requests to the [Warcraft Logs API](https://www.warcraftlogs.com/v1/docs) to get the data it needs to build the events. It then calculates insights based on these events, and returns everything.

> An almost identical flow is used when people interact with Wipefest via Discord, except that the Wipefest frontend is replaced by the [Wipefest.Bot](https://github.com/JoshYaxley/Wipefest.Bot)

## Run the application

Install the Angular CLI globally:

`npm install @angular.cli --global`

Clone the repository:

`git clone https://github.com/JoshYaxley/Wipefest.git`

Change directory:

`cd Wipefest`

Install dependencies:

`npm install`

Serve the application locally:

`ng serve`

Then visit [http://localhost:4200](http://localhost:4200) in your browser.

## Contribute

1. Get in touch on our Discord server or using the issue tracker
2. Fork this repository
3. Make a feature branch
4. Commit/push your changes
5. Make a pull request

> To contribute to [Wipefest.Core](https://github.com/JoshYaxley/Wipefest.Core), [Wipefest.Api](https://github.com/JoshYaxley/Wipefest.Api), [Wipefest.EventConfigs](https://github.com/JoshYaxley/Wipefest.EventConfigs), or [Wipefest.Bot](https://github.com/JoshYaxley/Wipefest.Bot), see their respective repositories.