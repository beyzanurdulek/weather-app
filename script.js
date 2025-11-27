const API_KEY = "1ebdad5ffa564d41ba189178bd39289d" ; 


const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const errorMessage = document.getElementById("error-message");

const weatherCard = document.getElementById("weather-card");
const cityNameEl = document.getElementById("city-name");
const descriptionEl = document.getElementById("description");
const tempEl = document.getElementById("temp");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const weatherIconEl = document.getElementById("weather-icon");

// 🌤️ İKON SEÇİM FONKSİYONU (TR + EN destekli)
function getIconByWeather(mainWeather, description) {
    const main = (mainWeather || "").toLowerCase();
    const desc = (description || "").toLowerCase();

    // Fırtına
    if (main.includes("thunder") || desc.includes("fırtına")) return "⛈️";

    // Kar
    if (main.includes("snow") || desc.includes("kar")) return "❄️";

    // Yağmur
    if (
        main.includes("rain") ||
        main.includes("drizzle") ||
        desc.includes("yağmur") ||
        desc.includes("sağanak")
    ) return "🌧️";

    // Sis, pus
    if (
        main.includes("mist") ||
        main.includes("fog") ||
        main.includes("haze") ||
        desc.includes("sis") ||
        desc.includes("pus")
    ) return "🌫️";

    // Bulutlu
    if (main.includes("cloud") || desc.includes("bulut")) {
        if (desc.includes("parçalı") || desc.includes("az")) return "🌤️";
        return "☁️";
    }

    // diğer her şey
    return "☀️";
}
// 🎨 ARKA PLAN DEĞİŞTİRME
function setBackgroundByWeather(mainWeather) {
    document.body.classList.remove("sunny", "cloudy", "rainy", "snowy", "default-bg");

    const type = (mainWeather || "").toLowerCase();

    if (type.includes("clear")) {
        document.body.classList.add("sunny");
    } else if (type.includes("cloud")) {
        document.body.classList.add("cloudy");
    } else if (type.includes("rain") || type.includes("drizzle") || type.includes("thunderstorm")) {
        document.body.classList.add("rainy");
    } else if (type.includes("snow")) {
        document.body.classList.add("snowy");
    } else {
        document.body.classList.add("default-bg");
    }
}
//🔥 ANA FONKSİYON
async function getWeatherByCity(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
    )}&appid=${API_KEY}&units=metric&lang=tr`;

    try {
        errorMessage.classList.add("hidden");
        errorMessage.textContent = "";
        console.log("İstek URL'si:", apiUrl);

        const response = await fetch(apiUrl);

        // Cevabı her durumda JSON olarak okumayı dene
        let data = null;
        try {
            data = await response.json();
        } catch (jsonErr) {
            console.warn("JSON parse edilemedi:", jsonErr);
        }

        // Hata durumunda ayrıntılı mesaj üret
        if (!response.ok) {
            const apiMsg = data && data.message ? data.message : "Bilinmeyen bir hata oluştu.";
            const fullMessage = `API Hatası (${response.status}): ${apiMsg}`;
            console.error(fullMessage, data);
            throw new Error(fullMessage);
        }

        console.log("API cevabı:", data);

        const cityName = `${data.name}, ${data.sys.country}`;
        const description = data.weather[0].description;
        const mainWeather = data.weather[0].main;
        const temp = Math.round(data.main.temp);
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        cityNameEl.textContent = cityName;
        descriptionEl.textContent = description;
        tempEl.textContent = `${temp} °C`;
        humidityEl.textContent = `${humidity} %`;
        windEl.textContent = `${windSpeed} m/s`;


        const icon = getIconByWeather(mainWeather, description);
        weatherIconEl.textContent = icon;

        weatherCard.classList.remove("hidden");

        setBackgroundByWeather(mainWeather);
    } catch (err) {
        weatherCard.classList.add("hidden");
        errorMessage.textContent = err.message;
        errorMessage.classList.remove("hidden");
        console.error("Yakalanan hata:", err);
    }
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (!city) {
        errorMessage.textContent = "Lütfen bir şehir adı gir.";
        errorMessage.classList.remove("hidden");
        weatherCard.classList.add("hidden");
        return;
    }
    getWeatherByCity(city);
});

cityInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        searchBtn.click();
    }
});

document.body.classList.add("default-bg");
