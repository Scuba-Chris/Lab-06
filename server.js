'Use strict';

const express = require('express'); //library that allows server setup
const cors = require('cors');

const app = express(); //this initializes express server
app.use(cors()) //tells browser that it is ok to communicate with the domain that the js isn’t running. This tells the browser that you want the client domain to be able to make server requests.

require('dotenv').config(); //library that allows us to talk to .env file

const PORT = process.env.PORT || 3000 //(env file: PORT=3000)

app.listen(PORT, () => console.log(`listening on ${PORT}`)); //this starts our express server

// {
//   "search_query": "seattle",
//   "formatted_query": "Seattle, WA, USA",
//   "latitude": "47.606210",
//   "longitude": "-122.332071"
// }

app.get('/locations', request, response => {
  //  get info from json data
  // JSON data will be sent through constructor to create a lng lat format that is usable in order to create client side objects
  try {
    let searchQuery = request.query.data;
    const geoDataResults = require('./data/geo.json');

    const locations = new Location(searchQuery, geoDataResults);

    response.status(200).send(locations);
  } catch (err) {
    console.error(err);
  }

  response.status(200).sent(results);
})

function Location(searchQuery, geoDataResults) {
  this.searchQuery = searchQuery;
  this.formatted_query = geoDataResults.results[0].formatted_address;
  this.latitude = geoDataResults.results[0].geometry.location.lat;
  this.longitude = geoDataResults.results[0].geometry.location.lng;
}
