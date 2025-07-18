const targetsData = [
  {
    name: "FAKE DONK",
    url: "https://www.youtube.com/watch?v=Hau6gbUcs8Q",
    tag: "Impersonator"
  }
];

const reportTexts = {
  "Impersonator": `This account is impersonating a known public figure or gaming personality to gain trust and credibility within the community. It is actively distributing phishing links that mimic legitimate platforms (such as Steam) in order to steal user credentials.

The consequences are serious:

1. Impersonation of a trusted identity to deceive users  
2. Promotion of fraudulent links leading to fake login pages  
3. Theft of accounts and digital property through credential harvesting  

Digital items and accounts in games like CS2 hold significant real-world value, with some assets reaching prices of €20,000 or more. These scams result in financial loss, emotional distress, and disruption of legitimate gameplay.

This behavior violates platform policies on impersonation, fraud, and user safety. Immediate investigation and takedown are strongly recommended to prevent further harm to users and the integrity of the gaming community.`,

  "Cheat promoter": `This account is actively promoting unauthorized third-party software (cheats) for CS2. These tools include aim assists, wallhacks, and triggerbots, which create an unfair competitive advantage and violate the game's terms of service.

Cheating damages the integrity of online matches and undermines trust in ranked systems. It also encourages further spread of malicious software disguised as cheats.

Please investigate and take action to protect the fair play environment in CS2.`
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

