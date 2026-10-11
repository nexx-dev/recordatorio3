// ✏️ PERSONALIZA AQUÍ
const HER_NAME = "Sarita";     // Su nombre o apodo (vacío = "mi niña")
const TOGETHER_SINCE = "";      // Fecha de inicio, formato AAAA-MM-DD (vacío = no se muestra)

function applyPersonalization() {
  if (HER_NAME) {
    document.getElementById("her-name").textContent = HER_NAME;
    document.getElementById("letter-greeting").textContent = `${HER_NAME}, mi niña bonita,`;
  }
  const dateEl = document.getElementById("letter-date");
  const start = TOGETHER_SINCE ? new Date(`${TOGETHER_SINCE}T00:00:00`) : null;
  if (start && !isNaN(start)) {
    const days = Math.max(0, Math.floor((Date.now() - start) / 86400000));
    const nice = start.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
    dateEl.textContent = `Desde el ${nice} · ${days.toLocaleString("es")} días a tu lado ♥`;
  } else {
    dateEl.remove();
  }
}
applyPersonalization();

const welcomeScreen = document.getElementById("screen-welcome");
const letterScreen = document.getElementById("screen-letter");
const startButton = document.getElementById("start-mission");
const backButton = document.getElementById("back-home");
const restartButton = document.getElementById("restart");
const antiRageButton = document.getElementById("anti-rage");
const surpriseResult = document.getElementById("surprise-result");
const toastHearts = document.getElementById("toast-hearts");

const plans = [
  "Protocolo 1: respiramos, nos damos un mini abrazo virtual y después decidimos si va otra. 🫂",
  "Protocolo 2: pausa para reírnos de la jugada más caótica de la noche. 😂",
  "Protocolo 3: recordatorio importante: mi compañera favorita sigue aquí, aunque el marcador no coopere. 💙",
  "Protocolo 4: agua, respiramos y volvemos cuando los dos tengamos ganas. Cero presión. 🌷",
  "Protocolo 5: misión alternativa: ver algo de Bluey y recuperar los puntitos de ternura. 🐾",
  "Protocolo 6: la derrota dura una partida; el cariño no depende del rango. ♥"
];

const finalScreen = document.getElementById("screen-final");
const goLetterButton = document.getElementById("go-letter");
const backLetterButton = document.getElementById("back-letter");

let transitionTimer = null;

function showScreen(which) {
  const screens = { welcome: welcomeScreen, letter: letterScreen, final: finalScreen };
  const current = Object.values(screens).find(el => !el.hidden);
  const target = screens[which];
  if (current === target) return;
  window.clearTimeout(transitionTimer);
  stopTyping();
  Object.values(screens).forEach(el => el.classList.remove("leaving"));

  const reveal = () => {
    Object.entries(screens).forEach(([name, el]) => {
      el.hidden = name !== which;
      el.classList.toggle("active", name === which);
    });
    window.scrollTo({ top: 0, behavior: "auto" });
    if (which !== "welcome") burstHearts(12);
    if (which === "final") startTyping();
  };

  if (current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    current.classList.add("leaving");
    transitionTimer = window.setTimeout(() => { current.classList.remove("leaving"); reveal(); }, 280);
  } else {
    reveal();
  }
}

startButton.addEventListener("click", () => showScreen("letter"));
backButton.addEventListener("click", () => showScreen("welcome"));
goLetterButton.addEventListener("click", () => showScreen("final"));
backLetterButton.addEventListener("click", () => showScreen("letter"));
restartButton.addEventListener("click", () => {
  document.querySelectorAll(".memory-card").forEach(card => {
    card.classList.remove("revealed", "seen");
    card.setAttribute("aria-expanded", "false");
    card.querySelector(".card-prompt").textContent = "👆 Toca para abrir";
  });
  updateSeenCounter();
  surpriseResult.textContent = "Esperando la próxima misión…";
  showScreen("welcome");
});

document.querySelectorAll(".memory-card").forEach(card => {
  card.addEventListener("click", () => openModal(card));
});

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");
const modalVideo = document.getElementById("modal-video");
let lastCard = null;

