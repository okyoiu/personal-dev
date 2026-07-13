const ALL_PROJECTS = [
    {
      title: "Mobile Productivity Framework",
      desc: "A cross-platform mobile app built to streamline personal productivity. Features task management, scheduling, and local-first data persistence.",
      tags: ["TypeScript", "React Native", "Mobile"],
      categories: ["mobile"],
      link: "https://github.com/okyoiu/Mobile-Productivity-Framework",
      image: "../assets/images/project_one_Demo.png",
      imageAlt: "Mobile Productivity Framework Demo"
    },
    {
      title: "Meridian Routing Engine",
      desc: "A high-performance C++ pathfinding microservice holding 1.4 million OpenStreetMap nodes in memory. Uses a custom Dijkstra's algorithm to calculate true physical routes, visualized instantly through a React and Leaflet frontend.",
      tags: ["C++17", "React", "Microservices", "Algorithms"],
      categories: ["full-stack", "systems"],
      link: "https://github.com/okyoiu/Meridian", 
      image: "../assets/images/MERIDIAN_DEMO.png",
      imageAlt: "Meridian Routing Engine Demo"
    },
  {
    title: "StrataEngine (Tessera)",
    desc: "Architected a data-oriented 2D industrial automation simulation that was written using C++. Writing the code memory was optimized and logic conditions were met. ",
    tags: ["Data-Oriented Design", "C/C++", "Systems Programming"],
    categories: ["systems"],
    link: "https://github.com/okyoiu/StrataEngine",
    image: "../assets/images/teserra-png.png",
    imageAlt: "Interpreter Photo"
  },
  {
      title: "Rollins Engineering Platform",
      desc: "Architected the official full-stack website for Rollins Engineering Solutions, a non-profit aerospace organization. Built a highly scalable frontend utilizing Astro and React to cleanly abstract UI elements, integrated seamlessly with a custom backend server. This project currently serves as their live, public-facing platform.",
      tags: ["Astro", "React", "Full-Stack", "System Architecture"],
      categories: ["full-stack", "web", "mobile", "backend"],
      link: "https://github.com/rollins-engineering/rollins-frontend-server",
      image: "../assets/images/rollins-webpage.png",
      imageAlt: "Rollins Engineering Solutions Website"
    },
  {
      title: "Core Language Interpreter",
      desc: "Demonstrates systems-level programming, memory management, and compiler theory. Uses a custom Recursive Descent Parser and a memory-safe Abstract Syntax Tree.",
      tags: ["Interpreter Architecture", "C/C++", "Google Test"],
      categories: ["systems"],
      link: "https://github.com/okyoiu/CoreLang-Interpreter",
      image: "../assets/images/project3_creditByHaqr.png",
      imageAlt: "Interpreter Photo"
    },
    {
      title: "Investment Management Dashboard",
      desc: "A dashboard for consumers to track spending and secure their spending needs with graphs and charts to guide users for a more detailed banking experience.",
      tags: ["React/JavaScript", "Django", "Tailwind CSS"],
      categories: ["web", "backend"],
      link: "https://github.com/okyoiu/Investment-Portfolio-Management-Dashboard",
      image: "../assets/images/project_two_demo.jpeg",
      imageAlt: "Portfolio Management Website"
    },
    {
      title: "Vanilla JavaScript Project Collection",
      desc: "A comprehensive archive of small-scale frontend applications built to master core web technologies. Demonstrates proficiency in DOM manipulation, asynchronous programming, event handling, and responsive design.",
      tags: ["JavaScript", "HTML5", "CSS3", "DOM Manipulation"],
      categories: ["frontend"],
      link: "https://github.com/okyoiu/javascript-projects",
      image: null, 
      imageAlt: "JavaScript Mini-Projects Collection Demo"
    }
  ];

  // ─── STATE ───────────────────────────────────────────────────────────────
  const BATCH = 3;
  let activeFilter = "all";
  let shownCount = 0;
  let filteredProjects = [];

  // ─── DOM REFS ────────────────────────────────────────────────────────────
  const grid       = document.getElementById("proj-grid");
  const loadBtn    = document.getElementById("load-more-btn");
  const loadArea   = document.getElementById("load-more-area");
  const endState   = document.getElementById("end-state");
  const countLabel = document.getElementById("count-label");
  const loadCount  = document.getElementById("load-count");

  // ─── BUILD A CARD ────────────────────────────────────────────────────────
  function buildCard(p, isNew = false) {
    const a = document.createElement("a");
    a.className = "proj-card" + (isNew ? " new-card" : "");
    a.href = p.link;
    a.target = "_blank";

    const tagsHTML = p.tags.map(t => `<span class="proj-tag">${t}</span>`).join("");

    const thumbHTML = p.image
      ? `<img src="${p.image}" alt="${p.imageAlt}">`
      : `<div class="proj-thumb-placeholder">${p.title.slice(0, 2).toUpperCase()}</div>`;

    a.innerHTML = `
      <div class="proj-thumb">
        ${thumbHTML}
        <div class="proj-overlay">
          <button class="proj-overlay-btn">View on GitHub ↗</button>
        </div>
      </div>
      <div class="proj-body">
        <div class="proj-tags">${tagsHTML}</div>
        <div class="proj-title">${p.title}</div>
        <div class="proj-desc">${p.desc}</div>
        <div class="proj-footer">
          <span class="proj-link">github.com/okyoiu</span>
          <span class="proj-arrow">↗</span>
        </div>
      </div>
    `;
    return a;
  }

  // ─── RENDER BATCH ────────────────────────────────────────────────────────
  function renderBatch(isNew = false) {
    const slice = filteredProjects.slice(shownCount, shownCount + BATCH);
    slice.forEach((p, i) => {
      const card = buildCard(p, isNew);
      if (isNew) card.style.animationDelay = `${i * 0.07}s`;
      grid.appendChild(card);
    });
    shownCount += slice.length;
    updateUI();
  }

  // ─── UPDATE UI STATE ─────────────────────────────────────────────────────
  function updateUI() {
    const total = filteredProjects.length;
    countLabel.textContent = `(${String(total).padStart(2, "0")})`;
    loadCount.textContent = `Showing ${shownCount} of ${total}`;

    if (shownCount >= total) {
      loadArea.style.display = "none";
      setTimeout(() => {
        endState.style.display = "flex";
        requestAnimationFrame(() => endState.classList.add("visible"));
      }, 200);
    } else {
      loadArea.style.display = "flex";
      endState.classList.remove("visible");
      endState.style.display = "none";
    }
  }

  // ─── APPLY FILTER ────────────────────────────────────────────────────────
  function applyFilter(filter) {
    activeFilter = filter;
    filteredProjects = filter === "all"
      ? ALL_PROJECTS
      : ALL_PROJECTS.filter(p => p.categories.includes(filter));

    grid.innerHTML = "";
    shownCount = 0;
    endState.classList.remove("visible");
    endState.style.display = "none";

    renderBatch(false);
  }

  // ─── FILTER BUTTONS ──────────────────────────────────────────────────────
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });

  // ─── LOAD MORE ───────────────────────────────────────────────────────────
  loadBtn.addEventListener("click", () => {
    renderBatch(true);
  });

  // ─── INITIAL RENDER ──────────────────────────────────────────────────────
  applyFilter("all");
