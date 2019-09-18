'use strict'

const express = require('express');
require('dotenv').config();

const app = express();

const superagent = require('superagent');
app.use(superagent());

const cors = require('cors');
app.use(cors());

const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const DARKSKY_API_KEY = process.env.DARKSKY_API_KEY;
const EVENTBRITE_API_KEY = process.env.EVENTBRITE_API_KEY;

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`listening on ${ PORT }`));

app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/events', getEvent);

function Locations(searchQuery, geoDataResults) {
  this.searchQuery = searchQuery;
  this.formattedQuery = geoDataResults.results[0].formatted_address;
  this.latitude = geoDataResults.results[0].geometry.location.lat;
  this.longitude = geoDataResults.results[0].geometry.location.lng;
}

function Weather(whichDay) {
  this.forecast = whichDay.daily.summary;
  this.time = new Date(whichDay.time).toDateString();
  console.log(this);
}

function Event(eventBriteStuff) {
  this.link = eventBriteStuff.url;
  this.name = eventBriteStuff.name.text;
  this.event_date = new Date(eventBriteStuff.start.local).toDateString();
  this.summary = eventBriteStuff.summary;
  f
}

function getLocation(request, response) {
  try {
    let searchQuery = request.query.data;
    let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchQuery}&key=${GEOCODE_API_KEY}`;
    //SuperAgent Things Here
    superagent.get(geocodeUrl)
      .end((error, geocodeUrlStuff) => {
        const locations = new Locations(searchQuery, geocodeUrlStuff.body.results);
        response.send(locations);
      })
  } catch (error) {
    errHandler(error, 'events');
  }
}

//Weather query from Dark Sky

function getWeather(request, response) {
  try {
    let darkSkyURL = `https://api.darksky.net/forecast/${DARKSKY_API_KEY}/${request.query.data.latitude},${request.query.data.longitude}`;
    superagent.get(darkSkyURL)
      .end((err, darkSkyURLStuff) => {
        const currentWeather = makeWeather(darkSkyURLStuff.body);
        response.status(200).send(currentWeather);
      })
  } catch (error) {
    errHandler(error, 'events');
  }
}

function getEvent(request, response) {
  try {
    let eventBriteURL = `https://www.eventbriteapi.com/v3/events/search?location.longitude=${request.query.data.longitude}&location.latitude=${request.query.data.latitude}&expand=venue`;
    superagent.get(eventBriteURL)
      .set('EventBrite Info', `${EVENTBRITE_API_KEY}`)
      .end((err, eventBriteURL) => {
        const eventBriteInfo = getEvents(eventBriteURL.body.events);
        response.send(eventBriteInfo);
      });
  } catch (error) {
    errHandler(error, 'events');
  }
}

function makeWeather(weatherText) {
  return weatherText.daily.data.map(day => new Weather(day));
}

function getEvents(eventMap) {
  let eventInput = eventMap.map(event => new Event(event));
  return eventInput.splice(0, 20);
}

function errHandler(response, request) {
  response.status(500).send({ status: 500, responseText: `Error on ${request}` });
}
app.use('*', (request, response) => response.status(404).send('Location does not exist pal'));






// 'Use strict';
// //library that allows server setup
// const express = require('express');
// const cors = require('cors');

// const app = express(); //this initializes express server
// app.use(cors()); //tells browser that it is ok to communicate with the domain that the js isn’t running. This tells the browser that you want the client domain to be able to make server requests.

// require('dotenv').config(); //library that allows us to talk to .env file

// const PORT = process.env.PORT || 3000; //(env file: PORT=3000)

// app.get('/location', searchLatToLong);
// app.get('/weather', request, response);
// //  get info from json data
// // JSON data will be sent through constructor to create a lng lat format that is usable in order to create client side objects




// function searchLatToLong(request, response) {

//     try {
//         let searchQuery = request.query.data;

//         let url = `http://maps.googleapis.com/maps/api/geocode/json?address=${searchQuesr}&key=${process.env.GEOCODE_API_KEYS}`;

//         const geoDataResults = require('./data/geo.json');

//         const location = new Location(searchQuery, geoDataResults);
//         response.status(200).send(location);
//     } catch (err) {
//         console.error(err);
//     }
// }

// function Location(searchQuery, address, lat, long) {
//     let geoResults = geoDataResults.results[0];
//     this.search_query = searchQuery;
//     this.formatted_query = geoResults.formatted_address;
//     this.latitude = geoResults.geometry.location.lat;
//     this.longitude = geoResults.geometry.location.lng;
// }

// app.get('/weather', (request, response);

//         function getWeather(request, response) {
//             let locationDataObj = request.query.data;

//             let latitude = locationDataObj.latitude;
//             let longitude = locationDataObj.longitude;

//             let URL = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${latitude},${longitude}`;

//             superagent.get(URL);
//             .then(data => {
//                     let darkSkyDataArray = data.body.daily.data;
//                     const dailyWather = darkSkyDataArray.map(day => {
//                         return new Weather(day);
//                     })
//                     response.send(dailyWeather);
//                 })
//                 .catch(error => console.log(error));
//             let searchQuery = request.query.data;
//             let darkSkyData = require('./data/darksky.json');

//             let darkSkyDataArray = darkSkyData.daily.data;
//         }

//         function Weather(darkSkyData) {
//             this.time = new Date(darkSkyData.time).toDateString();
//             this.forecast = darkSkyData.summary;
//         }




//         app.listen(PORT, () => console.log(`listening on ${PORT}`)); //this starts our express server
