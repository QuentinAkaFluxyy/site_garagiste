// Menu mobile
const toggle = document.querySelector(".nav__toggle");
const menu = document.querySelector(".nav__menu");

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Ferme le menu après clic sur un lien (mobile)
  menu.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Ferme au clic en dehors
  document.addEventListener("click", (e) => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

// Reveal on scroll (propre + léger)
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

// Scroll progress
const bar = document.querySelector(".scroll-progress");
function updateProgress(){
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  if (bar) bar.style.width = `${pct}%`;
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

// Année footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Statut "Ouvert/Fermé" (Europe/Paris)
function getParisTimeParts() {
  const fmt = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const parts = fmt.formatToParts(new Date());
  const obj = {};
  for (const p of parts) obj[p.type] = p.value;
  return obj; // { weekday, hour, minute, ... }
}

function isOpenNowParis() {
  const { weekday, hour, minute } = getParisTimeParts();
  const h = parseInt(hour, 10);
  const m = parseInt(minute, 10);
  const t = h * 60 + m;

  // Lun–Ven uniquement
  // weekday en fr-FR: "lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."
  const wd = (weekday || "").toLowerCase();
  const isWeekday = ["lun.", "mar.", "mer.", "jeu.", "ven."].includes(wd);
  if (!isWeekday) return false;

  // Plages horaires (minutes)
  const morningOpen = 9 * 60;
  const morningClose = 12 * 60 + 30;
  const afternoonOpen = 14 * 60 + 30;
  const afternoonClose = 18 * 60 + 30;

  const inMorning = t >= morningOpen && t < morningClose;
  const inAfternoon = t >= afternoonOpen && t < afternoonClose;

  return inMorning || inAfternoon;
}

function updateOpenStatusDot() {
  const dot = document.querySelector(".brand__mark");
  if (!dot) return;

  const open = isOpenNowParis();
  dot.classList.toggle("is-open", open);
  dot.classList.toggle("is-closed", !open);

  // Accessibilité : indique l’état au survol
  dot.setAttribute("title", open ? "Ouvert" : "Fermé");
  dot.setAttribute("aria-label", open ? "Ouvert" : "Fermé");
}

// initial + refresh toutes les 30s
updateOpenStatusDot();
setInterval(updateOpenStatusDot, 30000);
