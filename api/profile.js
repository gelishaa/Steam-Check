import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { steamid } = req.query;
  const API_KEY = "5A3F92473809F973597EC85D4ECA08F8";

  try {
    const response = await fetch(
      `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${API_KEY}&steamids=${steamid}`
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res
        .status(response.status)
        .json({ error: "Помилка від Steam API", details: errorText });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Внутрішня помилка:", err.message);
    res.status(500).json({ error: "Внутрішня помилка сервера", details: err.message });
  }
}
