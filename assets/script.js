var apiKey = "c73e44345361466a1fad4f31ca1be2a6";
var savedSearches = [];

// list of past searches
var searchHistoryList = function(cityName) {
    $(".past-seach:contains('" + cityName + "')").remove();

    // entry with city name
    var searchHistoryEntry = $("<p>");
    searchHistoryEntry.addClass("past-search");
    searchHistoryEntry.text(cityName);

    // container for entry
    var searchEntryContainer = $("<div>");
    searchEntryContainer.addClass("past-search-container");

    // append entry to container
    searchEntryContainer.append(searchHistoryEntry);

    var searchHistoryContainerEl = $("#search-history-container");
    searchHistoryContainerEl.append(searchEntryContainer);

    if (savedSearches.length > 0) {
        var previousSavedSearches = localStorage.getItem("savedSearches");
        savedSearches = JSON.parse(previousSavedSearches);
    }

    savedSearches.push(cityName);
    localStorage.setItem("savedSearches", JSON.stringify(savedSearches));

    $("#search-input").val("");

};

var loadSearchHistory = function() {
    // get saved search history 
    var savedSearchHistory = localStorage.getItem("savedSearches");

    if (!savedSearchHistory) {
        return false;
    }

    savedSearchHistory = JSON.parse(savedSearchHistory);

    for (var i = 0; i < savedSearchHistory.length; i++) {
        searchHistoryList(savedSearchHistory[i])
    }
};

var currentWeatherSection = function(cityName) {
    // get and use data from open weather current weather api end point
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`)
    // get response and turn it into objects
    .then(function(response) {
        return response.json();
    })
    .then(function(response) {
        // get city's longitude and latitude
        var cityLon = response.coord.lon;
        var cityLat = response.coord.lat;

        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
            // get response from one call api and turn it into objects
            .then(function(response) {
                return response.json();
            })
            // get data from response and apply them to the current weather section title 
            .then(function(response) {
                searchHistoryList(cityName);

                //add current weather container with border to page 
                var currentWeatherContainer = $("#current-weather-container");
                currentWeatherContainer.addClass("current-weather-container");


            })
    })
};

// called when the search form is submitted 
$("#search-form").on("submit", function() {
    event.preventDefault();

    // get name of city searched 
    var cityName = $("#search-input").val();

    if (cityName === "" || cityName === null) {
        // alert if search input is empty when submitted
        alert("Please enter N=name of city.");
        event.preventDefault();
    } else {
        currentWeatherSection(cityName);
    }
});
