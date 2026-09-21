"use strict";

/* =========================================================
   SPACEBOTS ULTRA — CLOUD (Firebase Auth + Firestore)
   =========================================================
   This file handles:
     - Google Sign-In
     - Reading/writing the player's save to Firestore
       (collection "users", one document per uid)
     - A public leaderboard (collection "leaderboard",
       one small public document per uid)

   It talks to app.js through the shared page-global
   variables `save`, `saveGame` and `renderMenu` (they are
   declared with let/const in app.js, which — because both
   files are loaded as plain classic <script> tags, not
   modules — share the same global scope as this file).
========================================================= */

let cloudReady = false;
let auth = null;
let db = null;
let provider = null;

try {

  if (
    !window.firebaseConfig ||
    window.firebaseConfig.apiKey === "PASTE_YOUR_API_KEY_HERE"
  ) {
    console.warn(
      "[SpaceBots] firebase-config.js is not filled in yet — " +
      "Google login and cloud save are disabled until you paste " +
      "your real Firebase config values."
    );
  } else {

    firebase.initializeApp(window.firebaseConfig);

    auth = firebase.auth();
    db = firebase.firestore();
    provider = new firebase.auth.GoogleAuthProvider();

    cloudReady = true;
  }

} catch (err) {
  console.error("[SpaceBots] Firebase init failed:", err);
}


/* =========================================================
   DOM
========================================================= */

