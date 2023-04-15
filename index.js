require("dotenv").config();
const path = require("path");
const express = require("express");
const app = express();
const https = require("https");
const cors = require("cors");

//Static Folder
app.use(express.static(__dirname + "/public"));

//Body Parser
app.use(express.urlencoded({ extended: true }));

//EJS-View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Cross Origin Resource Sharing-CORS
app.use(cors());

////////////////////////////////////////////////////////////////// ROUTES

app.get("/", function (req, res) {
    res.render("index");
})

app.post("/", function (req, res) {
    const city = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const apiURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + apiKey ;

    https.get(apiURL, function (response) {
        console.log(response.statusCode);

        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const windSpeed = weatherData.wind.speed;
            const weatherDescription = weatherData.weather[0].description;
            const weatherIcon = weatherData.weather[0].icon;
            const weatherLookURL = "http://openweathermap.org/img/wn/" + weatherIcon + "@4x.png";

            res.render("anemometer", {
                weatherLookURL: weatherLookURL,
                city: city,
                temp: temp,
                weatherDescription: weatherDescription,
                windSpeed: windSpeed
            });

        });


    });
});

////////////////////////////////////////////////////////////////// PORT

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}


app.listen(port, function () {
    console.log("Server has started successfully.");
});

////////////////////////////////////////////////////////////////// Export Express App
module.exports = app;