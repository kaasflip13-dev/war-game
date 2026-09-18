"use strict";

/* =========================================================
   SPACEBOTS ULTRA
   Browser shooter - geen bloed
========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const miniMap = document.getElementById("miniMap");
const miniCtx = miniMap.getContext("2d");

const W = 1280;
const H = 720;
const MAX_WAVE = 10;


/* =========================================================
   DATA
========================================================= */

const weapons = [
  {
    id: "blaster",
    name: "fist",
    icon: "✊",
    damage: 18,
    fireRate: 180,
    speed: 10,
    spread: 0,
    cost: 0
  },
  {
    id: "triple",
    name: "TRIPLE SHOT",
    icon: "🔫",
    damage: 11,
    fireRate: 560,
    speed: 9,
    spread: .18,
    cost: 120
  },
  {
    id: "plasma",
    name: "PLASMA",
    icon: "⚡",
    damage: 42,
    fireRate: 520,
    speed: 7,
    spread: 0,
    cost: 250
  },
  {
    id: "laser",
    name: "LASER",
    icon: "🔴",
    damage: 24,
    fireRate: 90,
    speed: 15,
    spread: 0,
    cost: 400
  },
  {
    id: "nova",
    name: "NOVA",
    icon: "💥",
    damage: 16,
    fireRate: 650,
    speed: 6,
    spread: .45,
    cost: 600
  },
  {
    id: "void",
    name: "VOID CANNON",
    icon: "🌀",
    damage: 80,
    fireRate: 900,
    speed: 5,
    spread: 0,
    cost: 1000
  }
];


const maps = [
  {
    id: "neon",
    name: "NEON GRID",
    icon: "🌌",
    unlock: 0,
    description: "Een futuristische stad vol energie."
  },
  {
    id: "moon",
    name: "CRIMSON MOON",
    icon: "🌑",
    unlock: 3,
    description: "Een donkere maan met gevaarlijke robots."
  },
  {
    id: "temple",
    name: "VOID TEMPLE",
    icon: "🏛️",
    unlock: 5,
    description: "Een mysterieuze tempel in de ruimte."
  },
  {
    id: "toxic",
    name: "TOXIC PLANET",
    icon: "☢️",
    unlock: 7,
    description: "Een groene planeet met sterke machines."
  },
  {
    id: "forge",
    name: "STAR FORGE",
    icon: "⭐",
    unlock: 10,
    description: "De laatste arena."
  }
];


const robotTypes = [
  {
    name: "SCOUT",
    hp: 35,
    speed: 1.8,
    damage: 8,
    size: 18,
    color: "#39ff9a",
    score: 10,
    shoot: 150
  },
  {
    name: "DRONE",
    hp: 45,
    speed: 1.4,
    damage: 10,
    size: 20,
    color: "#36d9ff",
    score: 15,
    shoot: 130
  },
  {
    name: "HUNTER",
    hp: 70,
    speed: 1.25,
    damage: 12,
    size: 23,
    color: "#ff4268",
    score: 20,
    shoot: 110
  },
  {
    name: "BRUTE",
    hp: 150,
    speed: .65,
    damage: 20,
    size: 35,
    color: "#ffad42",
    score: 35,
    shoot: 180
  },
  {
    name: "SNIPER",
    hp: 60,
    speed: .7,
    damage: 25,
    size: 22,
    color: "#a855ff",
    score: 40,
    shoot: 240
  },
  {
    name: "DASHER",
    hp: 75,
    speed: 2.4,
    damage: 18,
    size: 22,
    color: "#f97316",
    score: 30,
    shoot: 160
  },
  {
    name: "TANK",
    hp: 300,
    speed: .4,
    damage: 30,
    size: 45,
    color: "#64748b",
    score: 70,
    shoot: 210
  },
  {
    name: "SPLITTER",
    hp: 100,
    speed: 1,
    damage: 15,
    size: 28,
    color: "#22c55e",
    score: 45,
    shoot: 150
  },
  {
    name: "PHANTOM",
    hp: 90,
    speed: 1.7,
    damage: 20,
    size: 25,
    color: "#c084fc",
    score: 50,
    shoot: 130
  },
  {
    name: "MINER",
    hp: 130,
    speed: .8,
    damage: 35,
    size: 27,
    color: "#facc15",
    score: 55,
    shoot: 200
  },
  {
    name: "GUARDIAN",
    hp: 240,
    speed: .55,
    damage: 25,
    size: 40,
    color: "#38bdf8",
    score: 80,
    shoot: 130
  },
  {
    name: "ELITE",
    hp: 400,
    speed: .9,
    damage: 35,
    size: 45,
    color: "#fb7185",
    score: 120,
    shoot: 100
  }
];


const bosses = [
  {
    name: "IRON TITAN",
    hp: 2500,
    speed: .45,
    size: 80,
    damage: 35,
    color: "#ff4268"
  },
  {
    name: "VOID CORE",
    hp: 4500,
    speed: .6,
    size: 95,
    damage: 45,
    color: "#a855ff"
  },
  {
    name: "STAR DESTROYER",
    hp: 7000,
    speed: .75,
    size: 115,
    damage: 55,
    color: "#36d9ff"
  }
];


const upgrades = [
  {
    id: "damage",
    name: "CORE DAMAGE",
    icon: "⚔️",
    description: "+10% wapenschade"
  },
  {
    id: "health",
    name: "ARMOR PLATING",
    icon: "🛡️",
    description: "+20 maximale HP"
  },
  {
    id: "shield",
    name: "SHIELD MATRIX",
    icon: "🔵",
    description: "+20 maximale shield"
  },
  {
    id: "energy",
    name: "ENERGY CELL",
    icon: "⚡",
    description: "+20 maximale energie"
  },
  {
    id: "speed",
    name: "THRUSTERS",
    icon: "🚀",
    description: "+8% snelheid"
  },
  {
    id: "cooldown",
    name: "RAPID CORE",
    icon: "🔥",
    description: "Sneller schieten"
  }
];


const achievementData = [
  {
    id: "first",
    name: "FIRST CONTACT",
    icon: "🤖",
    description: "Versla je eerste robot."
  },
  {
    id: "hunter",
    name: "ROBOT HUNTER",
    icon: "🎯",
    description: "Versla 50 robots."
  },
  {
    id: "combo",
    name: "COMBO MASTER",
    icon: "🔥",
    description: "Bereik combo x10."
  },
  {
    id: "boss",
    name: "BOSS BREAKER",
    icon: "👑",
    description: "Versla een boss."
  },
  {
    id: "survivor",
    name: "SURVIVOR",
    icon: "❤️",
    description: "Bereik wave 5."
  },
  {
    id: "ultra",
    name: "ULTRA PILOT",
    icon: "⭐",
    description: "Bereik wave 10."
  },
  {
    id: "energy",
    name: "ENERGY TYCOON",
    icon: "⚡",
    description: "Verzamel 20 pickups."
  },
  {
    id: "arsenal",
    name: "FULL ARSENAL",
    icon: "🔫",
    description: "Ontgrendel alle wapens."
  },
  {
    id: "explorer",
    name: "EXPLORER",
    icon: "🌌",
    description: "Speel op alle maps."
  }
];


