let CITY = "Tampere";
const daysOfWeek = ["Sunday", "Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const weatherImages = document.getElementById("weather-image-container").querySelectorAll("img");

const displayBlock = (item) => {
  item.forEach((element) => {
    element.style.display = "block";
  });
};
const displayNone = (item) => {
  item.forEach((element) => {
    element.style.display = "none";
  });
};
const oneDecimal = (degree) => {
  return (Math.round(degree * 10) / 10).toFixed(1);
};

const getInputLocation = () => {
  try {
    const cityInput = document.getElementById("location-input");

    const fetchAndUpdate = () => {
      let initialCity = sessionStorage.getItem("currentCity");
      if (!initialCity) {
        initialCity = cityInput.value;
      } else {
        cityInput.value = initialCity;
      }
      fetchGeoLocation(initialCity);
    };
    const cityForm = document.getElementById("location-form");
    cityForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const city = cityInput.value;
      sessionStorage.setItem("currentCity", city);
      cityInput.value = "";
      resetPage();
      fetchAndUpdate();
    });
    // const citySubmit = document.getElementById("submit-button");
    // citySubmit.addEventListener("pointerdown", function (event) {
    //   event.preventDefault();
    //   city = cityInput.value;
    //   sessionStorage.setItem("currentCity", city);
    //   cityInput.value = "";
    //   resetPage();
    //   fetchAndUpdate();
    // });
    fetchAndUpdate();
  } catch (error) {
    console.log(error);
  }
};

const fetchGeoLocation = async (city) => {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
    );
    const data = await response.json();
    sessionStorage.setItem("latitude", data.results[0].latitude);
    sessionStorage.setItem("longitude", data.results[0].longitude);
    fetchWeatherData(data.results[0].country_code);
    //console.log(data);
  } catch (error) {
    console.log(error);
    displayNone(weatherImages);
    displayBlock(errorMessage);
  }
};

const errorMessage = document.querySelectorAll(".not-found");

