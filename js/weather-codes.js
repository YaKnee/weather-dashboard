const weatherCodes = {
    "00" : { type: "clear", description: "Clear Sky"},
    "01" : { type: "clear", description: "Mainly Clear"},
    "02" : { type: "cloud", description: "Partly Cloudy"},
    "03" : { type: "cloud", description: "Overcast" },
    "04" : { type: "mist", description: "Airborn Smoke" },
    "05" : { type: "mist", description: "Haze" },
    "06-09" :{ type: "dust", description: "Dusty"},
    "10-12": { type: "mist", description: "Misty Patches" },
    "13" : { type: "lightning", description: "Lightning" },
    "14-16" : { type: "light-rain", description: "Approaching Rain" },
    "17" : { type: "thunder", description: "Thunderstorm" },
    "18-19" : { type: "wind", description: "High Winds" },
    "20-21": { type: "light-rain", description: "Drizzling Rain" },
    "22-23": { type: "snow", description: "Snow" },
    "24": { type: "freeze-rain", description: "Freezing Drizzle" },
    "25": { type: "rain", description: "Rain Showers" },
    "26-27": { type: "snow", description: "Snow Showers" },
    "28": { type: "mist", description: "Fog" },
    "29": { type: "thunder", description: "Thunderstorm" },
    "30-32": { type: "dust", description: "Slight Duststorm" },
    "33-35": { type: "dust", description: "Severe Duststorm" },
    "36" : { type: "light-snow", description: "Slight Drifting Snow" },
    "37" : { type: "snow", description: "Heavy Drifting Snow" },
    "38" : { type: "light-snow", description: "Slight Blowing Snow" },
    "39" : { type: "snow", description: "Heavy Blowing Snow" },
    "40-49": { type: "mist", description: "Fog: Reduced Visibilty" },
    "50-51": { type: "light-rain", description: "Light Drizzle" },
    "52-54": { type: "light-rain", description: "Drizzling Rain" },
    "55": { type: "rain", description: "Heavy Drizzle" },
    "56-57": { type: "freeze-rain", description: "Drizzling Freezing Rain" },
    "58-59": { type: "light-rain", description: "Drizzling Rain" },
    "60-61": { type: "light-rain", description: "Light Rain" },
    "62-64": { type: "light-rain", description: "Raining" },
    "65": { type: "rain", description: "Heavy Rain" }, 
    "66": { type: "freeze-rain", description: "Light Freezing Rain" },
    "67-69": { type: "h-freeze-rain", description: "Freezing Rain" },
    "70-71": { type: "light-snow", description: "Slight Snowfall" },
    "72-73": { type: "snow", description: "Moderate Snowfall" },
    "74-75": { type: "snow", description: "Heavy Snowfall" },
    "76-79": { type: "light-snow", description: "Light Snow" },
    "80": { type: "light-rain", description: "Light Rain Showers" },
    "81": { type: "rain", description: "Rain Showers" },
    "82": { type: "rain", description: "Heavy Rain Showers" },
    "83-84": { type: "h-freeze-rain", description: "Freezing Rain Showers" },
    "85": { type: "light-snow", description: "Snow Showers" },
    "86": { type: "snow", description: "Heavy Snow Showers" },
    "87-90": { type: "light-snow", description: "Showers of Hail" },
    "91": { type: "light-rain", description: "Slight Rain" },
    "92": { type: "rain", description: "Heavy Rain" },
    "93": { type: "light-snow", description: "Slight Snow" },
    "94": { type: "snow", description: "Heavy Snow" },
    "95": { type: "thunder", description: "Thunderstorm" },
    "96-99": { type: "thunder-snow", description: "Thunderstorms with Hail" }
  }
  
  const weatherFromWMOCode = (wmoCode) => {
    for (let key in weatherCodes) {
        if (key.includes("-")) { //if range
            let [start, end] = key.split("-").map(Number);
            if (wmoCode >= start && wmoCode <= end) {
                return weatherCodes[key];
            }
        } else { //if single
            if (wmoCode === parseInt(key)) {
                return weatherCodes[key];
            }
        }
    }
    return { type: "unknown", description: "Unknown Weather" }; 
  }
  