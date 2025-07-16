
const targetsData = [
  {
  name: "FAKE Falcons Esport",
  type: "cyan",
  externalLink: "https://www.youtube.com/watch?v=icwvT0MOIqM",
  reportText: `This video is part of a **highly coordinated scam campaign** impersonating the professional CS2 team **“Falcons Esport”**, their players, and official partners including **Steam**. The scam is promoted as a paid **YouTube ad**, abusing brand trust to lure users into visiting a fake giveaway website that collects Steam login credentials.\n\nThis operation uses real team logos, edited footage, and deceptive messaging to appear legitimate. Immediate investigation is required due to the scale, brand impersonation, and security threat posed to users and the esports community.`
  },
  {
    name: "FAKE Donk",
    type: "cyan",
    externalLink: "https://www.youtube.com/watch?v=07VgJc0qE7s&ab_channel=donk",
    reportText: `This is not the real Donk. The account linked above is impersonating the CS2 pro player “Donk” and streaming fake giveaways. A scam link appears in the live chat, designed to steal viewer credentials. Please investigate and take it down.`
  },
  {
    name: "Cheat-Advertiser - Khedutputra",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=nmWpeWVF4JE&ab_channel=KhedutputraGujarati",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.\n\nThe uploader encourages viewers to download external software that compromises game integrity and may put users at risk. Please investigate and take appropriate action under your platform's anti-cheat and content policies.`
  },
  {
    name: "Cheat-Advertiser - MarvelGaming #1",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=-CCGOzGo90I&ab_channel=MarvelGaming",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.`
  },
  {
    name: "Cheat-Advertiser - CSE Teacher",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=mcjvQ9H5GbI&ab_channel=CSETeacher",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.`
  },
  {
    name: "Cheat-Advertiser - BLAKIDOG",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=70J6UD9-yak&ab_channel=BLAKIDOG",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.`
  },
  {
    name: "Cheat-Advertiser - krvgo3pbv1",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=krvgo3pbv1I&pp=ygUIY3MyIGhhY2s%3D",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.`
  },
  {
    name: "Cheat-Advertiser - nHaLYsppcJM #1",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=nHaLYsppcJM&pp=ygUIY3MyIGhhY2s%3D",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.`
  },
  {
    name: "Cheat-Advertiser - nHaLYsppcJM #2 (dup)",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=nHaLYsppcJM&pp=ygUIY3MyIGhhY2s%3D",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.`
  },
  {
    name: "Cheat-Advertiser - PautaClub",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=7qX9nG6Yj94&ab_channel=PautaClub",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.`
  },
  {
    name: "Cheat-Advertiser - S7c3ZgYsSHo",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=S7c3ZgYsSHo&pp=ygUIY3MyIGhhY2s%3D",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.`
  },
  {
    name: "Cheat-Advertiser - -1aQ9ZQ-z_s",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=-1aQ9ZQ-z_s&pp=ygUIY3MyIGhhY2s%3D",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.`
  },
  {
    name: "Cheat-Advertiser - MarvelGaming #2",
    type: "magenta",
    externalLink: "https://www.youtube.com/watch?v=fpjVtiWNt5M&ab_channel=MarvelGaming",
    reportText: `This video promotes and distributes unauthorized cheats and modifications for Counter-Strike 2, including AimBot, ESP, WallHack, and other hack menus. These tools violate Valve's Terms of Service and disrupt fair gameplay.`
  }
];
// DOM references
const buttonsContainer = document.getElementById("targetButtons");
const searchInput = document.getElementById("searchInput");
const targetDetails = document.getElementById("targetDetails");
const reportBox = document.getElementById("reportBox");
const reportText = document.getElementById("reportText");
const reportButton = document.getElementById("reportButton");
const clickSound = document.getElementById("clickSound");

let selectedLink = ""; // 🆕 Store selected target's link

// Function to create buttons
function renderButtons(targets) {
  buttonsContainer.innerHTML = "";
  targets.forEach(target => {
    const btn = document.createElement("button");
    btn.textContent = target.name;
    btn.classList.add("target-button");
    btn.addEventListener("click", () => {
      clickSound.play();
      selectedLink = target.externalLink; // 🆕 Save the link for REPORT button
      showReport(target.reportText);
    });
    buttonsContainer.appendChild(btn);
  });
}

// Function to show report box
function showReport(text) {
  targetDetails.querySelector("h2").textContent = "Target Selected";
  targetDetails.querySelector("p").textContent = "Copy the report text and paste it when reporting.";
  reportText.textContent = text;
  reportBox.style.display = "block";
  reportButton.style.display = "block";
  reportButton.classList.remove("clicked");
}

// Copy to clipboard
reportText.addEventListener("click", () => {
  navigator.clipboard.writeText(reportText.textContent).then(() => {
    const oldText = reportText.textContent;
    reportText.textContent = "✓ COPIED!";
    setTimeout(() => {
      reportText.textContent = oldText;
    }, 1200);
  });
});

// Report image hover/click effect
reportButton.addEventListener("mouseover", () => {
  reportButton.src = "images/report2.webp";
});

reportButton.addEventListener("mouseout", () => {
  reportButton.src = "images/report1.webp";
});

reportButton.addEventListener("click", () => {
  if (selectedLink) {
    window.open(selectedLink, "_blank"); // ✅ Open link ONLY here
  }
  reportButton.src = "images/report3.webp";
  reportButton.classList.add("clicked");
  setTimeout(() => {
    reportButton.src = "images/report1.webp";
    reportButton.classList.remove("clicked");
  }, 1000);
});

// Search filtering
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = targetsData.filter(t => t.name.toLowerCase().includes(searchTerm));
  renderButtons(filtered);
});

// Initial render
renderButtons(targetsData);