export default async function handler(req, res) {
  try {
    const response = await fetch(
      "https://api.steampowered.com/ISteamApps/GetAppList/v2/"
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: "Помилка Steam API" });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Помилка:", err);
    res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
}
