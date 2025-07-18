const targetsData = [
  {
    name: "xXLegendAimXx",
    tag: "Impersonator",
    reportText: "This user is impersonating another content creator to promote hacks.",
    externalLink: "https://youtube.com/example1"
  },
  {
    name: "SilentAimGod",
    tag: "Cheat promoter",
    reportText: "This account is promoting external cheat programs.",
    externalLink: "https://youtube.com/example2"
  },
  // ... add more targets here
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

