# ISTE-422 - Address API

## Set Up Your Local Dev Environment and Run

1. Install NVM and Node v20.13.1
2. From the root directory, run `npm install`
3. Create a .env file
4. In the .env file set `SERVER_PORT` to a port of your choosing
5. In the .env file set `ENV` to "dev"
6. Start the app using `npm run dev`

## Use

- Using Postman or building an integration, send a request using "http://localhost:<port>/address/<endpoint>"
- To send a request, send a POST request with a raw JSON object
- This JSON object should have some of the parameters listed below to find addresses matching them
- There is a limit of 1000 addresses that can be shown at once

### Parameters
- state: takes a string of a US state in abbreviated form, such as "NY" for New York
- zipcode: takes an integer of a zipcode
- number: takes an integer of an address number
- street: takes a string of a street name. Most street names have abbreviated parts, such as "RD" for "Road" or "E" for "East" 
- city: takes a string of a city name
- page: takes an integer that will be used as the page number for larger data sets. For example, because of the 1000 address limit, page 2 will have results 1001 - 2000

## Endpoints

### Request
- Uses the `request` endpoint
- Returns all information about every address that matches the search conditions.

### Count
- Uses the `count` endpoint
- Returns the number of addresses that match the search conditions
- For large data sets of addresses, the maximum count will be 1000, but the "page" parameter can be used to count more addresses

### Distance
- Uses the `distance` endpoint
- Requires the request to return at least two addresses
- Returns the distance between the first two addresses from the request in kilometers and miles
- Use the "unit" parameter to specify "kilometers" or "miles", or don't use it for both

### Get city
- Uses the `getcity` endpoint
- Requires a zipcode parameter with no other parameters
- Returns the city that the requested zipcode is associated with

### Numbers
- Uses the `numbers` endpoint
- Requires a state, city or zipcode, and street
- Requires the request to return at least one address
- Returns the lowest and highest address numbers on the requested street
- The program isn't perfect, for streets that span multiple cities or zipcodes the program cannot identify the absolute lowest and highest numbers with one request
