let allCountryName;

const xhttp = new XMLHttpRequest();
xhttp.open('GET', 'allContry.json', true);
xhttp.send();
xhttp.onreadystatechange = function (){
    if (this.status === 200){
        allCountryName = JSON.parse(this.responseText);
    }
};

let cityList = [];

var api;
const test = '';
const searchBtn = document.getElementById('city-btn');
const searchBar = document.getElementById('city-input');
const allCard = document.querySelector('.allCard');
const originPositionCard = document.getElementById('originPosition');

const city = document.getElementById('city'),
county = document.getElementById('county'),
temp = document.getElementById('temp'),
description = document.getElementById('description'),
wind = document.querySelector('.wind'),
img = document.querySelector('img[alt="weather"]'),
humidity = document.querySelector('.humidity');

const message = document.querySelector('div.message');
let messageText;

function errorMessage(mess){
    message.textContent = mess;
    message.style.opacity = .9;
    setTimeout(function (){
        message.style.opacity = 0;
    }, 4000);
}

onload = function (){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        messageText = 'Your browser not support geolocation !';
        errorMessage(messageText);
    }
};
function success(pos){
    const latitude = pos.coords.latitude;
    const longitude = pos.coords.longitude;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=965f6a94c800a580612cf1ff93b62f7c`;
    fetchDatacur(api);
};
function error(error){
    originPositionCard.innerHTML = `<h2 class="messageError">${error.message}</h2>
    <img src="icon/remove-location.svg" alt="Location">`;
    originPositionCard.classList.add('active');
}

searchBar.addEventListener('keyup', e => {
    if (e.key == 'Enter' && searchBar.value != ''){
        searchBtn.innerHTML = '<img src="icon/loading.svg" alt="loading">';
        api = `https://api.openweathermap.org/data/2.5/weather?q=${searchBar.value}&units=metric&appid=965f6a94c800a580612cf1ff93b62f7c`;
        fetchNewData(api);
    }
});

searchBtn.addEventListener('click', function (){
    if (searchBar.value != ''){
        searchBtn.innerHTML = '<img src="icon/loading.svg" alt="loading">';
        api = `https://api.openweathermap.org/data/2.5/weather?q=${searchBar.value}&units=metric&appid=965f6a94c800a580612cf1ff93b62f7c`;
        fetchNewData(api);
    }
});

function fetchDatacur(api){
    fetch(api).then(re => re.json()).then(res => currentPosition(res));
}

function fetchNewData(api){
    fetch(api).then(re => re.json()).then(res => addNewPosition(res));
}

function currentPosition(data){
    const dataCity = data.name;
    const dataCountry = counrtyName(data.sys.country);
    const dataTemp = Math.floor(data.main.temp);
    const datawind = data.wind.speed;
    const dataHumidity = data.main.humidity;
    const dataDescription = data.weather[0].description;
    const dataicon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    
    city.innerText = dataCity;
    county.innerText = dataCountry;
    description.innerText = dataDescription;
    temp.innerText = `${dataTemp}°C`;
    wind.innerText = datawind;
    humidity.innerText = dataHumidity;
    img.src = dataicon;
    img.style.opacity = 1;
    
    searchBtn.innerHTML = 'search';
    cityList.push(dataCity);
};

function addNewPosition(data){
    if (data.cod == 200){
        const dataCity = data.name;
        const dataCountry = counrtyName(data.sys.country);
        const dataTemp = Math.floor(data.main.temp);
        const datawind = data.wind.speed;
        const dataHumidity = data.main.humidity;
        const dataDescription = data.weather[0].description;
        const dataicon = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        
        var newPos = `
        <div class="info infoNew">
        <div class="desc">
        <h3 id="description">${dataDescription}</h3>
        <img src="${dataicon}" alt="weather">
        </div>
        <div class="all-weather">
        <div class="title">
        <h1 id="city">${dataCity}</h1>
        <span id="county">${dataCountry}</span>
        </div>
        <h1 id="temp">${dataTemp}°C</h1>
        </div>
        <div class="card-footer">
        <div class="footer-left footer-item">
        <div class="footer-value">
        <i class="fa-solid fa-wind"></i>
        <span class="wind value">${datawind}</span><h3>m/s</h3>
        </div>
        <span class="footer-title">Wind speed</span>
        </div>
        
        <div class="footer-right footer-item">
        <div class="footer-value">
        <i class="fa-solid fa-droplet"></i>
        <span class="humidity value">${dataHumidity}</span><h3>%</h3>
        </div>
        <span class="footer-title">humidity</span>
        </div>
        </div>
        </div>
        `;
        if (cityList.includes(dataCity)){
            messageText = 'City already added !';
            errorMessage(messageText);
            searchBtn.innerHTML = 'search';
            searchBar.value = '';
            searchBar.focus();
        } else {
            allCard.innerHTML += newPos;
            searchBtn.innerHTML = 'search';
            cityList.push(dataCity);
            searchBar.value = '';
            searchBar.focus();
        }
}   else {
        messageText = data.message;
        errorMessage(messageText);
        searchBtn.innerHTML = 'search';
        searchBar.value = '';
        searchBar.focus();
}

};

function counrtyName(codeCounty){
    for (let country of allCountryName){
        if (codeCounty == country.code){
            return country.name;
        }
    }
}

const html = document.querySelector('html'),
themeBtn = document.querySelector('#themeBtn');
themeBtn.addEventListener('click', function (){
    if (html.getAttribute('dark') == 'false'){
        setproperty();
    } else {
        removeproperty();
    }
});

function setproperty(){
    themeBtn.classList.replace('fa-sun', 'fa-moon');
    html.setAttribute('dark', 'true');
}

function removeproperty(){
    themeBtn.classList.replace('fa-moon', 'fa-sun');
    html.setAttribute('dark', 'false');
}