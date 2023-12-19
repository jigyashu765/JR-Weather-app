const url = 'https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=';

let Column = document.getElementById('Column');

let searchBtn = document.getElementById('searchBtn');
let weatherHeading = document.getElementById('weatherHeading');
let historyTable = document.getElementById('historyTable');


weatherHeading.innerHTML = "Welcome To JR Weather..."

searchBtn.addEventListener('click', function (event) {
  event.preventDefault();
  getWeather();
});

async function getWeather() {
  let cityInp = document.getElementById('cityInp').value;

  cityInp = cityInp.charAt(0).toUpperCase() + cityInp.slice(1);

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '654dfcea36mshf28f6f35f28804ep15c6c5jsn5e5069d528fc',
      'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(`${url}${cityInp}`, options);

    if (response.ok) {
      const result = await response.json();
      weatherHeading.innerHTML = `Weather of ${cityInp}`;

      Cloud_pct = result.cloud_pct;
      Feels_like = result.feels_like;
      Humidity = result.humidity;
      Max_temp = result.max_temp;
      Min_temp = result.min_temp;
      Sunrise = result.sunrise;
      Sunset = result.sunset;
      Temp = result.temp;
      Wind_degrees = result.wind_degrees;
      Wind_speed = result.wind_speed;
      
      function convertTimestamp(timestamp) {
        const date = new Date(timestamp * 1000);
        const hours = ('0' + date.getHours()).slice(-2);
        const minutes = ('0' + date.getMinutes()).slice(-2);
        const seconds = ('0' + date.getSeconds()).slice(-2);
        return `${hours}:${minutes}:${seconds}`;
      }
      
      Sunrise = convertTimestamp(Sunrise);
      Sunset = convertTimestamp(Sunset);
      
      let weatherData = {
        Cloud_pct: Cloud_pct,
        Feels_like: Feels_like,
        Humidity: Humidity,
        Max_temp: Max_temp,
        Min_temp: Min_temp,
        Sunrise: Sunrise,
        Sunset: Sunset,
        Temp: Temp,
        Wind_degrees: Wind_degrees,
        Wind_speed: Wind_speed,
      };
      
      updateHistory(cityInp, weatherData);

      Column.innerHTML = `
            <div class="col">
          <div class="card mb-4 rounded-3 shadow-sm border-primary">
            <div class="card-header py-3 text-bg-primary border-primary">
              <h4 class="my-0 fw-normal">Temperature</h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">${Temp}<small class="text-body-secondary fw-light"> &#x2103; | &#x2109;</small></h1>
              <ul class="list-unstyled mt-3 mb-4 text-start">
                <li>Maximum Temperature :- ${Max_temp}&#x2103;</li>
                <li>Manimum Temperature :- ${Min_temp}&#x2103;</li>
                <li>Humidity :- ${Humidity}%</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card mb-4 rounded-3 shadow-sm border-primary">
            <div class="card-header py-3 text-bg-primary border-primary">
              <h4 class="my-0 fw-normal">Wind & Cloud</h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">${Wind_speed}<small class="text-body-secondary fw-light">Km/hr</small></h1>
              <ul class="list-unstyled mt-3 mb-4 text-start">
                <li>Wind degrees :- ${Wind_degrees}&#xb0;</li>
                <li>Cloud pct :- ${Cloud_pct}</li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col">
          <div class="card mb-4 rounded-3 shadow-sm border-primary">
            <div class="card-header py-3 text-bg-primary border-primary">
              <h4 class="my-0 fw-normal">Sun</h4>
            </div>
            <div class="card-body">
              <h1 class="card-title pricing-card-title">${Feels_like}<small class="text-body-secondary fw-light">Feels-like</small></h1>
              <ul class="list-unstyled mt-3 mb-4 text-start">
                <li>Sunrise at :- ${Sunrise}</li>
                <li>Sunset :- ${Sunset}</li>
              </ul>
            </div>
          </div>
        </div>
			`;

    } else {
      console.error('Error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
}

function updateHistory(city, weatherData) {
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

  const existingCityIndex = history.findIndex(item => item.city === city);

  if (existingCityIndex !== -1) {
    const duplicateDataIndex = history[existingCityIndex].data.findIndex(existingData => (
      existingData.Cloud_pct === weatherData.Cloud_pct &&
      existingData.Feels_like === weatherData.Feels_like &&
      existingData.Humidity === weatherData.Humidity &&
      existingData.Max_temp === weatherData.Max_temp &&
      existingData.Min_temp === weatherData.Min_temp &&
      existingData.Sunrise === weatherData.Sunrise &&
      existingData.Sunset === weatherData.Sunset &&
      existingData.Temp === weatherData.Temp &&
      existingData.Wind_degrees === weatherData.Wind_degrees &&
      existingData.Wind_speed === weatherData.Wind_speed
    ));

    if (duplicateDataIndex === -1) {
      history[existingCityIndex].data.push(weatherData);
      history[existingCityIndex].data = history[existingCityIndex].data.slice(-5);
    }

    if (history[existingCityIndex].data.length >= 6) {
      history[existingCityIndex].data.shift();
    }
  } else {
    history.push({ city, data: [weatherData] });
  }

  localStorage.setItem('weatherHistory', JSON.stringify(history));

  displayHistory();
}

function displayHistory() {
  const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];

  const historyTable = document.getElementById('historyTable');

  historyTable.innerHTML = '';

  history.forEach(item => {
    const { city, data } = item;

    if (data && Array.isArray(data)) {
      const latestEntries = data.slice(-5);

      latestEntries.forEach(entry => {
        historyTable.innerHTML += `
                  <tr>
                      <th scope="row" class="text-start">${city}</th>
                      <td>${entry.Cloud_pct || '0'}</td>
                      <td>${entry.Feels_like || '0'}</td>
                      <td>${entry.Humidity || '0'}</td>
                      <td>${entry.Max_temp || '0'}</td>
                      <td>${entry.Min_temp || '0'}</td>
                      <td>${entry.Sunrise || '0'}</td>
                      <td>${entry.Sunset || '0'}</td>
                      <td>${entry.Temp || '0'}</td>
                      <td>${entry.Wind_degrees || '0'}</td>
                      <td>${entry.Wind_speed || '0'}</td>
                  </tr>
              `;
      });
    }
  });
}
localStorage.removeItem('weatherHistory');

searchBtn.addEventListener('click', function (event) {
  event.preventDefault();
  getWeather();
});
