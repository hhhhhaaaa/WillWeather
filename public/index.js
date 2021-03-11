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
var saveBtn = document.querySelectorAll('.save');
var textArea = document.querySelectorAll('textarea');
citySearchInput.on("click", event => {
    event.preventDefault();
});
searchButton.on("click", event => {
    event.preventDefault();
    var citySearchData = $(".search-box").val();
    var citySearchDataCopy = $(".search-box").val();
    mapGet(citySearchData, citySearchDataCopy);
});
// (`${city} (${moment().format('L')})`
{
    /* <input type="text" class="mapboxgl-ctrl-geocoder--input" placeholder="Search" aria-label="Search"></input> */
}
$(document).ready(() => {
    for (let i = 1; i <= 12; i++) {
        var time = $(`#time${[i]}`);
        var current = moment().add(i, "H").format("H");
        time.text(current);
    }
})
for (let x = 0; x < saveBtn.length; x++) {
    const buttonItem = saveBtn[x];
    const textItem = textArea[x];
    textItem.value = localStorage.getItem(`${x}`);
    console.log(localStorage.getItem(x));
    buttonItem.addEventListener("click", (event) => {
        localStorage.setItem(x, textItem.value);
        console.log(localStorage.getItem(x));
    });
}
// A for loop, looping through the buttons on the page, and giving each the save data-value feature
// As well as setting the current value of the textArea to it's current local-storage value
function mapGet(cityTitle, cityTitleCopy) {
    $.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${cityTitle}.json?access_token=${cityKey}`,
        data => {
            var mapSearch = $(".mapboxgl-ctrl-geocoder--input");
            var cityLon = data.features[0].center[0];
            var cityLat = data.features[0].center[1];
            mapSearch.val(cityTitleCopy);
            mapSearch.submit();
            cityName.text(cityTitleCopy);
            dateTime.text(`(${moment().format("L")})`);
            mapUpdate(cityLat, cityLon);
            weatherGet(cityLat, cityLon);
        });
}
mapGet(cityName, cityNameCopy);
function mapUpdate(latitude, longitude) {
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
function weatherGet(latitude, longitude) {
    $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${weatherKey}&units=imperial`,
        data => {
            console.log("Weather");
            console.log(data);
            console.log(data.hourly[1].temp);
            for (let i = 1; i <= 12; i++) {
                var time = $(`#time${[i]}`);
                var current = moment().add(i, "H").format("H");
                time.text(current);
                var timeWeather = $(`#weather${[i]}`);
                timeWeather.text(data.hourly[i].temp)
            }
            currentTemp.text(data.current.temp + "°F");
            currentWeather.text(data.current.weather[0].main);
            currentHiLow.text(data.daily[0].temp.max + "°F/" + data.daily[0].temp.min + "°F");
        });
}