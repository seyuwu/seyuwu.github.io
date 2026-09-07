/* ============================================================
   Рендер проектов из js/projects.js + интерактив
   ============================================================ */

// ---------- Карточки проектов ----------
function renderProjects() {
  const list = document.getElementById("projectsList");
  if (!list || typeof PROJECTS === "undefined") return;

  const visible = PROJECTS.filter((p) => p.visible !== false);
  const counter = document.getElementById("projectsCount");
  if (counter) counter.textContent = visible.length;

  list.innerHTML = "";

  visible.forEach((p) => {
    const accent = p.accent || "#6e5bff";
    const card = document.createElement("article");
    card.className = "card reveal";
    card.style.setProperty("--accent", accent);
    card.innerHTML = `
      <div class="card__body">
        <div class="card__head">
          <span class="card__icon">${p.icon || "◆"}</span>
          <div class="card__titles">
            <h3>${p.name}</h3>
            <p>${p.tagline || ""}</p>
          </div>
          ${p.status ? `<span class="card__status">${p.status}</span>` : ""}
        </div>

        <p class="card__summary">${p.summary || ""}</p>

        <div class="card__tags">
          ${(p.tags || []).map((t) => `<span>${t}</span>`).join("")}
        </div>

        ${p.details && p.details.length ? `
          <button class="card__toggle" type="button">Подробнее</button>
          <div class="card__details">
            <ul>${p.details.map((t) => `<li>${t}</li>`).join("")}</ul>
          </div>` : ""}

        ${p.link ? `<a class="card__link" href="${p.link}" target="_blank" rel="noopener">Открыть ↗</a>` : ""}
      </div>

      <div class="card__art" aria-hidden="true">
        <span class="card__art-icon">${p.icon || "◆"}</span>
        <span class="card__art-name">${p.name}</span>
      </div>
    `;
    list.appendChild(card);
  });

  // аккордеон "Подробнее"
  list.querySelectorAll(".card__toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".card");
      const open = card.classList.toggle("open");
      btn.textContent = open ? "Свернуть" : "Подробнее";
    });
  });
}
renderProjects();

// ---------- Появление при прокрутке ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 60}ms`;
  io.observe(el);
});

// ---------- Плавный скролл с учётом шапки ----------
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const y = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
});

// ---------- Год в футере ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Бегущая строка технологий ----------
const TECH = [
  "Go", "PostgreSQL", "Redis", "Docker", "REST API", "JavaScript",
  "Linux / VPS", "HTTPS", "RBAC", "AI-assisted Development",
  "Парсеры", "Кэширование", "Модульная архитектура", "Автоматизация"
];
(function renderTicker() {
  const ticker = document.getElementById("ticker");
  if (!ticker) return;
  const group = TECH.map((t) => `<span>${t}</span><i>✦</i>`).join("");
  ticker.innerHTML =
    `<div class="ticker__track">` +
    `<div class="ticker__group">${group}</div>` +
    `<div class="ticker__group">${group}</div>` +
    `</div>`;
})();

// ---------- Свечение карточек за курсором ----------
document.getElementById("projectsList").addEventListener("pointermove", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty("--mx", (e.clientX - r.left) + "px");
  card.style.setProperty("--my", (e.clientY - r.top) + "px");
});

// ---------- Пасхалка: конфетти по клику на аватар ----------
const avatar = document.querySelector(".header__avatar");
if (avatar) {
  avatar.addEventListener("click", (e) => {
    e.preventDefault();
    const colors = ["#6e5bff", "#0ea5e9", "#10b981", "#f97316", "#f5c04e"];
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("span");
      p.className = "confetti";
      p.style.left = e.clientX + "px";
      p.style.top = e.clientY + "px";
      p.style.background = colors[i % colors.length];
      document.body.appendChild(p);
      const angle = Math.random() * Math.PI * 2;
      const dist = 60 + Math.random() * 110;
      p.animate(
        [
          { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
          {
            transform: `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist + 80}px) rotate(${Math.random() * 540 - 270}deg)`,
            opacity: 0
          }
        ],
        { duration: 900 + Math.random() * 500, easing: "cubic-bezier(0.2,0.7,0.3,1)" }
      ).onfinish = () => p.remove();
    }
  });
}
