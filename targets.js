const targetsData = []; // Empty for now

// DOM references
const buttonsContainer = document.getElementById("targetButtons");
const searchInput = document.getElementById("searchInput");
const targetDetails = document.getElementById("targetDetails");
const reportBox = document.getElementById("reportBox");
const reportText = document.getElementById("reportText");
const reportButton = document.getElementById("reportButton");
const clickSound = document.getElementById("clickSound");

let selectedLink = "";

// Create buttons
function renderButtons(targets) {
  buttonsContainer.innerHTML = "";
  targets.forEach(target => {
    const btn = document.createElement("button");
    btn.textContent = target.name;
    btn.classList.add("target-button");
    btn.addEventListener("click", () => {
      clickSound.play();
      selectedLink = target.externalLink;
      showReport(target.reportText);
    });
    buttonsContainer.appendChild(btn);
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

// Search filter
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = targetsData.filter(t => t.name.toLowerCase().includes(searchTerm));
  renderButtons(filtered);
});

// Initial render
renderButtons(targetsData);

