const express = require("express");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const path = require("path");

const app = express();
const PORT = 3000;
const API_KEY = "5A3F92473809F973597EC85D4ECA08F8"; // заміни, якщо потрібно

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/vanity", async (req, res) => {
  const vanityurl = req.query.vanityurl;
  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${API_KEY}&vanityurl=${vanityurl}`
  );
  const data = await response.json();
  res.json(data);
});

app.get("/api/profile", async (req, res) => {
  const steamid = req.query.steamid;
  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${steamid}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Помилка від Steam API: ${response.status} - ${errorText}`);
      return res
        .status(response.status)
        .json({ error: "Перевищено ліміт запитів до Steam API" });
    }

    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Помилка запиту профілю:", err);
    res.status(500).json({ error: "Помилка при запиті профілю" });
  }
});
app.get("/api/applist", async (req, res) => {
  try {
    const response = await fetch(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
    );
    if (!response.ok) {
      return res.status(response.status).json({ error: "Помилка Steam API" });
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Помилка завантаження списку ігор:", err);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
});
app.listen(PORT, () => {
  console.log(`Сервер працює: http://localhost:${PORT}`);
});
