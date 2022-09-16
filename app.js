//jshint esversion:6
const express = require("express");
const https = require("https"); //the structure that allows us to get what we want from the data we have. you don't need to download this module to a native structure.Its'a native module.
const bodyParser = require("body-parser");
//require('dotenv').config(); //for security (api keys)

const app = express();

//for encoding data
app.use(bodyParser.urlencoded({extended:true})); // for using body-parser
app.use(express.static(__dirname + '/public')); //for css files

app.set('view engine', 'ejs');

app.get("/",function(req,res){ //bilgi talebi
  res.sendFile(__dirname + "/index.html");
});

app.post("/",function(req,res){
  let query = req.body.cityName;
  let apiKey ="bc9998c3e820dd0008a2d5bcdd20c003";
  let unit = "metric";
  let lang = "en";
  let url = "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&units=" + unit + "&lang=" + lang + "&appid=" + apiKey;

  https.get(url,function(response){
    console.log(response.statusCode); //control 200 OK
    response.on("data",function(data){
      //console.log("Data:" + data);  //this gives us buffer(hexadecimal codes). instead, you have to rotate it in JSON format, and if you print it like this, it comes in HEXADECIMAL.
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const feel = weatherData.main.feels_like;
      const desc = weatherData.weather[0].description; //weather is an array
      const icon = weatherData.weather[0].icon;
      const imageURL = "http://openweathermap.org/img/wn/" + icon + "@4x.png";
      //res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
      query = query.toUpperCase();

      res.render('weather',{city : query,temperature : temp,explain : desc,image : imageURL});

      res.end();
    });
  });
});



app.listen(5000,function() {
  console.log("Server is running on port 5000.");
});
