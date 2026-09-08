/* ============================================================
   Рендер записей журнала из js/projects.js + интерактив
   ============================================================ */

// Статичный рендер для скриншотов (?capture=1)
if (new URLSearchParams(location.search).has("capture")) {
  document.documentElement.classList.add("capture");
}

// ---------- Записи журнала (проекты) ----------
function renderEngineeringDetails(ed) {
  return `<div class="ed__list">` + Object.entries(ed).map(([label, text]) =>
    `<div class="ed__sec"><b>${label}</b><p>${text}</p></div>`
  ).join("") + `</div>`;
}

function renderProjects() {
  const list = document.getElementById("projectsList");
  if (!list || typeof PROJECTS === "undefined") return;

  const visible = PROJECTS.filter((p) => p.visible !== false);
  const counter = document.getElementById("projectsCount");
  const total = document.getElementById("projectsTotal");
  if (counter) counter.textContent = visible.length;
  if (total) total.textContent = visible.length;

  list.innerHTML = "";

  visible.forEach((p, idx) => {
    const num = String(idx + 1).padStart(2, "0");
    const hasEd = p.engineeringDetails && Object.keys(p.engineeringDetails).length;
    const hasDetails = hasEd || (p.details && p.details.length);
    const detailsId = `entry-details-${num}`;

    const detailsHtml = hasDetails
      ? `<button class="entry__toggle" type="button" aria-expanded="false" aria-controls="${detailsId}" data-label="${hasEd ? "Замеры проекта" : "Подробнее"}">
           ${hasEd ? "Замеры проекта" : "Подробнее"}
         </button>
         <div class="entry__details" id="${detailsId}">
           ${hasEd
             ? renderEngineeringDetails(p.engineeringDetails)
             : `<div class="ed__list">${p.details.map((t) => `<div class="ed__sec"><p>${t}</p></div>`).join("")}</div>`}
         </div>`
      : "";

    // Статус как отметка: «в работе» — красный крест-штамп, остальное — синий штамп
    const inWork = /разработ/i.test(p.status || "");

    const entry = document.createElement("article");
    entry.className = "entry reveal";
    entry.innerHTML = `
      <div class="entry__margin">
        <span class="entry__num">Запись № ${num}</span>
        ${p.status ? `<span class="stamp ${inWork ? "stamp--red" : "stamp--blue"} entry__stamp stamp-land">${p.status}</span>` : ""}
      </div>

      <div class="entry__body">
        <h3 class="entry__name">${p.name}</h3>
        <p class="entry__tagline">${p.tagline || ""}</p>

        <p class="entry__summary">${p.summary || ""}</p>

        ${(p.solution || p.personally) ? `<div class="entry__fields">
          ${p.solution ? `<div><b>Решение</b><p>${p.solution}</p></div>` : ""}
          ${p.personally ? `<div><b>Лично</b><p>${p.personally}</p></div>` : ""}
        </div>` : ""}

        ${p.tags && p.tags.length ? `<p class="entry__materials">${p.tags.join("<i>·</i>")}</p>` : ""}

        ${detailsHtml}

        ${p.link ? `<a class="entry__link" href="${p.link}" target="_blank" rel="noopener">${/github\.com/.test(p.link) ? "Исходники на GitHub" : "Открыть проект"}</a>` : ""}
      </div>
    `;
    list.appendChild(entry);
  });

  // аккордеон замеров
  list.querySelectorAll(".entry__toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const entry = btn.closest(".entry");
      const open = entry.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Свернуть" : btn.dataset.label;
    });
  });
}
renderProjects();

// ---------- Появление при прокрутке + приёмка штампом ----------
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
        if (e.target.classList.contains("entry") || e.target.classList.contains("entry-frag")) {
          e.target.classList.add("stamped");
        }
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 50}ms`;
  io.observe(el);
});

// подчёркивания в герое дорисовываются сразу после загрузки
window.addEventListener("load", () => {
  document.querySelectorAll(".ink-u").forEach((el) => el.classList.add("drawn"));
});

// ---------- Скроллспай: активная графа навигации ----------
const navLinks = [...document.querySelectorAll(".tabs a")];
const sections = navLinks
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`)
      );
    });
  },
  { rootMargin: "-30% 0px -60% 0px" }
);
sections.forEach((s) => spy.observe(s));

// ---------- Год в колонтитуле ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Пасхалка: штамп «прочитано» по клику на исполнителя ----------
const brand = document.getElementById("brand");
const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (brand) {
  brand.addEventListener("click", (e) => {
    // с клавиатуры — обычный переход к началу страницы
    if (e.detail === 0) return;
    e.preventDefault();
    const s = document.createElement("span");
    s.className = "read-stamp";
    s.textContent = "Прочитано";
    s.style.left = e.clientX - 60 + "px";
    s.style.top = e.clientY - 24 + "px";
    s.style.transform = `rotate(${Math.random() * 10 - 11}deg)`;
    document.body.appendChild(s);
    if (motionOk) {
      s.animate(
        [
          { transform: `${s.style.transform} scale(1.8)`, opacity: 0 },
          { transform: `${s.style.transform} scale(1)`, opacity: 1 }
        ],
        { duration: 300, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );
      setTimeout(() => {
        s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: "forwards" })
          .onfinish = () => s.remove();
      }, 1400);
    } else {
      setTimeout(() => s.remove(), 1400);
    }
  });
}
