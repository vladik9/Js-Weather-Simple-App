const express = require("express"); // use modele express server for nodeJS
const https = require("https"); // use https module for nodeJS
const app = express(); // app instance for current app
const bodyParser = require("body-parser"); //body parser to get info from HTML form
app.use(bodyParser.urlencoded({ extended: true })); // applay body parse for app

app.get("/", function (req, res) {
  // first  get request of  the browser to roote
  res.sendFile(__dirname + "/index.html"); // sendFile back the directory and the main file
});
app.get("/index", function (req, res) {
  // first  get request of  the browser to roote
  res.sendFile(__dirname + "/index.html"); // sendFile back the directory and the main file
});

app.post("/index", function (req, res) {
  // manage the get request from the form in html
  const user_city = req.body.City; //read via parse the name of city entred by user
  // the appi from free weather.com
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${user_city}&units=metric&appid=58f8a18f3a524bfe1aecc978a318d218`;
  https.get(url, function (apiResponse) {
    // use https get request to get data in a format like JSON ..
    apiResponse.on("data", function (data) {
      // manage response and extract comprimed data to JSON notation
      const JsonData = JSON.parse(data); // store  data to a variable (extracted)
      //if city not valid
      if (JsonData.cod == 404) {
        //print eror message
        res.send(
          "<h2 style='text-align: center'>City not found Error 404!</h2>"
        );
      }
      const temperature = JsonData.main.temp; //get the temperature from the JSON
      //cosntruct a string from whater and whater description
      const mainDescription =
        "In " +
        user_city +
        " is " +
        JsonData.weather[0].main +
        " " +
        "(" +
        JsonData.weather[0].description +
        "!)";
      // get the icon infromation
      const icon = JsonData.weather[0].icon;
      //incorporate icon in the image api
      const iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write(`<p>${mainDescription}</p>`); // write in buffer all information needed
      res.write(
        `<h1>The actual temperature in ${user_city} is ${temperature} C</h1>`
      );
      res.write(`<img src="${iconUrl}">`);
      res.send(); //send buffer to the client browser
    });
  });
});

app.listen(8080, function () {
  //open port 8080 for browser request
  console.log("my port is enabled at 8080");
});
