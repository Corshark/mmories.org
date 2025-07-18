const targetsData = [
  {
    name: "FAKE DONK",
    url: "https://www.youtube.com/watch?v=Hau6gbUcs8Q",
    tag: "Impersonator"
  }
];

const reportTexts = {
This account is impersonating a known gaming figure and sharing phishing links that mimic platforms like Steam to steal user credentials. It violates policies on impersonation and fraud. Immediate review is needed to protect users and prevent further harm.

};

const targetButtons = document.getElementById("targetButtons");
const targetDetails = document.getElementById("targetDetails");
const promptButton = document.getElementById("promptButton");
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

    promptButton.style.display = "inline-block";
    copiedNotice.style.display = "none";
    reportButton.style.display = "none";
    targetDetails.querySelector("h2").textContent = target.name;
  });

  targetButtons.appendChild(btn);
});

// Copy on prompt click
promptButton.addEventListener("click", () => {
  if (!currentReportText) return;

  navigator.clipboard.writeText(currentReportText).then(() => {
    copiedNotice.style.display = "block";
    reportButton.style.display = "inline-block";
  });
});

// Redirect to report link
reportButton.addEventListener("click", () => {
  if (currentReportLink) {
    window.open(currentReportLink, "_blank");
  }
});

