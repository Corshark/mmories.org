const targetsData = [
  {
    name: "FAKE DONK",
    url: "https://www.youtube.com/watch?v=Hau6gbUcs8Q",
    tag: "Impersonator"
  }
];

const reportTexts = {
  "Impersonator": `This account is impersonating a known gaming figure and sharing phishing links that mimic platforms like Steam to steal user credentials. It violates policies on impersonation and fraud. Immediate review is needed to protect users and prevent further harm.`,

  "Cheat promoter": `This account is promoting cheats like aimbots and wallhacks in CS2. These tools give an unfair advantage, ruin competitive integrity, and violate the game's terms of service. Please review and take action.`
};

const targetButtons = document.getElementById("targetButtons");
const targetDetails = document.getElementById("targetDetails");
const reportPromptImg = document.getElementById("reportPromptImg");
const copiedNotice = document.getElementById("copiedNotice");
const reportButton = document.getElementById("reportButton");

let currentReportText = "";
let currentReportLink = "";

// Render each target button
targetsData.forEach(target => {
  const btn = document.createElement("button");
  btn.classList.add("target-btn");
  btn.textContent = `${target.name} [${target.tag}]`;

  btn.addEventListener("click", () => {
    currentReportText = reportTexts[target.tag];
    currentReportLink = target.url;

    reportPromptImg.style.display = "inline-block";
    copiedNotice.style.display = "none";
    reportButton.style.display = "none";
    targetDetails.querySelector("h2").textContent = target.name;
  });

  targetButtons.appendChild(btn);
});

// Copy on image click
reportPromptImg.addEventListener("click", () => {
  if (!currentReportText) return;

  navigator.clipboard.writeText(currentReportText).then(() => {
    copiedNotice.style.display = "block";
    reportPromptImg.style.display = "none";
    reportButton.style.display = "inline-block";
  });
});

// Redirect to report link
reportButton.addEventListener("click", () => {
  if (currentReportLink) {
    window.open(currentReportLink, "_blank");
  }
});
