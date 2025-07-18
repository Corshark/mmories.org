const targetsData = [
  {
    name: "Fake donk",
    tag: "Impersonator",
    reportText: "This channel is impersonating the CS2 pro player donk.",
    externalLink: "https://www.youtube.com/watch?v=Hau6gbUcs8Q"
  },
  {
    name: "LA CRUZ QUE TRANSFORMA",
    tag: "Cheat promoter",
    reportText: "This channel is distributing or promoting CS2 cheats.",
    externalLink: "https://www.youtube.com/watch?v=IY_mv1xXCgI"
  },
  {
    name: "Anime Future",
    tag: "Cheat promoter",
    reportText: "This channel is distributing or promoting CS2 cheats.",
    externalLink: "https://www.youtube.com/watch?v=eztH3Yu8E44"
  },
  {
    name: "RuX",
    tag: "Cheat promoter",
    reportText: "This channel is distributing or promoting CS2 cheats.",
    externalLink: "https://www.youtube.com/watch?v=jvy83YtbLgs"
  },
  {
    name: "Pauta Club",
    tag: "Cheat promoter",
    reportText: "This channel is distributing or promoting CS2 cheats.",
    externalLink: "https://www.youtube.com/watch?v=xuUy9F1cDPY"
  },
  {
    name: "LOBEATZ",
    tag: "Cheat promoter",
    reportText: "This channel is distributing or promoting CS2 cheats.",
    externalLink: "https://www.youtube.com/watch?v=2Xh0tDCLrxA"
  },
  {
    name: "MandacaruCT",
    tag: "Cheat promoter",
    reportText: "This channel is distributing or promoting CS2 cheats.",
    externalLink: "https://www.youtube.com/watch?v=qpGTdY2g5kw"
  },
  {
    name: "Animate Animation",
    tag: "Cheat promoter",
    reportText: "This channel is distributing or promoting CS2 cheats.",
    externalLink: "https://www.youtube.com/watch?v=3S_Zbf2nZsg"
  },
  {
    name: "ابو ناجي Abu Naji",
    tag: "Cheat promoter",
    reportText: "This channel is distributing or promoting CS2 cheats.",
    externalLink: "https://www.youtube.com/watch?v=lahRa1dDbfc"
  },
  {
    name: "SETH7 FF",
    tag: "Cheat promoter",
    reportText: "This channel is distributing or promoting CS2 cheats.",
    externalLink: "https://www.youtube.com/watch?v=JcY7F1_7PLk"
  }
];

// DOM references
const buttonsContainer = document.getElementById("targetButtons");
const targetDetails = document.getElementById("targetDetails");
const reportBox = document.getElementById("reportBox");
const reportText = document.getElementById("reportText");
const reportButton = document.getElementById("reportButton");
const clickSound = document.getElementById("clickSound");

let selectedLink = "";

// Create badge-like buttons (limit 10 entries)
function renderButtons(targets) {
  buttonsContainer.innerHTML = "";
  targets.slice(0, 10).forEach(target => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("target-entry");

    // Add class for tag styling
    if (target.tag.toLowerCase().includes("impersonator")) {
      wrapper.classList.add("impersonator");
    }
    if (target.tag.toLowerCase().includes("cheat")) {
      wrapper.classList.add("cheat");
    }

    const nameBtn = document.createElement("button");
    nameBtn.textContent = target.name;
    nameBtn.classList.add("target-button");
    nameBtn.addEventListener("click", () => {
      clickSound.play();
      selectedLink = target.externalLink;
      showReport(target.reportText);
    });

    const tag = document.createElement("span");
    tag.textContent = target.tag;
    tag.classList.add("target-tag");

    // Optional inline color (can be removed if you're using CSS class colors)
    if (target.tag.toLowerCase() === "impersonator") tag.style.color = "#17c9e2";
    if (target.tag.toLowerCase() === "cheat promoter") tag.style.color = "#bd51ea";

    wrapper.appendChild(nameBtn);
    wrapper.appendChild(tag);
    buttonsContainer.appendChild(wrapper);
  });
}

// Show report box
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
    window.open(selectedLink, "_blank");
  }
  reportButton.src = "images/report3.webp";
  reportButton.classList.add("clicked");
  setTimeout(() => {
    reportButton.src = "images/report1.webp";
    reportButton.classList.remove("clicked");
  }, 1000);
});

// Initial render
renderButtons(targetsData);