function openModal(card) {
  lastCard = card;
  modalTitle.textContent = card.querySelector(".card-label").textContent;
  const video = card.dataset.video;
  modalText.hidden = Boolean(video);
  modalVideo.hidden = !video;
  if (video) {
    modalText.textContent = "";
    modalVideo.src = video;
    modalVideo.play().catch(() => {});
  } else {
    modalText.textContent = card.dataset.message;
  }
  modal.hidden = false;
  card.setAttribute("aria-expanded", "true");
  markSeen(card);
  burstHearts(3);
}

const seenCounter = document.getElementById("seen-counter");
const allCards = document.querySelectorAll(".memory-card");

function updateSeenCounter() {
  const seen = document.querySelectorAll(".memory-card.seen").length;
  const done = seen === allCards.length;
  seenCounter.textContent = done ? "¡Las descubriste todas! 💙" : `${seen} de ${allCards.length} descubiertas`;
  seenCounter.classList.toggle("all", done);
}

function markSeen(card) {
  card.classList.add("seen");
  card.querySelector(".card-prompt").textContent = "✓ Ya la leíste ♥";
  updateSeenCounter();
}

function closeModal() {
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
  modal.hidden = true;
  if (lastCard) {
    lastCard.setAttribute("aria-expanded", "false");
    lastCard.focus();
  }
}

modal.querySelectorAll("[data-close]").forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });

antiRageButton.addEventListener("click", () => {
  const current = surpriseResult.dataset.lastIndex;
  let index = Math.floor(Math.random() * plans.length);
  if (plans.length > 1 && String(index) === current) index = (index + 1) % plans.length;
  surpriseResult.dataset.lastIndex = String(index);
  surpriseResult.textContent = plans[index];
  burstHearts(5);
});

function burstHearts(amount = 6) {
  const symbols = ["♥", "♡", "✦", "🐾"];
  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("span");
    particle.className = "heart-particle";
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = `${8 + Math.random() * 84}%`;
    particle.style.bottom = `${Math.random() * 8}%`;
    particle.style.animationDelay = `${Math.random() * 0.35}s`;
    particle.style.color = ["#e97f9d", "#7dbfe4", "#f0c86d", "#9c8bd2"][Math.floor(Math.random() * 4)];
    toastHearts.appendChild(particle);
    window.setTimeout(() => particle.remove(), 2100);
  }
}

// Let the keyboard activate cards naturally; buttons already support Enter and Space.

// Efecto máquina de escribir para la cartita
const letterPaper = document.querySelector(".letter-paper");
const endCap = document.querySelector(".end-cap");
const typeTargets = letterPaper.querySelectorAll("h3, p:not(.eyebrow)");
const typeNodes = [];
typeTargets.forEach(el => {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent.trim()) typeNodes.push({ node, text: node.textContent, el });
  }
});
let typingTimer = null;

function stopTyping() {
  window.clearTimeout(typingTimer);
  typeNodes.forEach(({ node, text }) => { node.textContent = text; });
  letterPaper.style.minHeight = "";
  letterPaper.querySelectorAll(".typing-caret").forEach(el => el.classList.remove("typing-caret"));
  endCap.classList.remove("end-hidden");
}

function celebrate() {
  burstHearts(26);
  window.setTimeout(() => burstHearts(18), 500);
  window.setTimeout(() => burstHearts(12), 1100);
}

function startTyping() {
  stopTyping();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  letterPaper.style.minHeight = `${letterPaper.offsetHeight}px`;
  endCap.classList.add("end-hidden");
  typeNodes.forEach(({ node }) => { node.textContent = ""; });
  let n = 0, i = 0;
  const step = () => {
    const { node, text, el } = typeNodes[n];
    letterPaper.querySelectorAll(".typing-caret").forEach(c => c.classList.remove("typing-caret"));
    el.classList.add("typing-caret");
    node.textContent = text.slice(0, ++i);
    let delay = ".,!?".includes(text[i - 1]) ? 220 : 32;
    if (i >= text.length) {
      const next = typeNodes[n + 1];
      n++; i = 0;
      if (!next) { stopTyping(); celebrate(); return; }
      if (next.el !== el) delay = next.el.classList.contains("letter-signoff") ? 1400 : 650;
    }
    typingTimer = window.setTimeout(step, delay);
  };
  step();
}
