//jshint esversion:6
const express = require("express");
const https = require("https"); //the structure that allows us to get what we want from the data we have. you don't need to download this module to a native structure.Its'a native module.
const bodyParser = require("body-parser");
require('dotenv').config(); //for security (api keys)

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
  const apiKey=process.env.WEATHER_API_KEY;
  // let apiKey ="";
  const unit = "metric";
  const lang = "en";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query +"&units=" + unit + "&lang=" + lang + "&appid=" + apiKey;

  https.get(url,function(response){
    console.log(response.statusCode);
    if(response.statusCode==200)
    {
      response.on("data",function(data){
        //console.log("Data:" + data);  //this gives us buffer(hexadecimal codes). instead, you have to rotate it in JSON format, and if you print it like this, it comes in HEXADECIMAL.
        const weatherData = JSON.parse(data);
        const temp1 = weatherData.main.temp;
        const feel = weatherData.main.feels_like;
        const desc = weatherData.weather[0].description; //weather is an array
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@4x.png";
        //res.write("<h1>The temperature in " + query + " is " + temp + " degrees Celcius.</h1>");
        query = query.toUpperCase();

        res.render('weather',{city : query,temperature : temp1,explain : desc,image : imageURL});

        res.end();
      });
    }
    else {
      {
        res.render('demo');
        res.end();
      }
    }

  });
});



app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
  console.log("Server is running on port.");
});