/* =========================================================
   SAVE
========================================================= */

const defaultSave = {
  highscore: 0,
  bestWave: 0,
  totalKills: 0,
  credits: 0,
  pickups: 0,
  bossKills: 0,

  selectedWeapon: "blaster",
  selectedMap: "neon",

  unlockedWeapons: ["blaster"],

  unlockedMaps: ["neon"],

  upgrades: {
    damage: 0,
    health: 0,
    shield: 0,
    energy: 0,
    speed: 0,
    cooldown: 0
  },

  achievements: [],

  settings: {
    sound: true,
    particles: true,
    shake: true,
    autoFire: false,
    difficulty: "normal"
  }
};


let save = loadSave();


function loadSave() {

  try {

    const stored = localStorage.getItem("spacebotsUltraSave");

    if (!stored) {
      return structuredClone(defaultSave);
    }

    const data = JSON.parse(stored);

    return {
      ...structuredClone(defaultSave),
      ...data,
      upgrades: {
        ...defaultSave.upgrades,
        ...(data.upgrades || {})
      },
      settings: {
        ...defaultSave.settings,
        ...(data.settings || {})
      }
    };

  } catch {

    return structuredClone(defaultSave);
  }
}


function saveGame() {
  localStorage.setItem(
    "spacebotsUltraSave",
    JSON.stringify(save)
  );
}


/* =========================================================
   STATE
========================================================= */

const state = {

  running: false,
  paused: false,

  score: 0,
  wave: 1,
  kills: 0,

  combo: 1,
  comboTimer: 0,

  startTime: 0,

  waveKills: 0,
  waveTarget: 10,

  bossKills: 0,

  player: null,

  bullets: [],
  enemyBullets: [],
  robots: [],
  particles: [],
  pickups: [],

  boss: null,

  mouse: {
    x: W / 2,
    y: H / 2,
    down: false
  },

  keys: {},

  lastTime: 0,
  shotTimer: 0,

  shake: 0,

  map: null,
  weapon: null
};


/* =========================================================
   DOM
========================================================= */

const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");

const weaponCards = document.getElementById("weaponCards");
const upgradeCards = document.getElementById("upgradeCards");
const mapCards = document.getElementById("mapCards");
const achievementCards = document.getElementById("achievementCards");


/* =========================================================
   MENU
========================================================= */

function showScreen(id) {

  document.querySelectorAll(".screen, .subscreen, .game-screen")
    .forEach(el => {
      el.style.display = "none";
    });

  const target = document.getElementById(id);

  if (target) {
    target.style.display = "block";
  }

  if (id === "startScreen") {
    renderMenu();
  }
}


function renderMenu() {

  document.getElementById("menuHighscore").textContent =
    save.highscore;

  renderWeapons();
  renderUpgrades();
  renderMaps();
  renderAchievements();
  renderSettings();
}


document.querySelectorAll(".menu-card").forEach(button => {

  button.addEventListener("click", () => {

    showScreen(button.dataset.panel);

  });

});


document.querySelectorAll(".backBtn").forEach(button => {

  button.addEventListener("click", () => {

    showScreen("startScreen");

  });

});


/* =========================================================
   WEAPONS
========================================================= */

