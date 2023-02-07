
// Variable to Store API key var APIkey = "0958d36ff11a9413adb830587416df45";

// Declare DOM elements
var cityInput = document.querySelector("#search-input");

var currDate = moment().format('MMMM Do YYYY, h:mm:ss a');

var currCity = document.querySelector("#current-city");
var searchbtn = document.querySelector("#search-btn");

let cityStorage = [];

// Handling User Search Displays City and Forecast

function displayContents(event) {
  event.preventDefault();

  var city = cityInput.value.trim("");
  currentWeather(city); 
  if (!cityStorage.includes(city)) {
    var prevSearchBTN = $(`<button>${city}</button>`);
    $("#list-history").append(prevSearchBTN);
  };

  console.log(cityStorage); 
  localStorage.setItem("city", JSON.stringify(cityStorage));
  
  


  cityInput.value = "";

};


$(document).ready(function(){
  var historyArray = JSON.parse(localStorage.getItem("city"));

    if(historyArray !== null) {
      var prevSearchHist = historyArray.length -1;
      var prevSearch = historyArray[prevSearchHist];
      currentWeather(prevSearch);
      console.log(`Last City you searched: ${prevSearch}`);
    }

});

// Call Open Weather API for Current Weather Conditions

function currentWeather (city) {
  // API call to locate City 
  var queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=694a8523ec59db50414d0e3395f9e898`;

  fetch(queryURL)
    .then(function (response) {
      return response.json();  
    })
    .then(function (data) {
      console.log(data);

      $("#weatherBox").css("display","block");
      $("#current-city").empty();

      // Create Icon to Display Weather Status
      var iconcode = data.weather[0].icon;
      var iconURL = "http://openweathermap.org/img/w/" + iconcode + ".png";

      // Displays current weather conditions for City
      var displayCity = $(`<h3> ${data.name} ${currDate} <img src="${iconURL}" alt="${data.weather[0].description}"/> </h3>`);
      
      $("#current-city").append(displayCity);
      
      // Displays Temp, Humidity, Wind Speed for City
      var displayConditions = $(`
        <li>Temperature: ${data.main.temp} °F</li>
        <li>Humidity: ${data.main.humidity} %</li>
        <li>Wind Speed: ${data.wind.speed} MPH</li>
      `);

      $("#current-conditions").append(displayConditions);

      fiveDayForecast(lat,lon);

    });
  }

// Function for Future Weather Conditions using lat and lon
function fiveDayForecast(lat,lon) {

  var lat = city.coord.lat;
  var lon = city.coord.lon;

  var fivedayURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly,alert&appid=fc963772d2de62fc879128da5a742e54`;

  fetch(fivedayURL)
  .then(function(response) {
    return response.json();
  })
  .then(function(data) {
    console.log(data);
    $("#futureWeather").empty();

    let futureCast = [];
    // Created divs to displays 5 Day Forecast 
    for (let i = 0; i < 5; i++) {
    
    var displayFiveDay = $(                             
      `<div class="card text-bg-light mb-3">
        <div class="card-header"> ${moment().add(i + 1, 'days').format('L')}</div>
          <ul id="current-conditions">
            <li><img src='http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png' alt='Current Weather Icon'></li>
            <li>Temp: ${data.daily[i].temp.temperature.unit}</li>
            <li>Humidity: ${data.daily[i].humidity.humidity.unit}</li>
            <li>Wind: ${data.daily[i].wind.speed.unit}</li>
          </ul>
       </div>`);

      $("#futureWeather").append(displayFiveDay);
    }

  })
}



//event lister for search button
searchbtn.addEventListener("click", displayContents);

//Handle History Search Button
$(document).on("click", ".list-group-item", function(){
  var listHistory = $(this).text();
  currentWeather(listHistory);
});