const fetchWeatherData = async (countryCode) => {
  try {
    let lat = sessionStorage.getItem("latitude");
    let long = sessionStorage.getItem("longitude");
    //response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=61.49773&longitude=23.779099&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,showers,snowfall,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&wind_speed_unit=ms&timezone=auto`);
    let response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}9&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&wind_speed_unit=ms&timezone=auto`
    );
    const data = await response.json();
    console.log(data);
    const isDay = data.current.is_day;
    displayNone(errorMessage);
    populateCurrentWeatherDetails(data, countryCode, isDay);
    populateHourlyForecast(data);
    populateDailyForecast(data, isDay);
    createChart(data, isDay);

    //setTimeout(fetchWeatherData, 1000 * 60 * 60); //calls every hour
  } catch (error) {
    displayNone(weatherImages);
    displayBlock(errorMessage);
  }
};

const populateCurrentWeatherDetails = (data, countryCode, isDay) => {
  const now = data.current.time.split("T")[1];
  const sunrise = data.daily.sunrise[0].split("T")[1];
  const sunset = data.daily.sunset[0].split("T")[1];
  if (now < sunset && now > sunrise) {
    document.body.style.background =
      "linear-gradient(0deg, rgba(9,37,78,1) 28%, rgba(137,152,247,1) 94%)";
  } else {
    document.body.style.background =
      "linear-gradient(180deg, rgba(9,37,78,1) 28%, rgba(137,152,247,1) 83%)";
  }

  createCurrentMainItem(
    data.current.time,
    data.current.temperature_2m,
    data.current.apparent_temperature,
    data.daily.temperature_2m_max[0],
    data.daily.temperature_2m_min[0]
  );
  createCurrentLocationItem(
    data.current.weather_code,
    countryCode,
    isDay);
  createCurrentMiscItem(
    data.current.pressure_msl,
    data.current.relative_humidity_2m,
    data.daily.precipitation_probability_max[0],
    data.current.wind_speed_10m,
    data.current.wind_direction_10m,
    sunrise,
    sunset
  );
};

const createCurrentMainItem = (time_now,temp,feels_like,temp_max,temp_min) => {
  const [date, time] = time_now.split("T");
  const currentDate = new Date(date);
  const dayOfWeek = daysOfWeek[currentDate.getDay()];
  const dayOfMonth = currentDate.getDate();
  const month = months[currentDate.getMonth()];
  document.getElementById("day").innerText = dayOfWeek;
  document.getElementById("date").innerText = month + " " + dayOfMonth + ", " + time;
  document.getElementById("temp").innerText = oneDecimal(temp) + "°C";
  document.getElementById("feels-like").innerHTML ='<i class="bi bi-person-fill-exclamation"></i> ' + oneDecimal(feels_like) + "°C";
  document.getElementById("temp-max").innerHTML = '<i class="bi bi-thermometer-high"></i> ' + oneDecimal(temp_max) + "°C";
  document.getElementById("temp-min").innerHTML =
    '<i class="bi bi-thermometer"></i> ' + oneDecimal(temp_min) + "°C";
};

const createCurrentLocationItem = (weather, country, isDay) => {
  const countryImage = document.getElementById("country");
  countryImage.src = `https://flagcdn.com/${country.toLowerCase()}.svg`;
  countryImage.style.width = "30px";
  countryImage.style.height = "15px";
  countryImage.alt = `${country} Flag`;
  const cloud = document.getElementById("cloud");
  const wind = document.getElementById("windy");
  const windyCloud = document.getElementById("windy-cloud");
  const dcloud = document.querySelectorAll(".dcloud");
  const lightning = document.getElementById("lightning");
  const thunder = document.getElementById("thunder");
  const mist = document.querySelectorAll(".mist");
  const rain = document.querySelectorAll(".rain");
  const snow = document.querySelectorAll(".snow");
  const dust = document.querySelectorAll(".dust");
  displayNone(weatherImages);
  const weatherType = weatherFromWMOCode(weather);
  const timeOfDay = isDay === 1 ? "sun" : "moon";
  switch (weatherType.type) {
    case "clear":
      document.getElementById(`${timeOfDay}-clear`).style.display = "block";
      break;
    case "rain":
      document.getElementById(timeOfDay).style.display = "block";
      cloud.style.display = "block";
      displayBlock(rain);
      break;
    case "light-rain":
      document.getElementById(timeOfDay).style.display = "block";
      cloud.style.display = "block";
      rain[1].style.display = "block";
      break;
    case "freeze-rain":
      document.getElementById(timeOfDay).style.display = "block";
      cloud.style.display = "block";
      rain[1].style.display = "block";
      snow[0].style.display = "block";
      break;
    case "h-freeze-rain":
      // /document.getElementById(timeOfDay).style.display = "block";
      cloud.style.display = "block";
      dcloud[0].style.display = "block";
      dcloud[0].style.zIndex = "3";
      displayBlock(rain);
      displayBlock(snow);
      break;
    case "light-snow":
      document.getElementById(timeOfDay).style.display = "block";
      cloud.style.display = "block";
      snow[0].style.display = "block";
      break;
    case "snow":
      //document.getElementById(timeOfDay).style.display = "block";
      cloud.style.display = "block";
      dcloud[0].style.display = "block";
      dcloud[0].style.zIndex = "3";
      displayBlock(snow);
      break;
    case "mist":
      document.getElementById(`${timeOfDay}-clear`).style.display = "block";
      displayBlock(mist);
      mist[0].style.zIndex = "3";
      mist[1].style.zIndex = "3";
      break;
    case "lightning":
      dcloud.forEach((img) => {
        img.style.display = "block";
        img.style.zIndex = "3";
      });
      cloud.style.display = "block";
      lightning.style.display = "block";
      break;
    case "dust":
      document.getElementById(`${timeOfDay}-clear`).style.display = "block";
      displayBlock(dust);
      dust[0].style.zIndex = "3";
      dust[1].style.zIndex = "3";
      break;
    case "wind":
      document.getElementById(timeOfDay).style.display = "block";
      windyCloud.style.display = "block";
      windyCloud.style.zIndex = "3";
      wind.style.display = "block";
      break;
    case "thunder":
      document.getElementById(timeOfDay).style.display = "block";
      displayBlock(dcloud);
      dcloud[0].style.zIndex = "3";
      dcloud[1].style.zIndex = "1";
      cloud.style.display = "block";
      thunder.style.display = "block";
      thunder.style.zIndex = "2";
      break;
    case "thunder-snow":
      displayBlock(dcloud);
      dcloud[0].style.zIndex = "3";
      dcloud[1].style.zIndex = "1";
      snow[1].style.display = "block";
      cloud.style.display = "block";
      thunder.style.display = "block";
      thunder.style.zIndex = "2";
      break;
    default:
      document.getElementById(timeOfDay).style.display = "block";
      cloud.style.display = "block";
  }
  document.getElementById("weather-desc").innerText = weatherType.description;
  document.getElementById("weather-desc").style.zIndex = "99";
};

