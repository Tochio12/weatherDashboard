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

