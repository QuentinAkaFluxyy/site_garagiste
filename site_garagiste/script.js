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
