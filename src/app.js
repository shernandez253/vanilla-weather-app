function displayCity(response) {
  let citySearch = document.querySelector("#city");
  citySearch.innerHTML = response.data.city;
}

function displayDescription(response) {
  let description = document.querySelector("#description");
  description.innerHTML = response.data.condition.description;
}

function displayIcon(response) {
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);
}

function formatTime(timestamp) {
  let time = new Date(timestamp * 1000);
  let hour = time.getHours();
  let minutes = time.getMinutes();
  let clockDisplay = "";

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  //format military time to a 12-hour clock with am/pm indicators
  if (hour < 12) {
    clockDisplay = ` 0${hour}:${minutes}am`;
  }
  if (hour >= 13 && hour <= 21) {
    clockDisplay = ` 0${hour - 12}:${minutes}pm`;
  } else {
    clockDisplay = ` ${hour - 12}:${minutes}pm`;
  }

  return clockDisplay;
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
  timeDisplay.innerHTML = formatTime(response.data.time);
}

function displayDate(response) {
  let dateDisplay = document.querySelector("#date");
  dateDisplay.innerHTML = formatDay(response.data.time);
}

function displayFeelsLike(response) {
  let precipiation = document.querySelector("#feels-like");
  precipiation.innerHTML = Math.round(response.data.temperature.feels_like);
}

function displayHumidity(response) {
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = Math.round(response.data.temperature.humidity);
}

function displayWind(response) {
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
}

function displayTemperature(response) {
  let temperature = document.querySelector("#temperature");
  farenheitTemperature = response.data.temperature.current;
  temperature.innerHTML = Math.round(farenheitTemperature);

  displayCity(response);
  displayDescription(response);
  displayIcon(response);
  displayTime(response);
  displayDate(response);
  displayFeelsLike(response);
  displayHumidity(response);
  displayWind(response);
  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "c1e688fc5830bt7b77cdeo0bcaa64da0";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function getLocalLocation(response) {
  let localCity = response.data.city;
  search(localCity);
}

function handleCurrentLocation(position) {
  //changed api from openweather to shecodes
  let apiKey = "c1e688fc5830bt7b77cdeo0bcaa64da0";
  let lon = position.coords.longitude;
  let lat = position.coords.latitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?lat=${lat}&lon=${lon}&key=${apiKey}&units=imperial`;
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
  console.log(coordinates);
  let apiKey = "c1e688fc5830bt7b77cdeo0bcaa64da0";
  let latitude = coordinates.latitude;
  let longitude = coordinates.longitude;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${longitude}&lat=${latitude}&units=imperial&key=${apiKey}`;
  //response is a 7 day forecast object
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  console.log(response.data);
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
