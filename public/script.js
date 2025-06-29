const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const target = tab.getAttribute("data-tab");
    contents.forEach((c) => {
      c.style.display = c.id === target ? "block" : "none";
    });
  });
});

function getStatusText(state) {
  switch (state) {
    case 0:
      return "Офлайн";
    case 1:
      return "Онлайн";
    case 2:
      return "Зайнятий";
    case 3:
      return "Не турбувати";
    case 4:
      return "Відсутній";
    case 5:
      return "Відсутній на місці";
    case 6:
      return "Грає у гру";
    default:
      return "Невідомо";
  }
}

async function searchUser() {
  const username = document.getElementById("username").value.trim();
  const result = document.getElementById("result");

  if (!username) {
    result.innerText = "Введіть ім'я користувача";
    return;
  }

  result.innerText = "Шукаю...";

  try {
    const res1 = await fetch(`/api/vanity?vanityurl=${username}`);
    const data1 = await res1.json();

    if (data1.response.success !== 1) {
      result.innerText = "Користувача не знайдено";
      return;
    }

    const steamid = data1.response.steamid;

    const res2 = await fetch(`/api/profile?steamid=${steamid}`);
    const data2 = await res2.json();

    const player = data2.response.players[0];

    if (!player) {
      result.innerText = "Профіль не знайдено";
      return;
    }

    const statusText = getStatusText(player.personastate);

    result.innerHTML = `
      <img src="${player.avatarfull}" alt="avatar"><br>
      <strong>${player.personaname}</strong><br>
      Статус: <em>${statusText}</em><br>
      <a href="${player.profileurl}" target="_blank" class="profile-link">Переглянути профіль</a>
    `;
  } catch (err) {
    console.error(err);
    result.innerText = "Помилка під час запиту";
  }
}

let appList = [];

async function loadAppList() {
  try {
    const res = await fetch("/api/applist");
    if (!res.ok) {
      throw new Error("Помилка завантаження списку ігор");
    }
    const data = await res.json();
    appList = data.applist.apps;
  } catch (err) {
    console.error("Помилка завантаження списку ігор:", err);
  }
}

async function searchGame() {
  const query = document.getElementById("gamequery").value.trim().toLowerCase();
  const gameResult = document.getElementById("game-result");

  if (!query) {
    gameResult.innerText = "Введіть назву гри";
    return;
  }

  if (appList.length === 0) {
    gameResult.innerText = "Завантаження списку ігор";
    await loadAppList();
  }

  const results = appList
    .filter((app) => app.name.toLowerCase().includes(query))
    .slice(0, 10);

  if (results.length === 0) {
    gameResult.innerText = "Ігри не знайдено";
    return;
  }

  gameResult.innerHTML =
    "<ul>" +
    results
      .map(
        (app) =>
          `<li>
          <a href="https://store.steampowered.com/app/${app.appid}" target="_blank" class="profile-link">
            <strong>${app.name}</strong>
          </a> (AppID: ${app.appid})
        </li>`
      )
      .join("") +
    "</ul>";
}

document.getElementById("searchUserBtn").addEventListener("click", searchUser);
document.getElementById("searchGameBtn").addEventListener("click", searchGame);

loadAppList();