const degreesToCompass = (degrees) => {
    const compassPoints = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"];
    const index = Math.round(degrees / 22.5);
    return compassPoints[index];
}
const createCurrentMiscItem = (pressure,humidity,precipitation,windSpeed,windDir,sunrise, sunset) => {
  document.getElementById("h-name").innerHTML = "<strong>Humidity:</strong>";
  document.getElementById("humidity").innerText = humidity + "%";
  document.getElementById("p-name").innerHTML = "<strong>Pressure:</strong>";
  document.getElementById("pressure").innerText = pressure + "hPa";
  document.getElementById("prec-name").innerHTML = "<strong>Precipitation:</strong>";
  document.getElementById("prec-prob").innerText = precipitation + "%";
  document.getElementById("w-name").innerHTML = "<strong>Wind: </strong>[" + degreesToCompass(windDir)+ "]";
  document.getElementById("wind-speed").innerText = windSpeed + "m/s";
  document.getElementById("sr-name").innerHTML = "<strong>Sunrise:</strong>";
  document.getElementById("sunrise").innerText = sunrise;
  document.getElementById("ss-name").innerHTML = "<strong>Sunset:</strong>";
  document.getElementById("sunset").innerText = sunset;
};


const setWeatherImage = (weatherType, isDay) => {
  const weatherImage = document.createElement("img");
  const timeOfDay = isDay === 1 ? "sun" : "moon";
  switch (weatherType.type) {
    case "clear":
      weatherImage.src = `./images/forecast-${timeOfDay}.png`;
      break;
    case "rain":
      weatherImage.src = `./images/forecast-${timeOfDay}-rain.png`;
      break;
    case "light-rain":
      weatherImage.src = `./images/forecast-${timeOfDay}-rain-light.png`;
      break;
    case "freeze-rain":
      weatherImage.src = `./images/forecast-${timeOfDay}-rain-freeze-light.png`;
      break;
    case "h-freeze-rain":
      weatherImage.src = `./images/forecast-${timeOfDay}-rain-freeze.png`;
      break;
    case "snow":
      weatherImage.src = "./images/forecast-snow.png";
      break;
    case "light-snow":
      weatherImage.src = "./images/forecast-snow-light.png";
      break;
    case "mist":
      weatherImage.src = `./images/forecast-${timeOfDay}-mist.png`;
      break;
    case "lightning":
      weatherImage.src = "./images/forecast-lightning.png";
      break;
    case "dust":
      weatherImage.src = `./images/forecast-${timeOfDay}-dust.png`;
      break;
    case "wind":
      weatherImage.src = `./images/forecast-${timeOfDay}-wind.png`;
      break;
    case "thunder":
      weatherImage.src = "./images/forecast-thunder.png";
      break;
    case "thunder-snow":
      weatherImage.src = "./images/forecast-thunder-snow.png";
      break;
    default:
      weatherImage.src = `./images/forecast-${timeOfDay}-cloud.png`;
  }

  return weatherImage;
};

