function displayCity(response) {
  let citySearch = document.querySelector("#city");
  citySearch.innerHTML = response.data.name;
}

function displayDescription(response) {
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].main;
}

function displayIcon(response) {
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function formatTime(timestamp) {
  let time = new Date(timestamp * 1000);
  let hour = time.getHours();
  let minutes = time.getMinutes();

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hour < 12) {
    hour = `0${hour}`;
  }
  return ` ${hour}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return `${weekDays[day]}`;
}

function displayTime(response) {
  let timeDisplay = document.querySelector("#time");
  timeDisplay.innerHTML = formatTime(response.data.dt);
}

function displayDate(response) {
  let dateDisplay = document.querySelector("#date");
  dateDisplay.innerHTML = formatDay(response.data.dt);
}

function displayFeelsLike(response) {
  let precipiation = document.querySelector("#feels-like");
  precipiation.innerHTML = response.data.main.feels_like;
}

function displayHumidity(response) {
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.humidity;
}

function displayWind(response) {
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
}

function displayTemperature(response) {
  let temperature = document.querySelector("#temperature");
  farenheitTemperature = response.data.main.temp;
  temperature.innerHTML = Math.round(farenheitTemperature);

  displayCity(response);
  displayDescription(response);
  displayIcon(response);
  displayTime(response);
  displayDate(response);
  displayFeelsLike(response);
  displayHumidity(response);
  displayWind(response);
  //displayForecast();
  getForecast(response.data.coord);
  console.log(response.data);
}

function search(city) {
  let apiKey = "9c0a0dd5ce072e1ac8919092ab708dad";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function getLocalLocation(response) {
  let localCity = response.data[0].name;
  search(localCity);
}

function handleCurrentLocation(position) {
  let apiKey = "9c0a0dd5ce072e1ac8919092ab708dad";
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  let apiUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(getLocalLocation);
}

function convertToCelcuis(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  farenheitLink.classList.remove("active");
  celciusLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(
    (farenheitTemperature - 32) * (5 / 9)
  );
}

function convertToFarenheit(event) {
  event.preventDefault();
  let temperatureElement = document.querySelector("#temperature");
  celciusLink.classList.remove("active");
  farenheitLink.classList.add("active");
  temperatureElement.innerHTML = Math.round(farenheitTemperature);
}

function getForecast(coordinates) {
  let apiKey = "c1e688fc5830bt7b77cdeo0bcaa64da0";
  let latitude = coordinates.lat;
  let longitude = coordinates.lon;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${longitude}&lat=${latitude}&units=imperial&key=${apiKey}`;
  //response is a 7 day forecast object
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  let dailyForecast = response.data.daily;

  //inject html into js with forEach to repeat code
  let forecastHtml = `<div class="row">`;
  dailyForecast.forEach(function (forecastDay, index) {
    if (index <= 5) {
      forecastHtml += `
        <div class="col-2">
          <div class="weather-forecast-day">${formatDay(forecastDay.time)}</div>
          <img
            src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
              forecastDay.condition.icon
            }.png"
            alt=""
            width="50"
          />
          <div class="weather-forecast-temperature">
            <span class="max-temp"> ${Math.round(
              forecastDay.temperature.maximum
            )}°</span>
            <span class="min-temp"> ${Math.round(
              forecastDay.temperature.minimum
            )}°</span>
          </div>
        </div>
      `;
    }
  });

  forecastHtml = forecastHtml + `</div>`;
  forecastElement.innerHTML = forecastHtml;
  console.log(response.data.daily);
}

let farenheitTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", convertToCelcuis);

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", convertToFarenheit);

navigator.geolocation.getCurrentPosition(handleCurrentLocation);

search("Boston");
