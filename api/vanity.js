export default async function handler(req, res) {
  const { vanityurl } = req.query;
  const API_KEY = "5A3F92473809F973597EC85D4ECA08F8";

  const response = await fetch(
    `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${API_KEY}&vanityurl=${vanityurl}`
  );

  const data = await response.json();
  res.status(200).json(data);
}
