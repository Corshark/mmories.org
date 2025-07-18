const targetsData = [
  {
    name: "Fake donk",
    tag: "Impersonator",
    reportLink: "https://www.youtube.com/watch?v=K6jC3FM0Fj8"
  },
  {
    name: "LA CRUZ QUE TRANSFORMA",
    tag: "Cheat promoter",
    reportLink: "https://www.youtube.com/watch?v=IY_mv1xXCgI"
  }
  // Add more entries here...
];

const impersonatorPrompt = `This account is impersonating a known public figure or gaming personality to gain trust and credibility within the community. It is actively distributing phishing links that mimic legitimate platforms (such as Steam) in order to steal user credentials.

The consequences are serious:

1. Impersonation of a trusted identity to deceive users  
2. Promotion of fraudulent links leading to fake login pages  
3. Theft of accounts and digital property through credential harvesting  

Digital items and accounts in games like CS2 hold significant real-world value, with some assets reaching prices of €20,000 or more. These scams result in financial loss, emotional distress, and disruption of legitimate gameplay.

This behavior violates platform policies on impersonation, fraud, and user safety. Immediate investigation and takedown are strongly recommended to prevent further harm to users and the integrity of the gaming community.`;

const cheatPrompt = `This channel is actively promoting or distributing cheating software for CS2.

Consequences of this behavior include:

1. Enabling unfair advantages in multiplayer environments  
2. Encouraging rule-breaking, damaging the integrity of the game  
3. Creating toxic environments and harming the legitimate player base  

Cheating is a violation of game terms and platform rules. Channels like this contribute to a decline in fair gameplay, user trust, and esports reputation. It should be reported for immediate review and takedown.`;

const buttonsContainer = document.getElementById("targetButtons");
const targetDetails = document.getElementById("targetDetails");
const promptButton = document.getElementById("promptButton");
const copiedNotice = document.getElementById("copiedNotice");
const reportButton = document.getElementById("reportButton");
const clickSound = document.getElementById("clickSound");

let currentLink = "";
let currentPrompt = "";

function renderButtons(data) {
  buttonsContainer.innerHTML = "";
  data.forEach(target => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("target-entry");

    if (target.tag.toLowerCase() === "impersonator") wrapper.classList.add("impersonator");
    if (target.tag.toLowerCase() === "cheat promoter") wrapper.classList.add("cheat");

    const button = document.createElement("button");
    button.textContent = target.name;
    button.classList.add("target-button");

    const tag = document.createElement("span");
    tag.className = "target-tag";
    tag.textContent = target.tag;

    button.addEventListener("click", () => {
      clickSound.play();

      // Assign the long prompt and link based on tag
      currentPrompt = (target.tag === "Impersonator") ? impersonatorPrompt : cheatPrompt;
      currentLink = target.reportLink;

      // Reset UI state
      promptButton.style.display = "inline-block";
      copiedNotice.style.display = "none";
      reportButton.style.display = "none";
    });

    wrapper.appendChild(button);
    wrapper.appendChild(tag);
    buttonsContainer.appendChild(wrapper);
  });
}

// Copy prompt when clicking "Report Prompt"
promptButton.addEventListener("click", () => {
  navigator.clipboard.writeText(currentPrompt).then(() => {
    copiedNotice.style.display = "inline-block";
    reportButton.style.display = "inline-block";
    setTimeout(() => copiedNotice.style.display = "none", 1500);
  });
});

// Open external report link
reportButton.addEventListener("click", () => {
  if (currentLink) window.open(currentLink, "_blank");
});

// On load
renderButtons(targetsData);
