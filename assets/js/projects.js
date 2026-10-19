// Every project on the site lives here. The home page shows the featured
// ones; components/projects.html shows them all with filters.
//   kind:  the small line under the name (the projects page shows tags there)
//   note:  the handwritten caption under the preview
//   image: a file in assets/images/, or null for a written card
const PROJECTS = [
  {
    title: "StrataEngine",
    kind: "Systems · C++20",
    note: "cache-friendly by design",
    desc: "A data-oriented 2D industrial automation simulation in C++20, built around a cache-friendly memory layout and a tight systems core.",
    tags: ["C/C++", "Data-oriented design", "Systems programming"],
    categories: ["systems"],
    link: "https://github.com/okyoiu/StrataEngine",
    image: "teserra-png.webp",
    featured: true,
  },
  {
    title: "Meridian",
    kind: "Systems · C++17 + React",
    note: "1.4M nodes, all in RAM",
    desc: "A C++ pathfinding microservice that holds 1.4 million OpenStreetMap nodes in memory and runs a custom Dijkstra to find real routes, drawn on a React and Leaflet map.",
    tags: ["C++17", "React", "Microservices", "Algorithms"],
    categories: ["full-stack", "systems"],
    link: "https://github.com/okyoiu/Meridian",
    image: "MERIDIAN_DEMO.webp",
    featured: true,
  },
  {
    title: "CoreLang Interpreter",
    kind: "Systems · C/C++",
    note: "parser written by hand",
    desc: "An interpreter with a hand-written recursive descent parser and a memory-safe abstract syntax tree, tested with Google Test.",
    tags: ["C/C++", "Interpreter design", "Google Test"],
    categories: ["systems"],
    link: "https://github.com/okyoiu/CoreLang-Interpreter",
    image: "project3_creditByHaqr.webp",
    featured: true,
  },
  {
    title: "Rollins Engineering",
    kind: "Full-stack · Astro + React",
    note: "it's live, go look",
    desc: "The official site for Rollins Engineering Solutions, a non-profit aerospace organization: an Astro and React frontend on a custom backend server. It's their live, public site.",
    tags: ["Astro", "React", "Full-stack", "System architecture"],
    categories: ["full-stack", "web", "mobile", "backend"],
    link: "https://github.com/rollins-engineering/rollins-frontend-server",
    image: "rollins-webpage.webp",
    featured: true,
  },
  {
    title: "Mobile Productivity",
    kind: "Mobile · React Native",
    note: "local-first by design",
    desc: "A cross-platform app for tasks and scheduling, with local-first data so it works without a connection.",
    tags: ["TypeScript", "React Native", "Mobile"],
    categories: ["mobile"],
    link: "https://github.com/okyoiu/Mobile-Productivity-Framework",
    image: "project_one_Demo.webp",
    featured: true,
  },
  {
    title: "Investment Dashboard",
    kind: "Web · Django + React",
    note: "built with Django & React",
    desc: "A dashboard for tracking spending, with graphs and charts that give a clearer picture of where the money goes.",
    tags: ["React", "Django", "Tailwind CSS"],
    categories: ["web", "backend"],
    link: "https://github.com/okyoiu/Investment-Portfolio-Management-Dashboard",
    image: "project_two_demo.webp",
  },
  {
    title: "JavaScript Collection",
    kind: "Web · Vanilla JS",
    note: "where I learned the basics",
    desc: "Small frontend apps built to learn the core of the web: DOM work, async code, events and responsive layout.",
    tags: ["JavaScript", "HTML", "CSS"],
    categories: ["web"],
    link: "https://github.com/okyoiu/javascript-projects",
    image: null,
  },
];

PROJECTS.forEach((p) => console.assert(p.title && p.link && p.categories.length, "Project needs a title, link and category:", p));

// Renders into <div data-index="featured|all" data-images="path/to/images/">
document.querySelectorAll("[data-index]").forEach((index) => {
  const base = index.dataset.images;
  const full = index.dataset.index === "all";
  let shown = [];

  // The row crossing the middle of the screen takes the preview, so long lists keep it in step
  const io = "IntersectionObserver" in window &&
    new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && activate(e.target.dataset.i)),
      { rootMargin: "-45% 0px -50% 0px" });

  function render(list) {
    shown = list;
    if (io) io.disconnect();
    index.innerHTML = `
      <ol class="index-list">${list.map((p, i) => `
        <li class="index-row" style="--i:${i}" data-i="${i}">
          <a class="index-link" href="${p.link}" target="_blank" rel="noopener" data-label="${p.categories[0]}">
            ${p.image ? `<img class="index-thumb" src="${base + p.image}" alt="" loading="lazy">` : ""}
            <span class="index-name">${p.title}</span>
            <span class="index-kind">${full ? p.tags.join(" · ") : p.kind}</span>
          </a>
          ${full ? `<p class="index-desc">${p.desc}</p>` : ""}
        </li>`).join("")}
      </ol>
      <figure class="index-frame" aria-hidden="true">${list.map((p, i) => p.image
        ? `<img src="${base + p.image}" alt="" data-i="${i}" loading="lazy">`
        : `<p class="index-empty" data-i="${i}">${p.title}</p>`).join("")}
        <span class="bbox bbox--tag-in" style="--x:5%; --y:6%; --w:90%; --h:88%"><span class="tag"><span class="tag-model"></span></span></span>
        <figcaption class="index-note hand on-ground"></figcaption>
      </figure>`;
    activate("0");
    if (io) index.querySelectorAll(".index-row").forEach((row) => io.observe(row));
  }

  // i is a data-i string, so it compares straight against dataset values
  function activate(i) {
    if (index.querySelector(".index-row.is-active")?.dataset.i === i) return;
    index.querySelectorAll(".index-row").forEach((row) => row.classList.toggle("is-active", row.dataset.i === i));
    // A fresh copy of the box replays its lock-on animation; the label is the project's first category
    const box = index.querySelector(".index-frame .bbox");
    const copy = box.cloneNode(true);
    copy.querySelector(".tag-model").textContent = shown[i]?.categories[0] ?? "";
    box.replaceWith(copy);
    index.querySelectorAll(".index-frame > [data-i]").forEach((pic) => pic.classList.toggle("is-on", pic.dataset.i === i));
    index.querySelector(".index-note").textContent = shown[i]?.note ?? "";
  }

  const pick = (e) => { const row = e.target.closest(".index-row"); if (row) activate(row.dataset.i); };
  index.addEventListener("pointerover", pick);
  index.addEventListener("focusin", pick);

  // Filter buttons only exist on the projects page
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    const matches = (p) => btn.dataset.filter === "all" || p.categories.includes(btn.dataset.filter);
    btn.insertAdjacentHTML("beforeend", ` <span class="filter-count">${PROJECTS.filter(matches).length}</span>`);
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.setAttribute("aria-pressed", b === btn));
      render(PROJECTS.filter(matches));
    });
  });

  render(full ? PROJECTS : PROJECTS.filter((p) => p.featured));
});
