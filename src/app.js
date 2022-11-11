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

function formatDateTime(timestamp) {
  let date = new Date(timestamp);
  let hour = date.getHours();
  let minutes = date.getMinutes();
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

  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  if (hour > 12) {
    hour = `0${hour}`;
  }

  return `${weekDays[day]} ${hour}:${minutes}`;
}

function displayDateTime(response) {
  let dateTime = document.querySelector("#date-time");
  dateTime.innerHTML = formatDateTime(response.data.dt * 1000);
}

function displayFeelsLike(response) {
  let precipiation = document.querySelector("#feels-like");
  precipiation.innerHTML = response.data.main.humidity;
}

function displayHumidity(response) {
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = response.data.main.feels_like;
}

function displayWind(response) {
  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
}

function displayTemperature(response) {
  let temperature = document.querySelector("#temperature");
  temperature.innerHTML = Math.round(response.data.main.temp);

  console.log(response.data);

  displayCity(response);
  displayDescription(response);
  displayIcon(response);
  displayDateTime(response);
  displayFeelsLike(response);
  displayHumidity(response);
  displayWind(response);
}

let cityName = "boston";
let apiKey = "9c0a0dd5ce072e1ac8919092ab708dad";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

axios.get(apiUrl).then(displayTemperature);
