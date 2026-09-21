"use strict";

/* =========================================================
   FIREBASE CONFIG — SpaceBots Ultra
   =========================================================
   Fill in the missing values below from the Firebase console:

   1. Go to https://console.firebase.google.com/
   2. Open project "SpaceBots Ultra" (spacebots-ultra)
   3. Click the gear icon -> "Project settings"
   4. Scroll to "Your apps". If there is no Web app yet,
      click the "</>" (Web) icon and register an app
      (nickname can be anything, e.g. "spacebots-web").
   5. Firebase shows a firebaseConfig object — copy the
      apiKey, appId, messagingSenderId and storageBucket
      values into the object below.

   The values below (projectId, authDomain, messagingSenderId)
   are already filled in based on your project info.
   apiKey and appId are UNIQUE per web app and must be copied
   from your Firebase console — they are not secret in the
   sense of a password, but they DO need to match your project.
========================================================= */

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY_HERE",
  authDomain: "spacebots-ultra.firebaseapp.com",
  projectId: "spacebots-ultra",
  storageBucket: "spacebots-ultra.appspot.com",
  messagingSenderId: "425940718755",
  appId: "PASTE_YOUR_APP_ID_HERE"
};

window.firebaseConfig = firebaseConfig;
