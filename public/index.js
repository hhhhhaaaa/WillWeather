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

citySearchInput.on("click", event =>{
    event.preventDefault();
});

searchButton.on("click", event =>{
    event.preventDefault();
    var citySearchData = $(".search-box").val();
    var citySearchDataCopy = $(".search-box").val();
    mapGet(citySearchData, citySearchDataCopy);
});

// (`${city} (${moment().format('L')})`
{/* <input type="text" class="mapboxgl-ctrl-geocoder--input" placeholder="Search" aria-label="Search"></input> */}

function mapGet(cityTitle, cityTitleCopy) {
    console.log(cityTitle);
    console.log(cityTitleCopy);
    $.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${cityTitle}.json?access_token=${cityKey}`,
    data =>{
        console.log("cityTitle");
        console.log(data);
        var mapSearch = $(".mapboxgl-ctrl-geocoder--input");
        var cityLon = data.features[0].center[0];
        var cityLat = data.features[0].center[1];

        console.log(cityTitleCopy);
        
        mapSearch.val(cityTitleCopy);
        mapSearch.submit();
        cityName.text(cityTitleCopy);
        dateTime.text(`(${moment().format("L")})`);
        
        weatherGet(cityLat, cityLon);
    });
}
mapGet(cityName, cityNameCopy);

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

function weatherGet(latitude, longitude) {
    $.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${weatherKey}&units=imperial`,
    data =>{
        console.log("Weather");
        console.log(data);

        currentTemp.text(data.current.temp + "°F");
        currentWeather.text(data.current.weather[0].main);
        currentHiLow.text(data.daily[0].temp.max + "°F/" + data.daily[0].temp.min + "°F");
    });
}