const googleLoginBtn = document.getElementById("googleLoginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const userInfo = document.getElementById("userInfo");
const userPhoto = document.getElementById("userPhoto");
const userName = document.getElementById("userName");
const cloudStatusEl = document.getElementById("cloudStatus");

const leaderboardList = document.getElementById("leaderboardList");
const leaderboardStatus = document.getElementById("leaderboardStatus");
const leaderboardLoggedOut = document.getElementById("leaderboardLoggedOut");


function setCloudStatus(text) {
  if (cloudStatusEl) {
    cloudStatusEl.textContent = text;
  }
}


/* =========================================================
   AUTH UI
========================================================= */

function updateAccountUI(user) {

  if (user) {

    if (googleLoginBtn) googleLoginBtn.style.display = "none";
    if (userInfo) userInfo.style.display = "flex";

    if (userPhoto) userPhoto.src = user.photoURL || "";
    if (userName) userName.textContent = user.displayName || "Piloot";

    if (leaderboardLoggedOut) leaderboardLoggedOut.style.display = "none";

  } else {

    if (googleLoginBtn) googleLoginBtn.style.display = "flex";
    if (userInfo) userInfo.style.display = "none";

    if (leaderboardLoggedOut) leaderboardLoggedOut.style.display = "block";
  }
}


if (googleLoginBtn) {

  googleLoginBtn.addEventListener("click", () => {

    if (!cloudReady) {
      alert(
        "Cloud-opslag is nog niet ingesteld door de ontwikkelaar " +
        "(firebase-config.js). Lokale voortgang werkt gewoon."
      );
      return;
    }

    setCloudStatus("inloggen...");

    auth.signInWithPopup(provider).catch(err => {
      console.error("[SpaceBots] Google sign-in failed:", err);
      setCloudStatus("inloggen mislukt");
      alert("Inloggen mislukt: " + err.message);
    });

  });
}


if (logoutBtn) {

  logoutBtn.addEventListener("click", () => {
    if (auth) auth.signOut();
  });
}


if (cloudReady) {

  auth.onAuthStateChanged(user => {

    updateAccountUI(user);

    if (user) {
      pullAndMergeSave(user);
    }

  });
}


/* =========================================================
   MERGE CLOUD SAVE INTO LOCAL SAVE
========================================================= */

function pullAndMergeSave(user) {

  setCloudStatus("synchroniseren...");

  db.collection("users").doc(user.uid).get()
    .then(doc => {

      if (doc.exists) {
        mergeCloudDataIntoLocalSave(doc.data());
      }

      // Whatever we end up with locally becomes the new
      // source of truth in the cloud too.
      saveGame();
      renderMenu();

      setCloudStatus("☁ synced");

    })
    .catch(err => {
      console.error("[SpaceBots] Could not load cloud save:", err);
      setCloudStatus("⚠ offline");
    });
}


function mergeCloudDataIntoLocalSave(cloudData) {

  if (!cloudData || typeof save === "undefined") return;

  const merged = structuredClone(save);

  const maxNumberFields = [
    "highscore", "bestWave", "totalKills",
    "credits", "pickups", "bossKills"
  ];

  maxNumberFields.forEach(field => {
    if (typeof cloudData[field] === "number") {
      merged[field] = Math.max(merged[field] || 0, cloudData[field]);
    }
  });

  const unionArrayFields = [
    "unlockedWeapons", "unlockedMaps", "unlockedSkins", "achievements"
  ];

  unionArrayFields.forEach(field => {
    if (Array.isArray(cloudData[field])) {
      merged[field] = Array.from(
        new Set([...(merged[field] || []), ...cloudData[field]])
      );
    }
  });

  if (cloudData.upgrades && merged.upgrades) {
    Object.keys(merged.upgrades).forEach(key => {
      if (typeof cloudData.upgrades[key] === "number") {
        merged.upgrades[key] = Math.max(
          merged.upgrades[key],
          cloudData.upgrades[key]
        );
      }
    });
  }

  if (cloudData.settings) {
    merged.settings = { ...merged.settings, ...cloudData.settings };
  }

  if (typeof cloudData.selectedWeapon === "string") {
    merged.selectedWeapon = cloudData.selectedWeapon;
  }

  if (typeof cloudData.selectedMap === "string") {
    merged.selectedMap = cloudData.selectedMap;
  }

  if (typeof cloudData.selectedSkin === "string") {
    merged.selectedSkin = cloudData.selectedSkin;
  }

  save = merged;
}


/* =========================================================
   PUSH LOCAL SAVE TO THE CLOUD (debounced)
========================================================= */

let pushTimer = null;

function pushSaveToCloud(saveSnapshot) {

  if (!cloudReady || !auth || !auth.currentUser) return;

  const user = auth.currentUser;

  setCloudStatus("opslaan...");

  clearTimeout(pushTimer);

  pushTimer = setTimeout(() => {

    const data = structuredClone(saveSnapshot);

    const userPayload = {
      ...data,
      displayName: user.displayName || "Piloot",
      photoURL: user.photoURL || "",
      email: user.email || "",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("users").doc(user.uid).set(userPayload, { merge: true })
      .then(() => {

        setCloudStatus("☁ synced");

        return db.collection("leaderboard").doc(user.uid).set({
          displayName: user.displayName || "Piloot",
          photoURL: user.photoURL || "",
          highscore: data.highscore || 0,
          bestWave: data.bestWave || 0,
          totalKills: data.totalKills || 0,
          bossKills: data.bossKills || 0,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

      })
      .catch(err => {
        console.error("[SpaceBots] Cloud save failed:", err);
        setCloudStatus("⚠ opslaan mislukt");
      });

  }, 800);
}


/* =========================================================
   LEADERBOARD
========================================================= */

function loadLeaderboard() {

  if (!leaderboardList) return;

  if (!cloudReady) {
    leaderboardStatus.style.display = "block";
    leaderboardStatus.textContent =
      "Ranglijst is niet beschikbaar (cloud niet geconfigureerd).";
    leaderboardList.innerHTML = "";
    return;
  }

  leaderboardStatus.style.display = "block";
  leaderboardStatus.textContent = "Ranglijst wordt geladen...";
  leaderboardList.innerHTML = "";

  db.collection("leaderboard")
    .orderBy("highscore", "desc")
    .limit(50)
    .get()
    .then(snap => {

      leaderboardStatus.style.display = "none";

      if (snap.empty) {
        leaderboardStatus.style.display = "block";
        leaderboardStatus.textContent =
          "Nog niemand op de ranglijst. Wees de eerste!";
        return;
      }

      let rank = 0;

      snap.forEach(doc => {

        rank++;

        const d = doc.data();

        const row = document.createElement("div");
        row.className = "leaderboard-row";

        row.innerHTML = `
          <span class="lb-rank">#${rank}</span>
          <img class="lb-photo" src="${d.photoURL || ""}" alt="">
          <span class="lb-name">${escapeHtml(d.displayName || "Piloot")}</span>
          <span class="lb-stat"><small>SCORE</small>${d.highscore || 0}</span>
          <span class="lb-stat"><small>WAVE</small>${d.bestWave || 0}</span>
          <span class="lb-stat"><small>KILLS</small>${d.totalKills || 0}</span>
        `;

        leaderboardList.appendChild(row);

      });

    })
    .catch(err => {

      console.error("[SpaceBots] Leaderboard load failed:", err);

      leaderboardStatus.style.display = "block";
      leaderboardStatus.textContent =
        "Kon ranglijst niet laden. Probeer het later opnieuw.";

    });
}


function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}


/* =========================================================
   PUBLIC API (used by app.js)
========================================================= */

window.Cloud = {
  push: pushSaveToCloud,
  loadLeaderboard,
  isReady: () => cloudReady,
  isSignedIn: () => !!(auth && auth.currentUser)
};
