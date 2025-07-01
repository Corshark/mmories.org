// save-profile.js
import { db } from './firebase-config.js';
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const saveBtn = document.getElementById("save-profile-btn"); // Make sure this button exists

  saveBtn?.addEventListener("click", async () => {
    const name = document.getElementById("char-name").value;
    const guild = document.getElementById("guild-name").value;
    const game = document.getElementById("game-name").value;
    const screenshots = Array.from(document.querySelectorAll(".screenshot-input"))
      .map(input => input.value)
      .filter(url => url.trim() !== "");

    const profileData = {
      name,
      guild,
      game,
      screenshots,
      createdAt: Timestamp.now()
    };

    try {
      const docRef = await addDoc(collection(db, "profiles"), profileData);
      alert("Profile saved! ID: " + docRef.id);
      console.log("Saved profile with ID:", docRef.id);
    } catch (e) {
      console.error("Error saving profile:", e);
      alert("Failed to save profile.");
    }
  });
});