function renderWeapons() {

  weaponCards.innerHTML = "";

  weapons.forEach((weapon, index) => {

    const unlocked =
      save.unlockedWeapons.includes(weapon.id);

    const selected =
      save.selectedWeapon === weapon.id;

    const card = document.createElement("div");

    card.className =
      "card" +
      (selected ? " selected" : "") +
      (!unlocked ? " locked" : "");

    card.innerHTML = `
      <div class="card-icon">${weapon.icon}</div>

      <h3>${index + 1}. ${weapon.name}</h3>

      <p>
        Damage: ${weapon.damage}<br>
        Fire rate: ${weapon.fireRate}ms<br>
        Speed: ${weapon.speed}
      </p>

      <button>
        ${
          unlocked
            ? selected
              ? "GESELECTEERD"
              : "SELECTEER"
            : "KOOP - " + weapon.cost + " CREDITS"
        }
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => {

      if (unlocked) {

        save.selectedWeapon = weapon.id;
        saveGame();
        renderWeapons();

      } else {

        if (save.credits >= weapon.cost) {

          save.credits -= weapon.cost;

          save.unlockedWeapons.push(weapon.id);

          save.selectedWeapon = weapon.id;

          saveGame();

          renderWeapons();
          renderUpgrades();

        }

      }

    });

    weaponCards.appendChild(card);

  });
}


/* =========================================================
   UPGRADES
========================================================= */

function renderUpgrades() {

  document.getElementById("creditsValue").textContent =
    save.credits;

  upgradeCards.innerHTML = "";

  upgrades.forEach(upgrade => {

    const level = save.upgrades[upgrade.id];

    const price = 75 + level * 75;

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <div class="card-icon">${upgrade.icon}</div>

      <h3>${upgrade.name}</h3>

      <p>${upgrade.description}</p>

      <p>
        Level: <b>${level}</b>
      </p>

      <button>
        UPGRADE - ${price} C
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => {

      if (save.credits >= price) {

        save.credits -= price;

        save.upgrades[upgrade.id]++;

        saveGame();

        renderUpgrades();

      }

    });

    upgradeCards.appendChild(card);

  });
}


/* =========================================================
   MAPS
========================================================= */

function renderMaps() {

  mapCards.innerHTML = "";

  maps.forEach(map => {

    const unlocked =
      save.unlockedMaps.includes(map.id);

    const selected =
      save.selectedMap === map.id;

    const card = document.createElement("div");

    card.className =
      "card" +
      (selected ? " selected" : "") +
      (!unlocked ? " locked" : "");

    card.innerHTML = `
      <div class="card-icon">${map.icon}</div>

      <h3>${map.name}</h3>

      <p>${map.description}</p>

      <p>
        Unlock bij wave ${map.unlock}
      </p>

      <button>
        ${
          unlocked
            ? selected
              ? "GESELECTEERD"
              : "SELECTEER"
            : "VERGRENDELD"
        }
      </button>
    `;

    card.querySelector("button").addEventListener("click", () => {

      if (!unlocked) return;

      save.selectedMap = map.id;

      saveGame();

      renderMaps();

    });

    mapCards.appendChild(card);

  });
}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function renderAchievements() {

  const unlockedCount =
    save.achievements.length;

  document.getElementById("achievementCount").textContent =
    unlockedCount;

  document.getElementById("achievementKills").textContent =
    save.totalKills;

  document.getElementById("achievementWave").textContent =
    save.bestWave;

  achievementCards.innerHTML = "";

  achievementData.forEach(a => {

    const unlocked =
      save.achievements.includes(a.id);

    const card = document.createElement("div");

    card.className =
      "card achievement-card" +
      (unlocked ? " unlocked" : "");

    card.innerHTML = `
      <div class="card-icon">
        ${unlocked ? a.icon : "🔒"}
      </div>

      <h3>${a.name}</h3>

      <p>${a.description}</p>

      <div class="status">
        ${unlocked ? "✓ UNLOCKED" : "LOCKED"}
      </div>
    `;

    achievementCards.appendChild(card);

  });
}


/* =========================================================
   SETTINGS
========================================================= */

function renderSettings() {

  document.getElementById("soundToggle").checked =
    save.settings.sound;

  document.getElementById("particlesToggle").checked =
    save.settings.particles;

  document.getElementById("shakeToggle").checked =
    save.settings.shake;

  document.getElementById("autoFireToggle").checked =
    save.settings.autoFire;

  document.getElementById("difficultySelect").value =
    save.settings.difficulty;
}


document.getElementById("soundToggle").addEventListener("change", e => {

  save.settings.sound = e.target.checked;
  saveGame();

});


document.getElementById("particlesToggle").addEventListener("change", e => {

  save.settings.particles = e.target.checked;
  saveGame();

});


document.getElementById("shakeToggle").addEventListener("change", e => {

  save.settings.shake = e.target.checked;
  saveGame();

});


document.getElementById("autoFireToggle").addEventListener("change", e => {

  save.settings.autoFire = e.target.checked;
  saveGame();

});


document.getElementById("difficultySelect").addEventListener("change", e => {

  save.settings.difficulty = e.target.value;
  saveGame();

});


document.getElementById("resetSaveBtn").addEventListener("click", () => {

  if (!confirm("Alles resetten?")) return;

  save = structuredClone(defaultSave);

  saveGame();

  renderMenu();

});


/* =========================================================
   AUDIO
========================================================= */

let audioContext = null;


function audio() {

  if (!save.settings.sound) return;

  if (!audioContext) {

    audioContext =
      new (window.AudioContext ||
      window.webkitAudioContext)();

  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}


function beep(
  frequency = 440,
  duration = .05,
  type = "square"
) {

  if (!save.settings.sound) return;

  audio();

  if (!audioContext) return;

  const osc =
    audioContext.createOscillator();

  const gain =
    audioContext.createGain();

  osc.type = type;
  osc.frequency.value = frequency;

  gain.gain.setValueAtTime(
    .04,
    audioContext.currentTime
  );

  gain.gain.exponentialRampToValueAtTime(
    .001,
    audioContext.currentTime + duration
  );

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start();

  osc.stop(
    audioContext.currentTime + duration
  );
}


/* =========================================================
   GAME START
========================================================= */

function startGame() {

  audio();

  state.running = true;
  state.paused = false;

  state.score = 0;
  state.wave = 1;
  state.kills = 0;

  state.combo = 1;
  state.comboTimer = 0;

  state.waveKills = 0;
  state.waveTarget = 10;

  state.bullets = [];
  state.enemyBullets = [];
  state.robots = [];
  state.particles = [];
  state.pickups = [];

  state.boss = null;

  state.shake = 0;

  state.startTime = performance.now();

  state.map =
    maps.find(m => m.id === save.selectedMap) ||
    maps[0];

  state.weapon =
    weapons.find(w => w.id === save.selectedWeapon) ||
    weapons[0];


  const maxHp =
    100 +
    save.upgrades.health * 20;

  const maxShield =
    100 +
    save.upgrades.shield * 20;

  const maxEnergy =
    100 +
    save.upgrades.energy * 20;


  state.player = {

    x: W / 2,
    y: H / 2,

    radius: 18,

    hp: maxHp,
    maxHp,

    shield: maxShield,
    maxShield,

    energy: maxEnergy,
    maxEnergy,

    angle: 0

  };


  showScreen("gameScreen");

  announceWave();

  for (let i = 0; i < 5; i++) {
    spawnRobot();
  }

  updateHUD();

  requestAnimationFrame(loop);
}


/* =========================================================
   WAVE
========================================================= */

function announceWave() {

  const banner =
    document.getElementById("waveBanner");

  document.getElementById(
    "waveBannerNumber"
  ).textContent = state.wave;

  banner.classList.add("show");

  setTimeout(() => {
    banner.classList.remove("show");
  }, 1500);

}


function newWave() {

  state.wave++;

  state.waveKills = 0;

  state.waveTarget =
    8 + state.wave * 4;

  unlockProgress();

  if (state.wave > MAX_WAVE) {
    victory();
    return;
  }

  announceWave();

  if (state.wave % 5 === 0) {

    spawnBoss();

  } else {

    for (
      let i = 0;
      i < Math.min(12, 4 + state.wave);
      i++
    ) {
      spawnRobot();
    }

  }

}


/* =========================================================
   UNLOCKS
========================================================= */

function unlockProgress() {

  maps.forEach(map => {

    if (
      state.wave >= map.unlock &&
      !save.unlockedMaps.includes(map.id)
    ) {

      save.unlockedMaps.push(map.id);

    }

  });

  save.bestWave =
    Math.max(save.bestWave, state.wave);

  saveGame();

  checkAchievements();

}


/* =========================================================
   ROBOTS
========================================================= */

function chooseRobotType() {

  let available = robotTypes.slice(
    0,
    Math.min(
      robotTypes.length,
      3 + Math.floor(state.wave * .9)
    )
  );

  let type =
    available[
      Math.floor(Math.random() * available.length)
    ];

  return type;
}


function spawnRobot() {

  const type = chooseRobotType();

  let x;
  let y;

  const side =
    Math.floor(Math.random() * 4);

  if (side === 0) {
    x = Math.random() * W;
    y = -60;
  }

  if (side === 1) {
    x = W + 60;
    y = Math.random() * H;
  }

  if (side === 2) {
    x = Math.random() * W;
    y = H + 60;
  }

  if (side === 3) {
    x = -60;
    y = Math.random() * H;
  }


  const difficulty =
    save.settings.difficulty;

  let multiplier = 1;

  if (difficulty === "easy") {
    multiplier = .75;
  }

  if (difficulty === "hard") {
    multiplier = 1.3;
  }


  state.robots.push({

    type,

    x,
    y,

    hp:
      type.hp *
      (1 + state.wave * .08) *
      multiplier,

    maxHp:
      type.hp *
      (1 + state.wave * .08) *
      multiplier,

    speed:
      type.speed *
      (1 + state.wave * .025) *
      multiplier,

    damage:
      type.damage * multiplier,

    size: type.size,

    color: type.color,

    score: type.score,

    shootCd:
      Math.random() * type.shoot + 40,

    angle: 0,

    phase: Math.random() * Math.PI * 2

  });

}


/* =========================================================
   BOSS
========================================================= */

function spawnBoss() {

  const bossIndex =
    Math.min(
      Math.floor(state.wave / 5) - 1,
      bosses.length - 1
    );

  const template =
    bosses[bossIndex];

  state.boss = {

    name: template.name,

    x: W / 2,
    y: 130,

    hp: template.hp *
      (1 + state.wave * .12),

    maxHp: template.hp *
      (1 + state.wave * .12),

    speed: template.speed,

    size: template.size,

    damage: template.damage,

    color: template.color,

    shootCd: 100,

    phase: 0

  };

  document.getElementById(
    "bossContainer"
  ).style.display = "block";

  document.getElementById(
    "bossName"
  ).textContent = template.name;

  beep(80, .4, "sawtooth");

}


/* =========================================================
   PLAYER SHOOT
========================================================= */

function shoot() {

  if (!state.running || state.paused) {
    return;
  }

  if (state.shotTimer > 0) {
    return;
  }

  const weapon = state.weapon;

  const damage =
    weapon.damage *
    (1 + save.upgrades.damage * .10);

  const cooldown =
    weapon.fireRate *
    Math.pow(.92, save.upgrades.cooldown);

  state.shotTimer = cooldown;


  const dx =
    state.mouse.x - state.player.x;

  const dy =
    state.mouse.y - state.player.y;

  const baseAngle =
    Math.atan2(dy, dx);

  state.player.angle = baseAngle;


  const count =
    weapon.id === "triple" ? 3 :
    weapon.id === "nova" ? 5 :
    1;


  for (let i = 0; i < count; i++) {

    let angle = baseAngle;

    if (count > 1) {

      angle +=
        (i - (count - 1) / 2) *
        weapon.spread;

    }


    state.bullets.push({

      x: state.player.x +
        Math.cos(angle) * 22,

      y: state.player.y +
        Math.sin(angle) * 22,

      vx:
        Math.cos(angle) *
        weapon.speed,

      vy:
        Math.sin(angle) *
        weapon.speed,

      damage,

      radius:
        weapon.id === "void" ? 7 : 4,

      life: 100,

      color:
        weapon.id === "plasma"
          ? "#36d9ff"
          : weapon.id === "laser"
            ? "#ff4268"
            : weapon.id === "void"
              ? "#a855ff"
              : "#ffffff"

    });

  }


  beep(
    weapon.id === "plasma" ? 180 :
    weapon.id === "void" ? 70 :
    350,
    .04
  );

}


/* =========================================================
   ENEMY SHOOT
========================================================= */

function enemyShoot(robot) {

  const dx =
    state.player.x - robot.x;

  const dy =
    state.player.y - robot.y;

  const angle =
    Math.atan2(dy, dx);

  const speed =
    robot.type === "SNIPER"
      ? 5
      : 3;


  state.enemyBullets.push({

    x: robot.x,
    y: robot.y,

    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,

    damage: robot.damage,

    radius: 5,

    life: 300,

    color: robot.color

  });

}


/* =========================================================
   BOSS SHOOT
========================================================= */

function bossShoot() {

  if (!state.boss) return;

  const boss = state.boss;

  const dx =
    state.player.x - boss.x;

  const dy =
    state.player.y - boss.y;

  const angle =
    Math.atan2(dy, dx);


  for (let i = -2; i <= 2; i++) {

    const a =
      angle + i * .16;

    state.enemyBullets.push({

      x: boss.x,
      y: boss.y,

      vx: Math.cos(a) * 4,
      vy: Math.sin(a) * 4,

      damage: boss.damage,

      radius: 8,

      life: 300,

      color: boss.color

    });

  }

  beep(90, .08, "sawtooth");

}


/* =========================================================
   PLAYER DAMAGE
========================================================= */

function hitPlayer(damage) {

  if (!state.player) return;

  let remaining = damage;


  if (state.player.shield > 0) {

    const absorbed =
      Math.min(
        state.player.shield,
        remaining
      );

    state.player.shield -= absorbed;

    remaining -= absorbed;

  }


  if (remaining > 0) {

    state.player.hp -= remaining;

  }


  state.shake =
    save.settings.shake
      ? Math.min(10, state.shake + damage * .15)
      : 0;


  burst(
    state.player.x,
    state.player.y,
    "#36d9ff",
    8
  );


  if (state.player.hp <= 0) {

    state.player.hp = 0;

    gameOver();

  }

}


/* =========================================================
   ROBOT DAMAGE
========================================================= */

function damageRobot(robot, damage) {

  robot.hp -= damage;

  burst(
    robot.x,
    robot.y,
    robot.color,
    4
  );


  if (robot.hp <= 0) {

    killRobot(robot);

  }

}


function killRobot(robot) {

  const index =
    state.robots.indexOf(robot);

  if (index !== -1) {

    state.robots.splice(index, 1);

  }


  state.kills++;

  state.waveKills++;


  state.combo =
    Math.min(
      20,
      state.combo + .25
    );

  state.comboTimer = 180;


  state.score +=
    Math.round(
      robot.score * state.combo
    );


  save.credits +=
    Math.max(
      2,
      Math.floor(robot.score / 5)
    );


  burst(
    robot.x,
    robot.y,
    robot.color,
    18
  );


  if (Math.random() < .12) {

    spawnPickup(
      robot.x,
      robot.y
    );

  }


  beep(120, .04);


  checkAchievements();


  if (
    state.waveKills >=
    state.waveTarget &&
    !state.boss
  ) {

    newWave();

  } else if (!state.boss) {

    if (
      state.robots.length <
      Math.min(
        15,
        3 + state.wave * 2
      )
    ) {

      spawnRobot();

    }

  }


  save.totalKills = Math.max(
    save.totalKills,
    state.kills
  );

  save.highscore = Math.max(
    save.highscore,
    state.score
  );

  saveGame();

}


/* =========================================================
   PICKUPS
========================================================= */

function spawnPickup(x, y) {

  const types = [
    "energy",
    "shield",
    "health",
    "credits"
  ];

  const type =
    types[
      Math.floor(Math.random() * types.length)
    ];

  state.pickups.push({

    x,
    y,

    type,

    radius: 10,

    life: 700,

    phase: Math.random() * Math.PI * 2

  });

}


function pickup(p) {

  const player =
    state.player;

  if (p.type === "energy") {

    player.energy =
      Math.min(
        player.maxEnergy,
        player.energy + 25
      );

    text = "ENERGY +25";

  }

  if (p.type === "shield") {

    player.shield =
      Math.min(
        player.maxShield,
        player.shield + 30
      );

    text = "SHIELD +30";

  }

  if (p.type === "health") {

    player.hp =
      Math.min(
        player.maxHp,
        player.hp + 25
      );

    text = "HP +25";

  }

  if (p.type === "credits") {

    save.credits += 25;

    text = "CREDITS +12";

  }


  if (p.type === "energy") {
    save.pickups++;
  }


  const notice =
    document.getElementById(
      "pickupNotice"
    );

  notice.textContent = text;
  notice.style.opacity = 1;

  setTimeout(() => {
    notice.style.opacity = 0;
  }, 600);


  beep(700, .08, "sine");

  saveGame();

}


/* =========================================================
   PARTICLES
========================================================= */

function burst(x, y, color, amount = 10) {

  if (!save.settings.particles) {
    return;
  }

  for (let i = 0; i < amount; i++) {

    const angle =
      Math.random() *
      Math.PI *
      2;

    const speed =
      Math.random() *
      4 + 1;

    state.particles.push({

      x,
      y,

      vx:
        Math.cos(angle) *
        speed,

      vy:
        Math.sin(angle) *
        speed,

      life:
        Math.random() *
        30 + 20,

      size:
        Math.random() *
        3 + 1,

      color

    });

  }

}


/* =========================================================
   UPDATE
========================================================= */

function update(dt) {

  if (!state.running || state.paused) {
    return;
  }


  state.shotTimer -= dt;

  state.comboTimer -= dt;

  if (state.comboTimer <= 0) {
    state.combo = 1;
  }


  /* PLAYER */

  const player =
    state.player;

  let dx = 0;
  let dy = 0;


  if (
    state.keys["w"] ||
    state.keys["arrowup"]
  ) dy--;

  if (
    state.keys["s"] ||
    state.keys["arrowdown"]
  ) dy++;

  if (
    state.keys["a"] ||
    state.keys["arrowleft"]
  ) dx--;

  if (
    state.keys["d"] ||
    state.keys["arrowright"]
  ) dx++;


  const length =
    Math.hypot(dx, dy);


  if (length > 0) {

    dx /= length;
    dy /= length;

  }


  const speed =
    4 *
    (1 + save.upgrades.speed * .08);


  player.x += dx * speed;
  player.y += dy * speed;


  player.x =
    Math.max(
      player.radius,
      Math.min(
        W - player.radius,
        player.x
      )
    );


  player.y =
    Math.max(
      player.radius,
      Math.min(
        H - player.radius,
        player.y
      )
    );


  player.angle =
    Math.atan2(
      state.mouse.y - player.y,
      state.mouse.x - player.x
    );


  if (
    state.mouse.down ||
    save.settings.autoFire
  ) {

    if (
      state.mouse.down ||
      save.settings.autoFire
    ) {
      shoot();
    }

  }


  /* BULLETS */

  for (
    let i = state.bullets.length - 1;
    i >= 0;
    i--
  ) {

    const b =
      state.bullets[i];

    b.x += b.vx;
    b.y += b.vy;

    b.life -= dt;


    if (
      b.life <= 0 ||
      b.x < -50 ||
      b.x > W + 50 ||
      b.y < -50 ||
      b.y > H + 50
    ) {

      state.bullets.splice(i, 1);

      continue;

    }


    let hit = false;


    /* ROBOTS */

    for (
      let j = state.robots.length - 1;
      j >= 0;
      j--
    ) {

      const r =
        state.robots[j];

      const distance =
        Math.hypot(
          b.x - r.x,
          b.y - r.y
        );


      if (
        distance <
        b.radius + r.size
      ) {

        damageRobot(
          r,
          b.damage
        );

        hit = true;

        break;

      }

    }


    /* BOSS */

    if (
      !hit &&
      state.boss
    ) {

      const boss =
        state.boss;

      const distance =
        Math.hypot(
          b.x - boss.x,
          b.y - boss.y
        );


      if (
        distance <
        b.radius + boss.size
      ) {

        boss.hp -= b.damage;

        burst(
          b.x,
          b.y,
          boss.color,
          5
        );

        if (boss.hp <= 0) {
          killBoss();
        }

        hit = true;

      }

    }


    if (hit) {

      state.bullets.splice(i, 1);

    }

  }


  /* ENEMY BULLETS */

  for (
    let i = state.enemyBullets.length - 1;
    i >= 0;
    i--
  ) {

    const b =
      state.enemyBullets[i];

    b.x += b.vx;
    b.y += b.vy;

    b.life -= dt;


    if (
      b.life <= 0 ||
      b.x < -100 ||
      b.x > W + 100 ||
      b.y < -100 ||
      b.y > H + 100
    ) {

      state.enemyBullets.splice(i, 1);

      continue;

    }


    const distance =
      Math.hypot(
        b.x - player.x,
        b.y - player.y
      );


    if (
      distance <
      b.radius + player.radius
    ) {

      hitPlayer(b.damage);

      state.enemyBullets.splice(i, 1);

    }

  }


  /* ROBOTS */

  for (const robot of state.robots) {

    const dx =
      player.x - robot.x;

    const dy =
      player.y - robot.y;

    const distance =
      Math.hypot(dx, dy);


    if (distance > 0) {

      robot.x +=
        dx / distance *
        robot.speed;

      robot.y +=
        dy / distance *
        robot.speed;

    }


    robot.phase += .04;


    robot.shootCd -= dt;


    if (
      robot.shootCd <= 0 &&
      distance < 700
    ) {

      enemyShoot(robot);

      robot.shootCd =
        robot.type.shoot -
        state.wave * 2 +
        Math.random() * 80;

    }


    if (
      distance <
      player.radius + robot.size
    ) {

      hitPlayer(
        robot.damage *
        .03
      );

      robot.x -=
        dx / Math.max(distance, 1) *
        3;

      robot.y -=
        dy / Math.max(distance, 1) *
        3;

    }

  }


  /* BOSS */

  updateBoss(dt);


  /* PICKUPS */

  for (
    let i = state.pickups.length - 1;
    i >= 0;
    i--
  ) {

    const p =
      state.pickups[i];

    p.life -= dt;
    p.phase += .05;


    const distance =
      Math.hypot(
        p.x - player.x,
        p.y - player.y
      );


    if (
      distance <
      p.radius + player.radius
    ) {

      pickup(p);

      state.pickups.splice(i, 1);

      continue;

    }


    if (p.life <= 0) {

      state.pickups.splice(i, 1);

    }

  }


  /* PARTICLES */

  for (
    let i = state.particles.length - 1;
    i >= 0;
    i--
  ) {

    const p =
      state.particles[i];

    p.x += p.vx;
    p.y += p.vy;

    p.vx *= .97;
    p.vy *= .97;

    p.life -= dt;


    if (p.life <= 0) {

      state.particles.splice(i, 1);

    }

  }


  if (state.shake > 0) {
    state.shake *= .88;
  }


  updateHUD();

}


/* =========================================================
   BOSS UPDATE
========================================================= */

function updateBoss(dt) {

  if (!state.boss) return;

  const boss =
    state.boss;

  const dx =
    state.player.x - boss.x;

  const dy =
    state.player.y - boss.y;

  const distance =
    Math.hypot(dx, dy);


  if (distance > 180) {

    boss.x +=
      dx / distance *
      boss.speed;

    boss.y +=
      dy / distance *
      boss.speed;

  }


  boss.phase += .02;

  boss.shootCd -= dt;


  if (boss.shootCd <= 0) {

    bossShoot();

    boss.shootCd = 100;

  }


  boss.x =
    Math.max(
      boss.size,
      Math.min(
        W - boss.size,
        boss.x
      )
    );


  boss.y =
    Math.max(
      boss.size,
      Math.min(
        H - boss.size,
        boss.y
      )
    );

}


/* =========================================================
   BOSS DEATH
========================================================= */

function killBoss() {

  if (!state.boss) return;

  const boss =
    state.boss;

  state.score += 1000;

  state.bossKills++;

  save.bossKills++;

  save.credits += 100;


  burst(
    boss.x,
    boss.y,
    boss.color,
    80
  );


  state.boss = null;


  document.getElementById(
    "bossContainer"
  ).style.display = "none";


  checkAchievements();


  if (state.wave >= MAX_WAVE) {

    victory();

  } else {

    newWave();

  }


  saveGame();

}


/* =========================================================
   GAME OVER
========================================================= */

function gameOver() {

  if (!state.running) return;

  state.running = false;

  const oldHighscore =
    save.highscore;

  const isRecord =
    state.score > oldHighscore;


  save.highscore =
    Math.max(
      save.highscore,
      state.score
    );

  save.bestWave =
    Math.max(
      save.bestWave,
      state.wave
    );

  save.totalKills =
    Math.max(
      save.totalKills,
      state.kills
    );


  saveGame();


  document.getElementById(
    "Score"
  ).textContent = state.score;

  document.getElementById(
    "Wave"
  ).textContent = state.wave;

  document.getElementById(
    "Kills"
  ).textContent = state.kills;


  document.getElementById(
    "newRecordText"
  ).style.display =
    isRecord
      ? "block"
      : "none";


  document.getElementById(
    "gameOverOverlay"
  ).style.display = "grid";


  beep(70, .5, "sawtooth");

}


/* =========================================================
   VICTORY
========================================================= */

function victory() {

  state.running = false;

  save.highscore =
    Math.max(
      save.highscore,
      state.score
    );

  save.bestWave =
    Math.max(
      save.bestWave,
      state.wave
    );

  save.totalKills =
    Math.max(
      save.totalKills,
      state.kills
    );


  saveGame();


  document.getElementById(
    "victoryScore"
  ).textContent = state.score;

  document.getElementById(
    "victoryWave"
  ).textContent = state.wave;

  document.getElementById(
    "victoryKills"
  ).textContent = state.kills;


  document.getElementById(
    "victoryOverlay"
  ).style.display = "grid";


  burst(
    W / 2,
    H / 2,
    "#36d9ff",
    120
  );


  beep(800, .3, "sine");

}


/* =========================================================
   ACHIEVEMENTS
========================================================= */

function unlockAchievement(id) {

  if (
    save.achievements.includes(id)
  ) {
    return;
  }

  save.achievements.push(id);

  save.credits += 100;

  saveGame();

}


function checkAchievements() {

  if (state.kills >= 1) {
    unlockAchievement("first");
  }

  if (save.totalKills >= 50) {
    unlockAchievement("hunter");
  }

  if (state.combo >= 10) {
    unlockAchievement("combo");
  }

  if (save.bossKills >= 1) {
    unlockAchievement("boss");
  }

  if (state.wave >= 5) {
    unlockAchievement("survivor");
  }

  if (state.wave >= 10) {
    unlockAchievement("ultra");
  }

  if (save.pickups >= 20) {
    unlockAchievement("energy");
  }

  if (
    save.unlockedWeapons.length ===
    weapons.length
  ) {
    unlockAchievement("arsenal");
  }

  if (
    save.unlockedMaps.length ===
    maps.length
  ) {
    unlockAchievement("explorer");
  }

}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

  if (!state.player) return;


  document.getElementById(
    "scoreText"
  ).textContent = state.score;


  document.getElementById(
    "waveText"
  ).textContent = state.wave;


  document.getElementById(
    "killsText"
  ).textContent = state.kills;


  document.getElementById(
    "comboText"
  ).textContent =
    "x" +
    Math.max(
      1,
      Math.floor(state.combo)
    );


  const elapsed =
    performance.now() -
    state.startTime;


  document.getElementById(
    "timeText"
  ).textContent =
    formatTime(elapsed);


  const progress =
    Math.min(
      100,
      state.waveKills /
      Math.max(1, state.waveTarget) *
      100
    );


  document.getElementById(
    "waveProgress"
  ).style.width =
    progress + "%";


  const p =
    state.player;


  document.getElementById(
    "hpBar"
  ).style.width =
    (p.hp / p.maxHp * 100) + "%";


  document.getElementById(
    "shieldBar"
  ).style.width =
    (p.shield / p.maxShield * 100) + "%";


  document.getElementById(
    "energyBar"
  ).style.width =
    (p.energy / p.maxEnergy * 100) + "%";


  document.getElementById(
    "hpText"
  ).textContent =
    Math.ceil(p.hp);


  document.getElementById(
    "shieldText"
  ).textContent =
    Math.ceil(p.shield);


  document.getElementById(
    "energyText"
  ).textContent =
    Math.ceil(p.energy);


  document.getElementById(
    "weaponIcon"
  ).textContent =
    state.weapon.icon;


  document.getElementById(
    "weaponName"
  ).textContent =
    state.weapon.name;


  document.getElementById(
    "weaponStatus"
  ).textContent =
    state.shotTimer <= 0
      ? "READY"
      : "CHARGING";


  /* BOSS */

  if (state.boss) {

    document.getElementById(
      "bossBar"
    ).style.width =
      Math.max(
        0,
        state.boss.hp /
        state.boss.maxHp *
        100
      ) + "%";

  }


  drawMinimap();

}


/* =========================================================
   TIME
========================================================= */

function formatTime(ms) {

  const total =
    Math.floor(ms / 1000);

  const minutes =
    Math.floor(total / 60);

  const seconds =
    total % 60;

  return (
    String(minutes).padStart(2, "0") +
    ":" +
    String(seconds).padStart(2, "0")
  );

}


/* =========================================================
   DRAW
========================================================= */

function draw() {

  ctx.clearRect(
    0,
    0,
    W,
    H
  );


  const shake =
    save.settings.shake
      ? state.shake
      : 0;


  ctx.save();

  if (shake > .5) {

    ctx.translate(
      (Math.random() - .5) * shake,
      (Math.random() - .5) * shake
    );

  }


  drawBackground();

  drawPickups();

  drawBullets();

  drawEnemyBullets();

  drawRobots();

  drawBoss();

  drawPlayer();

  drawParticles();


  ctx.restore();

}


/* =========================================================
   BACKGROUND
========================================================= */

function drawBackground() {

  const map =
    state.map?.id ||
    "neon";


  let gradient =
    ctx.createLinearGradient(
      0,
      0,
      W,
      H
    );


  if (map === "neon") {

    gradient.addColorStop(
      0,
      "#030a18"
    );

    gradient.addColorStop(
      1,
      "#081b2b"
    );

  }


  if (map === "moon") {

    gradient.addColorStop(
      0,
      "#16050d"
    );

    gradient.addColorStop(
      1,
      "#2b0b17"
    );

  }


  if (map === "temple") {

    gradient.addColorStop(
      0,
      "#11051f"
    );

    gradient.addColorStop(
      1,
      "#180d35"
    );

  }


  if (map === "toxic") {

    gradient.addColorStop(
      0,
      "#03150d"
    );

    gradient.addColorStop(
      1,
      "#082b1b"
    );

  }


  if (map === "forge") {

    gradient.addColorStop(
      0,
      "#081422"
    );

    gradient.addColorStop(
      1,
      "#17102b"
    );

  }


  ctx.fillStyle = gradient;

  ctx.fillRect(
    0,
    0,
    W,
    H
  );


  /* GRID */

  ctx.strokeStyle =
    "rgba(54,217,255,.09)";

  ctx.lineWidth = 1;


  const grid = 50;


  for (
    let x = 0;
    x <= W;
    x += grid
  ) {

    ctx.beginPath();

    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);

    ctx.stroke();

  }


  for (
    let y = 0;
    y <= H;
    y += grid
  ) {

    ctx.beginPath();

    ctx.moveTo(0, y);
    ctx.lineTo(W, y);

    ctx.stroke();

  }


  /* STARS */

  for (let i = 0; i < 80; i++) {

    const x =
      (i * 157) % W;

    const y =
      (i * 83) % H;

    const size =
      (i % 3) + 1;

    ctx.fillStyle =
      "rgba(255,255,255,.5)";

    ctx.fillRect(
      x,
      y,
      size,
      size
    );

  }

}


/* =========================================================
   PLAYER DRAW
========================================================= */

function drawPlayer() {

  const p =
    state.player;

  ctx.save();

  ctx.translate(
    p.x,
    p.y
  );

  ctx.rotate(
    p.angle
  );


  /* ENERGY GLOW */

  ctx.shadowBlur = 25;
  ctx.shadowColor = "#36d9ff";


  ctx.fillStyle =
    "#36d9ff";

  ctx.beginPath();

  ctx.moveTo(24, 0);
  ctx.lineTo(-15, -13);
  ctx.lineTo(-9, 0);
  ctx.lineTo(-15, 13);

  ctx.closePath();

  ctx.fill();


  ctx.shadowBlur = 0;


  ctx.fillStyle =
    "#dffaff";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    7,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* GUN */

  ctx.fillStyle =
    "#ffffff";

  ctx.fillRect(
    4,
    -3,
    25,
    6
  );


  ctx.restore();


  /* SHIELD */

  if (p.shield > 0) {

    ctx.strokeStyle =
      "rgba(54,217,255,.25)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      28,
      0,
      Math.PI * 2
    );

    ctx.stroke();

  }

}


/* =========================================================
   ROBOT DRAW
========================================================= */

function drawRobots() {

  for (const r of state.robots) {

    ctx.save();

    ctx.translate(
      r.x,
      r.y
    );

    ctx.rotate(
      r.phase
    );


    ctx.shadowBlur = 18;
    ctx.shadowColor = r.color;

    ctx.strokeStyle = r.color;
    ctx.fillStyle = "rgba(5,12,25,.9)";

    ctx.lineWidth = 3;


    ctx.beginPath();

    ctx.rect(
      -r.size,
      -r.size,
      r.size * 2,
      r.size * 2
    );

    ctx.fill();
    ctx.stroke();


    /* EYES */

    ctx.fillStyle = r.color;

    ctx.fillRect(
      -r.size * .55,
      -4,
      r.size * .3,
      8
    );

    ctx.fillRect(
      r.size * .25,
      -4,
      r.size * .3,
      8
    );


    ctx.shadowBlur = 0;

    ctx.restore();


    /* HP */

    const width =
      r.size * 2;

    const hp =
      Math.max(
        0,
        r.hp / r.maxHp
      );


    ctx.fillStyle =
      "rgba(0,0,0,.6)";

    ctx.fillRect(
      r.x - width / 2,
      r.y - r.size - 10,
      width,
      4
    );


    ctx.fillStyle =
      r.color;

    ctx.fillRect(
      r.x - width / 2,
      r.y - r.size - 10,
      width * hp,
      4
    );

  }

}


/* =========================================================
   BOSS DRAW
========================================================= */

function drawBoss() {

  const boss =
    state.boss;

  if (!boss) return;


  ctx.save();

  ctx.translate(
    boss.x,
    boss.y
  );


  const pulse =
    Math.sin(
      boss.phase * 5
    ) * 5;


  ctx.shadowBlur = 35;
  ctx.shadowColor =
    boss.color;


  ctx.strokeStyle =
    boss.color;

  ctx.fillStyle =
    "rgba(10,10,25,.9)";

  ctx.lineWidth = 6;


  ctx.beginPath();

  ctx.arc(
    0,
    0,
    boss.size + pulse,
    0,
    Math.PI * 2
  );

  ctx.fill();
  ctx.stroke();


  ctx.beginPath();

  ctx.arc(
    0,
    0,
    boss.size * .55,
    0,
    Math.PI * 2
  );

  ctx.stroke();


  ctx.fillStyle =
    boss.color;

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    18,
    0,
    Math.PI * 2
  );

  ctx.fill();


  ctx.shadowBlur = 0;

  ctx.restore();

}


/* =========================================================
   BULLETS
========================================================= */

function drawBullets() {

  for (const b of state.bullets) {

    ctx.save();

    ctx.shadowBlur = 15;
    ctx.shadowColor = b.color;

    ctx.fillStyle = b.color;

    ctx.beginPath();

    ctx.arc(
      b.x,
      b.y,
      b.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

  }

}


function drawEnemyBullets() {

  for (const b of state.enemyBullets) {

    ctx.save();

    ctx.shadowBlur = 15;
    ctx.shadowColor = b.color;

    ctx.fillStyle = b.color;

    ctx.beginPath();

    ctx.arc(
      b.x,
      b.y,
      b.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.restore();

  }

}


/* =========================================================
   PICKUPS DRAW
========================================================= */

function drawPickups() {

  for (const p of state.pickups) {

    let color = "#39ff9a";

    let symbol = "+";

    if (p.type === "shield") {
      color = "#3d7cff";
      symbol = "S";
    }

    if (p.type === "health") {
      color = "#ff4268";
      symbol = "H";
    }

    if (p.type === "credits") {
      color = "#ffad42";
      symbol = "$";
    }


    const pulse =
      Math.sin(p.phase) * 2;


    ctx.save();

    ctx.shadowBlur = 20;
    ctx.shadowColor = color;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    ctx.beginPath();

    ctx.arc(
      p.x,
      p.y,
      p.radius + pulse,
      0,
      Math.PI * 2
    );

    ctx.stroke();


    ctx.fillStyle = color;

    ctx.font =
      "bold 12px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
      symbol,
      p.x,
      p.y
    );

    ctx.restore();

  }

}


/* =========================================================
   PARTICLES DRAW
========================================================= */

function drawParticles() {

  for (const p of state.particles) {

    ctx.globalAlpha =
      Math.max(
        0,
        p.life / 50
      );

    ctx.fillStyle =
      p.color;

    ctx.fillRect(
      p.x,
      p.y,
      p.size,
      p.size
    );

  }

  ctx.globalAlpha = 1;

}


/* =========================================================
   MINIMAP
========================================================= */

function drawMinimap() {

  miniCtx.clearRect(
    0,
    0,
    miniMap.width,
    miniMap.height
  );


  miniCtx.fillStyle =
    "rgba(3,10,20,.9)";

  miniCtx.fillRect(
    0,
    0,
    miniMap.width,
    miniMap.height
  );


  const sx =
    miniMap.width / W;

  const sy =
    miniMap.height / H;


  /* PLAYER */

  if (state.player) {

    miniCtx.fillStyle =
      "#36d9ff";

    miniCtx.beginPath();

    miniCtx.arc(
      state.player.x * sx,
      state.player.y * sy,
      4,
      0,
      Math.PI * 2
    );

    miniCtx.fill();

  }


  /* ROBOTS */

  miniCtx.fillStyle =
    "#ff4268";

  for (const r of state.robots) {

    miniCtx.fillRect(
      r.x * sx - 2,
      r.y * sy - 2,
      4,
      4
    );

  }


  /* BOSS */

  if (state.boss) {

    miniCtx.fillStyle =
      "#a855ff";

    miniCtx.beginPath();

    miniCtx.arc(
      state.boss.x * sx,
      state.boss.y * sy,
      6,
      0,
      Math.PI * 2
    );

    miniCtx.fill();

  }

}


/* =========================================================
   LOOP
========================================================= */

function loop(timestamp) {

  if (!state.running) {

    draw();

    return;

  }


  const dt =
    Math.min(
      32,
      timestamp -
      (state.lastTime || timestamp)
    );


  state.lastTime =
    timestamp;


  update(dt);

  draw();

  requestAnimationFrame(loop);

}


/* =========================================================
   CONTROLS
========================================================= */

window.addEventListener(
  "keydown",
  e => {

    const key =
      e.key.toLowerCase();

    state.keys[key] = true;


    if (
      key >= "1" &&
      key <= "6"
    ) {

      const index =
        Number(key) - 1;

      const weapon =
        weapons[index];

      if (
        weapon &&
        save.unlockedWeapons.includes(
          weapon.id
        )
      ) {

        save.selectedWeapon =
          weapon.id;

        if (state.running) {

          state.weapon =
            weapon;

        }

        saveGame();

      }

    }


    if (key === "p") {

      togglePause();

    }


    if (key === "escape") {

      if (state.running) {

        state.running = false;

        showScreen(
          "startScreen"
        );

      }

    }

  }
);


window.addEventListener(
  "keyup",
  e => {

    state.keys[
      e.key.toLowerCase()
    ] = false;

  }
);


/* =========================================================
   MOUSE
========================================================= */

canvas.addEventListener(
  "mousemove",
  e => {

    const rect =
      canvas.getBoundingClientRect();


    state.mouse.x =
      (e.clientX - rect.left) /
      rect.width *
      W;


    state.mouse.y =
      (e.clientY - rect.top) /
      rect.height *
      H;

  }
);


canvas.addEventListener(
  "mousedown",
  () => {

    state.mouse.down = true;

    audio();

  }
);


window.addEventListener(
  "mouseup",
  () => {

    state.mouse.down = false;

  }
);


/* =========================================================
   TOUCH
========================================================= */

canvas.addEventListener(
  "touchstart",
  e => {

    e.preventDefault();

    const touch =
      e.touches[0];

    const rect =
      canvas.getBoundingClientRect();


    state.mouse.x =
      (touch.clientX - rect.left) /
      rect.width *
      W;


    state.mouse.y =
      (touch.clientY - rect.top) /
      rect.height *
      H;


    state.mouse.down = true;

    shoot();

  },
  { passive: false }
);


canvas.addEventListener(
  "touchmove",
  e => {

    e.preventDefault();

    const touch =
      e.touches[0];

    const rect =
      canvas.getBoundingClientRect();


    state.mouse.x =
      (touch.clientX - rect.left) /
      rect.width *
      W;


    state.mouse.y =
      (touch.clientY - rect.top) /
      rect.height *
      H;

  },
  { passive: false }
);


canvas.addEventListener(
  "touchend",
  () => {

    state.mouse.down = false;

  }
);


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

  if (!state.running) return;

  state.paused =
    !state.paused;


  document.getElementById(
    "pauseOverlay"
  ).style.display =
    state.paused
      ? "grid"
      : "none";

}


document.getElementById(
  "resumeBtn"
).addEventListener(
  "click",
  togglePause
);


/* =========================================================
   BUTTONS
========================================================= */

document.getElementById(
  "startBtn"
).addEventListener(
  "click",
  startGame
);


document.getElementById(
  "continueBtn"
).addEventListener(
  "click",
  startGame
);


document.getElementById(
  "restartBtn"
).addEventListener(
  "click",
  () => {

    document.getElementById(
      "gameOverOverlay"
    ).style.display = "none";

    startGame();

  }
);


document.getElementById(
  "gameOverMenuBtn"
).addEventListener(
  "click",
  () => {

    document.getElementById(
      "gameOverOverlay"
    ).style.display = "none";

    showScreen(
      "startScreen"
    );

  }
);


document.getElementById(
  "pauseMenuBtn"
).addEventListener(
  "click",
  () => {

    state.running = false;

    document.getElementById(
      "pauseOverlay"
    ).style.display = "none";

    showScreen(
      "startScreen"
    );

  }
);


document.getElementById(
  "victoryMenuBtn"
).addEventListener(
  "click",
  () => {

    document.getElementById(
      "victoryOverlay"
    ).style.display = "none";

    showScreen(
      "startScreen"
    );

  }
);


/* =========================================================
   INIT
========================================================= */

renderMenu();

showScreen("startScreen");
