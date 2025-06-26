window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded, initializing profile page");

  const urlParams = new URLSearchParams(window.location.search);
  const profileKey = urlParams.get('profile') || localStorage.getItem("lastProfileKey");
  if (!profileKey) {
    console.error("No profile key found, redirecting to create-profile.html");
    window.location.href = "create-profile.html";
    return;
  }

  let profileData = localStorage.getItem(profileKey);
  if (!profileData) {
    console.error("No profile data found for key:", profileKey, "redirecting to create-profile.html");
    window.location.href = "create-profile.html";
    return;
  }

  let profile;
  try {
    profile = JSON.parse(profileData);
    console.log("Profile Data:", profile);
  } catch (error) {
    console.error("Failed to parse profile data:", error);
    alert("Invalid profile data. Please create a new profile.");
    window.location.href = "create-profile.html";
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

  const nameEl = document.getElementById("char-name");
  const guildEl = document.getElementById("char-guild");
  const mmoEl = document.getElementById("char-mmo");
  const screenshotEl = document.getElementById("char-screenshot");
  const createdDateEl = document.getElementById("created-date-text");
  const counterEl = document.getElementById("memory-counter");
  const visitCounterEl = document.getElementById("visit-counter");
  const mmoriePointsEl = document.getElementById("mmorie-points");
  const achievementsEl = document.getElementById("achievements");
  const bgVideoEl = document.getElementById("bgVideo");
  const changeBgBtn = document.getElementById("change-background-btn");
  const changeBorderBtn = document.getElementById("change-border-btn");
  const changeBoxBgBtn = document.getElementById("change-box-bg-btn");
  const resetCustomizationsBtn = document.getElementById("reset-customizations-btn");
  const editProfileBtn = document.getElementById("edit-profile-btn");
  const donateBtn = document.getElementById("donate-btn");
  const donationModal = document.getElementById("donation-modal");
  const cancelDonationBtn = document.getElementById("cancel-donation-btn");
  const confirmDonationBtn = document.getElementById("confirm-donation-btn");
  const donationInput = document.getElementById("donation-input");
  const donationNoteEl = document.getElementById("donation-note");
  const donationTypes = document.getElementsByName("donation-type");
  const prevScreenshotBtn = document.getElementById("prev-screenshot");
  const nextScreenshotBtn = document.getElementById("next-screenshot");

  if (nameEl) {
    nameEl.textContent = profile.name || "Unknown Character";
    console.log("Name set to:", nameEl.textContent);
  }
  if (guildEl) {
    guildEl.textContent = profile.guild || "No Guild";
    console.log("Guild set to:", guildEl.textContent);
  }
  if (mmoEl) mmoEl.textContent = `From: ${profile.mmo || "Unknown MMO"}`;
  if (createdDateEl) {
    createdDateEl.textContent = new Date(profile.registeredAt).toLocaleString() || "6/2/2025, 09:00 AM";
    console.log("Created date set to:", createdDateEl.textContent);
  }

  let currentScreenshotIndex = 0;
  if (screenshotEl && profile.screenshots && profile.screenshots.length > 0) {
    function updateScreenshot() {
      const currentScreenshot = profile.screenshots[currentScreenshotIndex];
      screenshotEl.src = currentScreenshot.src || "default-screenshot.png";
      screenshotEl.alt = `Screenshot of ${profile.name || "Unknown Character"}`;
      screenshotEl.style.transform = `translate(${currentScreenshot.positionX || 0}px, ${currentScreenshot.positionY || 0}px) scale(${currentScreenshot.scale || 1})`;
      console.log("Screenshot set:", screenshotEl.src, "Index:", currentScreenshotIndex);
    }

    prevScreenshotBtn.addEventListener("click", () => {
      currentScreenshotIndex = (currentScreenshotIndex - 1 + profile.screenshots.length) % profile.screenshots.length;
      updateScreenshot();
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
    });

    nextScreenshotBtn.addEventListener("click", () => {
      currentScreenshotIndex = (currentScreenshotIndex + 1) % profile.screenshots.length;
      updateScreenshot();
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
    });

    updateScreenshot();
  } else if (screenshotEl && profile.screenshot) {
    // Fallback for single screenshot
    profile.screenshots = [{ src: profile.screenshot, positionX: profile.positionX, positionY: profile.positionY, scale: profile.scale }];
    function updateScreenshot() {
      const currentScreenshot = profile.screenshots[currentScreenshotIndex];
      screenshotEl.src = currentScreenshot.src || "default-screenshot.png";
      screenshotEl.alt = `Screenshot of ${profile.name || "Unknown Character"}`;
      screenshotEl.style.transform = `translate(${currentScreenshot.positionX || 0}px, ${currentScreenshot.positionY || 0}px) scale(${currentScreenshot.scale || 1})`;
      console.log("Screenshot set:", screenshotEl.src, "Index:", currentScreenshotIndex);
    }

    prevScreenshotBtn.addEventListener("click", () => {
      currentScreenshotIndex = (currentScreenshotIndex - 1 + profile.screenshots.length) % profile.screenshots.length;
      updateScreenshot();
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
    });

    nextScreenshotBtn.addEventListener("click", () => {
      currentScreenshotIndex = (currentScreenshotIndex + 1) % profile.screenshots.length;
      updateScreenshot();
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
    });

    updateScreenshot();
  } else {
    screenshotEl.src = "default-screenshot.png";
    screenshotEl.alt = "No Screenshot Available";
    console.error("No screenshots found in profile data");
  }

  if (counterEl && profile.registeredAt) {
    try {
      const registered = new Date(profile.registeredAt);
      const now = new Date();
      if (isNaN(registered.getTime())) {
        console.error("Invalid registeredAt date:", profile.registeredAt);
        counterEl.textContent = "Memory Age: Invalid Date";
      } else {
        const days = Math.floor((now - registered) / (1000 * 60 * 60 * 24));
        counterEl.textContent = `Memory Age: ${days} days`;
        console.log("Memory Age set to:", days, "days, registeredAt:", profile.registeredAt);
      }
    } catch (error) {
      console.error("Error calculating memory age:", error);
      counterEl.textContent = "Memory Age: Error";
    }
  }
  if (visitCounterEl) {
    visitCounterEl.textContent = `Profile Visits: ${visitCount}`;
    console.log("Visit counter set to:", visitCount);
  }
  if (mmoriePointsEl) {
    mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
    console.log("mmoriePoints set to:", mmoriePoints);
  }

  if (achievementsEl) {
    achievementsEl.innerHTML = "";
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
        achievementsEl.appendChild(img);
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

    // Add Corshark-Admin.png only if profile.name is "Corshark"
    if (profile.name === "Corshark" && !achievements.includes("admin")) {
      const adminAch = achievementData.find(a => a.visits === "admin");
      if (adminAch) {
        const img = document.createElement("img");
        img.src = adminAch.image;
        img.alt = adminAch.alt;
        img.setAttribute("data-tooltip", adminAch.tooltip);
        achievementsEl.appendChild(img);
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

  if (changeBgBtn && bgVideoEl) {
    const backgrounds = ["videos/profile.mp4", "videos/profile1.mp4", "videos/profile2.mp4", "videos/profile3.mp4", "videos/profile4.mp4"];
    let currentBgIndex = parseInt(localStorage.getItem(`${profileKey}_currentBgIndex`) || "0");

    bgVideoEl.src = backgrounds[currentBgIndex];
    bgVideoEl.load();
    bgVideoEl.play();
    console.log("Loaded background:", backgrounds[currentBgIndex]);

    changeBgBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Change Background button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "100 mmoriePoints to change background!";
      document.body.appendChild(tooltip);

      const rect = changeBgBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Button tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      changeBgBtn._tooltip = tooltip;
    });

    changeBgBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Change Background button: hiding tooltip");
      if (changeBgBtn._tooltip) {
        changeBgBtn._tooltip.remove();
        changeBgBtn._tooltip = null;
      }
    });

    changeBgBtn.addEventListener("click", () => {
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
        mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
        mmoriePointsEl.classList.add("points-updated");
        setTimeout(() => mmoriePointsEl.classList.remove("points-updated"), 500);
        console.log("Deducted 100 mmoriePoints, new balance:", mmoriePoints);

        currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
        const newVideoSrc = backgrounds[currentBgIndex];
        bgVideoEl.src = newVideoSrc;
        bgVideoEl.load();
        bgVideoEl.play();
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

  if (changeBorderBtn) {
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

    changeBorderBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Change Border button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "100 mmoriePoints to change borders!";
      document.body.appendChild(tooltip);

      const rect = changeBorderBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Border tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      changeBorderBtn._tooltip = tooltip;
    });

    changeBorderBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Change Border button: hiding tooltip");
      if (changeBorderBtn._tooltip) {
        changeBorderBtn._tooltip.remove();
        changeBorderBtn._tooltip = null;
      }
    });

    changeBorderBtn.addEventListener("click", () => {
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
        mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
        mmoriePointsEl.classList.add("points-updated");
        setTimeout(() => mmoriePointsEl.classList.remove("points-updated"), 500);
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

  if (changeBoxBgBtn) {
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

    changeBoxBgBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Change Box Background button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "100 mmoriePoints to change box backgrounds!";
      document.body.appendChild(tooltip);

      const rect = changeBoxBgBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Box Bg tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      changeBoxBgBtn._tooltip = tooltip;
    });

    changeBoxBgBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Change Box Background button: hiding tooltip");
      if (changeBoxBgBtn._tooltip) {
        changeBoxBgBtn._tooltip.remove();
        changeBoxBgBtn._tooltip = null;
      }
    });

    changeBoxBgBtn.addEventListener("click", () => {
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
        mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
        mmoriePointsEl.classList.add("points-updated");
        setTimeout(() => mmoriePointsEl.classList.remove("points-updated"), 500);
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

  if (resetCustomizationsBtn) {
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

    resetCustomizationsBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Reset Customizations button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "50 mmoriePoints to reset borders, background, and box backgrounds!";
      document.body.appendChild(tooltip);

      const rect = resetCustomizationsBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Reset tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      resetCustomizationsBtn._tooltip = tooltip;
    });

    resetCustomizationsBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Reset Customizations button: hiding tooltip");
      if (resetCustomizationsBtn._tooltip) {
        resetCustomizationsBtn._tooltip.remove();
        resetCustomizationsBtn._tooltip = null;
      }
    });

    resetCustomizationsBtn.addEventListener("click", () => {
      if (mmoriePoints >= 50) {
        const clickSound = document.getElementById("click-sound");
        if (clickSound) {
          try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
        }
        mmoriePoints -= 50;
        localStorage.setItem(`${profileKey}_mmoriePoints`, mmoriePoints);
        mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
        mmoriePointsEl.classList.add("points-updated");
        setTimeout(() => mmoriePointsEl.classList.remove("points-updated"), 500);
        console.log("Deducted 50 mmoriePoints, new balance:", mmoriePoints);

        bgVideoEl.src = defaultBackground;
        bgVideoEl.load();
        bgVideoEl.play();
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

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      console.log("Edit Profile clicked, redirecting to create-profile.html");
      window.location.href = "create-profile.html?edit=true&profile=" + profileKey;
    });

    editProfileBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Edit Profile button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "Edit your character’s name, guild, MMO, or screenshot!";
      document.body.appendChild(tooltip);

      const rect = editProfileBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Edit tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      editProfileBtn._tooltip = tooltip;
    });

    editProfileBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Edit Profile button: hiding tooltip");
      if (editProfileBtn._tooltip) {
        editProfileBtn._tooltip.remove();
        editProfileBtn._tooltip = null;
      }
    });
  } else {
    console.error("Edit Profile button not found");
  }

  if (donateBtn && donationModal) {
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
        mmoriePointsEl.textContent = `mmPoints: ${mmoriePoints}`;
        mmoriePointsEl.classList.add("points-updated");
        setTimeout(() => mmoriePointsEl.classList.remove("points-updated"), 500);
        console.log("Awarded 500 mmoriePoints for MetaMask donation, new balance:", mmoriePoints);

        localStorage.setItem("isDonator", "true");
        if (!achievements.includes("donator")) {
          achievements.push("donator");
          localStorage.setItem(`${profileKey}_achievements`, JSON.stringify(achievements));
          console.log("Added donator achievement for MetaMask donation");
        }
        if (!achievements.includes("metamask-donator")) {
          achievements.push("metamask-donator");
          localStorage.setItem(`${profileKey}_achievements`, JSON.stringify(achievements));
          console.log("Added metamask-donator achievement for MetaMask donation");
        }

        achievementsEl.innerHTML = "";
        achievements.forEach(achievement => {
          const ach = achievementData.find(a => a.visits.toString() === achievement);
          if (ach) {
            const img = document.createElement("img");
            img.src = ach.image;
            img.alt = ach.alt;
            img.setAttribute("data-tooltip", ach.tooltip);
            achievementsEl.appendChild(img);

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
        console.log("Refreshed achievements with new coins");

        donationModal.style.display = "none";
      } catch (error) {
        console.error("Donation transaction failed:", error);
        alert("Donation failed. Please check your MetaMask wallet and try again.");
      }
    }

    donateBtn.addEventListener("click", () => {
      console.log("Donate clicked");
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
        console.log("Donate button clicked, click sound played");
      }

      donationModal.style.display = "block";
      const selectedType = document.querySelector('input[name="donation-type"]:checked').value;
      if (selectedType === "steam-trade") {
        donationInput.style.display = "none";
        donationNoteEl.style.display = "block";
        donationNoteEl.textContent = `Please include your mmories.com username: ${profile.name || "Unknown Character"}`;
      } else if (selectedType === "metamask") {
        donationInput.style.display = "block";
        donationNoteEl.style.display = "block";
        donationNoteEl.textContent = `Enter amount and include your mmories.com username: ${profile.name || "Unknown Character"} in the transaction note.`;
      }

      const donateSound = document.getElementById("donate-sound");
      if (donateSound) {
        try { donateSound.currentTime = 0; donateSound.play(); } catch (e) { console.warn("Failed to play donate sound:", e); }
        console.log("Donation modal opened, donate sound played");
      }
    });

    donationTypes.forEach(type => {
      type.addEventListener("change", () => {
        donationInput.style.display = "none";
        donationNoteEl.style.display = "block";
        if (type.value === "steam-trade") {
          donationNoteEl.textContent = `Please include your mmories.com username: ${profile.name || "Unknown Character"}`;
        } else if (type.value === "metamask") {
          donationInput.style.display = "block";
          donationNoteEl.textContent = `Enter amount and include your mmories.com username: ${profile.name || "Unknown Character"} in the transaction note.`;
        }
        console.log("Donation type changed to:", type.value);
      });
    });

    cancelDonationBtn.addEventListener("click", () => {
      console.log("Cancel donation clicked");
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
      donationModal.style.display = "none";
    });

    confirmDonationBtn.addEventListener("click", async () => {
      console.log("Confirm donation clicked");
      const clickSound = document.getElementById("click-sound");
      if (clickSound) {
        try { clickSound.currentTime = 0; clickSound.play(); } catch (e) { console.warn("Failed to play click sound:", e); }
      }
      const selectedType = document.querySelector('input[name="donation-type"]:checked').value;
      if (selectedType === "steam-trade") {
        window.open(steamTradeUrl, "_blank");
        alert(`Please include your mmories.com username: ${profile.name || "Unknown Character"}`);
        donationModal.style.display = "none";
        console.log("Opened Steam Trade link:", steamTradeUrl);
      } else if (selectedType === "metamask") {
        const walletAddress = await connectMetaMask();
        if (walletAddress) {
          const amount = parseFloat(document.getElementById("donation-input").value) || 0.01;
          donationAmount = amount.toString();
          await sendDonation(walletAddress);
        }
      }
    });

    donateBtn.addEventListener("mouseenter", (e) => {
      console.log("Hover on Donate button: showing tooltip");
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.textContent = "Donate via Steam Trade or MetaMask to earn points and a coin!";
      document.body.appendChild(tooltip);

      const rect = donateBtn.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top + rect.height / 2}px`;
      tooltip.style.transform = "translateY(-50%)";
      tooltip.style.display = "block";

      console.log(`Donate tooltip positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

      donateBtn._tooltip = tooltip;
    });

    donateBtn.addEventListener("mouseleave", () => {
      console.log("Mouse leave on Donate button: hiding tooltip");
      if (donateBtn._tooltip) {
        donateBtn._tooltip.remove();
        donateBtn._tooltip = null;
      }
    });
  } else {
    console.error("Donate button or donation modal not found");
  }

  const counters = [counterEl, visitCounterEl, mmoriePointsEl];
  counters.forEach(counter => {
    if (counter) {
      counter.addEventListener("mouseenter", (e) => {
        console.log(`Hover on ${counter.id}: showing tooltip`);
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.textContent = counter.getAttribute("data-tooltip");
        document.body.appendChild(tooltip);

        const rect = counter.getBoundingClientRect();
        tooltip.style.left = `${rect.right + 10}px`;
        tooltip.style.top = `${rect.top + rect.height / 2}px`;
        tooltip.style.transform = "translateY(-50%)";
        tooltip.style.display = "block";

        console.log(`Tooltip for ${counter.id} positioned at left: ${tooltip.style.left}, top: ${tooltip.style.top}`);

        counter._tooltip = tooltip;
      });

      counter.addEventListener("mouseleave", () => {
        console.log(`Mouse leave on ${counter.id}: hiding tooltip`);
        if (counter._tooltip) {
          counter._tooltip.remove();
          counter._tooltip = null;
        }
      });
    }
  });
});