const apiKey = "0133cc5316757ac730cc46ae342334e4";

const searchBtn = document.getElementById("searchBtn");
const logs = document.getElementById("logs");

let cityHistory = JSON.parse(localStorage.getItem("cityHistory")) || [];

// Logger (for event loop)
function log(message) {
    console.log(message);
    const p = document.createElement("p");
    p.textContent = message;
    logs.appendChild(p);
}

// Button click
searchBtn.addEventListener("click", () => {
    logs.innerHTML = "";
    getWeather();
});

async function getWeather() {

    const city = document.getElementById("cityInput").value.trim();

    if (!city) {
        alert("Enter city!");
        return;
    }

    log("Sync Start");
    log("[ASYNC] Start fetching");

    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );

        log("Promise.then (Microtask)");

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();

        log("[ASYNC] Data received");

        // Display data
        document.getElementById("city").textContent = data.name;
        document.getElementById("temp").textContent = data.main.temp + " °C";
        document.getElementById("weather").textContent = data.weather[0].main;
        document.getElementById("humidity").textContent = data.main.humidity + "%";
        document.getElementById("wind").textContent = data.wind.speed + " m/s";

        saveHistory(city);

    } catch (error) {

        // Show error inside UI (NOT alert)
        document.getElementById("city").innerHTML = "<span style='color:red;'>City not found</span>";
        document.getElementById("temp").textContent = "-";
        document.getElementById("weather").textContent = "-";
        document.getElementById("humidity").textContent = "-";
        document.getElementById("wind").textContent = "-";

        log("Error: " + error.message);
    }

    setTimeout(() => {
        log("setTimeout (Macrotask)");
    }, 0);

    log("Sync End");
}


// Save history
function saveHistory(city) {

    if (!cityHistory.includes(city)) {
        cityHistory.push(city);
        localStorage.setItem("cityHistory", JSON.stringify(cityHistory));
    }

    displayHistory();
}


// Display history
function displayHistory() {

    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";

    cityHistory.forEach(city => {
        const span = document.createElement("span");
        span.textContent = city;

        span.onclick = () => {
            document.getElementById("cityInput").value = city;
            logs.innerHTML = "";
            getWeather();
        };

        historyDiv.appendChild(span);
    });
}

// Load history on start
displayHistory();


// Promise version (for assignment requirement)
function getWeatherWithPromise(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
}