const populateHourlyForecast = (data) => {
  const hourlyForecast = document.getElementById("hourly-forecast");

  const hourlyForecastText = document.createElement("p");
  hourlyForecastText.innerText = "Hourly Forecast";
  hourlyForecastText.className = "text-white text-start m-0";
  hourlyForecast.append(hourlyForecastText);

  const hourlyForecastContainer = document.createElement("div");
  hourlyForecastContainer.className = "d-inline-flex overflow-x-scroll justify-content-between pb-3";
  hourlyForecastContainer.style.width = "100%";

  let timeIndex = data.current.time.substring(11, 13);
  timeIndex = timeIndex[0] === "0" ? parseInt(timeIndex.substring(1)) : parseInt(timeIndex);

  for(let i = timeIndex; i < 24 + timeIndex; i++) {
    const hourlyContainer = document.createElement("div");
    hourlyContainer.style.height = "100px"
    hourlyContainer.className = "mx-1 px-2 rounded position-relative forecast-hour-container border border-light";

    const hourlyTime = document.createElement("p");
    hourlyTime.innerText = data.hourly.time[i].split("T")[1];
    hourlyTime.className = "m-0";
    hourlyContainer.append(hourlyTime);

    const sunrise = data.daily.sunrise[0].split("T")[1];
    const sunset = data.daily.sunset[0].split("T")[1];
    const timeNow = data.hourly.time[i].split("T")[1];
    const isDay = (timeNow <= sunset && timeNow >= sunrise) ? 1 : 0;

    const weatherType = weatherFromWMOCode(data.hourly.weather_code[i]);
    const weatherImage = setWeatherImage(weatherType, isDay);
    weatherImage.style.width = "50px";
    weatherImage.className ="position-absolute top-50 start-50 translate-middle";
    hourlyContainer.append(weatherImage);

    const weatherDescText = document.createElement("p");
    weatherDescText.innerText = data.hourly.temperature_2m[i] + "°C";
    weatherDescText.className = "fs-6 fw-bold m-0 position-absolute bottom-0 start-50 translate-middle-x"
    hourlyContainer.append(weatherDescText);

    hourlyForecastContainer.append(hourlyContainer);
  }
  hourlyForecast.append(hourlyForecastContainer);
}

const dailyForecast = document.getElementById("daily-forecast");
const populateDailyForecast = (data, isDay) => {
  const forecast = document.getElementById("forecast");

  const dailyForecastText = document.createElement("p");
  dailyForecastText.innerText = "Daily Forecast";
  dailyForecastText.className = "text-white text-start m-0";
  forecast.append(dailyForecastText);

  const dailyForecastContainer = document.createElement("div");
  dailyForecastContainer.className = "d-inline-flex justify-content-between pb-3 px-3";
  dailyForecastContainer.style.width = "100%";
  for (let i = 0; i < data.daily.time.length; i++) {
      const weatherForecast = document.createElement("div");
      weatherForecast.className = "forecast-container shadow border border-light rounded";
      const forecastDate = document.createElement("div");
      forecastDate.className = "forecast-date-container row m-0 text-center border-bottom border-light";
      forecastDate.style.width = "100%";
  
      const date = new Date(data.daily.time[i]);
      const dayName = document.createElement("p");
      dayName.className = "day col-lg-6 m-0 p-0 fw-bold text-uppercase";
      dayName.innerText = daysOfWeek[date.getDay()].replace(/day|nesday|urday/, "");
      forecastDate.append(dayName);
  
      const dateText = document.createElement("p");
      dateText.innerText = months[date.getMonth()] + " " + date.getDate();
      dateText.className = "date col-lg-6 m-0 p-0";
      forecastDate.append(dateText);
  
      weatherForecast.append(forecastDate);
  
      const forecastWeatherContainer = document.createElement("div");
      forecastWeatherContainer.className = "forecast-image-container position-relative";
  
      const weatherType = weatherFromWMOCode(data.daily.weather_code[i]);
      const weatherImage = setWeatherImage(weatherType, isDay);
      weatherImage.className = "forecast-image position-absolute top-0 start-50 translate-middle-x";
      //weatherImage.style.minWidth = "50px";
      forecastWeatherContainer.append(weatherImage);
  
  
      const weatherDesc = document.createElement("div");
      weatherDesc.className = "forecast-text-container position-absolute bottom-0 start-50 translate-middle-x";
      weatherDesc.style.width = "100%";
      const weatherDescText = document.createElement("p");
      weatherDescText.innerText = weatherType.description;
      weatherDesc.append(weatherDescText);
      forecastWeatherContainer.append(weatherDesc);
      weatherForecast.append(forecastWeatherContainer);
  
  
      const highLow = document.createElement("div");
      highLow.className = "high-low-container row border-top border-light pt-1 m-0";
      highLow.style.width = "100%";
  
      const highTemp = document.createElement("p");
      highTemp.className = "high-temp col-lg-6 p-0 m-0";
      highTemp.innerHTML =
        '<i class="bi bi-thermometer-high""></i><strong>' +
        oneDecimal(data.daily.temperature_2m_max[i]) + "°C</strong>";
      highLow.append(highTemp);
  
      const lowTemp = document.createElement("p");
      lowTemp.className = "low-temp col-lg-6 p-0 m-0";
      lowTemp.innerHTML =
        '<i class="bi bi-thermometer"></i><strong>' +
        oneDecimal(data.daily.temperature_2m_min[i]) + "°C</strong>";
      highLow.append(lowTemp);
  
      weatherForecast.append(highLow);
      dailyForecastContainer.append(weatherForecast);
      }
    forecast.append(dailyForecastContainer);
};

