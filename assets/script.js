var apiKey = "c73e44345361466a1fad4f31ca1be2a6";
var weatherApiUrl = 'https://api.openweathermap.org';
var savedSearches = [];


// element references 
var searchHistoryEl = document.querySelector("#history");
var forecastEl = document.querySelector("#forecast");
var todayWeather = document.querySelector("#today");
var searchInput = document.querySelector("#search-value");
var searchFrom = document.querySelector("#search-form");

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

// history list
function searchHistorySection() {
    searchHistoryEl.innerHTML = '';

    for (var i = savedSearches.length -1; i >= 0; i--) {
        var button = document.createElement("button");
        button.setAttribute('type', 'button');
        button.setAttribute('aria-controls', 'today forecast');
        button.classList.add( 'button-history');

        button.setAttribute('data-search', savedSearches[i]);
        button.textContent =savedSearches[i];
        searchHistoryEl.append(button);
    }
};

function appendHistory(search) {
    if (savedSearches.indexOf(search) !== -1) {
        return;
      }
      savedSearches.push(search);

    localStorage.setItem('search-histroy', JSON.stringify(savedSearches));
    searchHistorySection();
};

function startSearchHistory() {
    var storedHistory = localStorage.getItem('search-history');
    if (storedHistory) {
        savedSearches =JSON.parse(storedHistory);
    }
    searchHistorySection();
};

function displayCurrentWeather(city, weather) {
    var date = dayjs().format('M/D/YYYY');
    var temp = weather.main.temp;
    var wind = weather.wind.speed;
    var humidity = weather.main.humidity;
    var icon = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
    var abtIcon = weather.weather[0].description || weather[0].main;

    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var heading = document.createElement('h2');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    card.setAttribute('class', 'card');
    cardBody.setAttribute('class', 'card-body');
    card.append(cardBody);

    heading.setAttribute('class', 'h3 card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    heading.textContent = `${city} (${date})`;
    weatherIcon.setAttribute('src', icon);
    weatherIcon.setAttribute('alt', abtIcon);
    weatherIcon.setAttribute('class', 'weather-img');
    heading.append(weatherIcon);
    tempEl.textContent = `Temp: ${temp}°F`;
    windEl.textContent = `Wind: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;
    cardBody.append(heading, tempEl, windEl, humidityEl);

    todayWeather.innerHTML = '';
    todayWeather.append(card);
};

function forecastCard(forecast) {
    var icon = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var abtIcon = forecast.weather[0].description;
    var temp = forecast.main.temp;
    var humidity = forecast.main.humidity;
    var wind = forecast.wind.speed;

    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');

    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    weatherIcon.setAttribute('src', icon);
    weatherIcon.setAttribute('alt', abtIcon);
    tempEl.textContent = `Temp: ${temp} °F`;
    windEl.textContent = `Wind: ${wind} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;

    forecastEl.append(col);
};

function displayForecast(dailyForecast) {
    var startDate = dayjs().add(1, 'day').startOf('day').unix();
    var endDate = dayjs().add(6, 'day').startOf('day').unix();
    
    var headingCol = document.createElement('div');
    var heading = document.createElement('h4');

    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast:';
    headingCol.append(heading);

    forecastEl.innerHTML = '';
    forecastEl.append(headingCol);

    for (var i = 0; i < dailyForecast.length; i++) {
        if (dailyForecast[i].dt >= startDate && dailyForecast[i].dt < endDate) {

            if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
                forecastCard(dailyForecast[i]);
         }
     }
  }
};

function items(city, data) {
    displayCurrentWeather(city, data.list[0], data.city.timezone);
    displayForecast(data.list);
}

function fetchWeather(location) {
    var { lat } = location;
    var { lon } = location;
    var city = location.name;
    
    var api = `${weatherApiUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

    fetch(api)
    .then(function (res) {
        return res.json();
    })
    .then(function (data) {
        items(city, data);
    })
    .catch(function (err) {
        console.error(err);
    })

};

function coords(search) {
    var api = `${weatherApiUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
  
    fetch(api)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        if (!data[0]) {
          alert('Location not found');
        } else {
          appendHistory(search);
          fetchWeather(data[0]);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
};

function submitSearch(r) {
    if (!searchInput.value) {
        return;
      }
    
      r.preventDefault();
      var search = searchInput.value.trim();
      coords(search);
      searchInput.value = '';
};

function historyClick(r) {
    if (!r.target.matches('.button-history')) {
        return;
      }
    
      var button = r.target;
      var search = button.getAttribute('data-search');
      coords(search); 
}

startSearchHistory();
searchFrom.addEventListener('submit', submitSearch);
searchHistoryEl.addEventListener('click', historyClick);
