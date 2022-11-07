function displayCity(response) {
  let citySearch = document.querySelector("#city");
  citySearch.innerHTML = response.data.name;
}

function displayDescription(response) {
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].main;
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
  //call to display date/time
  displayFeelsLike(response);
  displayHumidity(response);
  displayWind(response);
}

let cityName = "springfield";
let apiKey = "9c0a0dd5ce072e1ac8919092ab708dad";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;

axios.get(apiUrl).then(displayTemperature);
