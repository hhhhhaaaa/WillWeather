// List of variables
var cityKey = "pk.eyJ1IjoiaGhoaGhhYWFhIiwiYSI6ImNrbHh5ejRoYzA0ODkydm1ydzQ0YWw3bzYifQ.VD05jB9VejzqA1MOQRGO9Q";
var weatherKey = "b51b641219666b974b540f2b14ac7871";
var cityName = "Detroit";
var cityNameCopy = "Detroit";
var citySearchInput = $(".search-box");
var searchButton = $(".search-btn");
var cityName = $(".city");
var dateTime = $(".date");
var currentTemp = $(".temp");
var currentWeather = $(".weather");
var currentHiLow = $(".hi-low");
var saveBtn = document.querySelectorAll('.save-btn');
var textArea = document.querySelectorAll('textarea');
// On click events for both searches, as well as local storage saving
citySearchInput.on("click", event => {
    event.preventDefault();
});
searchButton.on("click", event => {
    event.preventDefault();
    var citySearchData = $(".search-box").val();
    var citySearchDataCopy = $(".search-box").val();
    mapGet(citySearchData, citySearchDataCopy);
});
for (let x = 0; x < saveBtn.length; x++) {
    const buttonItem = saveBtn[x];
    const textItem = textArea[x];
    textItem.value = localStorage.getItem(`${x}`);
    buttonItem.addEventListener("click", (event) => {
        localStorage.setItem(x, textItem.value);
        console.log(localStorage.getItem(x));
    });
}
// When document is ready, get the current time and pass it, as well as load mapOnLoad function
$(document).ready(() => {
    for (let i = 1; i <= 12; i++) {
        var time = $(`#time${[i]}`);
        var current = moment().add(i, "H").format("LT");
        time.text(current);
    }
    mapOnLoad();
})
// A mapGet function specifically for setting up the map on start
function mapOnLoad() {
    console.log("test");
    mapboxgl.accessToken =
        cityKey;
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/hhhhhaaaa/cklzhu75c0wnd17s8b6jevws8',
        center: [-83.0567, 42.3487],
        zoom: 13
    });
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
    )
    // Mapbox API
    $.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${cityName}.json?access_token=${cityKey}`,
        data => {
            console.log(data);
            var cityLon = data.features[0].center[0];
            var cityLat = data.features[0].center[1];
            weatherGet(cityLat, cityLon);
            var mapSearch = $(".mapboxgl-ctrl-geocoder--input");
            mapSearch.val(cityNameCopy);
            mapSearch.submit();
            cityName.text(cityNameCopy);
            dateTime.text(`(${moment().format("L")})`);
        });
}
// mapGet function, which gets the current city and passes on the data...
function mapGet(cityTitle, cityTitleCopy) {
    // Mapbox API
    $.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${cityTitle}.json?access_token=${cityKey}`,
        data => {
            var cityLon = data.features[0].center[0];
            var cityLat = data.features[0].center[1];
            mapUpdate(cityLat, cityLon);
            weatherGet(cityLat, cityLon);
            var mapSearch = $(".mapboxgl-ctrl-geocoder--input");
            mapSearch.val(cityTitleCopy);
            mapSearch.submit();
            cityName.text(cityTitleCopy);
            dateTime.text(`(${moment().format("L")})`);
        });
}
// mapUpdate function, which takes the current city from mapGet and passes the info to the Map
function mapUpdate(latitude, longitude) {
    // Mapbox map setup
    mapboxgl.accessToken =
        cityKey;
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/hhhhhaaaa/cklzhu75c0wnd17s8b6jevws8',
        center: [longitude, latitude],
        zoom: 13
    });
    map.addControl(
        new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl
        })
    )
}
// weatherGet function, which takes the current city from the mapGet and passing on the known forecast for the city
function weatherGet(latitude, longitude) {
    // OpenWeatherMap one call forecast
    $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${weatherKey}&units=imperial`,
        data => {
            console.log("Weather");
            console.log(data);
            for (let i = 1; i <= 12; i++) {
                var time = $(`#time${[i]}`);
                var current = moment().add(i, "H").format("LT");
                time.text(current);
                var timeWeather = $(`#weather${[i]}`);
                timeWeather.text(`${data.hourly[i].temp}°F`);
            }
            currentTemp.text(data.current.temp + "°F");
            currentWeather.text(data.current.weather[0].main);
            currentHiLow.text(data.daily[0].temp.max + "°F/" + data.daily[0].temp.min + "°F");

            for (let x = 1; x <= 5; x++) {
                var temp = $(`.futureTemp${x}`);
                var date = $(`.futureDate${x}`);
                var UV = $(`.futureUV${x}`);
                var wind = $(`.futureWind${x}`);
                var futureDate = moment().add(x, "d").format("MMM Do YYYY");
                temp.text(`Temperature: ${data.daily[x-1].temp.day}°F`);
                date.text(`Date: ${futureDate}`);
                UV.text(`UV: ${data.daily[x-1].uvi}`);
                wind.text(`Wind: ${data.daily[x-1].wind_speed} MPH`);
            }
        });
}