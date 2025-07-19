const targetsData = [
  {
    name: "FAKE DONK",
    url: "https://www.youtube.com/watch?v=3Wtx080GvFs",
    tag: "Impersonator"
  },
  {
    name: "BLAKI DOG",
    url: "https://www.youtube.com/watch?v=uiDlgwxpZws",
    tag: "Cheat promoter"
  },
  {
    name: "Aprendi com Elas",
    url: "https://www.youtube.com/watch?v=heuKRrYgcOY",
    tag: "Cheat promoter"
  },
  {
    name: "ArchTube.Building Construction",
    url: "https://www.youtube.com/watch?v=gITCCAM_sa8",
    tag: "Cheat promoter"
  },
  {
    name: "RuX",
    url: "https://www.youtube.com/watch?v=i11Cp0g9GPw",
    tag: "Cheat promoter"
  },
  {
    name: "Gustavo Costa",
    url: "https://www.youtube.com/watch?v=TMFWVD_Hnns",
    tag: "Cheat promoter"
  },
  {
    name: "LA CRUZ QUE TRANSFORMA",
    url: "https://www.youtube.com/watch?v=IY_mv1xXCgI&t=2s",
    tag: "Cheat promoter"
  },
  {
    name: "@sonar1x1",
    url: "https://www.youtube.com/@sonar1x1/shorts",
    tag: "Cheat promoter"
  },
  {
    name: "Krishu Singh",
    url: "https://www.youtube.com/watch?v=fcgnxu_tBI0",
    tag: "Cheat promoter"
  },
  {
    name: "Jayden zayn",
    url: "https://www.youtube.com/watch?v=peiHMctzPF4",
    tag: "Cheat promoter"
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

// Render target buttons
targetsData.forEach(target => {
  const btn = document.createElement("button");
  btn.classList.add("target-card");
  btn.textContent = `${target.name} [${target.tag}]`;

  btn.addEventListener("click", () => {
    currentReportText = reportTexts[target.tag];
    currentReportLink = target.url;

    // Update details
    targetDetails.querySelector("h2").textContent = target.name;

    // Show the report prompt button, hide others
    reportPromptImg.style.display = "inline-block";
    copiedNotice.style.display = "none";
    reportButton.style.display = "none";
  });

  targetButtons.appendChild(btn);
});

// On reportPrompt image click
reportPromptImg.addEventListener("click", () => {
  if (!currentReportText) return;

  navigator.clipboard.writeText(currentReportText).then(() => {
    // Hide image, show copied text and report button
    reportPromptImg.style.display = "none";
    copiedNotice.style.display = "block";
    reportButton.style.display = "inline-block";
  });
});

// Final report button opens link
reportButton.addEventListener("click", () => {
  if (currentReportLink) {
    window.open(currentReportLink, "_blank");
  }
});
