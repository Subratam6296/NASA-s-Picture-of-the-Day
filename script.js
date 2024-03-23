let searchHistorySet = new Set();

document.addEventListener('DOMContentLoaded', function () {
    getCurrentImageOfTheDay();
    loadSearchHistory();
});

document.getElementById('search-form').addEventListener('submit', function (event) {
    event.preventDefault();
    getImageOfTheDay(document.getElementById('search-input').value);
});

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    fetchAPOD(currentDate);
}

function getImageOfTheDay(date) {
    fetchAPOD(date);
    saveSearch(date);
}

function fetchAPOD(date) {
    const apiUrl = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=8NkSLB0LsWipu2d1faD3u8R3S7qGALaf6b7yO5mK`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            return response.json();
        })
        .then(data => {
            displayImage(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            displayError(error.message);
        });
}

function displayImage(data) {
    const container = document.getElementById('current-image-container');
    container.innerHTML = `
        <h2>${data.title}</h2>
        <img src="${data.url}" alt="${data.title}" style="max-width: 100%;">
        <p>${data.explanation}</p>
    `;
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.push(date);
    localStorage.setItem('searches', JSON.stringify(searches));
    addSearchToHistory(date);
}

function loadSearchHistory() {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(date => addSearchToHistory(date));
}

function addSearchToHistory(date) {
    const historyList = document.getElementById('search-history');

    if (!searchHistorySet.has(date)) {
        const listItem = document.createElement('li');
        listItem.textContent = date;
        listItem.addEventListener('click', function () {
            getImageOfTheDay(date);
        });
        historyList.appendChild(listItem);
        searchHistorySet.add(date);
    }
}

function displayError(message) {
    const container = document.getElementById('current-image-container');
    container.innerHTML = `<p style="color: red;">Error: ${message}</p>`;
}