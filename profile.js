import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBbQkQ2Sy9pMyKx68z3p_PLwTON70BS1PQ",
  authDomain: "mmories-org-live.firebaseapp.com",
  projectId: "mmories-org-live",
  storageBucket: "mmories-org-live.firebasestorage.app",
  messagingSenderId: "978660559442",
  appId: "1:978660559442:web:b874b822f391a765a4ed8b"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

window.addEventListener("DOMContentLoaded", async () => {
  console.log("DOM loaded, initializing profile page");

  const loadingOverlay = document.getElementById("loading-overlay");
  if (!loadingOverlay) {
    console.warn("Loading overlay not found");
  }

  const urlParams = new URLSearchParams(window.location.search);
  const profileKey = urlParams.get('profile') || localStorage.getItem("lastProfileKey");
  if (!profileKey) {
    console.error("No profile key found, redirecting to create-profile.html");
    alert("No profile key provided. Redirecting to create a new profile.");
    window.location.href = "create-profile.html";
    if (loadingOverlay) loadingOverlay.style.display = "none";
    return;
  }

  let profile;
  try {
    // Try fetching from Firebase first
    const profileRef = ref(database, `profiles/${profileKey}`);
    const snapshot = await get(profileRef);
    if (snapshot.exists()) {
      const firebaseData = snapshot.val();
      // Validate Firebase data
      if (!firebaseData.characterName || !firebaseData.mmoGame) {
        throw new Error("Invalid Firebase data: missing characterName or mmoGame");
      }
      profile = {
        name: firebaseData.characterName,
        guild: firebaseData.guild || '[Wanderer]',
        mmo: firebaseData.mmoGame,
        screenshots: (firebaseData.screenshotURLs || []).map(url => ({
          src: url,
          positionX: 0,
          positionY: 0,
          scale: 1
        })),
        registeredAt: firebaseData.timestamp ? new Date(firebaseData.timestamp).toLocaleString() : new Date().toLocaleString()
      };
      // Save to localStorage for consistency
      localStorage.setItem(profileKey, JSON.stringify(profile));
      console.log("Profile fetched from Firebase and saved to localStorage:", profile);
    } else {
      // Fallback to localStorage
      const profileData = localStorage.getItem(profileKey);
      if (!profileData) {
        console.error("No profile data found for key:", profileKey, "redirecting to create-profile.html");
        alert("Profile not found. Redirecting to create a new profile.");
        window.location.href = "create-profile.html";
        if (loadingOverlay) loadingOverlay.style.display = "none";
        return;
      }
      profile = JSON.parse(profileData);
      // Validate localStorage data
      if (!profile.name || !profile.mmo) {
        throw new Error("Invalid localStorage data: missing name or mmo");
      }
      console.log("Profile fetched from localStorage:", profile);
    }
  } catch (error) {
    console.error("Failed to fetch profile data:", error);
    alert(`Error loading profile: ${error.message}. Please try again or create a new profile.`);
    window.location.href = "create-profile.html";
    if (loadingOverlay) loadingOverlay.style.display = "none";
    return;
  }

  if (!profile.registeredAt) {
    profile.registeredAt = new Date().toLocaleString();
    localStorage.setItem(profileKey, JSON.stringify(profile));
    console.log("Set default registeredAt:", profile.registeredAt);
  }

  let visitCount = parseInt(localStorage.getItem(`${profileKey}_visitCount`) || "0");
  visitCount++;
  localStorage.setItem(`${profileKey}_visitCount`, visitCount);
  sessionStorage.setItem("hasVisitedProfile", "true");

  let achievements = JSON.parse(localStorage.getItem(`${profileKey}_achievements`) || "[]");
  let mmoriePoints = parseInt(localStorage.getItem(`${profileKey}_mmoriePoints`) || "1000");

  const milestones = [
    { visits: 10, image: "Coins/10-profile.png", alt: "10 Visits Achievement", tooltip: "Your profile was visited 10 times! Congrats!" },
    { visits: 100, image: "Coins/100-profile.png", alt: "100 Visits Achievement", tooltip: "Your profile was visited 100 times! Congrats!" },
    { visits: 500, image: "Coins/500-profile.png", alt: "500 Visits Achievement", tooltip: "Your profile was visited 500 times! Congrats!" },
    { visits: 1000, image: "Coins/1000-profile.png", alt: "1000 Visits Achievement", tooltip: "Your profile was visited 1000 times! Congrats!" }
  ];

  milestones.forEach(milestone => {
    if (visitCount >= milestone.visits && !achievements.includes(milestone.visits.toString())) {
      achievements.push(milestone.visits.toString());
      console.log("Added achievement:", milestone.alt);
    }
  });

  const isDonator = localStorage.getItem("isDonator") === "true";
  if (isDonator && !achievements.includes("donator")) {
    achievements.push("donator");
    console.log("Added donator achievement");
  }

  const isKnifeDonor = localStorage.getItem("isKnifeDonor") === "true";
  if (isKnifeDonor && !achievements.includes("knife-donator")) {
    achievements.push("knife-donator");
    console.log("Added knife-donator achievement");
  }

  const userEmail = localStorage.getItem("userEmail") || "";
  const isCreator = userEmail === "corshark@mmories.com";
  if (isCreator && !achievements.includes("creator")) {
    achievements.push("creator");
    console.log("Added creator achievement");
  }

  localStorage.setItem(`${profileKey}_achievements`, JSON.stringify(achievements));

  const elements = {
    nameEl: document.getElementById("char-name"),
    guildEl: document.getElementById("char-guild"),
    mmoEl: document.getElementById("char-mmo"),
    screenshotEl: document.getElementById("char-screenshot"),
    createdDateEl: document.getElementById("created-date-text"),
    counterEl: document.getElementById("memory-counter"),
    visitCounterEl: document.getElementById("visit-counter"),
    mmoriePointsEl: document.getElementById("mmorie-points"),
    achievementsEl: document.getElementById("achievements"),
    bgVideoEl: document.getElementById("bgVideo"),
    changeBgBtn: document.getElementById("change-background-btn"),
    changeBorderBtn: document.getElementById("change-border-btn"),
    changeBoxBgBtn: document.getElementById("change-box-bg-btn"),
    resetCustomizationsBtn: document.getElementById("reset-customizations-btn"),
    editProfileBtn: document.getElementById("edit-profile-btn"),
    donateBtn: document.getElementById("donate-btn"),
    donationModal: document.getElementById("donation-modal"),
    cancelDonationBtn: document.getElementById("cancel-donation-btn"),
    confirmDonationBtn: document.getElementById("confirm-donation-btn"),
    donationInput: document.getElementById("donation-input"),
    donationNoteEl: document.getElementById("donation-note"),
    donationTypes: document.getElementsByName("donation-type"),
    prevScreenshotBtn: document.getElementById("prev-screenshot"),
    nextScreenshotBtn: document.getElementById("next-screenshot")
  };

  // Check for missing elements
  Object.entries(elements).forEach(([key, el]) => {
    if (!el && key !== "donationTypes") {
      console.warn(`Element ${key} not found in DOM`);
    }
  });

  if (elements.nameEl) {
    elements.nameEl.textContent = profile.name || "Unknown Character";
    console.log("Name set to:", elements.nameEl.textContent);
  }
  if (elements.guildEl) {
    elements.guildEl.textContent = profile.guild || "[Wanderer]";
    console.log("Guild set to:", elements.guildEl.textContent);
  }
  if (elements.mmoEl) {
    elements.mmoEl.textContent = `From: ${profile.mmo || "Unknown MMO"}`;
    console.log("MMO set to:", elements.mmoEl.textContent);
  }
  if (elements.createdDateEl) {
    elements.createdDateEl.textContent = profile.registeredAt || "6/2/2025, 09:00 AM";
    console.log("Created date set to:", elements.createdDateEl.textContent);
  }

  let currentScreenshotIndex = 0;
  if (elements.screenshotEl && profile.screenshots && profile.screenshots.length > 0) {
    function updateScreenshot() {
      const currentScreenshot = profile.screenshots[currentScreenshotIndex];
      elements.screenshotEl.src = currentScreenshot.src || "default-screenshot.png";
      elements.screenshotEl.alt = `Screenshot of ${profile.name || "Unknown Character"}`;
      elements.screenshotEl.style.transform = `translate(${currentScreenshot.positionX || 0}px, ${currentScreenshot.positionY || 0}px) scale(${currentScreenshot.scale || 1})`;
      console.log("Screenshot set:", elements.screenshotEl.src, "Index:", currentScreenshotIndex);
    }

    elements.prevScreenshotBtn.addEventListener("click", () => {
      currentScreenshotIndex = (currentScreenshotIndex - 1 + profile.screenshots.length) % profile.screenshots.length;
      updateScreenshot();
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
    });

    elements.nextScreenshotBtn.addEventListener("click", () => {
      currentScreenshotIndex = (currentScreenshotIndex + 1) % profile.screenshots.length;
      updateScreenshot();
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
    });

    updateScreenshot();
  } else if (elements.screenshotEl && profile.screenshot) {
    profile.screenshots = [{ src: profile.screenshot, positionX: profile.positionX, positionY: profile.positionY, scale: profile.scale }];
    function updateScreenshot() {
      const currentScreenshot = profile.screenshots[currentScreenshotIndex];
      elements.screenshotEl.src = currentScreenshot.src || "default-screenshot.png";
      elements.screenshotEl.alt = `Screenshot of ${profile.name || "Unknown Character"}`;
      elements.screenshotEl.style.transform = `translate(${currentScreenshot.positionX || 0}px, ${currentScreenshot.positionY || 0}px) scale(${currentScreenshot.scale || 1})`;
      console.log("Screenshot set:", elements.screenshotEl.src, "Index:", currentScreenshotIndex);
    }

    elements.prevScreenshotBtn.addEventListener("click", () => {
      currentScreenshotIndex = (currentScreenshotIndex - 1 + profile.screenshots.length) % profile.screenshots.length;
      updateScreenshot();
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
    });

    elements.nextScreenshotBtn.addEventListener("click", () => {
      currentScreenshotIndex = (currentScreenshotIndex + 1) % profile.screenshots.length;
      updateScreenshot();
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
    });

    updateScreenshot();
  } else if (elements.screenshotEl) {
    elements.screenshotEl.src = "default-screenshot.png";
    elements.screenshotEl.alt = "No Screenshot Available";
    console.error("No screenshots found in profile data");
  }

  if (elements.counterEl && profile.registeredAt) {
    try {
      const registered = new Date(profile.registeredAt);
      const now = new Date();
      if (isNaN(registered.getTime())) {
        console.error("Invalid registeredAt date:", profile.registeredAt);
        elements.counterEl.textContent = "Memory Age: Invalid Date";
      } else {
        const days = Math.floor((now - registered) / (1000 * 60 * 60 * 24));
        elements.counterEl.textContent = `Memory Age: ${days} days`;
        console.log("Memory Age set to:", days, "days, registeredAt:", profile.registeredAt);
      }
    } catch (error) {
      console.error("Error calculating memory age:", error);
      elements.counterEl.textContent = "Memory Age: Error";
    }
  }
  if (elements.visitCounterEl) {
    elements.visitCounterEl.textContent = `Profile Visits: ${visitCount}`;
    console.log("Visit counter set to:", visitCount);
  }
  if (elements.mmoriePointsEl) {
    elements.mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
    console.log("mmoriePoints set to:", mmoriePoints);
  }

  if (elements.achievementsEl) {
    elements.achievementsEl.innerHTML = "";
    const achievementData = [
      { visits: 10, image: "Coins/10-profile.png", alt: "10 Visits Achievement", tooltip: "Your profile was visited 10 times! Congrats!" },
      { visits: 100, image: "Coins/100-profile.png", alt: "100 Visits Achievement", tooltip: "Your profile was visited 100 times! Congrats!" },
      { visits: 500, image: "Coins/500-profile.png", alt: "500 Visits Achievement", tooltip: "Your profile was visited 500 times! Congrats!" },
      { visits: 1000, image: "Coins/1000-profile.png", alt: "1000 Visits Achievement", tooltip: "Your profile was visited 1000 times! Congrats!" },
      { visits: "donator", image: "Coins/donator.png", alt: "Donator Achievement", tooltip: "Thank you for donating to mmories.com! Your donation will make sure mmories.com will live yet another day." },
      { visits: "knife-donator", image: "Coins/knife-donator.png", alt: "Knife Donator Achievement", tooltip: "Thank you for your special knife donation to mmories.com! Your support keeps the cosmos glowing." },
      { visits: "creator", image: "Coins/corshark-creator.png", alt: "Creator Achievement", tooltip: "Awarded to the creator of mmories.com for their stellar contribution!" },
      { visits: "metamask-donator", image: "Coins/Metamask-Donator.png", alt: "Metamask Donator Achievement", tooltip: "Thank you for your MetaMask donation to mmories.com! Your support shines bright in the blockchain cosmos!" },
      { visits: "admin", image: "Coins/Corshark-Admin.png", alt: "Admin Achievement", tooltip: "Exclusive admin privilege for Corshark!" }
    ];
    achievements.forEach(achievement => {
      const ach = achievementData.find(a => a.visits.toString() === achievement);
      if (ach) {
        const img = document.createElement("img");
        img.src = ach.image;
        img.alt = ach.alt;
        img.setAttribute("data-tooltip", ach.tooltip);
        elements.achievementsEl.appendChild(img);
        console.log("Added coin:", ach.alt, "src:", ach.image, "tooltip:", ach.tooltip);

        img.addEventListener("mouseenter", (e) => {
          console.log(`Hover on ${ach.alt}: showing tooltip`);
          const tooltip = document.createElement("div");
          tooltip.classList.add("tooltip");
          tooltip.textContent = ach.tooltip;
          document.body.appendChild(tooltip);

          const rect = img.getBoundingClientRect();
          tooltip.style.left = `${rect.right + 10}px`;
          tooltip.style.top = `${rect.top + rect.height / 2}px`;
          tooltip.style.transform = "translateY(-50%)";
          tooltip.style.display = "block";

          console.log(`Tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

          img._tooltip = tooltip;
        });
        img.addEventListener("mouseleave", () => {
          console.log(`Mouse leave on ${ach.alt}: hiding tooltip`);
          if (img._tooltip) {
            img._tooltip.remove();
            img._tooltip = null;
          }
        });
        img.addEventListener("click", () => {
          if (img.classList.contains("flipping")) {
            console.log(`Click on ${ach.alt} ignored, animation in progress`);
            return;
          }

          console.log(`Clicked on ${ach.alt}, toggling flip`);
          img.classList.add("flipping");
          img.classList.toggle("flip");

          const flipSound = document.getElementById("flip-sound");
          if (flipSound) {
            try { flipSound.currentTime = 0; flipSound.play(); } catch (e) { console.warn("Failed to play flip sound:", e); }
          }
          const clickSound = document.getElementById("click-sound");
          if (clickSound) {
            try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
          }

          setTimeout(() => {
            img.classList.remove("flipping");
            console.log(`Flip animation complete for ${ach.alt}`);
          }, 600);
        });
      }
    });

    if (profile.name === "Corshark" && !achievements.includes("admin")) {
      const adminAch = achievementData.find(a => a.visits === "admin");
      if (adminAch) {
        const img = document.createElement("img");
        img.src = adminAch.image;
        img.alt = adminAch.alt;
        img.setAttribute("data-tooltip", adminAch.tooltip);
        elements.achievementsEl.appendChild(img);
        console.log("Added admin coin:", adminAch.alt, "src:", adminAch.image, "tooltip:", adminAch.tooltip);

        img.addEventListener("mouseenter", (e) => {
          console.log(`Hover on ${adminAch.alt}: showing tooltip`);
          const tooltip = document.createElement("div");
          tooltip.classList.add("tooltip");
          tooltip.textContent = adminAch.tooltip;
          document.body.appendChild(tooltip);

          const rect = img.getBoundingClientRect();
          tooltip.style.left = `${rect.right + 10}px`;
          tooltip.style.top = `${rect.top + rect.height / 2}px`;
          tooltip.style.transform = "translateY(-50%)";
          tooltip.style.display = "block";

          console.log(`Tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

          img._tooltip = tooltip;
        });
        img.addEventListener("mouseleave", () => {
          console.log(`Mouse leave on ${adminAch.alt}: hiding tooltip`);
          if (img._tooltip) {
            img._tooltip.remove();
            img._tooltip = null;
          }
        });
        img.addEventListener("click", () => {
          if (img.classList.contains("flipping")) {
            console.log(`Click on ${adminAch.alt} ignored, animation in progress`);
            return;
          }

          console.log(`Clicked on ${adminAch.alt}, toggling flip`);
          img.classList.add("flipping");
          img.classList.toggle("flip");

          const flipSound = document.getElementById("flip-sound");
          if (flipSound) {
            try { flipSound.currentTime = 0; flipSound.play(); } catch (e) { console.warn("Failed to play flip sound:", e); }
          }
          const clickSound = document.getElementById("click-sound");
          if (clickSound) {
            try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
          }

          setTimeout(() => {
            img.classList.remove("flipping");
            console.log(`Flip animation complete for ${adminAch.alt}`);
          }, 600);
        });
      }
    }
    console.log("Added", achievements.length, "coins to #achievements");
  } else {
    console.error("Achievements element not found");
  }

  if (elements.changeBgBtn && elements.bgVideoEl) {
    const backgrounds = ["videos/profile.mp4", "videos/profile1.mp4", "videos/profile2.mp4", "videos/profile3.mp4", "videos/profile4.mp4"];
    let currentBgIndex = parseInt(localStorage.getItem(`${profileKey}_currentBgIndex`) || "0");

    elements.bgVideoEl.src = backgrounds[currentBgIndex];
    elements.bgVideoEl.load();
    elements.bgVideoEl.play().catch(e => console.warn("Video playback failed:", e));
    console.log("Loaded background:", backgrounds[currentBgIndex]);

    elements.changeBgBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Change Background button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "100 mmoriePoints to change background!";
      document.body.appendChild(tooltip);

      const rect = elements.changeBgBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Button tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      elements.changeBgBtn._tooltip = tooltip;
    });

    elements.changeBgBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Change Background button: hiding tooltip");
      if (elements.changeBgBtn._tooltip) {
        elements.changeBgBtn._tooltip.remove();
        elements.changeBgBtn._tooltip = null;
      }
    });

    elements.changeBgBtn.addEventListener("click", () => {
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
      console.log("Change Background button clicked, click sound played");

      if (mmoriePoints >= 100) {
        const bgChangeSound = document.getElementById("bg-change-sound");
        if (bgChangeSound) {
          try { bgChangeSound.currentTime = 0; bgChangeSound.play(); } catch (e) { console.warn("Failed to play bg-change sound:", e); }
        }
        console.log("Background change confirmed, bg-change sound played");

        mmoriePoints -= 100;
        localStorage.setItem(`${profileKey}_mmoriePoints`, mmoriePoints);
        elements.mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
        elements.mmoriePointsEl.classList.add("points-updated");
        setTimeout(() => elements.mmoriePointsEl.classList.remove("points-updated"), 500);
        console.log("Deducted 100 mmoriePoints, new balance:", mmoriePoints);

        currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
        const newVideoSrc = backgrounds[currentBgIndex];
        elements.bgVideoEl.src = newVideoSrc;
        elements.bgVideoEl.load();
        elements.bgVideoEl.play().catch(e => console.warn("Video playback failed:", e));
        localStorage.setItem(`${profileKey}_currentBgIndex`, currentBgIndex);
        console.log("Changed background to:", newVideoSrc);
      } else {
        alert("Not enough mmoriePoints! You need 100 points to change the background.");
        console.log("Insufficient points for background change:", mmoriePoints);
      }
    });
  } else {
    console.error("Change Background button or bgVideo element not found");
  }

  if (elements.changeBorderBtn) {
    const borderColors = ["#01d9f5", "#ff2e95", "#ffd700", "#a649cb", "#00ff7f"];
    let currentBorderIndex = parseInt(localStorage.getItem(`${profileKey}_currentBorderIndex`) || "0");
    const profileBg = document.querySelector(".profile-background");
    const screenshotBox = document.querySelector(".screenshot-box");
    const achievementsBox = document.querySelector("#achievements");
    const mmoBox = document.querySelector(".mmo-box");
    const createdDate = document.querySelector(".created-date");

    if (profileBg) {
      const savedColor = borderColors[currentBorderIndex];
      profileBg.style.borderColor = savedColor;
      profileBg.style.boxShadow = `0 0 20px ${savedColor}, 0 0 40px #FFD70066`;
    }
    if (screenshotBox) {
      const savedColor = borderColors[currentBorderIndex];
      screenshotBox.style.borderColor = savedColor;
      screenshotBox.style.boxShadow = `0 0 40px ${savedColor}, 0 0 80px ${savedColor}88`;
    }
    if (achievementsBox) {
      const savedColor = borderColors[currentBorderIndex];
      achievementsBox.style.borderColor = savedColor;
      achievementsBox.style.boxShadow = `0 0 20px ${savedColor}88`;
    }
    if (mmoBox) mmoBox.style.borderColor = borderColors[currentBorderIndex];
    if (createdDate) createdDate.style.borderColor = borderColors[currentBorderIndex];
    console.log("Loaded border color:", borderColors[currentBorderIndex]);

    elements.changeBorderBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Change Border button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "100 mmoriePoints to change borders!";
      document.body.appendChild(tooltip);

      const rect = elements.changeBorderBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Border tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      elements.changeBorderBtn._tooltip = tooltip;
    });

    elements.changeBorderBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Change Border button: hiding tooltip");
      if (elements.changeBorderBtn._tooltip) {
        elements.changeBorderBtn._tooltip.remove();
        elements.changeBorderBtn._tooltip = null;
      }
    });

    elements.changeBorderBtn.addEventListener("click", () => {
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
      console.log("Change Border button clicked, click sound played");

      if (mmoriePoints >= 100) {
        const borderChangeSound = document.getElementById("border-change-sound");
        if (borderChangeSound) {
          try { borderChangeSound.currentTime = 0; borderChangeSound.play(); } catch (e) { console.warn("Failed to play border-change sound:", e); }
        }
        console.log("Border change confirmed, border-change sound played");

        mmoriePoints -= 100;
        localStorage.setItem(`${profileKey}_mmoriePoints`, mmoriePoints);
        elements.mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
        elements.mmoriePointsEl.classList.add("points-updated");
        setTimeout(() => elements.mmoriePointsEl.classList.remove("points-updated"), 500);
        console.log("Deducted 100 mmoriePoints, new balance:", mmoriePoints);

        currentBorderIndex = (currentBorderIndex + 1) % borderColors.length;
        const newColor = borderColors[currentBorderIndex];

        if (profileBg) {
          profileBg.style.borderColor = newColor;
          profileBg.style.boxShadow = `0 0 20px ${newColor}, 0 0 40px #FFD70066`;
        }
        if (screenshotBox) {
          screenshotBox.style.borderColor = newColor;
          screenshotBox.style.boxShadow = `0 0 40px ${newColor}, 0 0 80px ${newColor}88`;
        }
        if (achievementsBox) {
          achievementsBox.style.borderColor = newColor;
          achievementsBox.style.boxShadow = `0 0 20px ${newColor}88`;
        }
        if (mmoBox) mmoBox.style.borderColor = newColor;
        if (createdDate) createdDate.style.borderColor = newColor;

        localStorage.setItem(`${profileKey}_currentBorderIndex`, currentBorderIndex);
        console.log("Changed borders to:", newColor);
      } else {
        alert("Not enough mmoriePoints! You need 100 points to change the borders.");
        console.log("Insufficient points for border change:", mmoriePoints);
      }
    });
  } else {
    console.error("Change Border button not found");
  }

  if (elements.changeBoxBgBtn) {
    const boxBackgrounds = [
      "rgb(14, 28, 51)",
      "linear-gradient(to bottom, #2a4066, #1a2b4a)",
      "rgb(50, 20, 70)",
      "linear-gradient(to bottom, #5a2d2d, #3a1c1c)",
      "rgb(20, 50, 40)"
    ];
    let currentBoxBgIndex = parseInt(localStorage.getItem(`${profileKey}_currentBoxBgIndex`) || "0");
    const screenshotBox = document.querySelector(".screenshot-box");
    const achievementsBox = document.querySelector("#achievements");
    const mmoBox = document.querySelector(".mmo-box");
    const createdDate = document.querySelector(".created-date");
    const celestialPanel = document.querySelector(".celestial-panel");
    const mysticPanel = document.querySelector(".mystic-panel");
    const modal = document.querySelector(".modal");

    const savedBoxBg = boxBackgrounds[currentBoxBgIndex];
    if (screenshotBox) screenshotBox.style.background = savedBoxBg;
    if (achievementsBox) achievementsBox.style.background = savedBoxBg;
    if (mmoBox) mmoBox.style.background = savedBoxBg;
    if (createdDate) createdDate.style.background = savedBoxBg;
    if (celestialPanel) celestialPanel.style.background = savedBoxBg;
    if (mysticPanel) mysticPanel.style.background = savedBoxBg;
    if (modal) modal.style.background = savedBoxBg;
    console.log("Loaded box background:", savedBoxBg);

    elements.changeBoxBgBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Change Box Background button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "100 mmoriePoints to change box backgrounds!";
      document.body.appendChild(tooltip);

      const rect = elements.changeBoxBgBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Box Bg tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      elements.changeBoxBgBtn._tooltip = tooltip;
    });

    elements.changeBoxBgBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Change Box Background button: hiding tooltip");
      if (elements.changeBoxBgBtn._tooltip) {
        elements.changeBoxBgBtn._tooltip.remove();
        elements.changeBoxBgBtn._tooltip = null;
      }
    });

    elements.changeBoxBgBtn.addEventListener("click", () => {
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
      console.log("Change Box Background button clicked, click sound played");

      if (mmoriePoints >= 100) {
        const boxBgChangeSound = document.getElementById("box-bg-change-sound");
        if (boxBgChangeSound) {
          try { boxBgChangeSound.currentTime = 0; boxBgChangeSound.play(); } catch (e) { console.warn("Failed to play box-bg-change sound:", e); }
        }
        console.log("Box background change confirmed, box-bg-change sound played");

        mmoriePoints -= 100;
        localStorage.setItem(`${profileKey}_mmoriePoints`, mmoriePoints);
        elements.mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
        elements.mmoriePointsEl.classList.add("points-updated");
        setTimeout(() => elements.mmoriePointsEl.classList.remove("points-updated"), 500);
        console.log("Deducted 100 mmoriePoints, new balance:", mmoriePoints);

        currentBoxBgIndex = (currentBoxBgIndex + 1) % boxBackgrounds.length;
        const newBoxBg = boxBackgrounds[currentBoxBgIndex];

        if (screenshotBox) screenshotBox.style.background = newBoxBg;
        if (achievementsBox) achievementsBox.style.background = newBoxBg;
        if (mmoBox) mmoBox.style.background = newBoxBg;
        if (createdDate) createdDate.style.background = newBoxBg;
        if (celestialPanel) celestialPanel.style.background = newBoxBg;
        if (mysticPanel) mysticPanel.style.background = newBoxBg;
        if (modal) modal.style.background = newBoxBg;

        localStorage.setItem(`${profileKey}_currentBoxBgIndex`, currentBoxBgIndex);
        console.log("Changed box backgrounds to:", newBoxBg);
      } else {
        alert("Not enough mmoriePoints! You need 100 points to change the box backgrounds.");
        console.log("Insufficient points for box background change:", mmoriePoints);
      }
    });
  } else {
    console.error("Change Box Background button not found");
  }

  if (elements.resetCustomizationsBtn) {
    const defaultBorderColor = "#01d9f5";
    const defaultBackground = "videos/profile.mp4";
    const defaultBoxBg = "rgb(14, 28, 51)";
    const profileBg = document.querySelector(".profile-background");
    const screenshotBox = document.querySelector(".screenshot-box");
    const achievementsBox = document.querySelector("#achievements");
    const mmoBox = document.querySelector(".mmo-box");
    const createdDate = document.querySelector(".created-date");
    const celestialPanel = document.querySelector(".celestial-panel");
    const mysticPanel = document.querySelector(".mystic-panel");
    const modal = document.querySelector(".modal");

    elements.resetCustomizationsBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Reset Customizations button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "50 mmoriePoints to reset borders, background, and box backgrounds!";
      document.body.appendChild(tooltip);

      const rect = elements.resetCustomizationsBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Reset tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      elements.resetCustomizationsBtn._tooltip = tooltip;
    });

    elements.resetCustomizationsBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Reset Customizations button: hiding tooltip");
      if (elements.resetCustomizationsBtn._tooltip) {
        elements.resetCustomizationsBtn._tooltip.remove();
        elements.resetCustomizationsBtn._tooltip = null;
      }
    });

    elements.resetCustomizationsBtn.addEventListener("click", () => {
      if (mmoriePoints >= 50) {
        const clickSound = document.getElementById("click-sound");
        if (clickSound) {
          try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
        }
        mmoriePoints -= 50;
        localStorage.setItem(`${profileKey}_mmoriePoints`, mmoriePoints);
        elements.mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
        elements.mmoriePointsEl.classList.add("points-updated");
        setTimeout(() => elements.mmoriePointsEl.classList.remove("points-updated"), 500);
        console.log("Deducted 50 mmoriePoints, new balance:", mmoriePoints);

        elements.bgVideoEl.src = defaultBackground;
        elements.bgVideoEl.load();
        elements.bgVideoEl.play().catch(e => console.warn("Video playback failed:", e));
        localStorage.setItem(`${profileKey}_currentBgIndex`, "0");
        console.log("Reset background to:", defaultBackground);

        if (profileBg) {
          profileBg.style.borderColor = defaultBorderColor;
          profileBg.style.boxShadow = `0 0 20px ${defaultBorderColor}, 0 0 40px #FFD70066`;
        }
        if (screenshotBox) {
          screenshotBox.style.borderColor = defaultBorderColor;
          screenshotBox.style.boxShadow = `0 0 40px ${defaultBorderColor}, 0 0 80px ${defaultBorderColor}88`;
          screenshotBox.style.background = defaultBoxBg;
        }
        if (achievementsBox) {
          achievementsBox.style.borderColor = defaultBorderColor;
          achievementsBox.style.boxShadow = `0 0 20px ${defaultBorderColor}88`;
          achievementsBox.style.background = defaultBoxBg;
        }
        if (mmoBox) {
          mmoBox.style.borderColor = defaultBorderColor;
          mmoBox.style.background = defaultBoxBg;
        }
        if (createdDate) {
          createdDate.style.borderColor = defaultBorderColor;
          createdDate.style.background = defaultBoxBg;
        }
        if (celestialPanel) celestialPanel.style.background = defaultBoxBg;
        if (mysticPanel) mysticPanel.style.background = defaultBoxBg;
        if (modal) modal.style.background = defaultBoxBg;

        localStorage.setItem(`${profileKey}_currentBorderIndex`, "0");
        localStorage.setItem(`${profileKey}_currentBoxBgIndex`, "0");
        console.log("Reset borders to:", defaultBorderColor, "and box backgrounds to:", defaultBoxBg);
      } else {
        alert("Not enough mmoriePoints! You need 50 points to reset customizations.");
        console.log("Insufficient points for reset:", mmoriePoints);
      }
    });
  } else {
    console.error("Reset Customizations button not found");
  }

  if (elements.editProfileBtn) {
    elements.editProfileBtn.addEventListener("click", () => {
      console.log("Edit Profile clicked, redirecting to create-profile.html");
      window.location.href = `create-profile.html?edit=true&profile=${profileKey}`;
    });

    elements.editProfileBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Edit Profile button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "Edit your character’s name, guild, MMO, or screenshot!";
      document.body.appendChild(tooltip);

      const rect = elements.editProfileBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Edit tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      elements.editProfileBtn._tooltip = tooltip;
    });

    elements.editProfileBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Edit Profile button: hiding tooltip");
      if (elements.editProfileBtn._tooltip) {
        elements.editProfileBtn._tooltip.remove();
        elements.editProfileBtn._tooltip = null;
      }
    });
  } else {
    console.error("Edit Profile button not found");
  }

  if (elements.donateBtn && elements.donationModal) {
    const steamTradeUrl = "https://steamcommunity.com/tradeoffer/new/?partner=234292270&token=Za-GzrF9";
    let donationAmount = "0.01";

    async function connectMetaMask() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          window.web3 = new Web3(window.ethereum);
          const walletAddress = accounts[0];
          console.log("Connected MetaMask wallet:", walletAddress);
          return walletAddress;
        } catch (error) {
          console.error("MetaMask connection failed:", error);
          alert("Failed to connect MetaMask. Please ensure MetaMask is installed and try again.");
          return null;
        }
      } else {
        console.error("MetaMask not detected");
        alert("MetaMask is not installed. Please install the MetaMask extension to donate with ETH.");
        return null;
      }
    }

    async function sendDonation(walletAddress) {
      if (!walletAddress) return;
      try {
        const amountInWei = window.web3.utils.toWei(donationAmount, "ether");
        const tx = {
          from: walletAddress,
          to: "0x1234567890AbCdEf1234567890AbCdEf12345678",
          value: amountInWei,
          gas: 21000,
        };
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [tx],
        });
        console.log("Donation transaction sent:", txHash);
        alert(`Donation successful! Transaction hash: ${txHash}\nPlease include your mmories.com username: ${profile.name || "Unknown Character"} in the transaction note.`);

        mmoriePoints += 500;
        localStorage.setItem(`${profileKey}_mmoriePoints`, mmoriePoints);
        elements.mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
        elements.mmoriePointsEl.classList.add("points-updated");
        setTimeout(() => elements.mmoriePointsEl.classList.remove("points-updated"), 500);
        console.log("Awarded 500 mmoriePoints for MetaMask donation, new balance:",