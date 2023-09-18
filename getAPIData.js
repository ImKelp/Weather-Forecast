function setCurrentWeather(data){
        // Creating a reference for each data point
        const city = data.name;
        const metric_temperature = data.main.temp;
        const description = data.weather[0].description;
        const tempHigh = data.main.temp_max;
        const tempLow = data.main.temp_min;
        const icon_img = data.weather[0].icon

        // Asigning each html element is a value extracted from the openweather api
        document.getElementById("cityName").innerHTML = city;
        document.getElementById("currentTemperature").innerHTML = roundUpFromString(metric_temperature)+"˚C";
        document.getElementById("description").innerHTML = capitalise_description(description);
        document.getElementById("tempHighandLow").innerHTML = "High: "+roundUpFromString(tempHigh)+"˚" + "&emsp;" + "Low: "+roundUpFromString(tempLow)+"˚";
        document.getElementById("icon").src = `https://openweathermap.org/img/wn/${icon_img}@4x.png`

}

function get_user_city_input() {
    let x = document.getElementById("chosenCity").value;
    // fetch() method starts the process of fetching a response  from a server
    fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${x}&appid={}`)
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Network Response Error")
        }
    }) .then(data => {
        setCurrentWeather(data);
        console.log(x);
    })  .catch((error) => console.error("Fetch Error:", error));  
}
function capitalise_description(sentence) {
    let arr = sentence.split(" ")
    let completed_sentence = []
    for (x of arr) {
        let a = x.charAt(0).toUpperCase() + x.slice(1)
        completed_sentence.push(a)
    }
    return completed_sentence.join(" ")
}

function roundUpFromString(input) {
    return String(Math.round(Number(input)))
}

function forecastAPI() {
    let x = document.getElementById("chosenCity").value;
    // fetch() method starts the process of fetching a response  from a server
    fetch(`https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${x}&appid={}`)
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Network Response Error")
        }
    }) .then(data => {
        setForecastWeather(data);
    })  .catch((error) => console.error("Fetch Error:", error));  
}

function setForecastWeather(data) {
    let list_arr_num = 0
    for (let i = 1; i < 22; i++) {
      // looping through i from 1 to 21, only accepting i if it is divisable by 3, this is to factor in the elements whose names end in with a number factorable by 3
      // I realised after the fact I shouldve changed the element names, wouldve saved me time. You live you learn. *shrugs*
        if (i % 3 == 0 ) {
            if (list_arr_num !== 21) {
                let date_forecast = convertDatetoDay(data.list[list_arr_num].dt_txt, data.city.timezone);
                let icon_forecast = data.list[list_arr_num].weather[0].icon;
                let temp_forecast = data.list[list_arr_num].main.temp;
                let description_forecast = capitalise_description(data.list[list_arr_num].weather[0].description);

                document.getElementById(`date-forecast-${i}`).innerHTML = date_forecast;
                document.getElementById(`icon-forecast-${i}`).src = `https://openweathermap.org/img/wn/${icon_forecast}@4x.png`
                document.getElementById(`temp-forecast-${i}`).innerHTML = roundUpFromString(temp_forecast)+"˚C"
                document.getElementById(`description-forecast-${i}`).innerHTML = description_forecast;
                
                if (description_forecast.includes("Thunderstorm") || description_forecast.includes("Rain") || description_forecast.includes("Drizzle")) {
                    document.getElementById(`plus${i}`).style.backgroundImage = "linear-gradient(mediumblue, mediumblue, black, black)";
                } else if (description_forecast.includes("Snow") || description_forecast.includes("Atmosphere")) {
                    document.getElementById(`plus${i}`).style.backgroundImage = "linear-gradient(OldLace, OldLace, black, black)";
                    document.getElementById(`date-forecast-${i}`).style.color = "black";
                } else if (description_forecast.includes("Clouds")) {
                    document.getElementById(`plus${i}`).style.backgroundImage = "linear-gradient(gray, gray, black, black)";
                } else if (description_forecast.includes("Clear") ) {
                    document.getElementById(`plus${i}`).style.backgroundImage = "linear-gradient(OrangeRed, OrangeRed, black, black)";
                }

            }
                list_arr_num += 1;
                
        }
    }
}

// Converts the raw date time into a day followed by the time in 24 hour format
function convertDatetoDay(apiDateTime, timeDifference) {
    // Addjusting location time by factoring timezone into dt_txt data point
    let hours_to_add = Number(timeDifference) / 3600;
    var datetime = new Date(apiDateTime);
    datetime.setHours(datetime.getHours()+hours_to_add); 
    let final = String(datetime).split(" ");
    return final[0] + " - " + final[4].slice(0, 5);
}