let myChart = null;
const createChart = (data, isDay) => {
  const times = data.hourly.time.map((time) => time.replace("T", " "));
  const minTemps = data.daily.temperature_2m_min;
  const maxTemps = data.daily.temperature_2m_max;
  const temps = data.hourly.temperature_2m;

  const duplicatedMinTemps = [];
  const duplicatedMaxTemps = [];
  for (let i = 0; i < temps.length; i++) {
      duplicatedMinTemps.push(minTemps[Math.floor(i / 24)]);
      duplicatedMaxTemps.push(maxTemps[Math.floor(i / 24)]);
  }
  let minColor = {};
  if(isDay === 1) {
    minColor = {bg: "rgb(33,166,255, 0.2)", main:"rgb(33,166,255)"};
  } else {
    minColor = {bg: "rgb(17,90,135, 0.2)", main:"rgb(17,90,135)"};
  }
  const chartCtx = document.getElementById("forecast-chart").getContext("2d");
  if (myChart !== null) {
    myChart.destroy();
  }
  myChart = new Chart(chartCtx, {
    type: "line",
    data: {
      labels: times,
      datasets: [
        {
          label: "Max Temperature (°C)",
          data: duplicatedMaxTemps,
          backgroundColor: "rgb(255,35,35,0.2)",
          borderColor: "rgb(255,35,35)",
          borderWidth: 2,
          pointStyle: false,
        },
        {
          label: "Hourly Temperature (°C)",
          data: temps,
          backgroundColor: "rgb(255,196,0, 0.2)",
          borderColor: "rgb(255,196,0)",
          borderWidth: 1,
        },
        {
          label: "Min Temperature (°C)",
          data: duplicatedMinTemps,
          backgroundColor: minColor.bg,
          borderColor: minColor.main,
          borderWidth: 2,
          pointStyle: false,
        },

      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks:{
            color: "white",
          }
        },
        x: {
          ticks: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "bottom",
          labels: {
            color: "white", 
            pointStyle: "circle",
            usePointStyle: true,
          }
        },
        title: {
          display: false,
          // text: "Temperature (°C)",
          // color: "white",
        },
      },
      interaction: {
        intersect: false,
        mode: "nearest",
        axis: "x",
      },
    },
  });
};

const resetPage = () => {
  console.log("Resetting");
  const paragraphs = document.getElementById("current-temp").querySelectorAll("p:not(.not-found)");
  paragraphs.forEach((paragraph) => {
    paragraph.innerHTML = "";
  });
  document.getElementById("forecast").innerHTML = "";
  document.getElementById("hourly-forecast").innerHTML = "";
};
